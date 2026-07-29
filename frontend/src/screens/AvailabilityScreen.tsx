import React, { useState } from 'react';
import { api } from '../services/api';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { VenueDetailModal } from '../components/VenueDetailModal';
import { useToast } from '../components/Toast';
import { Search, Calendar, Clock, MapPin, Grid, HelpCircle, X } from 'lucide-react';
import type { Classroom } from '../types';

export const AvailabilityScreen: React.FC = () => {
  const { showToast } = useToast();
  const [date, setDate] = useState('2026-07-20');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const [filterQuery, setFilterQuery] = useState('');
  const [selectedVenueModal, setSelectedVenueModal] = useState<Classroom | null>(null);

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

  const filteredRooms = rooms.filter((r) => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return (
      r.venue_name.toLowerCase().includes(q) ||
      (r.block && r.block.toLowerCase().includes(q)) ||
      (r.venue_type && r.venue_type.toLowerCase().includes(q))
    );
  });

  const handleOpenDetail = (room: any) => {
    const eqs: string[] = [];
    if (room.projector === 1) eqs.push('Projector');
    if (room.ac === 1) eqs.push('AC');
    if (room.wifi === 1) eqs.push('Wi-Fi');
    if (room.smart_board === 1) eqs.push('Smart Board');
    if (room.num_pcs > 0) eqs.push(`Computers (${room.num_pcs})`);
    if (eqs.length === 0) eqs.push('Projector', 'Wi-Fi');

    const modalObj: Classroom = {
      id: `room-${room.venue_name.toLowerCase()}`,
      name: `${room.venue_name} (${room.venue_type || 'Lecture Hall'})`,
      buildingId: 'bld-1',
      buildingName: room.block || 'Campus Block',
      floor: typeof room.floor === 'number' ? room.floor : 1,
      capacity: room.capacity || 40,
      category: (room.venue_type as any) || 'Lecture Hall',
      equipment: eqs,
      imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-${room.venue_name}`,
      status: 'available'
    };

    setSelectedVenueModal(modalObj);
  };

  return (
    <div className="flex flex-col gap-6 text-left animate-fade-in">
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Grid className="w-6 h-6 text-primary" /> Live Room Availability & Specs
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Query the scheduling engine to check live classroom availability, filter instantly, and view detailed specs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Search controls */}
        <Card className="lg:col-span-1 shadow-sm bg-white dark:bg-slate-900" header={
          <h3 className="text-sm font-bold text-slate-705 dark:text-slate-350 flex items-center gap-2">
            <Search className="w-4 h-4 text-primary" /> Query Time Filter
          </h3>
        }>
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <Input
              id="date"
              type="date"
              label="Select Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                id="startTime"
                type="time"
                label="Start Time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                leftIcon={<Clock className="w-4 h-4 text-slate-400" />}
                required
              />
              <Input
                id="endTime"
                type="time"
                label="End Time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                leftIcon={<Clock className="w-4 h-4 text-slate-400" />}
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Vacant Classrooms
            </h3>
            {searched && (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    placeholder="Filter results..."
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                  {filterQuery && (
                    <button onClick={() => setFilterQuery('')} className="absolute right-2 top-1.5 text-slate-400">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <span className="text-[10px] bg-primary/10 text-primary font-bold px-2.5 py-1 rounded-full border border-primary/20 whitespace-nowrap">
                  {filteredRooms.length} Vacant
                </span>
              </div>
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
          ) : filteredRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-rose-500/80 gap-3">
              <HelpCircle className="w-10 h-10 stroke-1" />
              <p className="text-xs font-bold">No classrooms found matching query.</p>
              <p className="text-[10px] text-slate-500">Try adjusting your query filter or date block.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredRooms.map((room) => (
                <div
                  key={room.venue_name}
                  onClick={() => handleOpenDetail(room)}
                  className="p-4 bg-slate-50 dark:bg-slate-905 border border-slate-200 dark:border-slate-800 rounded-2xl flex justify-between items-start hover:border-primary/50 hover:shadow-md cursor-pointer transition-all group"
                >
                  <div className="flex flex-col gap-1.5 text-left">
                    <span className="font-extrabold text-sm text-slate-850 dark:text-white group-hover:text-primary transition-colors flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-primary" /> {room.venue_name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {room.block} • Floor {room.floor}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="text-[9px] bg-slate-200 dark:bg-slate-800 text-slate-650 dark:text-slate-300 font-bold px-2 py-0.5 rounded-md">
                        Cap: {room.capacity}
                      </span>
                      {room.projector === 1 && (
                        <span className="text-[9px] bg-indigo-50 dark:bg-indigo-950/40 text-primary font-bold px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-900/30">
                          Projector
                        </span>
                      )}
                      {room.ac === 1 && (
                        <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-900/30">
                          AC
                        </span>
                      )}
                      {room.num_pcs > 0 && (
                        <span className="text-[9px] bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 font-bold px-2 py-0.5 rounded-md border border-purple-100 dark:border-purple-900/30">
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

      <VenueDetailModal
        venue={selectedVenueModal}
        isOpen={!!selectedVenueModal}
        onClose={() => setSelectedVenueModal(null)}
        onRequestBooking={(venueName) => {
          showToast(`Initiating allocation request for ${venueName}...`, 'info');
        }}
      />
    </div>
  );
};
