import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { useToast } from '../components/Toast';
import {
  Calendar, Search, MapPin, CheckCircle2, Clock, Trash2, XCircle,
  Download, RefreshCw, History, ChevronDown, ChevronUp,
  Building2, Users, Sparkles, AlertCircle, BookOpen, Filter,
  Award, Hash, Layers, Timer, Tag, FileCheck, Info, LayoutGrid
} from 'lucide-react';
import { api } from '../services/api';

interface BookingHistoryProps {
  requests?: any[];
  onCancelRequest?: (id: string) => void;
}

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected';

export const BookingHistoryScreen: React.FC<BookingHistoryProps> = ({
  onCancelRequest
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  if (!user) return null;

  const fetchMyBookings = useCallback(async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setRefreshing(true);
    try {
      const data = await api.getMyBookings(user.id);
      setMyRequests(data);
    } catch (err) {
      console.error('Failed to fetch booking history:', err);
      showToast('Could not load booking history. Please try again.', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchMyBookings();
    const interval = setInterval(() => fetchMyBookings(), 10000);
    return () => clearInterval(interval);
  }, [fetchMyBookings]);

  const handleCancel = async (id: string) => {
    if (onCancelRequest) {
      onCancelRequest(id);
      showToast('Booking request cancelled successfully.', 'info');
      setMyRequests((prev) => prev.filter((r) => r.id !== id));
    } else {
      showToast('Action not allowed in preview.', 'warning');
    }
  };

  const filteredRequests = myRequests.filter((r) => {
    const matchSearch =
      (r.subject || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.allocatedClassroomName || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.date || '').includes(search);
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const sortedFiltered = [...filteredRequests].sort((a, b) => {
    const tA = new Date(a.createdAt || 0).getTime();
    const tB = new Date(b.createdAt || 0).getTime();
    return sortOrder === 'newest' ? tB - tA : tA - tB;
  });

  const statusCounts = {
    all: myRequests.length,
    pending: myRequests.filter((r) => r.status === 'pending').length,
    approved: myRequests.filter((r) => r.status === 'approved').length,
    rejected: myRequests.filter((r) => r.status === 'rejected').length,
  };

  const filterTabs: { key: FilterStatus; label: string; activeColor: string; dotColor: string }[] = [
    { key: 'all', label: 'All', activeColor: 'border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30', dotColor: '' },
    { key: 'pending', label: 'Pending', activeColor: 'border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30', dotColor: 'bg-amber-400' },
    { key: 'approved', label: 'Approved', activeColor: 'border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30', dotColor: 'bg-emerald-400' },
    { key: 'rejected', label: 'Declined', activeColor: 'border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30', dotColor: 'bg-rose-400' },
  ];

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          badge: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          label: 'Approved',
          leftBorder: 'border-l-emerald-400',
        };
      case 'pending':
        return {
          badge: 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/20',
          icon: <Clock className="w-3.5 h-3.5 animate-pulse" />,
          label: 'Pending',
          leftBorder: 'border-l-amber-400',
        };
      case 'rejected':
        return {
          badge: 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/20',
          icon: <XCircle className="w-3.5 h-3.5" />,
          label: 'Declined',
          leftBorder: 'border-l-rose-400',
        };
      default:
        return {
          badge: 'bg-slate-50 text-slate-500 border-slate-100',
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          label: status,
          leftBorder: 'border-l-slate-300',
        };
    }
  };

  const formatCreatedAt = (iso: string) => {
    try {
      return new Date(iso).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch { return iso; }
  };

  return (
    <div className="flex flex-col gap-6 text-left animate-fade-in">

      {/* ─── Header ─── */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <History className="w-5 h-5 text-indigo-500" />
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                My Allocation History
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              All classroom allocation requests you've submitted — live status, room details, and more.
            </p>
          </div>

          <button
            onClick={() => fetchMyBookings(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl transition-all hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-slate-800/50 flex-shrink-0 cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-indigo-500' : ''}`} />
            <span className="hidden sm:inline">{refreshing ? 'Refreshing…' : 'Refresh'}</span>
          </button>
        </div>

        {/* Status filter chips */}
        {!loading && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilterStatus(tab.key)}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer
                  ${filterStatus === tab.key
                    ? tab.activeColor
                    : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
              >
                {tab.dotColor && (
                  <span className={`w-1.5 h-1.5 rounded-full ${tab.dotColor} shrink-0`} />
                )}
                {tab.label}
                <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-extrabold px-1
                  ${filterStatus === tab.key
                    ? 'bg-white/60 dark:bg-black/20'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}
                >
                  {statusCounts[tab.key]}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── Search + Sort ─── */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search by subject, room, or date…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>
        <button
          onClick={() => setSortOrder((prev) => prev === 'newest' ? 'oldest' : 'newest')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 px-3 py-2.5 rounded-xl transition-all hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-slate-800/50 cursor-pointer"
        >
          <Filter className="w-3.5 h-3.5" />
          {sortOrder === 'newest' ? (
            <><ChevronDown className="w-3.5 h-3.5" /> Newest First</>
          ) : (
            <><ChevronUp className="w-3.5 h-3.5" /> Oldest First</>
          )}
        </button>
      </div>

      {/* ─── Cards ─── */}
      <div className="flex flex-col gap-4">

        {/* Loading skeleton */}
        {loading && Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} padding="md" className="animate-pulse">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="h-4 w-44 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded-full" />
              </div>
              <div className="flex gap-3">
                <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded" />
                <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800 rounded" />
              </div>
            </div>
          </Card>
        ))}

        {/* Empty state */}
        {!loading && sortedFiltered.length === 0 && (
          <div className="text-center py-16 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-indigo-300 dark:text-indigo-700" />
            </div>
            <div>
              <p className="font-bold text-slate-600 dark:text-slate-400 text-sm">
                {search || filterStatus !== 'all' ? 'No requests match your filters.' : 'No allocation requests yet.'}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">
                {search || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter.'
                  : 'Submit a classroom request to see your history here.'}
              </p>
            </div>
            {(search || filterStatus !== 'all') && (
              <button
                onClick={() => { setSearch(''); setFilterStatus('all'); }}
                className="text-xs font-bold text-indigo-500 hover:text-indigo-700 underline underline-offset-2 cursor-pointer"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Request cards */}
        {!loading && sortedFiltered.map((req) => {
          const st = getStatusStyles(req.status);
          const isExpanded = expandedId === req.id;
          const isApproved = req.status === 'approved';

          return (
            <Card
              key={req.id}
              padding="none"
              className={`transition-all group overflow-hidden border-l-4 ${st.leftBorder}
                ${isApproved ? 'ring-1 ring-emerald-200/60 dark:ring-emerald-900/30' : ''}`}
            >
              {/* ── Card header row ── */}
              <div className="px-5 py-4 flex flex-col sm:flex-row justify-between sm:items-start gap-3">

                {/* Left: summary */}
                <div className="flex flex-col gap-1.5 text-left flex-1 min-w-0">
                  {/* Title + pills */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 truncate">
                      {req.subject || 'Untitled Request'}
                    </h3>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold px-2 py-0.5 rounded shrink-0">
                      {req.strength} Pax
                    </span>
                    {req.aiSuggested && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/20 shrink-0">
                        <Sparkles className="w-2.5 h-2.5" /> AI Matched
                      </span>
                    )}
                    {req.isBulkAllotment && (
                      <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-900/20 shrink-0">
                        Bulk
                      </span>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      {req.date}{req.isBulkAllotment && req.bulkDetails?.endDate && ` (${req.bulkDetails.startSession || 'FN'}) to ${req.bulkDetails.endDate} (${req.bulkDetails.endSession || 'AN'})`}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {req.time} ({req.duration} hr{req.duration > 1 ? 's' : ''})
                    </span>
                    {req.allocatedClassroomName && !req.isBulkAllotment && (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        {req.allocatedClassroomName}
                      </span>
                    )}
                    {req.purpose && (
                      <span className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-slate-400" />
                        {req.purpose}
                      </span>
                    )}
                  </div>

                  {req.createdAt && (
                    <p className="text-[10px] text-slate-400 dark:text-slate-600">
                      Submitted: {formatCreatedAt(req.createdAt)}
                    </p>
                  )}
                </div>

                {/* Right: status + expand/cancel */}
                <div className="flex items-center gap-2 self-end sm:self-start flex-shrink-0">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-3 py-1 rounded-full border ${st.badge}`}>
                    {st.icon} {st.label}
                  </span>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : req.id)}
                    className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-lg transition-all cursor-pointer"
                    title={isExpanded ? 'Collapse' : 'Show full details'}
                  >
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {req.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(req.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-900/20 cursor-pointer"
                      title="Cancel Request"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* ─────────────────────────────────────────────────
                  EXPANDED DETAILS — APPROVED: Full Confirmation
                  ───────────────────────────────────────────────── */}
              {isExpanded && isApproved && (
                <div className="border-t border-emerald-100 dark:border-emerald-900/30 animate-fade-in">

                  {/* Approved banner */}
                  <div className="px-5 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">
                        Allocation Confirmed
                      </p>
                      <p className="text-[10px] text-emerald-600/70 dark:text-emerald-500/70">
                        Your classroom has been officially allocated. Details below.
                      </p>
                    </div>
                  </div>

                  <div className="px-5 py-4 flex flex-col gap-5">

                    {/* ─ Allocated Room Highlight ─ */}
                    {!req.isBulkAllotment && req.allocatedClassroomName && (
                      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/60 dark:bg-emerald-950/10 p-4 flex flex-col gap-3">
                        <p className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5" /> Allocated Classroom
                        </p>

                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-6 h-6 text-emerald-500" />
                          </div>
                          <div>
                            <p className="text-lg font-extrabold text-slate-800 dark:text-white leading-tight">
                              {req.allocatedClassroomName}
                            </p>
                            {req.allocatedClassroomId && (
                              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                                Room ID: {req.allocatedClassroomId}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Room detail grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-1">
                          <div className="flex flex-col gap-0.5 bg-white dark:bg-slate-900/40 rounded-xl p-2.5 border border-emerald-100 dark:border-emerald-900/30">
                            <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <Calendar className="w-2.5 h-2.5" /> Date
                            </p>
                            <p className="text-xs font-extrabold text-slate-700 dark:text-slate-200">{req.date}</p>
                          </div>

                          <div className="flex flex-col gap-0.5 bg-white dark:bg-slate-900/40 rounded-xl p-2.5 border border-emerald-100 dark:border-emerald-900/30">
                            <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <Timer className="w-2.5 h-2.5" /> Time Slot
                            </p>
                            <p className="text-xs font-extrabold text-slate-700 dark:text-slate-200">{req.time} · {req.duration} hr{req.duration > 1 ? 's' : ''}</p>
                          </div>

                          <div className="flex flex-col gap-0.5 bg-white dark:bg-slate-900/40 rounded-xl p-2.5 border border-emerald-100 dark:border-emerald-900/30">
                            <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <Users className="w-2.5 h-2.5" /> Strength
                            </p>
                            <p className="text-xs font-extrabold text-slate-700 dark:text-slate-200">{req.strength} students</p>
                          </div>

                          {req.purpose && (
                            <div className="flex flex-col gap-0.5 bg-white dark:bg-slate-900/40 rounded-xl p-2.5 border border-emerald-100 dark:border-emerald-900/30">
                              <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                <Tag className="w-2.5 h-2.5" /> Purpose
                              </p>
                              <p className="text-xs font-extrabold text-slate-700 dark:text-slate-200">{req.purpose}</p>
                            </div>
                          )}

                          {req.allocationId && (
                            <div className="flex flex-col gap-0.5 bg-white dark:bg-slate-900/40 rounded-xl p-2.5 border border-emerald-100 dark:border-emerald-900/30 col-span-2 sm:col-span-2">
                              <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                <Hash className="w-2.5 h-2.5" /> Allocation Reference
                              </p>
                              <p className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 truncate">{req.allocationId}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* ─ Facilities ─ */}
                    {req.facilities && req.facilities.length > 0 && (
                      <div>
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <LayoutGrid className="w-3 h-3" /> Confirmed Facilities
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {req.facilities.map((f: string) => (
                            <span key={f} className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-semibold px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                              <CheckCircle2 className="w-2.5 h-2.5 opacity-70" /> {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ─ Remarks ─ */}
                    {req.remarks && (
                      <div>
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <Info className="w-3 h-3" /> Remarks
                        </p>
                        <p className="text-xs text-slate-500 italic bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                          "{req.remarks}"
                        </p>
                      </div>
                    )}

                    {/* ─ Bulk Allotment ─ */}
                    {req.isBulkAllotment && req.bulkDetails && (
                      <div className="rounded-xl border border-indigo-200 dark:border-indigo-800/50 bg-indigo-50/40 dark:bg-indigo-950/10 p-4 flex flex-col gap-3">
                        <p className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Layers className="w-3 h-3" /> Bulk Allotment Details
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="flex flex-col gap-0.5 bg-white dark:bg-slate-900/40 rounded-xl p-2.5 border border-indigo-100 dark:border-indigo-900/30">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Mapped</p>
                            <p className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                              {req.bulkDetails.summary?.mapped_students}
                              <span className="text-[10px] font-normal text-slate-400"> / {req.bulkDetails.summary?.total_students}</span>
                            </p>
                          </div>
                          <div className="flex flex-col gap-0.5 bg-white dark:bg-slate-900/40 rounded-xl p-2.5 border border-indigo-100 dark:border-indigo-900/30">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Labs</p>
                            <p className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">{req.bulkDetails.uniqueLabsCount}</p>
                          </div>
                          <div className="flex flex-col gap-0.5 bg-white dark:bg-slate-900/40 rounded-xl p-2.5 border border-indigo-100 dark:border-indigo-900/30">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Venues</p>
                            <p className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">{req.bulkDetails.uniqueVenuesCount}</p>
                          </div>
                        </div>

                        {/* Date range */}
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                          {req.bulkDetails.startDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-indigo-400" />
                              From: <strong className="text-slate-700 dark:text-slate-300">{req.bulkDetails.startDate} ({req.bulkDetails.startSession || 'FN'})</strong>
                            </span>
                          )}
                          {req.bulkDetails.endDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-indigo-400" />
                              To: <strong className="text-slate-700 dark:text-slate-300">{req.bulkDetails.endDate} ({req.bulkDetails.endSession || 'AN'})</strong>
                            </span>
                          )}
                        </div>

                        <a
                          href={api.downloadAllotmentUrl(req.bulkDetails.sessionId)}
                          download="Requested_Venue_Mapping.xlsx"
                          className="inline-flex items-center gap-2 text-xs font-extrabold text-white bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 px-3 py-2 rounded-xl transition-all self-start shadow-sm shadow-emerald-500/20"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download Allotment Plan (Excel)
                        </a>
                      </div>
                    )}

                    {/* ─ AI Confidence ─ */}
                    {req.aiSuggested && req.aiConfidence !== undefined && (
                      <div>
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-amber-400" /> AI Match Confidence
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 rounded-full transition-all"
                              style={{ width: `${req.aiConfidence}%` }}
                            />
                          </div>
                          <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 w-12 text-right">{req.aiConfidence}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────
                  EXPANDED DETAILS — PENDING / REJECTED: Standard view
                  ───────────────────────────────────────────────── */}
              {isExpanded && !isApproved && (
                <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-4 flex flex-col gap-4 animate-fade-in">

                  {/* Pending info */}
                  {req.status === 'pending' && (
                    <div className="flex items-start gap-2.5 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-100 dark:border-amber-900/30">
                      <Clock className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-amber-700 dark:text-amber-400">Awaiting Admin Review</p>
                        <p className="text-[10px] text-amber-600/70 dark:text-amber-500/60 mt-0.5">
                          Your request is in queue. You'll see full room details once approved.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Rejected reason placeholder */}
                  {req.status === 'rejected' && (
                    <div className="flex items-start gap-2.5 p-3 bg-rose-50 dark:bg-rose-950/20 rounded-xl border border-rose-100 dark:border-rose-900/30">
                      <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-rose-700 dark:text-rose-400">Request Declined</p>
                        <p className="text-[10px] text-rose-600/70 dark:text-rose-500/60 mt-0.5">
                          This allocation request was declined by the administrator. Please submit a new request if needed.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Common: what was requested */}
                  <div className="flex flex-col gap-3">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Request Summary</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-2.5 border border-slate-100 dark:border-slate-800">
                        <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5 flex items-center gap-1"><Calendar className="w-2.5 h-2.5" /> Date</p>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{req.date}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-2.5 border border-slate-100 dark:border-slate-800">
                        <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5 flex items-center gap-1"><Timer className="w-2.5 h-2.5" /> Time</p>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{req.time} · {req.duration} hr{req.duration > 1 ? 's' : ''}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-2.5 border border-slate-100 dark:border-slate-800">
                        <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5 flex items-center gap-1"><Users className="w-2.5 h-2.5" /> Strength</p>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{req.strength} students</p>
                      </div>
                    </div>
                  </div>

                  {req.facilities && req.facilities.length > 0 && (
                    <div>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Requested Facilities</p>
                      <div className="flex flex-wrap gap-1.5">
                        {req.facilities.map((f: string) => (
                          <span key={f} className="text-[10px] bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-semibold px-2 py-0.5 rounded-lg border border-indigo-100 dark:border-indigo-900/20">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {req.remarks && (
                    <div>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Remarks</p>
                      <p className="text-xs text-slate-500 italic bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        "{req.remarks}"
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Footer */}
      {!loading && myRequests.length > 0 && (
        <p className="text-[10px] text-center text-slate-400 dark:text-slate-600 pb-2">
          Showing history for <strong>{user.name}</strong> · Auto-refreshes every 10 seconds
        </p>
      )}
    </div>
  );
};
