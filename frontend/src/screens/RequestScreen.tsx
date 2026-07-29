import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { BUILDINGS, CLASSROOMS } from '../constants/mockData';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Dropdown } from '../components/Dropdown';
import { Sparkles, Calendar, Clock, Users, Building, ShieldCheck, HeartHandshake, AlertCircle, Upload, Download, Search, FileSpreadsheet, ChevronLeft, ChevronRight, ArrowRight, BookOpen, FileCheck } from 'lucide-react';
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

  const [activeSubTab, setActiveSubTab] = useState<'single' | 'bulk'>('single');

  // Bulk Upload States
  const [excelFile, setExcelFile] = useState<File | null>(null);
  
  const [dateType, setDateType] = useState<'single' | 'range'>('single');
  const [bulkStartDate, setBulkStartDate] = useState<string>('2026-07-20');
  const [bulkStartSession, setBulkStartSession] = useState<string>('FN');
  const [bulkEndDate, setBulkEndDate] = useState<string>('2026-07-24');
  const [bulkEndSession, setBulkEndSession] = useState<string>('AN');
  
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const [allotmentResults, setAllotmentResults] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tablePage, setTablePage] = useState<number>(1);
  const [bulkFnFacilities, setBulkFnFacilities] = useState<string[]>([]);
  const [bulkAnFacilities, setBulkAnFacilities] = useState<string[]>([]);
  const [bulkRemarks, setBulkRemarks] = useState('');

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

  const handleBulkFnFacilityToggle = (facility: string) => {
    setBulkFnFacilities((prev) =>
      prev.includes(facility) ? prev.filter((f) => f !== facility) : [...prev, facility]
    );
  };

  const handleBulkAnFacilityToggle = (facility: string) => {
    setBulkAnFacilities((prev) =>
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

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!excelFile) {
      showToast('Please select or drop an Excel file first.', 'warning');
      return;
    }

    setUploadLoading(true);
    try {
      const results = await api.uploadStudentExcel(
        excelFile,
        bulkStartDate,
        bulkStartSession,
        dateType === 'range' ? bulkEndDate : undefined,
        dateType === 'range' ? bulkEndSession : undefined,
        bulkFnFacilities,
        bulkAnFacilities,
        bulkRemarks
      );
      
      setAllotmentResults(results);
      setTablePage(1);
      
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 }
      });
      showToast(`Successfully processed allotments for ${results.all_students_count} students!`, 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to process student allotment file.', 'error');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSubmitBulkRequest = () => {
    if (!allotmentResults) return;

    const sessionStr = `${allotmentResults.start_date} (${allotmentResults.start_session})`;
    const endSessionStr = allotmentResults.end_date !== allotmentResults.start_date || allotmentResults.end_session !== allotmentResults.start_session 
      ? ` to ${allotmentResults.end_date} (${allotmentResults.end_session})` 
      : '';

    const newRequest = {
      id: `req-${Math.random().toString(36).substr(2, 9)}`,
      staffId: user?.id || 'usr-3',
      staffName: user?.name || 'Prof. Amit Sharma',
      subject: `Bulk Allotment - ${allotmentResults.summary.total_students} Students`,
      date: `${sessionStr}${endSessionStr}`,
      time: allotmentResults.start_session === 'FN' ? '09:00' : '13:30',
      duration: 3.5,
      strength: allotmentResults.summary.total_students,
      facilities: [...bulkFnFacilities, ...bulkAnFacilities],
      remarks: allotmentResults.remarks || bulkRemarks || 'Bulk allocation generated from Excel upload.',
      status: 'pending',
      createdAt: new Date().toISOString(),
      isBulkAllotment: true,
      bulkDetails: {
        sessionId: allotmentResults.session_id,
        summary: allotmentResults.summary,
        studentsCount: allotmentResults.students.length,
        uniqueLabsCount: allotmentResults.summary.unique_labs_count,
        uniqueVenuesCount: allotmentResults.summary.unique_venues_count,
        students: allotmentResults.students,
        startDate: allotmentResults.start_date,
        startSession: allotmentResults.start_session,
        endDate: allotmentResults.end_date,
        endSession: allotmentResults.end_session,
        fnFacilities: bulkFnFacilities,
        anFacilities: bulkAnFacilities
      }
    };

    onAddRequest(newRequest);

    // Confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    showToast('Bulk classroom booking request submitted to admin successfully!', 'success');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'xlsx' || ext === 'xls') {
        setExcelFile(file);
        showToast(`Excel file "${file.name}" selected. Ready to upload!`, 'info');
      } else {
        showToast('Please upload only Excel files (.xlsx, .xls)', 'warning');
      }
    }
  };

  const ITEMS_PER_PAGE = 10;

  const filteredStudents = allotmentResults?.students
    ? allotmentResults.students.filter((student: any) => {
        const query = searchQuery.toLowerCase();
        return (
          String(student['Student Name'] || '').toLowerCase().includes(query) ||
          String(student['Reg No'] || '').toLowerCase().includes(query) ||
          String(student['Department'] || '').toLowerCase().includes(query) ||
          String(student['Lab (FN)'] || '').toLowerCase().includes(query) ||
          String(student['Venue (AN)'] || '').toLowerCase().includes(query)
        );
      })
    : [];

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);

  const paginatedStudents = filteredStudents.slice(
    (tablePage - 1) * ITEMS_PER_PAGE,
    tablePage * ITEMS_PER_PAGE
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Sub-tab navigation selector */}
      <div className="flex border-b border-slate-200 dark:border-slate-800/80 gap-6">
        <button
          onClick={() => setActiveSubTab('single')}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeSubTab === 'single'
              ? 'text-primary'
              : 'text-slate-400 hover:text-slate-650 dark:hover:text-slate-300'
          }`}
        >
          Single Classroom Booking
          {activeSubTab === 'single' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('bulk')}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeSubTab === 'bulk'
              ? 'text-primary'
              : 'text-slate-400 hover:text-slate-650 dark:hover:text-slate-300'
          }`}
        >
          Bulk Student Allotment (Excel)
          {activeSubTab === 'bulk' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
          )}
        </button>
      </div>

      {activeSubTab === 'single' ? (
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
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Bulk Allotment configuration panel */}
          <Card className="lg:col-span-1 shadow-sm bg-white dark:bg-slate-900" header={
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white text-sm">
              <BookOpen className="w-4 h-4 text-primary" />
              <span>Allotment Parameters</span>
            </div>
          }>
            <form onSubmit={handleBulkUpload} className="flex flex-col gap-5">
              
              {/* Date Type Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-650 dark:text-slate-400">Duration Mode</label>
                <div className="flex bg-slate-150 dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setDateType('single')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      dateType === 'single'
                        ? 'bg-white dark:bg-slate-700 shadow text-primary'
                        : 'text-slate-500 hover:text-slate-850 dark:hover:text-slate-200'
                    }`}
                  >
                    Single Day
                  </button>
                  <button
                    type="button"
                    onClick={() => setDateType('range')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      dateType === 'range'
                        ? 'bg-white dark:bg-slate-700 shadow text-primary'
                        : 'text-slate-500 hover:text-slate-850 dark:hover:text-slate-200'
                    }`}
                  >
                    Date Range
                  </button>
                </div>
              </div>

              {/* Start Date & Session */}
              <div className="grid grid-cols-2 gap-3">
                <Input
                  id="bulk-start-date"
                  type="date"
                  label={dateType === 'range' ? "Start Date" : "Date"}
                  value={bulkStartDate}
                  onChange={(e) => setBulkStartDate(e.target.value)}
                  required
                />
                <Dropdown
                  id="bulk-start-session"
                  label="Session"
                  value={bulkStartSession}
                  onChange={(e) => setBulkStartSession(e.target.value)}
                  options={[
                    { value: 'FN', label: 'FN (9:00 AM)' },
                    { value: 'AN', label: 'AN (1:30 PM)' }
                  ]}
                />
              </div>

              {/* End Date & Session (Only if Range is selected) */}
              {dateType === 'range' && (
                <div className="grid grid-cols-2 gap-3 animate-fade-in">
                  <Input
                    id="bulk-end-date"
                    type="date"
                    label="End Date"
                    value={bulkEndDate}
                    onChange={(e) => setBulkEndDate(e.target.value)}
                    required
                  />
                  <Dropdown
                    id="bulk-end-session"
                    label="End Session"
                    value={bulkEndSession}
                    onChange={(e) => setBulkEndSession(e.target.value)}
                    options={[
                      { value: 'FN', label: 'FN (12:30 PM)' },
                      { value: 'AN', label: 'AN (4:30 PM)' }
                    ]}
                  />
                </div>
              )}              {/* Required Facilities - Forenoon (FN) */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-650 dark:text-slate-400">
                  Required Facilities - Forenoon (FN)
                </span>
                <div className="flex flex-wrap gap-2">
                  {facilityOptions.map((fac) => {
                    const isChecked = bulkFnFacilities.includes(fac);
                    return (
                      <button
                        key={fac}
                        type="button"
                        onClick={() => handleBulkFnFacilityToggle(fac)}
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

              {/* Required Facilities - Afternoon (AN) */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-650 dark:text-slate-400">
                  Required Facilities - Afternoon (AN)
                </span>
                <div className="flex flex-wrap gap-2">
                  {facilityOptions.map((fac) => {
                    const isChecked = bulkAnFacilities.includes(fac);
                    return (
                      <button
                        key={fac}
                        type="button"
                        onClick={() => handleBulkAnFacilityToggle(fac)}
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
                <label htmlFor="bulk-remarks" className="text-xs font-semibold text-slate-650 dark:text-slate-400">
                  Remarks / Additional Requirements
                </label>
                <textarea
                  id="bulk-remarks"
                  placeholder="e.g. Expert lecture series. Needs audio microphone testing."
                  value={bulkRemarks}
                  onChange={(e) => setBulkRemarks(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl transition-all duration-200 outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary min-h-[90px]"
                />
              </div>

              {/* Excel File Drop Uploader */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-650 dark:text-slate-400">Upload Student List</label>
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('bulk-excel-input')?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                    excelFile
                      ? 'border-emerald-500 bg-emerald-50/5 dark:bg-emerald-950/5'
                      : 'border-slate-200 dark:border-slate-800 hover:border-primary/50'
                  }`}
                >
                  <input
                    id="bulk-excel-input"
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setExcelFile(e.target.files[0]);
                        showToast(`Selected file "${e.target.files[0].name}"`, 'info');
                      }
                    }}
                    className="hidden"
                  />
                  <Upload className={`w-8 h-8 ${excelFile ? 'text-emerald-500' : 'text-slate-400'}`} />
                  {excelFile ? (
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                        {excelFile.name}
                      </span>
                      <span className="text-[10px] text-emerald-500 font-semibold mt-0.5">
                        {(excelFile.size / 1024).toFixed(1)} KB • Ready
                      </span>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-350">
                        Drag & Drop Excel File
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Supports .xlsx and .xls formats
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Button type="submit" variant="primary" className="py-3 text-sm mt-1" disabled={uploadLoading}>
                {uploadLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Excel...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Allotments</span>
                  </div>
                )}
              </Button>
            </form>
          </Card>

          {/* Allotment Dashboard Results */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {allotmentResults ? (
              <div className="flex flex-col gap-6 animate-fade-in">
                
                {/* KPI Summary Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800/80 p-4 rounded-2xl shadow-sm text-left">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Students</p>
                    <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">
                      {allotmentResults.summary.total_students}
                    </h3>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800/80 p-4 rounded-2xl shadow-sm text-left">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Mapped Status</p>
                    <h3 className="text-2xl font-extrabold text-emerald-500 mt-1">
                      {allotmentResults.summary.mapped_students} <span className="text-xs text-slate-400 font-medium">/{allotmentResults.summary.total_students}</span>
                    </h3>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800/80 p-4 rounded-2xl shadow-sm text-left">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Unique Labs</p>
                    <h3 className="text-2xl font-extrabold text-blue-500 mt-1">
                      {allotmentResults.summary.unique_labs_count}
                    </h3>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800/80 p-4 rounded-2xl shadow-sm text-left">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Unique Venues</p>
                    <h3 className="text-2xl font-extrabold text-amber-500 mt-1">
                      {allotmentResults.summary.unique_venues_count}
                    </h3>
                  </div>
                </div>

                {/* Info bar on duration and download */}
                <div className="bg-gradient-to-r from-blue-500/10 via-primary/5 to-emerald-500/10 border border-primary/20 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Duration: {allotmentResults.start_date} {allotmentResults.start_session}
                        {allotmentResults.end_date !== allotmentResults.start_date || allotmentResults.end_session !== allotmentResults.start_session ? (
                          <>
                            <ArrowRight className="w-3.5 h-3.5 inline mx-1.5 text-slate-400" />
                            {allotmentResults.end_date} {allotmentResults.end_session}
                          </>
                        ) : null}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Timings: FN (9:00 AM - 12:30 PM) | AN (1:30 PM - 4:30 PM)
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto">
                    <a
                      href={api.downloadAllotmentUrl(allotmentResults.session_id)}
                      download="Venue Mapping.xlsx"
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl shadow-xs transition-all duration-200 flex items-center justify-center gap-1.5 text-xs select-none border border-slate-200 dark:border-slate-750"
                    >
                      <Download className="w-4 h-4 text-slate-500" />
                      Download Excel
                    </a>
                    <button
                      type="button"
                      onClick={handleSubmitBulkRequest}
                      className="px-4 py-2.5 bg-emerald-550 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-1.5 text-xs select-none cursor-pointer border-none"
                    >
                      <FileCheck className="w-4.5 h-4.5" />
                      Submit Allocation Request
                    </button>
                  </div>
                </div>

                {/* Distributions Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Lab distribution */}
                  <Card className="shadow-sm bg-white dark:bg-slate-900" header={
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-350">
                      Forenoon Lab Distribution
                    </span>
                  }>
                    <div className="flex flex-col gap-3.5 max-h-[280px] overflow-y-auto pr-1">
                      {allotmentResults.summary.lab_distribution.map((d: any) => {
                        const pct = Math.round((d.count / allotmentResults.summary.total_students) * 100);
                        return (
                          <div key={d.venue} className="flex flex-col gap-1 text-left">
                            <div className="flex justify-between text-xs font-bold text-slate-650 dark:text-slate-300">
                              <span>{d.venue}</span>
                              <span>{d.count} students ({pct === 0 && d.count > 0 ? '<1' : pct}%)</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${Math.max(2, pct)}%` }}
                                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>

                  {/* Venue distribution */}
                  <Card className="shadow-sm bg-white dark:bg-slate-900" header={
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-350">
                      Afternoon Lecture Room Distribution
                    </span>
                  }>
                    <div className="flex flex-col gap-3.5 max-h-[280px] overflow-y-auto pr-1">
                      {allotmentResults.summary.venue_distribution.map((d: any) => {
                        const pct = Math.round((d.count / allotmentResults.summary.total_students) * 100);
                        return (
                          <div key={d.venue} className="flex flex-col gap-1 text-left">
                            <div className="flex justify-between text-xs font-bold text-slate-650 dark:text-slate-300">
                              <span>{d.venue}</span>
                              <span>{d.count} students ({pct === 0 && d.count > 0 ? '<1' : pct}%)</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${Math.max(2, pct)}%` }}
                                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>

                </div>

                {/* Interactive allotment table */}
                <Card className="shadow-sm bg-white dark:bg-slate-900" header={
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 w-full">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-350 text-left">
                      Allotted Students List
                    </span>
                    
                    {/* Search bar */}
                    <div className="relative w-full sm:w-64">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                        <Search className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="text"
                        placeholder="Search Name, Reg No, Dept..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setTablePage(1);
                        }}
                        className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-805 border border-slate-200 dark:border-slate-750 rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-800 dark:text-slate-200 placeholder-slate-400"
                      />
                    </div>
                  </div>
                }>
                  <div className="overflow-x-auto w-full border border-slate-100 dark:border-slate-800/80 rounded-2xl">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                          <th className="p-3 font-bold text-slate-500">S.No</th>
                          <th className="p-3 font-bold text-slate-500">Reg No</th>
                          <th className="p-3 font-bold text-slate-500">Name</th>
                          <th className="p-3 font-bold text-slate-500">Department</th>
                          <th className="p-3 font-bold text-slate-500">Forenoon Session</th>
                          <th className="p-3 font-bold text-slate-500">Afternoon Session</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedStudents.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-6 text-center text-slate-400 font-semibold">
                              No records found matching search query.
                            </td>
                          </tr>
                        ) : (
                          paginatedStudents.map((std: any) => (
                            <tr key={std['Reg No']} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                              <td className="p-3 font-medium text-slate-500">{std['S.No']}</td>
                              <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{std['Reg No']}</td>
                              <td className="p-3 font-medium text-slate-700 dark:text-slate-330">{std['Student Name']}</td>
                              <td className="p-3 text-slate-500 truncate max-w-[150px]" title={std['Department']}>
                                {std['Department']}
                              </td>
                              <td className="p-3">
                                <span className="inline-flex items-center bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/10 text-blue-650 dark:text-blue-400 px-2 py-0.5 rounded-lg font-bold">
                                  {std['Lab (FN)']}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className="inline-flex items-center bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/10 text-amber-650 dark:text-amber-400 px-2 py-0.5 rounded-lg font-bold">
                                  {std['Venue (AN)']}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-[10px] text-slate-500 font-medium">
                        Showing {(tablePage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(tablePage * ITEMS_PER_PAGE, filteredStudents.length)} of {filteredStudents.length} students
                      </span>
                      
                      <div className="flex items-center gap-1">
                        <button
                          disabled={tablePage === 1}
                          onClick={() => setTablePage(prev => Math.max(prev - 1, 1))}
                          className="p-1 border border-slate-250 dark:border-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-350 px-2">
                          Page {tablePage} of {totalPages}
                        </span>

                        <button
                          disabled={tablePage === totalPages}
                          onClick={() => setTablePage(prev => Math.min(prev + 1, totalPages))}
                          className="p-1 border border-slate-250 dark:border-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </Card>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 dark:bg-slate-900/30 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 gap-3">
                <FileSpreadsheet className="w-12 h-12 text-slate-300 dark:text-slate-700 animate-pulse" />
                <div className="flex flex-col items-center">
                  <span className="text-sm font-bold text-slate-500 dark:text-slate-400">No allotment generated yet.</span>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm text-center">
                    Configure your date/session parameters and upload a student details Excel file to calculate smart recommendations.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
