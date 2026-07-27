import React, { useState } from 'react';
import { TIMETABLE_DATA } from '../constants/mockData';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Calendar as CalendarIcon, Clock, Search, MapPin, Grid, Layers, User } from 'lucide-react';

export const TimetableScreen: React.FC = () => {
  const [view, setView] = useState<'today' | 'weekly' | 'monthly'>('weekly');
  const [searchQuery, setSearchQuery] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
  const timeSlots = [
    '09:00 AM - 10:00 AM',
    '10:15 AM - 11:15 AM',
    '11:30 AM - 12:30 PM',
    '02:00 PM - 03:00 PM',
    '03:15 PM - 04:15 PM'
  ];

  // Filter slots
  const filteredSlots = TIMETABLE_DATA.filter(
    (slot) =>
      slot.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slot.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slot.classroomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slot.batch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render weekly layout
  const renderWeekly = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-slate-100 dark:border-slate-800">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
            <th className="p-3 border border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500 uppercase text-center w-24">
              Day
            </th>
            {timeSlots.map((time) => (
              <th
                key={time}
                className="p-3 border border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500 uppercase text-center min-w-[200px]"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>{time}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
              <td className="p-3 border border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 text-center uppercase tracking-wide bg-slate-50/30 dark:bg-slate-900/10">
                {day.substring(0, 3)}
              </td>
              {timeSlots.map((time) => {
                const match = filteredSlots.find((s) => s.day === day && s.timeSlot.includes(time.split(' - ')[0]));
                return (
                  <td key={time} className="p-2 border border-slate-100 dark:border-slate-800 align-top">
                    {match ? (
                      <div className={`p-3 border rounded-xl flex flex-col gap-1 transition-all hover:scale-[1.01] hover:shadow-sm text-left ${match.color}`}>
                        <span className="font-extrabold text-xs">{match.subject}</span>
                        <div className="flex flex-col text-[10px] opacity-90 mt-1">
                          <span className="flex items-center gap-1 font-semibold">
                            <User className="w-3 h-3" /> {match.teacher}
                          </span>
                          <span className="flex items-center gap-1 mt-0.5">
                            <Layers className="w-3 h-3" /> {match.batch}
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-white/60 dark:bg-black/20 w-max px-1.5 py-0.5 rounded-md mt-1.5">
                          <MapPin className="w-2.5 h-2.5" /> {match.classroomName}
                        </span>
                      </div>
                    ) : (
                      <div className="h-16 flex items-center justify-center text-[10px] text-slate-350 dark:text-slate-600 font-medium">
                        Free Slot
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Render today timeline layout
  const renderToday = () => (
    <div className="flex flex-col gap-4 pl-4 border-l-2 border-slate-150 dark:border-slate-800 text-left">
      {filteredSlots.length === 0 ? (
        <p className="text-slate-400 font-medium py-4 text-center">No scheduled lectures matching current filter.</p>
      ) : (
        filteredSlots.map((slot) => (
          <div key={slot.id} className="relative p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            {/* Timeline node */}
            <div className="absolute -left-[25px] top-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-full border-4 border-white dark:border-slate-950 bg-primary shadow-sm" />
            
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-slate-400">{slot.day} • {slot.timeSlot}</span>
              <h4 className="text-sm font-extrabold text-slate-850 dark:text-slate-100">{slot.subject}</h4>
              <p className="text-xs text-slate-550 flex items-center gap-1 mt-1">
                <User className="w-3.5 h-3.5 text-primary" /> {slot.teacher} | {slot.batch}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/10 px-2.5 py-1 rounded-lg">
                {slot.classroomName}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );

  // Render monthly calendar simulation
  const renderMonthly = () => {
    const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
    
    return (
      <div className="grid grid-cols-7 gap-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <div key={d} className="text-center font-bold text-xs text-slate-450 uppercase py-2">
            {d}
          </div>
        ))}
        {/* Empty offsets to start on Monday */}
        {daysInMonth.map((day) => {
          // Mock highlight some days
          const isBooked = day % 3 === 0;
          const isToday = day === 16; // Simulated current date
          return (
            <div
              key={day}
              className={`min-h-[75px] p-2 border rounded-xl text-left flex flex-col justify-between transition-colors
                ${isToday
                  ? 'border-primary bg-blue-50/20 dark:bg-primary/5'
                  : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'
                }
              `}
            >
              <span className={`text-xs font-bold ${isToday ? 'text-primary' : 'text-slate-500'}`}>
                {day}
              </span>
              {isBooked && (
                <div className="text-[9px] font-bold bg-blue-50 dark:bg-blue-900/20 text-primary border border-blue-100 dark:border-blue-900/10 p-1 rounded truncate">
                  3 Lectures
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-left">
      {/* Timetable Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Classroom Timetable
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse schedule grids, verify vacant classrooms, and search allocations by teacher or subject.
          </p>
        </div>

        {/* View toggles */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-850 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setView('today')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all
              ${view === 'today' ? 'bg-white dark:bg-slate-900 text-slate-850 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}
            `}
          >
            Today's View
          </button>
          <button
            onClick={() => setView('weekly')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all
              ${view === 'weekly' ? 'bg-white dark:bg-slate-900 text-slate-850 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-850'}
            `}
          >
            Weekly Grid
          </button>
          <button
            onClick={() => setView('monthly')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all
              ${view === 'monthly' ? 'bg-white dark:bg-slate-900 text-slate-850 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-850'}
            `}
          >
            Monthly View
          </button>
        </div>
      </div>

      {/* Search Filter input */}
      <div className="max-w-md w-full">
        <Input
          placeholder="Filter timetable by Teacher, Subject, or Classroom..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4 text-slate-400" />}
        />
      </div>

      {/* Timetable Panel */}
      <Card padding="none" className="overflow-hidden bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="p-6">
          {view === 'weekly' && renderWeekly()}
          {view === 'today' && renderToday()}
          {view === 'monthly' && renderMonthly()}
        </div>
      </Card>
    </div>
  );
};
