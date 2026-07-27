import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Dropdown } from '../components/Dropdown';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { BarChart2, Download, Filter, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { useToast } from '../components/Toast';
import { useTheme } from '../contexts/ThemeContext';

export const ReportsScreen: React.FC = () => {
  const { showToast } = useToast();
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState('weekly');

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

  const handleExport = (format: 'pdf' | 'csv') => {
    showToast(`Generating report in ${format.toUpperCase()} format...`, 'info');
    setTimeout(() => {
      showToast(`Exported successfully to BIT_SmartCampus_Report.${format}`, 'success');
    }, 1500);
  };

  // Mock data for reports
  const weeklyAllocation = [
    { day: 'Mon', lectureHalls: 14, labs: 8, seminars: 3 },
    { day: 'Tue', lectureHalls: 12, labs: 9, seminars: 4 },
    { day: 'Wed', lectureHalls: 15, labs: 10, seminars: 2 },
    { day: 'Thu', lectureHalls: 11, labs: 7, seminars: 5 },
    { day: 'Fri', lectureHalls: 13, labs: 8, seminars: 3 },
    { day: 'Sat', lectureHalls: 6, labs: 4, seminars: 1 }
  ];

  const occupancyTrends = [
    { week: 'Week 1', utilization: 68 },
    { week: 'Week 2', utilization: 74 },
    { week: 'Week 3', utilization: 82 },
    { week: 'Week 4', utilization: 78 },
    { week: 'Week 5', utilization: 89 },
    { week: 'Week 6', utilization: 92 }
  ];

  return (
    <div className="flex flex-col gap-6 text-left animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-primary" /> Reports & Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Export utilization grids, track weekly capacity metrics, and monitor scheduling efficiency.
          </p>
        </div>

        {/* Exports actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />} onClick={() => handleExport('csv')}>
            Export CSV
          </Button>
          <Button variant="primary" size="sm" icon={<Download className="w-4 h-4" />} onClick={() => handleExport('pdf')}>
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-4 items-center bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Filter className="w-4 h-4 text-primary" />
          <span>Filters:</span>
        </div>
        <div className="w-44">
          <Dropdown
            id="timeRange"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            options={[
              { value: 'daily', label: 'Today' },
              { value: 'weekly', label: 'This Week' },
              { value: 'monthly', label: 'This Month' },
              { value: 'semester', label: 'Current Semester' }
            ]}
          />
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card padding="sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500 font-medium">Average Room Utilization</p>
              <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">84.2%</h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/10 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +3.4%
            </span>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500 font-medium">Peak Hour Occupancy</p>
              <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">94.8%</h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-205 dark:border-slate-700">
              Mon 11 AM
            </span>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500 font-medium">Conflicts Resolved by AI</p>
              <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">32 Cases</h3>
            </div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/20 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900/10">
              100% Efficiency
            </span>
          </div>
        </Card>
      </div>

      {/* utilization chart grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly allocation detail */}
        <Card header={<h3 className="text-sm font-bold text-slate-705 dark:text-slate-350">Allocations by Classroom Category</h3>}>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyAllocation}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-700/50" />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Legend iconType="circle" />
                <Bar dataKey="lectureHalls" name="Lecture Halls" fill="#2563EB" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="labs" name="Computer Labs" fill="#10B981" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="seminars" name="Seminar Halls" fill="#F59E0B" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Occupancy trends line graph */}
        <Card header={<h3 className="text-sm font-bold text-slate-705 dark:text-slate-350">Occupancy Efficiency Trend (Weekly)</h3>}>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={occupancyTrends}>
                <defs>
                  <linearGradient id="colorUtil" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-700/50" />
                <XAxis dataKey="week" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Area type="monotone" dataKey="utilization" name="Utilization Rate (%)" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorUtil)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>

      {/* Advisory card */}
      <Card padding="sm" className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="text-left text-xs">
          <h4 className="font-bold text-slate-800 dark:text-slate-200">AI Utilization Suggestion Alert</h4>
          <p className="text-slate-500 mt-0.5 leading-normal">
            Schedules indicate CV Raman Block classrooms are underutilized by 35% on Wednesday afternoons. 
            Automated optimization could swap 3 lecture sessions from Ramanujan Block to CV Raman Block to balance student density.
          </p>
        </div>
      </Card>
    </div>
  );
};
