import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useToast } from '../components/Toast';
import { Calendar, Search, MapPin, CheckCircle2, Clock, Trash2, XCircle } from 'lucide-react';

interface BookingHistoryProps {
  requests: any[];
  onCancelRequest?: (id: string) => void;
}

export const BookingHistoryScreen: React.FC<BookingHistoryProps> = ({
  requests,
  onCancelRequest
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');

  if (!user) return null;

  // Filter requests that belong to this staff member
  const myRequests = requests.filter(
    (r) =>
      r.staffId === user.id &&
      (r.subject.toLowerCase().includes(search.toLowerCase()) ||
        (r.allocatedClassroomName && r.allocatedClassroomName.toLowerCase().includes(search.toLowerCase())))
  );

  const handleCancel = (id: string) => {
    if (onCancelRequest) {
      onCancelRequest(id);
      showToast('Booking request cancelled successfully.', 'info');
    } else {
      showToast('Action not allowed in preview.', 'warning');
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left animate-fade-in">
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Booking History
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Review details and status history of all classroom requests you've submitted.
        </p>
      </div>

      {/* Search Filter */}
      <div className="max-w-md w-full">
        <Input
          placeholder="Search by Subject or Allocated Room..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4 text-slate-400" />}
        />
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        {myRequests.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-medium border border-dashed border-slate-205 dark:border-slate-800 rounded-2xl">
            No booking history found matching search query.
          </div>
        ) : (
          myRequests.map((req) => (
            <Card key={req.id} padding="md" className="hover:border-slate-200 dark:hover:border-slate-700 transition-all">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                
                {/* Details */}
                <div className="flex flex-col gap-1.5 text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-sm text-slate-805 dark:text-slate-100">
                      {req.subject}
                    </h3>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold px-2 py-0.5 rounded">
                      {req.strength} Pax
                    </span>
                    {req.aiSuggested && (
                      <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-105 dark:border-emerald-900/10">
                        AI Matched
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3.5 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {req.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {req.time} ({req.duration} hrs)
                    </span>
                    {req.allocatedClassroomName && (
                      <span className="flex items-center gap-1 text-emerald-600 font-bold">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" /> {req.allocatedClassroomName}
                      </span>
                    )}
                  </div>

                  {req.remarks && (
                    <p className="text-xs text-slate-450 italic mt-0.5 bg-slate-50/50 dark:bg-slate-905/30 p-2 rounded-lg border border-slate-100 dark:border-slate-800/80 max-w-xl">
                      Remarks: "{req.remarks}"
                    </p>
                  )}
                </div>

                {/* Status indicator and actions */}
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div>
                    {req.status === 'approved' && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-extrabold px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/10">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                      </span>
                    )}
                    {req.status === 'pending' && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 font-extrabold px-3 py-1 rounded-full border border-amber-100 dark:border-amber-900/10">
                        <Clock className="w-3.5 h-3.5 animate-pulse" /> Pending Allocation
                      </span>
                    )}
                    {req.status === 'rejected' && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-extrabold px-3 py-1 rounded-full border border-rose-100 dark:border-rose-900/10">
                        <XCircle className="w-3.5 h-3.5" /> Declined
                      </span>
                    )}
                  </div>

                  {req.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(req.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-900/20"
                      title="Cancel Request"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
