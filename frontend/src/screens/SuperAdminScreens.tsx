import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Dropdown } from '../components/Dropdown';
import { useToast } from '../components/Toast';
import { DEPARTMENTS, BUILDINGS, CLASSROOMS } from '../constants/mockData';
import { MOCK_USERS } from '../contexts/AuthContext';
import { Landmark, School, Building, Users, Sliders, Check, Plus, Trash2, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';

interface SuperAdminScreensProps {
  subTab: string;
}

export const SuperAdminScreens: React.FC<SuperAdminScreensProps> = ({ subTab }) => {
  const { showToast } = useToast();

  // Institution details state
  const [instName, setInstName] = useState('Bannari Amman Institute of Technology');
  const [instCode, setInstCode] = useState('BIT');
  const [instHead, setInstHead] = useState('Dr. C. Palanisamy (Principal)');
  const [instLoc, setInstLoc] = useState('Sathy, Erode, Tamil Nadu, India');

  // AI settings state
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [roomLockTime, setRoomLockTime] = useState(15);
  const [autoResolveClashes, setAutoResolveClashes] = useState(true);

  // Real ML model info states
  const [modelInfo, setModelInfo] = useState<any | null>(null);
  const [loadingModelInfo, setLoadingModelInfo] = useState(false);

  const fetchModelInfo = async () => {
    setLoadingModelInfo(true);
    try {
      const res = await api.getModelInfo();
      setModelInfo(res);
    } catch (err) {
      console.error("Error fetching model info:", err);
    } finally {
      setLoadingModelInfo(false);
    }
  };

  useEffect(() => {
    if (subTab === 'ai_settings') {
      fetchModelInfo();
    }
  }, [subTab]);

  const handleSaveInstitution = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Institution configurations updated.', 'success');
  };

  const handleSaveAISettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('AI Allocation parameters updated.', 'success');
  };

  // Render Institution Screen
  const renderInstitution = () => (
    <Card header={<h3 className="text-sm font-bold text-slate-700 dark:text-slate-350">Institution Settings</h3>}>
      <form onSubmit={handleSaveInstitution} className="flex flex-col gap-4 text-left">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="instName"
            label="Institution Name"
            value={instName}
            onChange={(e) => setInstName(e.target.value)}
            leftIcon={<Landmark className="w-4 h-4 text-slate-400" />}
          />
          <Input
            id="instCode"
            label="Institution Short Code"
            value={instCode}
            onChange={(e) => setInstCode(e.target.value)}
          />
          <Input
            id="instHead"
            label="Principal / Head of Institution"
            value={instHead}
            onChange={(e) => setInstHead(e.target.value)}
          />
          <Input
            id="instLoc"
            label="Location / Campus Address"
            value={instLoc}
            onChange={(e) => setInstLoc(e.target.value)}
          />
        </div>
        <Button type="submit" variant="primary" size="sm" className="self-end mt-2" icon={<Check className="w-4 h-4" />}>
          Save Institution Settings
        </Button>
      </form>
    </Card>
  );

  // Render Departments Screen
  const renderDepartments = () => (
    <Card header={
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-355">Academic Departments</h3>
        <Button variant="accent" size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => showToast('Form to add department opened (Simulated)', 'info')}>
          Add Dept
        </Button>
      </div>
    }>
      <div className="overflow-x-auto text-left">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-805 text-xs font-bold text-slate-400 uppercase">
              <th className="pb-3 pl-2">Code</th>
              <th className="pb-3">Department Name</th>
              <th className="pb-3">HOD / Chair</th>
              <th className="pb-3 text-center">Faculty count</th>
              <th className="pb-3 text-center">Students count</th>
              <th className="pb-3 text-right pr-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {DEPARTMENTS.map((dept) => (
              <tr key={dept.id} className="border-b border-slate-100/50 dark:border-slate-800/40 text-xs sm:text-sm text-slate-655 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                <td className="py-3 pl-2 font-bold text-primary">{dept.code}</td>
                <td className="py-3 font-semibold text-slate-800 dark:text-slate-205">{dept.name}</td>
                <td className="py-3">{dept.head}</td>
                <td className="py-3 text-center font-medium">{dept.staffCount}</td>
                <td className="py-3 text-center font-semibold">{dept.studentCount}</td>
                <td className="py-3 text-right pr-2">
                  <button onClick={() => showToast(`Cannot delete core department ${dept.code}`, 'warning')} className="text-slate-400 hover:text-rose-500 p-1 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  // Render Buildings Screen
  const renderBuildings = () => (
    <Card header={
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-705 dark:text-slate-350">Campus Buildings & Blocks</h3>
        <Button variant="accent" size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => showToast('Form to add building block opened (Simulated)', 'info')}>
          Add Block
        </Button>
      </div>
    }>
      <div className="overflow-x-auto text-left">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-805 text-xs font-bold text-slate-400 uppercase">
              <th className="pb-3 pl-2">Block Code</th>
              <th className="pb-3">Block Name</th>
              <th className="pb-3">Floors</th>
              <th className="pb-3 text-center">Total Rooms</th>
              <th className="pb-3 text-right pr-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {BUILDINGS.map((b) => (
              <tr key={b.id} className="border-b border-slate-100/50 dark:border-slate-800/40 text-xs sm:text-sm text-slate-655 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                <td className="py-3 pl-2 font-bold text-primary">{b.code}</td>
                <td className="py-3 font-semibold text-slate-800 dark:text-slate-205">{b.name}</td>
                <td className="py-3 font-medium">{b.floors} Floors</td>
                <td className="py-3 text-center font-semibold">{b.totalClassrooms}</td>
                <td className="py-3 text-right pr-2">
                  <button onClick={() => showToast('Feature disabled for sandbox demo', 'warning')} className="text-slate-400 hover:text-rose-500 p-1 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  // Render Classrooms Screen
  const renderClassrooms = () => (
    <Card header={
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-705 dark:text-slate-350">Active Classrooms List</h3>
        <Button variant="accent" size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => showToast('Form to add classroom opened (Simulated)', 'info')}>
          Add Room
        </Button>
      </div>
    }>
      <div className="overflow-x-auto text-left">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-805 text-xs font-bold text-slate-400 uppercase">
              <th className="pb-3 pl-2">Room Identifier</th>
              <th className="pb-3">Block Name</th>
              <th className="pb-3">Category</th>
              <th className="pb-3 text-center">Capacity</th>
              <th className="pb-3 text-center">Status</th>
              <th className="pb-3 text-right pr-2">Equipment</th>
            </tr>
          </thead>
          <tbody>
            {CLASSROOMS.map((room) => (
              <tr key={room.id} className="border-b border-slate-100/50 dark:border-slate-800/40 text-xs sm:text-sm text-slate-655 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                <td className="py-3 pl-2 font-bold text-slate-800 dark:text-slate-100">{room.name.split(' (')[0]}</td>
                <td className="py-3 font-semibold text-slate-500">{room.buildingName}</td>
                <td className="py-3 text-xs">{room.category}</td>
                <td className="py-3 text-center font-bold text-primary">{room.capacity} Pax</td>
                <td className="py-3 text-center">
                  <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full border
                    ${room.status === 'available' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20' : ''}
                    ${room.status === 'occupied' ? 'bg-blue-50 text-primary border-blue-100 dark:bg-blue-950/20' : ''}
                    ${room.status === 'maintenance' ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20' : ''}
                    ${room.status === 'reserved' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20' : ''}
                  `}>
                    {room.status.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 text-right pr-2 text-[10px] text-slate-450 truncate max-w-[150px]">
                  {room.equipment.join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  // Render Users list
  const renderUsers = () => (
    <Card header={
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-705 dark:text-slate-350">System Users Accounts</h3>
        <Button variant="accent" size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => showToast('Form to register new user opened (Simulated)', 'info')}>
          Add User
        </Button>
      </div>
    }>
      <div className="overflow-x-auto text-left">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-805 text-xs font-bold text-slate-400 uppercase">
              <th className="pb-3 pl-2">User details</th>
              <th className="pb-3">Email Address</th>
              <th className="pb-3">Department</th>
              <th className="pb-3 text-center">Role Permission</th>
              <th className="pb-3 text-right pr-2">ID Code</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(MOCK_USERS).map((u) => (
              <tr key={u.id} className="border-b border-slate-100/50 dark:border-slate-800/40 text-xs sm:text-sm text-slate-655 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                <td className="py-3 pl-2 flex items-center gap-2">
                  <img src={u.avatarUrl} alt={u.name} className="w-8 h-8 rounded-xl object-cover" />
                  <span className="font-semibold text-slate-805 dark:text-slate-200">{u.name}</span>
                </td>
                <td className="py-3 text-xs">{u.email}</td>
                <td className="py-3 text-slate-500 font-semibold">{u.department || 'General Administration'}</td>
                <td className="py-3 text-center">
                  <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full border
                    ${u.role === 'super_admin' ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20' : ''}
                    ${u.role === 'admin' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20' : ''}
                    ${u.role === 'staff' ? 'bg-blue-50 text-primary border-blue-100 dark:bg-blue-950/20' : ''}
                    ${u.role === 'student' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20' : ''}
                  `}>
                    {u.role.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="py-3 text-right pr-2 font-bold text-slate-400">#{u.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  // Render AI Settings Screen
  const renderAISettings = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start text-left">
      
      {/* Parameters tuning */}
      <Card className="lg:col-span-2 shadow-sm bg-white dark:bg-slate-900" header={
        <div className="flex items-center gap-2 text-primary font-bold text-left">
          <Sliders className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-bold text-slate-705 dark:text-slate-350">AI Allocator Engine Tuning</h3>
        </div>
      }>
        <form onSubmit={handleSaveAISettings} className="flex flex-col gap-6 text-left mt-2">
          {/* Confidence threshold */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-650 dark:text-slate-400">
              Minimum Match Confidence Threshold ({confidenceThreshold}%)
            </label>
            <div className="flex items-center gap-4 mt-2">
              <input
                type="range"
                min="50"
                max="98"
                step="2"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="w-12 text-center text-xs font-bold bg-slate-100 dark:bg-slate-805 border border-slate-200 dark:border-slate-800 py-1 px-2 rounded-lg">
                {confidenceThreshold}%
              </span>
            </div>
            <p className="text-[10px] text-slate-450 dark:text-slate-500 leading-normal mt-1">
              Min confidence required to trigger automatic booking proposal in recommendations. Higher means safer allocations but fewer drafts.
            </p>
          </div>

          <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

          {/* Expiration locks timer */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-650 dark:text-slate-400">
              Draft Booking Holds Lifetime ({roomLockTime} Minutes)
            </label>
            <div className="flex items-center gap-4 mt-2">
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={roomLockTime}
                onChange={(e) => setRoomLockTime(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="w-12 text-center text-xs font-bold bg-slate-100 dark:bg-slate-805 border border-slate-200 dark:border-slate-800 py-1 px-2 rounded-lg">
                {roomLockTime}m
              </span>
            </div>
            <p className="text-[10px] text-slate-455 dark:text-slate-500 leading-normal mt-1">
              Duration in minutes that suggested rooms are reserved as "Pending lock" before reverting to available status if request is not submitted.
            </p>
          </div>

          <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

          {/* Toggle conflict auto resolution */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-slate-705 dark:text-slate-205">AI Automated Conflict Resolution</h4>
              <p className="text-[10px] text-slate-450 dark:text-slate-500 leading-normal mt-1 max-w-md">
                Allow the system to automatically move conflicting timetable classes to adjacent vacant classrooms of equal capacity and alert HODs/Students.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoResolveClashes}
                onChange={(e) => setAutoResolveClashes(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>

          <Button type="submit" variant="primary" size="sm" className="self-end mt-2" icon={<Check className="w-4 h-4" />}>
            Save AI Engine Parameters
          </Button>
        </form>
      </Card>

      {/* Model monitor card */}
      <Card className="shadow-sm border-primary/20 bg-gradient-to-br from-blue-50/10 to-white dark:from-slate-850 dark:to-slate-900" header={
        <div className="flex items-center gap-2 text-primary font-bold text-left">
          <Sliders className="w-5 h-5 text-primary animate-pulse" />
          <h3 className="text-sm font-bold text-slate-750 dark:text-slate-200">XGBoost ML Recommender Monitor</h3>
        </div>
      }>
        <div className="flex flex-col gap-4 text-left text-xs leading-normal">
          {loadingModelInfo ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-2">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] font-bold">Checking active models...</span>
            </div>
          ) : !modelInfo ? (
            <div className="text-center py-6 text-slate-400 font-semibold border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              No active recommender model found. Using default heuristic ranking.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-500">Status:</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/10">
                  ● {modelInfo.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-500">Version:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-100 select-all truncate max-w-[150px]">{modelInfo.model_version || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-500">Trained At:</span>
                <span className="font-semibold text-slate-650 dark:text-slate-350">{modelInfo.trained_at || 'N/A'}</span>
              </div>
              
              <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />
              
              <div className="flex flex-col gap-2">
                <span className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest">Active Model Test Metrics</span>
                <div className="grid grid-cols-3 gap-2 text-center mt-1">
                  <div className="p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Accuracy</span>
                    <span className="text-xs font-black text-primary">
                      {modelInfo.metrics?.accuracy ? `${(modelInfo.metrics.accuracy * 100).toFixed(1)}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">F1-Score</span>
                    <span className="text-xs font-black text-purple-600 dark:text-purple-400">
                      {modelInfo.metrics?.f1_score ? `${(modelInfo.metrics.f1_score * 100).toFixed(1)}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Top-5 Acc</span>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                      {modelInfo.metrics?.top5_accuracy ? `${(modelInfo.metrics.top5_accuracy * 100).toFixed(1)}%` : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

              {/* Retraining Threshold Counter */}
              <div className="flex flex-col gap-1.5 mt-1">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-500">Auto Retraining Counter</span>
                  <span className="text-primary">{modelInfo.training_records_count || 1500} / 1000</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-750">
                  <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '100%' }} />
                </div>
                <p className="text-[9px] text-slate-450 leading-normal mt-1">
                  The model will automatically retrain and version itself in the background when the buffer reaches 1000 new allocation records.
                </p>
              </div>

            </div>
          )}
        </div>
      </Card>

    </div>
  );

  return (
    <div className="flex flex-col gap-6 text-left animate-fade-in">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white capitalize">
          System {subTab.replace('_', ' ')}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Super Admin dashboard to configure central infrastructure, users registries, and AI parameters.
        </p>
      </div>

      {subTab === 'institution' && renderInstitution()}
      {subTab === 'departments' && renderDepartments()}
      {subTab === 'buildings' && renderBuildings()}
      {subTab === 'classrooms' && renderClassrooms()}
      {subTab === 'users' && renderUsers()}
      {subTab === 'ai_settings' && renderAISettings()}
    </div>
  );
};
