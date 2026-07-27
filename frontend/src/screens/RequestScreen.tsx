import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { BUILDINGS, CLASSROOMS } from '../constants/mockData';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Dropdown } from '../components/Dropdown';
import { Sparkles, Calendar, Clock, Users, Building, ShieldCheck, HeartHandshake, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';

interface RequestScreenProps {
  onAddRequest: (request: any) => void;
}

export const RequestScreen: React.FC<RequestScreenProps> = ({ onAddRequest }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('2026-07-20');
  const [time, setTime] = useState('09:00');
  const [duration, setDuration] = useState('1');
  const [strength, setStrength] = useState(40);
  const [preferredBuilding, setPreferredBuilding] = useState('bld-1'); // Default Ramanujan
  const [remarks, setRemarks] = useState('');
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  
  // Real API states
  const [purpose, setPurpose] = useState('Class');
  const [strictDept, setStrictDept] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [allocationId, setAllocationId] = useState<string | null>(null);

  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [selectedSuggestionId, setSelectedSuggestionId] = useState<string | null>(null);

  const facilityOptions = ['Projector', 'Wi-Fi', 'AC', 'Audio System', 'Smart Board', 'Computers'];

  const purposeOptions = [
    { value: 'Class', label: 'Class / Lecture' },
    { value: 'Lab', label: 'Lab / Practical' },
    { value: 'Exam', label: 'Examination' },
    { value: 'Seminar', label: 'Seminar' },
    { value: 'Workshop', label: 'Workshop' },
    { value: 'Placement', label: 'Placement Drive' },
    { value: 'Meeting', label: 'Meeting' },
    { value: 'Conference', label: 'Conference' },
    { value: 'Training', label: 'Faculty Training' }
  ];

  // Handle facilities toggles
  const handleFacilityToggle = (facility: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility) ? prev.filter((f) => f !== facility) : [...prev, facility]
    );
  };

  // Helper time calculation
  const calculateEndTime = (timeStr: string, durationHrs: string) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return '';
    const totalMinutes = hours * 60 + minutes + Math.round(parseFloat(durationHrs) * 60);
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
  };

  // Helper department mapper
  const getDeptCode = (fullName: string | undefined): string => {
    if (!fullName) return 'CSE';
    const nameUpper = fullName.toUpperCase();
    if (nameUpper.includes('COMPUTER SCIENCE') || nameUpper.includes('CSE')) return 'CSE';
    if (nameUpper.includes('INFORMATION TECHNOLOGY') || nameUpper.includes('IT')) return 'IT';
    if (nameUpper.includes('ELECTRONICS') || nameUpper.includes('ECE')) return 'ECE';
    if (nameUpper.includes('ELECTRICAL') || nameUpper.includes('EEE')) return 'EEE';
    if (nameUpper.includes('MECHANICAL') || nameUpper.includes('MECH')) return 'MECH';
    if (nameUpper.includes('ARTIFICIAL') || nameUpper.includes('AIDS') || nameUpper.includes('AIML')) return 'AIDS';
    return 'CSE'; // Default
  };

  // Fetch live recommendations from backend
  const fetchRecommendations = async () => {
    if (!date || !time || !duration || !strength) return;

    setLoading(true);
    setApiError(null);
    try {
      const endTimeStr = calculateEndTime(time, duration);
      const deptCode = getDeptCode(user?.department);
      
      const payload = {
        purpose,
        student_count: strength,
        date,
        start_time: time,
        end_time: endTimeStr,
        department: deptCode,
        faculty_id: user?.id || 'FAC5001',
        strict_dept: strictDept
      };

      const result = await api.recommendRoom(payload);
      
      if (result && result.allocated_room) {
        setAllocationId(result.allocation_id);
        
        // Structure optimal room selection
        const optimalRoom = result.allocated_room;
        const optimalName = optimalRoom.venue_name;
        
        // Find existing classroom in frontend mock data to copy images/details
        const existingOptimal = CLASSROOMS.find(c => c.name.startsWith(optimalName) || c.name === optimalName);
        
        const optimalSuggestion = {
          id: existingOptimal?.id || `room-${optimalName}`,
          name: existingOptimal?.name || `${optimalName} (${optimalRoom.venue_type || 'Classroom'})`,
          capacity: optimalRoom.capacity || strength,
          equipment: existingOptimal?.equipment || (purpose.toLowerCase() === 'lab' ? ['Computers', 'Wi-Fi'] : ['Projector', 'Wi-Fi']),
          confidence: 100, // Optimal solution
          isOptimal: true,
          block: optimalRoom.block
        };

        // Format and map other ML recommendations
        const mappedAlternatives = (result.top_5_recommendations || [])
          .filter(([rName]: [string, number]) => rName !== optimalName) // don't repeat optimal
          .map(([rName, score]: [string, number]) => {
            const existing = CLASSROOMS.find(c => c.name.startsWith(rName) || c.name === rName);
            return {
              id: existing?.id || `room-${rName}`,
              name: existing?.name || `${rName} (Alternative Candidate)`,
              capacity: existing?.capacity || strength,
              equipment: existing?.equipment || [],
              confidence: Math.round(score * 100),
              isOptimal: false,
              block: existing?.buildingName || 'Campus Main Block'
            };
          });

        const suggestionsList = [optimalSuggestion, ...mappedAlternatives];
        setAiSuggestions(suggestionsList);
        setSelectedSuggestionId(optimalSuggestion.id); // Default to optimal
      } else {
        setAiSuggestions([]);
        setSelectedSuggestionId(null);
      }
    } catch (err: any) {
      console.error("Failed to fetch room recommendation:", err);
      setApiError(err.message || "Failed to fetch room recommendations.");
      setAiSuggestions([]);
      setSelectedSuggestionId(null);
    } finally {
      setLoading(false);
    }
  };

  // Re-run recommendation whenever inputs change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRecommendations();
    }, 450); // slight debounce
    return () => clearTimeout(timer);
  }, [purpose, date, time, duration, strength, strictDept, preferredBuilding]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim()) {
      showToast('Please specify a Subject/Purpose', 'warning');
      return;
    }

    const matchedRoom = aiSuggestions.find((s) => s.id === selectedSuggestionId) || aiSuggestions[0];

    if (!matchedRoom) {
      showToast('No classroom allocated. Please verify your options.', 'error');
      return;
    }

    const newRequest = {
      id: `req-${Math.random().toString(36).substr(2, 9)}`,
      staffId: user?.id || 'usr-3',
      staffName: user?.name || 'Prof. Amit Sharma',
      subject,
      date,
      time,
      duration: parseInt(duration),
      strength,
      facilities: selectedFacilities,
      preferredBuildingId: preferredBuilding,
      remarks,
      status: 'pending',
      createdAt: new Date().toISOString(),
      allocatedClassroomId: matchedRoom.id,
      allocatedClassroomName: matchedRoom.name.split(' (')[0],
      aiSuggested: true,
      aiConfidence: matchedRoom.confidence,
      allocationId: allocationId
    };

    onAddRequest(newRequest);

    // Confetti celebration!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    showToast('Classroom booking request submitted successfully!', 'success');

    // Reset Form
    setSubject('');
    setRemarks('');
    setSelectedFacilities([]);
    setSelectedSuggestionId(null);
  };

  return (
    <div className="flex flex-col gap-6 text-left animate-fade-in">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Request Classroom
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Submit classroom allocation request. AI automatically checks and flags availability options.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main form */}
        <Card className="lg:col-span-2 shadow-sm bg-white dark:bg-slate-900">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Subject and Purpose row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Input
                  id="subject"
                  label="Subject / Lecture Title"
                  placeholder="e.g. Guest Lecture on Cryptography"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>
              <Dropdown
                id="purpose"
                label="Booking Purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                options={purposeOptions}
              />
            </div>

            {/* Date and Time Group */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                id="date"
                type="date"
                label="Date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                leftIcon={<Calendar className="w-4 h-4" />}
                required
              />
              <Input
                id="time"
                type="time"
                label="Time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                leftIcon={<Clock className="w-4 h-4" />}
                required
              />
              <Dropdown
                id="duration"
                label="Duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                options={[
                  { value: '1', label: '1 Hour' },
                  { value: '2', label: '2 Hours' },
                  { value: '3', label: '3 Hours' },
                  { value: '4', label: '4 Hours' },
                ]}
              />
            </div>

            {/* Capacity & Building Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-semibold text-slate-650 dark:text-slate-400">
                  Required Seating Capacity ({strength} Students)
                </label>
                <div className="flex items-center gap-4 mt-2">
                  <input
                    type="range"
                    min="5"
                    max="150"
                    step="5"
                    value={strength}
                    onChange={(e) => setStrength(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span className="w-12 text-center text-sm font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1 px-2 rounded-lg">
                    {strength}
                  </span>
                </div>
              </div>

              <Dropdown
                id="building"
                label="Preferred Building / Block"
                value={preferredBuilding}
                onChange={(e) => setPreferredBuilding(e.target.value)}
                options={BUILDINGS.map((b) => ({ value: b.id, label: b.name }))}
              />
            </div>

            {/* Strict department option */}
            <div className="flex items-center justify-between gap-4 p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/50 dark:border-slate-800">
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Strict Department Preference</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Restrict rooms strictly to department preferred spaces</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={strictDept}
                  onChange={(e) => setStrictDept(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>

            {/* Required Facilities Checklist */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-650 dark:text-slate-400">
                Required Facilities
              </span>
              <div className="flex flex-wrap gap-2">
                {facilityOptions.map((fac) => {
                  const isChecked = selectedFacilities.includes(fac);
                  return (
                    <button
                      key={fac}
                      type="button"
                      onClick={() => handleFacilityToggle(fac)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold select-none transition-all
                        ${isChecked
                          ? 'bg-blue-50 dark:bg-primary/20 text-primary border-primary'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }
                      `}
                    >
                      {fac}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Remarks */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="remarks" className="text-xs font-semibold text-slate-650 dark:text-slate-400">
                Remarks / Additional Requirements
              </label>
              <textarea
                id="remarks"
                placeholder="e.g. Expert lecture series. Needs audio microphone testing."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl transition-all duration-200 outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary min-h-[90px]"
              />
            </div>

            <Button type="submit" variant="primary" className="py-3 text-sm mt-2" disabled={loading}>
              Submit Allocation Request
            </Button>
          </form>
        </Card>

        {/* AI Recommendations sidebar panel */}
        <div className="flex flex-col gap-4">
          <Card className="border-primary/45 dark:border-primary/30 bg-gradient-to-br from-blue-50/20 to-white dark:from-slate-850 dark:to-slate-900" header={
            <div className="flex items-center gap-2 text-primary font-bold">
              <Sparkles className="w-5 h-5 animate-pulse text-primary" />
              <h3 className="text-sm font-extrabold tracking-tight">AI Smart Allocations</h3>
            </div>
          }>
            <div className="flex flex-col gap-4 text-sm leading-relaxed">
              <p className="text-xs text-slate-500">
                Optimization Engine + ML rankings validate rules, building distances, and capacity wastage to find matching rooms.
              </p>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-3 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-bold text-slate-500">Querying AI Engine...</span>
                </div>
              ) : apiError ? (
                <div className="flex flex-col items-center justify-center p-4 py-6 text-rose-500 text-center gap-2 border border-dashed border-rose-250 dark:border-rose-900/40 rounded-xl bg-rose-500/5">
                  <AlertCircle className="w-7 h-7 text-rose-500" />
                  <span className="text-xs font-bold">No Rooms Allocated</span>
                  <p className="text-[10px] text-slate-500 leading-normal">{apiError}</p>
                </div>
              ) : aiSuggestions.length === 0 ? (
                <div className="text-center py-8 text-slate-400 font-semibold border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  ⚠️ No vacant rooms matching requirements.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {aiSuggestions.map((s) => {
                    const isSelected = selectedSuggestionId === s.id;
                    return (
                      <div
                        key={s.id}
                        onClick={() => setSelectedSuggestionId(s.id)}
                        className={`p-3.5 border rounded-xl cursor-pointer text-left transition-all relative overflow-hidden
                          ${isSelected
                            ? 'border-emerald-500 dark:border-emerald-600 bg-emerald-500/5 ring-1 ring-emerald-500'
                            : 'border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-800'
                          }
                        `}
                      >
                        {s.isOptimal && (
                          <div className="absolute top-0 right-0 bg-emerald-500 text-white font-extrabold text-[8px] px-2 py-0.5 rounded-bl uppercase tracking-wider">
                            Optimal (AI)
                          </div>
                        )}
                        <div className="flex justify-between items-start gap-2 pr-12">
                          <span className="font-extrabold text-slate-805 dark:text-slate-200 text-sm truncate">
                            {s.name}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                          {s.block}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                          <div className="flex items-center gap-3 text-[11px] text-slate-500">
                            <span className="flex items-center gap-1 font-semibold">
                              <Users className="w-3.5 h-3.5" /> Cap: {s.capacity}
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/10">
                            {s.confidence}% Match
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              <div className="mt-1 text-[10px] flex items-center gap-1.5 p-2 bg-slate-50 dark:bg-slate-950/30 rounded-lg text-slate-500 leading-normal">
                <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>AI pre-locks this selection to prevent overlaps.</span>
              </div>
            </div>
          </Card>

          {/* AI Helper Banner */}
          <Card padding="sm" className="bg-slate-50 dark:bg-slate-900/30">
            <div className="flex items-start gap-3">
              <HeartHandshake className="w-5 h-5 text-emerald-550 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Allocation Conflict Guarantee</h4>
                <p className="text-[10px] text-slate-500 leading-normal mt-0.5">
                  AI will auto-reroute your class to adjacent blocks and notify students if a sudden maintenance clash arises.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
