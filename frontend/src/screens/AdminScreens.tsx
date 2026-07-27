import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Dropdown } from '../components/Dropdown';
import { Input } from '../components/Input';
import { useToast } from '../components/Toast';
import { CLASSROOMS } from '../constants/mockData';
import { 
  FileCheck, Settings, Check, X, ShieldAlert, AlertTriangle, Hammer, MapPin, 
  School, Calendar, Clock, Users, ArrowRight, ArrowLeft, Grid, Printer, Search, Award
} from 'lucide-react';
import { api } from '../services/api';

interface AdminScreensProps {
  subTab: string;
  requests: any[];
  onApproveRequest: (id: string) => void;
  onRejectRequest: (id: string) => void;
  onToggleMaintenance?: (roomId: string) => void;
}

export const AdminScreens: React.FC<AdminScreensProps> = ({
  subTab,
  requests,
  onApproveRequest,
  onRejectRequest,
  onToggleMaintenance
}) => {
  const { showToast } = useToast();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Exam Scheduling States
  const [activePhase, setActivePhase] = useState<'halls' | 'seating'>('halls');
  const [examDate, setExamDate] = useState('2026-08-05');
  const [examStartTime, setExamStartTime] = useState('09:30');
  const [examEndTime, setExamEndTime] = useState('12:30');
  
  // Cohorts inputs
  const [cohortCSE, setCohortCSE] = useState('72');
  const [cohortAIML, setCohortAIML] = useState('50');
  const [cohortAIDS, setCohortAIDS] = useState('53');
  const [cohortIT, setCohortIT] = useState('0');
  const [cohortECE, setCohortECE] = useState('0');
  const [cohortMECH, setCohortMECH] = useState('0');
  
  const [allocatingHalls, setAllocatingHalls] = useState(false);
  const [examAllocResult, setExamAllocResult] = useState<any | null>(null);

  // Seating States
  const [selectedRoomAlloc, setSelectedRoomAlloc] = useState<any | null>(null);
  const [numCols, setNumCols] = useState(6);
  const [brokenSeats, setBrokenSeats] = useState<[number, number][]>([]);
  const [studentsInRoom, setStudentsInRoom] = useState<any[]>([]);
  const [generatingSeating, setGeneratingSeating] = useState(false);
  const [seatingResult, setSeatingResult] = useState<any | null>(null);
  const [seatingSearch, setSeatingSearch] = useState('');

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const handleToggleMaintenance = (roomId: string) => {
    if (onToggleMaintenance) {
      onToggleMaintenance(roomId);
    } else {
      showToast('Maintenance status updated.', 'success');
    }
  };

  // Run exam allocation API
  const handleAllocateExams = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct cohort counts
    const cohorts: Record<string, number> = {};
    if (parseInt(cohortCSE) > 0) cohorts['CSE'] = parseInt(cohortCSE);
    if (parseInt(cohortAIML) > 0) cohorts['AIML'] = parseInt(cohortAIML);
    if (parseInt(cohortAIDS) > 0) cohorts['AIDS'] = parseInt(cohortAIDS);
    if (parseInt(cohortIT) > 0) cohorts['IT'] = parseInt(cohortIT);
    if (parseInt(cohortECE) > 0) cohorts['ECE'] = parseInt(cohortECE);
    if (parseInt(cohortMECH) > 0) cohorts['MECH'] = parseInt(cohortMECH);

    if (Object.keys(cohorts).length === 0) {
      showToast('Please specify student counts for at least one department cohort.', 'warning');
      return;
    }

    setAllocatingHalls(true);
    setExamAllocResult(null);
    setSeatingResult(null);
    setSelectedRoomAlloc(null);
    
    try {
      const payload = {
        cohort_counts: cohorts,
        date: examDate,
        start_time: examStartTime,
        end_time: examEndTime
      };
      
      const result = await api.allocateExam(payload);
      setExamAllocResult(result);
      showToast('Examination halls allocated successfully!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to allocate exam halls', 'error');
    } finally {
      setAllocatingHalls(false);
    }
  };

  // Setup room for seating chart generation
  const handleSelectRoomForSeating = (roomAlloc: any) => {
    setSelectedRoomAlloc(roomAlloc);
    // Initialize students list with default is_disabled = 0
    const list = (roomAlloc.students || []).map((s: any) => ({
      student_id: s.student_id || `std-${s.roll_number}`,
      roll_number: s.roll_number,
      department: s.department,
      is_disabled: 0 // default
    }));
    setStudentsInRoom(list);
    setBrokenSeats([]);
    setSeatingResult(null);
    setActivePhase('seating');
  };

  // Toggle seat broken on preview grid click
  const handleToggleBrokenSeatPre = (r: number, c: number) => {
    setBrokenSeats((prev) => {
      const exists = prev.some(([row, col]) => row === r && col === c);
      if (exists) {
        return prev.filter(([row, col]) => !(row === r && col === c));
      } else {
        return [...prev, [r, c]];
      }
    });
  };

  // Toggle student disability flag
  const handleToggleDisability = (idx: number) => {
    setStudentsInRoom((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, is_disabled: s.is_disabled === 1 ? 0 : 1 } : s))
    );
  };

  // Call Seat allocation plan API
  const handleGenerateSeatPlan = async () => {
    if (!selectedRoomAlloc) return;
    
    setGeneratingSeating(true);
    setSeatingResult(null);
    
    try {
      const payload = {
        allocation_id: selectedRoomAlloc.allocation_id,
        students: studentsInRoom,
        capacity: selectedRoomAlloc.capacity,
        broken_seats: brokenSeats,
        num_cols: numCols
      };
      
      const result = await api.generateSeatPlan(payload);
      setSeatingResult(result);
      showToast('Seating chart generated successfully!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to generate seating plan', 'error');
    } finally {
      setGeneratingSeating(false);
    }
  };

  const handlePrintSeating = () => {
    window.print();
  };

  const getDeptColor = (dept: string) => {
    if (dept === 'CSE') return 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200';
    if (dept === 'AIML') return 'bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200';
    if (dept === 'AIDS') return 'bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200';
    if (dept === 'IT') return 'bg-teal-100 border-teal-300 text-teal-800 dark:bg-teal-900/30 dark:text-teal-200';
    if (dept === 'ECE') return 'bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200';
    if (dept === 'MECH') return 'bg-rose-100 border-rose-300 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200';
    return 'bg-slate-100 border-slate-300 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
  };

  // Render Approvals list view
  const renderApprovals = () => (
    <Card header={
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <h3 className="text-sm font-bold text-slate-705 dark:text-slate-350">Process Allocation Requests</h3>
        <div className="flex items-bg bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all capitalize
                ${filter === f 
                  ? 'bg-white dark:bg-slate-900 text-primary shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }
              `}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
    }>
      <div className="flex flex-col gap-4 text-left">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 text-slate-450 font-medium">
            No booking requests found under this filter.
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div key={req.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-150 dark:border-slate-800 rounded-xl flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-slate-250 dark:hover:border-slate-750 transition-colors">
              <div className="flex flex-col gap-1">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="font-extrabold text-slate-805 dark:text-slate-100 text-sm">
                    {req.subject}
                  </span>
                  <span className="text-[10px] bg-slate-105 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold px-2 py-0.5 rounded">
                    {req.strength} Students
                  </span>
                  {req.aiSuggested && (
                    <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/10 flex items-center gap-0.5">
                      AI Suggested ({req.aiConfidence}%)
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-slate-500">
                  Staff: <span className="font-semibold">{req.staffName}</span> | Date: <span className="font-medium text-slate-700 dark:text-slate-350">{req.date}</span> | Time: <span className="font-medium text-slate-700 dark:text-slate-350">{req.time} ({req.duration} hrs)</span>
                </p>

                {req.remarks && (
                  <p className="text-xs text-slate-450 italic mt-1 font-medium bg-white dark:bg-slate-950/20 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                    "{req.remarks}"
                  </p>
                )}

                {req.allocatedClassroomName && (
                  <span className="text-xs text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> Pre-allocated Classroom: {req.allocatedClassroomName}
                  </span>
                )}
              </div>

              {/* Status or actions */}
              <div className="flex items-center gap-2 self-end md:self-center">
                {req.status === 'pending' ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<X className="w-4 h-4" />}
                      onClick={() => {
                        onRejectRequest(req.id);
                        showToast('Booking request declined.', 'info');
                      }}
                    >
                      Decline
                    </Button>
                    <Button
                      variant="accent"
                      size="sm"
                      icon={<Check className="w-4 h-4" />}
                      onClick={() => {
                        onApproveRequest(req.id);
                        showToast('Booking request approved!', 'success');
                      }}
                    >
                      Approve
                    </Button>
                  </>
                ) : (
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase border
                    ${req.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20' : 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20'}
                  `}>
                    {req.status}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );

  // Render Maintenance Screen
  const renderMaintenance = () => (
    <Card header={<h3 className="text-sm font-bold text-slate-705 dark:text-slate-350">Classrooms Maintenance Registry</h3>}>
      <div className="flex flex-col gap-4 text-left">
        <p className="text-xs text-slate-500">
          Flag classrooms under maintenance to automatically pull them from the AI allocation algorithm pool, avoiding clashes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CLASSROOMS.map((room) => {
            const isMaint = room.status === 'maintenance';
            return (
              <div
                key={room.id}
                className={`p-4 border rounded-xl flex items-center justify-between transition-all
                  ${isMaint 
                    ? 'border-rose-350 dark:border-rose-900 bg-rose-500/5' 
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg flex-shrink-0
                    ${isMaint ? 'bg-rose-50 text-rose-500 dark:bg-rose-950/40' : 'bg-slate-50 text-slate-400 dark:bg-slate-800'}
                  `}>
                    <Hammer className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-extrabold text-sm text-slate-805 dark:text-slate-205">{room.name.split(' (')[0]}</span>
                    <span className="text-[10px] text-slate-500">{room.buildingName} • Floor {room.floor}</span>
                  </div>
                </div>

                {/* Toggle Button */}
                <button
                  onClick={() => handleToggleMaintenance(room.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all
                    ${isMaint
                      ? 'bg-rose-500 text-white border-transparent shadow shadow-rose-500/10'
                      : 'bg-transparent text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }
                  `}
                >
                  {isMaint ? 'Under Repair' : 'Set Repair'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );

  // Render Exams Scheduling Screen
  const renderExams = () => {
    if (activePhase === 'seating') {
      const parsedRows = Math.ceil(selectedRoomAlloc.capacity / numCols);
      const tempSeatingSearchLower = seatingSearch.toLowerCase();
      
      const filteredSeatingList = (seatingResult?.seating_list || []).filter((s: any) => 
        s.roll_number.toLowerCase().includes(tempSeatingSearchLower) || 
        s.department.toLowerCase().includes(tempSeatingSearchLower)
      );

      return (
        <div className="flex flex-col gap-6 text-left animate-fade-in print:p-0 print:m-0 print:bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 print:hidden">
            <button
              onClick={() => {
                setSeatingResult(null);
                setActivePhase('halls');
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Exam Allocations
            </button>
            <h3 className="text-sm font-bold text-slate-400">Step 2: Room Seat Layout</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start print:flex print:flex-col print:gap-4">
            
            {/* Visual seating grid setup side */}
            <Card className="lg:col-span-2 print:border-none print:shadow-none" header={
              <div className="flex justify-between items-center w-full">
                <div className="flex flex-col text-left">
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white print:text-lg">
                    Room Seating Chart Visualizer - {selectedRoomAlloc.venue_name}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 print:hidden">
                    Capacity: **{selectedRoomAlloc.capacity} pax** | Allocated: **{selectedRoomAlloc.allocated_count} students**
                  </p>
                </div>
                {seatingResult && (
                  <button
                    onClick={handlePrintSeating}
                    className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 rounded-xl border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 text-xs font-bold print:hidden"
                  >
                    <Printer className="w-4 h-4" /> Print Plan
                  </button>
                )}
              </div>
            }>
              
              <div className="flex flex-col gap-6 items-center">
                {/* Visual grid layout */}
                <div className="w-full max-w-lg bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border border-slate-150 dark:border-slate-900 flex flex-col items-center gap-5">
                  {/* Lecturer Desk / Screen Indicator */}
                  <div className="w-3/4 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-extrabold text-[10px] uppercase tracking-widest rounded-xl text-center shadow-sm select-none">
                    ⭐ FACULTY DESK / LECTURE SCREEN AREA
                  </div>

                  {/* Desk Rows */}
                  <div className="flex flex-col gap-3.5 w-full mt-2">
                    {Array.from({ length: parsedRows }).map((_, rIdx) => {
                      const rowNum = rIdx + 1;
                      const rowLetter = String.fromCharCode(64 + rowNum);
                      return (
                        <div key={rowNum} className="flex items-center gap-3.5 justify-center">
                          {/* Row identifier label */}
                          <span className="w-5 text-center text-xs font-black text-slate-400 uppercase select-none">
                            {rowLetter}
                          </span>

                          <div className="flex-1 grid gap-2.5" style={{ gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))` }}>
                            {Array.from({ length: numCols }).map((_, cIdx) => {
                              const colNum = cIdx + 1;
                              
                              // Check seatingResult first
                              let cellContent = '-';
                              let cellDept = '';
                              let isAccess = false;
                              let isBroken = brokenSeats.some(([r, c]) => r === rowNum && c === colNum);

                              if (seatingResult) {
                                const roll = seatingResult.seating_chart[rIdx]?.[cIdx] || '-';
                                if (roll === '[X]') {
                                  isBroken = true;
                                } else if (roll !== '-') {
                                  cellContent = roll;
                                  // Find student dept in seating_list
                                  const assignment = seatingResult.seating_list.find((s: any) => s.roll_number === roll);
                                  cellDept = assignment?.department || '';
                                  isAccess = assignment?.is_accessibility === 1;
                                }
                              } else {
                                // If not generated yet, show preview toggles
                                const isAssignedMockIdx = (rIdx * numCols) + cIdx;
                                if (isAssignedMockIdx < studentsInRoom.length && !isBroken) {
                                  const mockStd = studentsInRoom[isAssignedMockIdx];
                                  cellContent = mockStd.roll_number;
                                  cellDept = mockStd.department;
                                  isAccess = mockStd.is_disabled === 1;
                                }
                              }

                              return (
                                <div
                                  key={colNum}
                                  onClick={() => !seatingResult && handleToggleBrokenSeatPre(rowNum, colNum)}
                                  className={`aspect-[1.3] text-[10px] font-extrabold flex flex-col items-center justify-center border-2 rounded-xl transition-all select-none relative
                                    ${isBroken 
                                      ? 'bg-rose-500/10 border-rose-500/40 text-rose-500 cursor-pointer hover:bg-rose-500/20' 
                                      : cellContent !== '-' 
                                        ? `${getDeptColor(cellDept)} border-solid` 
                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                                    }
                                    ${!seatingResult ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}
                                  `}
                                  title={isBroken ? "Broken seat (No allocation)" : `${cellContent} [${cellDept}]`}
                                >
                                  <span>{isBroken ? '⚠️' : cellContent}</span>
                                  {isAccess && !isBroken && (
                                    <span className="absolute bottom-0.5 right-1 text-[9px]" title="Accessibility Tagged">♿</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Grid Legends */}
                  <div className="flex flex-wrap gap-4 items-center justify-center text-[10px] font-semibold text-slate-500 mt-2.5 pt-3.5 border-t border-slate-200 dark:border-slate-900/60 w-full select-none">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 bg-white border border-slate-200 rounded-md" />
                      <span>Empty Desk</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 bg-rose-500/10 border border-rose-500/40 text-center rounded-md" />
                      <span>Broken Seat (Avoided)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 bg-blue-100 border border-blue-300 rounded-md" />
                      <span>CSE Dept</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 bg-purple-100 border border-purple-300 rounded-md" />
                      <span>AIML Dept</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 bg-emerald-100 border border-emerald-300 rounded-md" />
                      <span>AIDS Dept</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>♿ Accessibility</span>
                    </div>
                  </div>

                </div>
              </div>
            </Card>

            {/* Parameters configuration sidebar */}
            <div className="flex flex-col gap-4 print:hidden">
              {!seatingResult ? (
                <Card className="shadow-sm" header={
                  <h4 className="text-sm font-bold text-slate-705 dark:text-slate-350 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-primary" /> Parameters Setup
                  </h4>
                }>
                  <div className="flex flex-col gap-4 text-xs">
                    {/* Columns Count */}
                    <div className="flex flex-col gap-1 text-left">
                      <label className="font-semibold text-slate-650 dark:text-slate-400">Desk Columns in Classroom</label>
                      <Dropdown
                        id="columns"
                        value={numCols.toString()}
                        onChange={(e) => setNumCols(parseInt(e.target.value))}
                        options={[
                          { value: '4', label: '4 Columns' },
                          { value: '6', label: '6 Columns' },
                          { value: '8', label: '8 Columns' },
                          { value: '10', label: '10 Columns' }
                        ]}
                      />
                      <p className="text-[9px] text-slate-450 mt-1 leading-normal">
                        Defines classroom desk structure to format alternate seating rules.
                      </p>
                    </div>

                    <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

                    {/* Broken seat lists indicator */}
                    <div className="text-left">
                      <span className="font-semibold text-slate-650 dark:text-slate-400 block mb-1">Broken Desks Selection ({brokenSeats.length})</span>
                      <p className="text-[9px] text-slate-450 mb-2 leading-normal">
                        Click on cells in the room grid to lock desks out of the seating algorithm.
                      </p>
                      {brokenSeats.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1 max-h-20 overflow-y-auto">
                          {brokenSeats.map(([r, c]) => (
                            <span key={`${r}-${c}`} className="text-[9px] font-bold bg-rose-500/10 border border-rose-500/20 text-rose-500 px-2 py-0.5 rounded flex items-center gap-1">
                              Row {String.fromCharCode(64 + r)} - Col {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

                    {/* Students accessibility checker list */}
                    <div className="text-left">
                      <span className="font-semibold text-slate-650 dark:text-slate-400 block mb-1">Accessibility Seating Check</span>
                      <p className="text-[9px] text-slate-450 mb-2.5 leading-normal">
                        Tag students requiring accessibility. AI places them in Row 1 (closest to exit/front board).
                      </p>
                      <div className="max-h-36 overflow-y-auto flex flex-col gap-1.5 pr-1">
                        {studentsInRoom.map((s, idx) => (
                          <label key={s.roll_number} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-905 border border-slate-150 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/40">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800 dark:text-slate-205">{s.roll_number}</span>
                              <span className="text-[9px] text-slate-450 uppercase">{s.department}</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={s.is_disabled === 1}
                              onChange={() => handleToggleDisability(idx)}
                              className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={handleGenerateSeatPlan}
                      variant="primary"
                      className="w-full py-2.5 mt-2 text-xs"
                      loading={generatingSeating}
                      icon={<Grid className="w-4 h-4" />}
                    >
                      Generate Seating Layout (AI)
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className="shadow-sm border-emerald-500/20" header={
                  <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-500" /> Seating Allocation Active
                  </h4>
                }>
                  <div className="flex flex-col gap-4 text-xs text-left">
                    <p className="text-slate-500 leading-normal">
                      Seating plan has been successfully written to the SQLite database. Seats are interleaved to avoid adjacent department overlaps.
                    </p>
                    <div className="p-3 bg-slate-50 dark:bg-slate-955 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-1.5 font-semibold text-slate-650 dark:text-slate-350">
                      <span>• Total Desks: {parsedRows * numCols}</span>
                      <span>• Students Allocated: {seatingResult.student_count}</span>
                      <span>• Broken Excluded: {brokenSeats.length}</span>
                    </div>

                    <Button
                      onClick={() => setSeatingResult(null)}
                      variant="outline"
                      className="w-full py-2 text-xs"
                    >
                      Reconfigure Layout
                    </Button>
                  </div>
                </Card>
              )}
            </div>

          </div>

          {/* Student-wise seat table list */}
          {seatingResult && (
            <Card className="w-full mt-4 print:mt-10" header={
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 w-full">
                <h4 className="text-sm font-bold text-slate-705 dark:text-slate-350">Student Assignment Roster</h4>
                <div className="relative max-w-xs w-full print:hidden">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search roll number or department..."
                    value={seatingSearch}
                    onChange={(e) => setSeatingSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-905 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-primary"
                  />
                </div>
              </div>
            }>
              <div className="overflow-x-auto text-left">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase">
                      <th className="pb-3 pl-2">Roll Number</th>
                      <th className="pb-3">Department</th>
                      <th className="pb-3 text-center">Assigned Seat</th>
                      <th className="pb-3 text-center">Accessibility</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSeatingList.map((rec: any) => (
                      <tr key={rec.roll_number} className="border-b border-slate-100/50 dark:border-slate-800/40 text-xs sm:text-sm text-slate-655 dark:text-slate-300">
                        <td className="py-2.5 pl-2 font-bold text-slate-800 dark:text-slate-205">{rec.roll_number}</td>
                        <td className="py-2.5 font-semibold text-slate-500 uppercase">{rec.department}</td>
                        <td className="py-2.5 text-center font-black text-primary text-sm">{rec.seat_number}</td>
                        <td className="py-2.5 text-center">
                          {rec.is_accessibility === 1 ? (
                            <span className="inline-block text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/10">♿ Front Row</span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredSeatingList.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center py-6 text-slate-400 font-semibold">
                          No student matching "{seatingSearch}" found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

        </div>
      );
    }

    // Default Exam Hall Allocation Form (Halls Allocation view)
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-fade-in">
        
        {/* Main form to input Date/Times and Cohort Counts */}
        <Card className="lg:col-span-2 shadow-sm bg-white dark:bg-slate-900" header={
          <h3 className="text-sm font-bold text-slate-705 dark:text-slate-350 flex items-center gap-1.5">
            <Award className="w-5 h-5 text-primary animate-pulse" /> Exam Hall Allocator parameters
          </h3>
        }>
          <form onSubmit={handleAllocateExams} className="flex flex-col gap-5 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                id="examDate"
                type="date"
                label="Date of Examination"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                leftIcon={<Calendar className="w-4 h-4" />}
                required
              />
              <Input
                id="examStartTime"
                type="time"
                label="Session Start Time"
                value={examStartTime}
                onChange={(e) => setExamStartTime(e.target.value)}
                leftIcon={<Clock className="w-4 h-4" />}
                required
              />
              <Input
                id="examEndTime"
                type="time"
                label="Session End Time"
                value={examEndTime}
                onChange={(e) => setExamEndTime(e.target.value)}
                leftIcon={<Clock className="w-4 h-4" />}
                required
              />
            </div>

            <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

            {/* Department cohort sizes */}
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Student Cohort Counts by Department
              </span>
              <p className="text-[10px] text-slate-500 mb-2 leading-normal">
                Specify student strengths for examination cohorts. AI allocates rooms and splits larger groups across available spaces.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Input
                  id="c_cse"
                  type="number"
                  label="CSE Cohort Count"
                  value={cohortCSE}
                  onChange={(e) => setCohortCSE(e.target.value)}
                  leftIcon={<Users className="w-4 h-4 text-slate-400" />}
                />
                <Input
                  id="c_aiml"
                  type="number"
                  label="AIML Cohort Count"
                  value={cohortAIML}
                  onChange={(e) => setCohortAIML(e.target.value)}
                  leftIcon={<Users className="w-4 h-4 text-slate-400" />}
                />
                <Input
                  id="c_aids"
                  type="number"
                  label="AIDS Cohort Count"
                  value={cohortAIDS}
                  onChange={(e) => setCohortAIDS(e.target.value)}
                  leftIcon={<Users className="w-4 h-4 text-slate-400" />}
                />
                <Input
                  id="c_it"
                  type="number"
                  label="IT Cohort Count"
                  value={cohortIT}
                  onChange={(e) => setCohortIT(e.target.value)}
                  leftIcon={<Users className="w-4 h-4 text-slate-400" />}
                />
                <Input
                  id="c_ece"
                  type="number"
                  label="ECE Cohort Count"
                  value={cohortECE}
                  onChange={(e) => setCohortECE(e.target.value)}
                  leftIcon={<Users className="w-4 h-4 text-slate-400" />}
                />
                <Input
                  id="c_mech"
                  type="number"
                  label="MECH Cohort Count"
                  value={cohortMECH}
                  onChange={(e) => setCohortMECH(e.target.value)}
                  leftIcon={<Users className="w-4 h-4 text-slate-400" />}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="py-3 mt-2 text-sm"
              loading={allocatingHalls}
            >
              Allocate Exam Halls (AI)
            </Button>
          </form>
        </Card>

        {/* Exam allocations output list */}
        <div className="flex flex-col gap-4">
          <Card className="bg-gradient-to-br from-emerald-500/5 to-white dark:to-slate-900 border-primary/20 min-h-[250px]" header={
            <div className="flex items-center gap-2 text-primary font-extrabold text-sm">
              <School className="w-5 h-5 text-primary" /> Exam Room Allocations
            </div>
          }>
            <div className="flex flex-col gap-4 text-sm leading-relaxed text-left">
              {!examAllocResult ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500 gap-3 text-center">
                  <Grid className="w-12 h-12 text-slate-300 dark:text-slate-800 stroke-1" />
                  <p className="text-xs font-semibold px-4">
                    Enter examination dates, cohort sizes and click run. AI will automatically optimize and split class lists.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {/* Summary Box */}
                  <div className="grid grid-cols-3 gap-2 text-center p-3 bg-slate-50 dark:bg-slate-955 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-450 block">Total Students</span>
                      <span className="text-base font-black text-slate-800 dark:text-white">{examAllocResult.total_students}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-450 block">Allocated</span>
                      <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{examAllocResult.allocated_count}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-450 block">Halls Used</span>
                      <span className="text-base font-black text-primary">{examAllocResult.rooms_allocated.length}</span>
                    </div>
                  </div>

                  {/* Allocations list */}
                  <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
                    {examAllocResult.allocations.map((alloc: any, index: number) => (
                      <div key={index} className="p-3.5 bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-800 hover:border-primary/20 rounded-2xl flex flex-col gap-2 transition-all">
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col text-left">
                            <span className="font-extrabold text-sm text-slate-800 dark:text-slate-205">{alloc.venue_name}</span>
                            <span className="text-[9px] font-bold text-slate-450 uppercase">Capacity: {alloc.capacity} pax</span>
                          </div>
                          <span className="text-[10px] font-bold bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded-full">
                            {alloc.allocated_count} Assigned
                          </span>
                        </div>

                        <div className="text-[10px] bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-100 dark:border-slate-900/60 leading-normal text-slate-600 dark:text-slate-400">
                          <span className="font-bold text-slate-450 uppercase text-[8px] block mb-1">Student Ranges</span>
                          {alloc.ranges.join(', ')}
                        </div>

                        <Button
                          onClick={() => handleSelectRoomForSeating(alloc)}
                          variant="accent"
                          size="sm"
                          className="w-full text-xs font-bold py-1.5 mt-1 flex items-center justify-center gap-1.5"
                          icon={<Grid className="w-3.5 h-3.5" />}
                        >
                          Plan Seating Grid <ArrowRight className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 text-left animate-fade-in">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-5 print:hidden">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white capitalize">
          Administration {subTab.replace('_', ' ')}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Review details, process pending approvals, and schedule repairs for campus resources.
        </p>
      </div>

      {subTab === 'approvals' && renderApprovals()}
      {subTab === 'maintenance' && renderMaintenance()}
      {subTab === 'exams' && renderExams()}
    </div>
  );
};
