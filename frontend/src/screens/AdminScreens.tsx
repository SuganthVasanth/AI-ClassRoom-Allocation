import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Dropdown } from '../components/Dropdown';
import { useToast } from '../components/Toast';
import { CLASSROOMS } from '../constants/mockData';
import { FileCheck, Settings, Check, X, ShieldAlert, AlertTriangle, Hammer, MapPin } from 'lucide-react';

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
                  Staff: <span className="font-semibold">{req.staffName}</span> | Date: <span className="font-medium text-slate-700 dark:text-slate-300">{req.date}</span> | Time: <span className="font-medium text-slate-700 dark:text-slate-300">{req.time} ({req.duration} hrs)</span>
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

  return (
    <div className="flex flex-col gap-6 text-left animate-fade-in">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white capitalize">
          Administration {subTab}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Review details, process pending approvals, and schedule repairs for campus resources.
        </p>
      </div>

      {subTab === 'approvals' && renderApprovals()}
      {subTab === 'maintenance' && renderMaintenance()}
    </div>
  );
};
