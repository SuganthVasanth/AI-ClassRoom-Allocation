import React, { useState } from 'react';
import { api } from '../services/api';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useToast } from '../components/Toast';
import { Search, Calendar, Clock, MapPin, Grid, ShieldCheck, HelpCircle } from 'lucide-react';

export const AvailabilityScreen: React.FC = () => {
  const { showToast } = useToast();
  const [date, setDate] = useState('2026-07-20');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !startTime || !endTime) {
      showToast('Please specify date, start time, and end time.', 'warning');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const res = await api.checkRoomAvailability(date, startTime, endTime);
      setRooms(res.rooms || []);
      showToast(`Found ${res.available_rooms_count} available rooms.`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Error checking room availability', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left animate-fade-in">
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Grid className="w-6 h-6 text-primary" /> Room Availability Search
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Query the scheduling engine to check live classroom availability and recurring timetable slot occupancy.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Search controls */}
        <Card className="lg:col-span-1 shadow-sm bg-white dark:bg-slate-900" header={
          <h3 className="text-sm font-bold text-slate-705 dark:text-slate-350 flex items-center gap-2">
            <Search className="w-4 h-4 text-primary" /> Query Filter
          </h3>
        }>
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <Input
              id="date"
              type="date"
              label="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              leftIcon={<Calendar className="w-4 h-4" />}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="start_time"
                type="time"
                label="Start Time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                leftIcon={<Clock className="w-4 h-4" />}
                required
              />
              <Input
                id="end_time"
                type="time"
                label="End Time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                leftIcon={<Clock className="w-4 h-4" />}
                required
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="py-2.5 mt-2"
              icon={<Search className="w-4.5 h-4.5" />}
            >
              Check Availability
            </Button>
          </form>
        </Card>

        {/* Availability results */}
        <Card className="lg:col-span-2 shadow-sm min-h-[300px]" header={
          <div className="flex justify-between items-center w-full">
            <h3 className="text-sm font-bold text-slate-705 dark:text-slate-350">
              Vacant Classrooms
            </h3>
            {searched && (
              <span className="text-[10px] bg-primary/10 text-primary font-bold px-2.5 py-0.5 rounded-full border border-primary/20">
                {rooms.length} Rooms Vacant
              </span>
            )}
          </div>
        }>
          {!searched ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500 gap-3">
              <Clock className="w-10 h-10 stroke-1 text-slate-350 dark:text-slate-700" />
              <p className="text-xs font-semibold">Enter a time slot and query to check room availability.</p>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-slate-500">Querying database engine...</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-rose-500/80 gap-3">
              <HelpCircle className="w-10 h-10 stroke-1" />
              <p className="text-xs font-bold">No classrooms available for the selected slot.</p>
              <p className="text-[10px] text-slate-500">Try searching for an alternative date or hour block.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rooms.map((room) => (
                <div
                  key={room.venue_name}
                  className="p-4 bg-slate-50 dark:bg-slate-905 border border-slate-200 dark:border-slate-800 rounded-xl flex justify-between items-start hover:border-primary/30 hover:scale-[1.01] transition-all"
                >
                  <div className="flex flex-col gap-1.5 text-left">
                    <span className="font-extrabold text-sm text-slate-850 dark:text-white flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-primary" /> {room.venue_name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {room.block} • Floor {room.floor}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="text-[9px] bg-slate-200 dark:bg-slate-800 text-slate-650 dark:text-slate-400 font-bold px-1.5 py-0.5 rounded">
                        Cap: {room.capacity}
                      </span>
                      {room.projector === 1 && (
                        <span className="text-[9px] bg-blue-50 dark:bg-blue-950/20 text-primary font-bold px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-900/10">
                          Projector
                        </span>
                      )}
                      {room.ac === 1 && (
                        <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/10">
                          AC
                        </span>
                      )}
                      {room.num_pcs > 0 && (
                        <span className="text-[9px] bg-purple-50 dark:bg-purple-950/20 text-purple-650 dark:text-purple-400 font-bold px-1.5 py-0.5 rounded border border-purple-100 dark:border-purple-900/10">
                          PCs: {room.num_pcs}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
