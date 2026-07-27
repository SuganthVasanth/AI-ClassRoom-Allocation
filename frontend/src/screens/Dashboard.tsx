import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../components/Toast';
import { CLASSROOMS, DEPARTMENTS, BUILDINGS, TIMETABLE_DATA } from '../constants/mockData';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  Users, Building, School, FileCheck, CheckCircle2, XCircle, AlertTriangle, Clock,
  Calendar, MapPin, Sparkles, MessageSquare, ArrowUpRight, HelpCircle, Download,
  Map as MapIcon
} from 'lucide-react';

interface DashboardProps {
  requests: any[];
  onApproveRequest: (id: string) => void;
  onRejectRequest: (id: string) => void;
  onChangeTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  requests,
  onApproveRequest,
  onRejectRequest,
  onChangeTab
}) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { showToast } = useToast();

  if (!user) return null;

  const tooltipStyle = {
    contentStyle: {
      borderRadius: '12px',
      backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
      borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
      color: theme === 'dark' ? '#f8fafc' : '#0f172a',
    },
    itemStyle: {
      color: theme === 'dark' ? '#f8fafc' : '#0f172a',
    },
    labelStyle: {
      color: theme === 'dark' ? '#94a3b8' : '#64748b',
      fontWeight: 'bold' as const,
    }
  };

  // Chart Data preparation
  const categoryData = [
    { name: 'Lecture Hall', value: CLASSROOMS.filter(r => r.category === 'Lecture Hall').length },
    { name: 'Computer Lab', value: CLASSROOMS.filter(r => r.category === 'Computer Lab').length },
    { name: 'Seminar Hall', value: CLASSROOMS.filter(r => r.category === 'Seminar Hall').length },
    { name: 'Workshop', value: CLASSROOMS.filter(r => r.category === 'Workshop').length },
    { name: 'Drawing Hall', value: CLASSROOMS.filter(r => r.category === 'Drawing Hall').length },
  ];

  const deptStats = DEPARTMENTS.map(d => ({
    name: d.code,
    classrooms: CLASSROOMS.filter(r => r.buildingId === (BUILDINGS.find(b => b.code === d.buildingCode)?.id || '')).length,
    students: d.studentCount
  }));

  const timelineData = [
    { hour: '09 AM', CSE: 4, ECE: 3, MECH: 2 },
    { hour: '10 AM', CSE: 5, ECE: 4, MECH: 3 },
    { hour: '11 AM', CSE: 6, ECE: 2, MECH: 4 },
    { hour: '12 PM', CSE: 3, ECE: 1, MECH: 1 },
    { hour: '02 PM', CSE: 5, ECE: 5, MECH: 3 },
    { hour: '03 PM', CSE: 4, ECE: 4, MECH: 5 },
    { hour: '04 PM', CSE: 2, ECE: 1, MECH: 2 },
  ];

  const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Handlers for quick triggers
  const handleDownloadReport = () => {
    showToast('Generating utilization report PDF... Download will start shortly.', 'success');
  };

  const handleMaintenanceReport = () => {
    showToast('Reported classroom issue. Maintenance ticket created.', 'info');
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const approvedRequests = requests.filter(r => r.status === 'approved');
  const staffRequests = requests.filter(r => r.staffId === user.id);

  // ----------------------------------------------------
  // RENDER SUPER ADMIN DASHBOARD
  // ----------------------------------------------------
  const renderSuperAdmin = () => (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card padding="sm" className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950 text-blue-500 rounded-xl">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Buildings</p>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">{BUILDINGS.length}</h3>
          </div>
        </Card>
        <Card padding="sm" className="flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-500 rounded-xl">
            <School className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Classrooms</p>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">{CLASSROOMS.length}</h3>
          </div>
        </Card>
        <Card padding="sm" className="flex items-center gap-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-950 text-purple-500 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Active Staff / Users</p>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">180+</h3>
          </div>
        </Card>
        <Card padding="sm" className="flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950 text-amber-550 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">AI Utilization Efficiency</p>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">94.8%</h3>
          </div>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2" header={
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-350">Live Campus Utilization Peak Hours</h3>
            <span className="text-xs text-slate-400">Slots Allocated vs Department</span>
          </div>
        }>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-700/50" />
                <XAxis dataKey="hour" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="CSE" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="ECE" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="MECH" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card header={<h3 className="text-sm font-bold text-slate-705 dark:text-slate-350">Rooms by Category</h3>}>
          <div className="h-72 w-full flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 justify-center text-[10px] font-semibold text-slate-500">
              {categoryData.map((cat, idx) => (
                <div key={cat.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span>{cat.name} ({cat.value})</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Buildings list Table */}
      <Card header={<h3 className="text-sm font-bold text-slate-705 dark:text-slate-350">Campus Block Configuration</h3>}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase">
                <th className="pb-3 pl-2">Block Code</th>
                <th className="pb-3">Block Name</th>
                <th className="pb-3">Description</th>
                <th className="pb-3 text-center">Floors</th>
                <th className="pb-3 text-center">Classrooms</th>
                <th className="pb-3 text-right pr-2">Map Location</th>
              </tr>
            </thead>
            <tbody>
              {BUILDINGS.map((b) => (
                <tr key={b.id} className="border-b border-slate-100/50 dark:border-slate-800/40 text-sm text-slate-655 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                  <td className="py-3 pl-2 font-bold text-primary">{b.code}</td>
                  <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">{b.name}</td>
                  <td className="py-3 text-xs text-slate-500">{b.description}</td>
                  <td className="py-3 text-center font-medium">{b.floors}</td>
                  <td className="py-3 text-center font-semibold">{b.totalClassrooms}</td>
                  <td className="py-3 text-right pr-2 text-xs font-semibold text-emerald-500">
                    X: {b.coordinates.x}%, Y: {b.coordinates.y}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  // ----------------------------------------------------
  // RENDER ADMIN DASHBOARD
  // ----------------------------------------------------
  const renderAdmin = () => (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card padding="sm" className="flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950 text-amber-500 rounded-xl">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Pending Approvals</p>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">{pendingRequests.length}</h3>
          </div>
        </Card>
        <Card padding="sm" className="flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-500 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Approved Bookings</p>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">{approvedRequests.length}</h3>
          </div>
        </Card>
        <Card padding="sm" className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950 text-blue-500 rounded-xl">
            <School className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Vacant Classrooms</p>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">
              {CLASSROOMS.filter(c => c.status === 'available').length} / {CLASSROOMS.length}
            </h3>
          </div>
        </Card>
        <Card padding="sm" className="flex items-center gap-4">
          <div className="p-3 bg-rose-50 dark:bg-rose-950 text-rose-500 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Maintenance Flagged</p>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">
              {CLASSROOMS.filter(c => c.status === 'maintenance').length}
            </h3>
          </div>
        </Card>
      </div>

      {/* Grid of Pending Approvals and Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pending approvals panel */}
        <Card className="lg:col-span-2" header={
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-350">Pending Classroom Allocations</h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-semibold border border-amber-100 dark:border-amber-900/20">
              Needs Approval
            </span>
          </div>
        }>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500 font-medium">
              🎉 All requests processed! No pending approvals.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {pendingRequests.map((req) => (
                <div key={req.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-200 dark:hover:border-slate-750 transition-colors">
                  <div className="flex flex-col gap-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{req.subject}</span>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold px-2 py-0.5 rounded-md">
                        {req.strength} Pax
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Requested by <span className="font-semibold">{req.staffName}</span> on {req.date} at {req.time}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {req.facilities.map((fac: string) => (
                        <span key={fac} className="text-[10px] bg-blue-50 dark:bg-blue-900/20 text-blue-650 dark:text-blue-450 border border-blue-100 dark:border-blue-900/10 font-bold px-1.5 py-0.5 rounded">
                          {fac}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Actions buttons */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <Button variant="outline" size="sm" onClick={() => onRejectRequest(req.id)}>
                      Decline
                    </Button>
                    <Button variant="accent" size="sm" onClick={() => onApproveRequest(req.id)}>
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick action list */}
        <Card header={<h3 className="text-sm font-bold text-slate-705 dark:text-slate-350">Quick Actions</h3>}>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => onChangeTab('approvals')}
              className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl hover:border-primary/50 dark:hover:border-primary/50 transition-all text-left shadow-sm group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-500 rounded-lg group-hover:scale-105 transition-transform">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Go to Approvals</h4>
                  <p className="text-[10px] text-slate-550 dark:text-slate-450 mt-0.5">Approve, decline and manual override</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
            </button>

            <button
              onClick={() => onChangeTab('timetable')}
              className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all text-left shadow-sm group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-500 rounded-lg group-hover:scale-105 transition-transform">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Modify Timetable</h4>
                  <p className="text-[10px] text-slate-550 dark:text-slate-450 mt-0.5">Edit room allocations & slots</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
            </button>

            <button
              onClick={handleDownloadReport}
              className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all text-left shadow-sm group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 dark:bg-purple-950 text-purple-500 rounded-lg group-hover:scale-105 transition-transform">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Download Reports</h4>
                  <p className="text-[10px] text-slate-550 dark:text-slate-450 mt-0.5">Get weekly utilization reports PDF</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-500 transition-colors" />
            </button>
          </div>
        </Card>
      </div>

      {/* utilization statistics */}
      <Card header={<h3 className="text-sm font-bold text-slate-705 dark:text-slate-350">Utilization Metrics by Department</h3>}>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deptStats}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-700/50" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="classrooms" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={45} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );

  // ----------------------------------------------------
  // RENDER STAFF DASHBOARD
  // ----------------------------------------------------
  const renderStaff = () => (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="p-6 bg-gradient-to-r from-primary to-blue-600 rounded-3xl text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg shadow-blue-500/10">
        <div className="flex flex-col gap-1 text-left">
          <h3 className="text-xl font-extrabold flex items-center gap-2">
            Welcome back, {user.name}! <Sparkles className="w-5 h-5 text-yellow-300 animate-bounce" />
          </h3>
          <p className="text-xs text-blue-100">
            Easily request classrooms, review schedules, and coordinate lab sessions using our AI allocator.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={<Sparkles className="w-4 h-4 text-primary" />}
          className="bg-white hover:bg-slate-100 text-primary font-bold shadow-sm"
          onClick={() => onChangeTab('request')}
        >
          Book a Classroom Now
        </Button>
      </div>

      {/* Mini Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card padding="sm" className="flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950 text-amber-500 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">My Pending Requests</p>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">
              {staffRequests.filter(r => r.status === 'pending').length}
            </h3>
          </div>
        </Card>
        <Card padding="sm" className="flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-500 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">My Approved Bookings</p>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">
              {staffRequests.filter(r => r.status === 'approved').length}
            </h3>
          </div>
        </Card>
        <Card padding="sm" className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950 text-blue-500 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Lectures Scheduled Today</p>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">3</h3>
          </div>
        </Card>
      </div>

      {/* Main Grid: My requests and AI prompt helper */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Booking History List */}
        <Card className="lg:col-span-2" header={
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-705 dark:text-slate-350">My Recent Booking Requests</h3>
            <Button variant="ghost" size="sm" onClick={() => onChangeTab('history')} className="text-xs font-semibold">
              View History
            </Button>
          </div>
        }>
          {staffRequests.length === 0 ? (
            <div className="text-center py-10 text-slate-400 font-medium">
              No classrooms booked yet. Start by booking one!
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {staffRequests.map((req) => (
                <div key={req.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-between hover:border-slate-200 dark:hover:border-slate-750 transition-colors">
                  <div className="text-left flex flex-col gap-0.5">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{req.subject}</h4>
                    <p className="text-xs text-slate-500">
                      Date: <span className="font-medium text-slate-700 dark:text-slate-300">{req.date}</span> | Time: <span className="font-medium text-slate-705 dark:text-slate-300">{req.time}</span>
                    </p>
                    {req.allocatedClassroomName && (
                      <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> Allocated: {req.allocatedClassroomName}
                      </p>
                    )}
                  </div>
                  
                  {/* Status chip */}
                  <div>
                    {req.status === 'approved' && (
                      <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-extrabold px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/10">
                        Approved
                      </span>
                    )}
                    {req.status === 'pending' && (
                      <span className="text-[10px] bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 font-extrabold px-3 py-1 rounded-full border border-amber-100 dark:border-amber-900/10">
                        Pending
                      </span>
                    )}
                    {req.status === 'rejected' && (
                      <span className="text-[10px] bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 font-extrabold px-3 py-1 rounded-full border border-rose-100 dark:border-rose-900/10">
                        Declined
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* AI chat widget quick link */}
        <Card className="flex flex-col justify-between" header={<h3 className="text-sm font-bold text-slate-705 dark:text-slate-350">AI Room Suggestion Assistant</h3>}>
          <div className="flex flex-col gap-4 text-center items-center py-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary animate-bounce">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Need instant allocations?</h4>
              <p className="text-xs text-slate-500 mt-1 px-4 leading-normal">
                Ask our smart assistant to query schedules and book a free slot in seconds with 95%+ confidence metric.
              </p>
            </div>
          </div>
          <Button variant="primary" className="w-full flex items-center gap-2 mt-2" onClick={() => onChangeTab('ai')}>
            <Sparkles className="w-4 h-4" /> Ask AI Assistant
          </Button>
        </Card>
      </div>
    </div>
  );

  // ----------------------------------------------------
  // RENDER STUDENT DASHBOARD
  // ----------------------------------------------------
  const renderStudent = () => {
    // Current class highlight helper
    const activeClass = TIMETABLE_DATA[0]; // DSA with Rajesh Kumar
    
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        {/* Active Class Hero card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-l-4 border-l-primary bg-gradient-to-br from-white to-blue-50/20 dark:from-slate-800 dark:to-slate-900/40 relative overflow-hidden" header={
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              <h3 className="text-xs font-extrabold text-emerald-500 uppercase tracking-widest">Active Lecture Right Now</h3>
            </div>
          }>
            <div className="text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
              <div className="flex flex-col gap-1.5">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {activeClass.subject}
                </span>
                <p className="text-sm text-slate-650 dark:text-slate-350">
                  Lecturer: <span className="font-semibold text-slate-800 dark:text-slate-200">{activeClass.teacher}</span> | Batch: <span className="font-medium">{activeClass.batch}</span>
                </p>
                <div className="flex items-center gap-3.5 text-xs text-slate-500 dark:text-slate-400 mt-2">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-4 h-4 text-primary" /> {activeClass.timeSlot}
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" /> {activeClass.classroomName}
                  </span>
                </div>
              </div>
              
              <Button
                variant="accent"
                size="sm"
                icon={<MapIcon className="w-4 h-4" />}
                onClick={() => {
                  onChangeTab('navigation');
                  showToast('Locating RAM-101 on map... Path highlighted!', 'success');
                }}
              >
                Navigate to Class
              </Button>
            </div>
          </Card>

          {/* Shortcuts card */}
          <Card header={<h3 className="text-sm font-bold text-slate-705 dark:text-slate-350">Campus Tools</h3>}>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => onChangeTab('navigation')}
                className="w-full py-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-150 dark:border-slate-800 text-xs font-semibold rounded-xl text-slate-750 dark:text-slate-300 flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <MapIcon className="w-4 h-4 text-primary" /> Navigate Campus Map
              </button>
              <button
                onClick={() => onChangeTab('timetable')}
                className="w-full py-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-150 dark:border-slate-800 text-xs font-semibold rounded-xl text-slate-750 dark:text-slate-300 flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Calendar className="w-4 h-4 text-emerald-500" /> Open Lecture Timetable
              </button>
              <button
                onClick={() => onChangeTab('ai')}
                className="w-full py-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-150 dark:border-slate-800 text-xs font-semibold rounded-xl text-slate-750 dark:text-slate-300 flex items-center justify-center gap-2 transition-all shadow-sm animate-pulse"
              >
                <Sparkles className="w-4 h-4 text-yellow-500" /> Consult AI Assistant
              </button>
            </div>
          </Card>
        </div>

        {/* Timetable schedule for today */}
        <Card header={<h3 className="text-sm font-bold text-slate-705 dark:text-slate-350">Today's Class Schedule</h3>}>
          <div className="flex flex-col gap-4 relative pl-4 border-l-2 border-slate-100 dark:border-slate-800">
            {TIMETABLE_DATA.slice(0, 3).map((slot, index) => (
              <div key={slot.id} className="relative text-left flex flex-col md:flex-row md:items-center justify-between gap-2 p-4 bg-slate-50/50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-800/80 rounded-xl hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                {/* Timeline node */}
                <div className={`absolute -left-[23px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 bg-primary`} />
                
                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-0.5">{slot.timeSlot}</span>
                  <span className="font-extrabold text-slate-850 dark:text-white text-sm">{slot.subject}</span>
                  <span className="text-xs text-slate-500 block">Lecturer: {slot.teacher}</span>
                </div>
                
                <div className="flex items-center gap-2 self-start md:self-center">
                  <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-primary border border-blue-100 dark:border-blue-900/20 px-2.5 py-0.5 rounded-lg font-bold">
                    {slot.classroomName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Workspace Dashboard
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as <span className="font-semibold text-slate-700 dark:text-slate-350">{user.name}</span> ({user.role.replace('_', ' ').toUpperCase()})
          </p>
        </div>
        <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
          Academic Term: Fall 2026
        </span>
      </div>

      {user.role === 'super_admin' && renderSuperAdmin()}
      {user.role === 'admin' && renderAdmin()}
      {user.role === 'staff' && renderStaff()}
      {user.role === 'student' && renderStudent()}
    </div>
  );
};
