import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { BUILDINGS, CLASSROOMS } from '../constants/mockData';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Dropdown } from '../components/Dropdown';
import { Sparkles, Calendar, Clock, Users, Building, ShieldCheck, HeartHandshake } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RequestScreenProps {
  onAddRequest: (request: any) => void;
}

export const RequestScreen: React.FC<RequestScreenProps> = ({ onAddRequest }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('2026-07-20');
  const [time, setTime] = useState('10:00');
  const [duration, setDuration] = useState('2');
  const [strength, setStrength] = useState(40);
  const [preferredBuilding, setPreferredBuilding] = useState('bld-1'); // Default Ramanujan
  const [remarks, setRemarks] = useState('');
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [selectedSuggestionId, setSelectedSuggestionId] = useState<string | null>(null);

  const facilityOptions = ['Projector', 'Wi-Fi', 'AC', 'Audio System', 'Smart Board', 'Computers'];

  // Handle facilities toggles
  const handleFacilityToggle = (facility: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility) ? prev.filter((f) => f !== facility) : [...prev, facility]
    );
  };

  // Re-run mock AI suggestions whenever parameters change
  useEffect(() => {
    // Find rooms in selected building that have sufficient capacity
    const bld = BUILDINGS.find((b) => b.id === preferredBuilding);
    if (!bld) return;

    const matches = CLASSROOMS.filter(
      (room) =>
        room.buildingId === preferredBuilding &&
        room.capacity >= strength &&
        room.status === 'available'
    )
      .map((room) => {
        // Calculate a mock matching confidence based on facilities
        const roomFacilities = room.equipment;
        const matchingFac = selectedFacilities.filter((f) => roomFacilities.includes(f));
        let confidence = 85;
        if (matchingFac.length === selectedFacilities.length && selectedFacilities.length > 0) {
          confidence = 98;
        } else if (selectedFacilities.length > 0) {
          confidence = 70 + Math.round((matchingFac.length / selectedFacilities.length) * 25);
        }

        return {
          id: room.id,
          name: room.name,
          capacity: room.capacity,
          equipment: room.equipment,
          confidence,
        };
      })
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 2);

    setAiSuggestions(matches);
  }, [preferredBuilding, strength, selectedFacilities]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim()) {
      showToast('Please specify a Subject/Purpose', 'warning');
      return;
    }

    const matchedRoom = aiSuggestions.find((s) => s.id === selectedSuggestionId) || aiSuggestions[0];

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
      ...(matchedRoom && {
        allocatedClassroomId: matchedRoom.id,
        allocatedClassroomName: matchedRoom.name,
        aiSuggested: true,
        aiConfidence: matchedRoom.confidence,
      }),
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
            
            {/* Subject */}
            <Input
              id="subject"
              label="Subject / Purpose"
              placeholder="e.g. Guest Lecture on Cryptography"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />

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
                    min="10"
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

            {/* Facilities Checklist */}
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
                placeholder="e.g. Board of Studies experts attending. Needs audio microphone testing."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl transition-all duration-200 outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary min-h-[90px]"
              />
            </div>

            <Button type="submit" variant="primary" className="py-3 text-sm mt-2">
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
                Live matching algorithms suggest available rooms matching criteria, minimizing timetable clashes automatically.
              </p>

              {aiSuggestions.length === 0 ? (
                <div className="text-center py-6 text-slate-400 font-semibold border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
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
                        className={`p-3.5 border rounded-xl cursor-pointer text-left transition-all
                          ${isSelected
                            ? 'border-emerald-500 dark:border-emerald-600 bg-emerald-500/5 ring-1 ring-emerald-500'
                            : 'border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-800'
                          }
                        `}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-extrabold text-slate-805 dark:text-slate-200 text-sm">
                            {s.name}
                          </span>
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/10">
                            {s.confidence}% Match
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3.5 text-xs text-slate-450 dark:text-slate-400 mt-2">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" /> Cap: {s.capacity}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-semibold truncate max-w-[120px]">
                            {s.equipment.slice(0, 3).join(', ')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              <div className="mt-2 text-xs flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-950/30 rounded-lg text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Pre-allocation locks classroom for 15 mins.</span>
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
