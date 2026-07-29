import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import type { Classroom } from '../types';
import { 
  Building, MapPin, Users, Monitor, Wifi, Wind, Volume2, 
  CheckCircle2, AlertTriangle, ShieldCheck, QrCode, Calendar, 
  ExternalLink, Layers, Info, Wrench
} from 'lucide-react';

interface VenueDetailModalProps {
  venue: Classroom | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToMap?: (venueName: string) => void;
  onRequestBooking?: (venueName: string) => void;
  onToggleMaintenance?: (venueId: string) => void;
}

export const VenueDetailModal: React.FC<VenueDetailModalProps> = ({
  venue,
  isOpen,
  onClose,
  onNavigateToMap,
  onRequestBooking,
  onToggleMaintenance
}) => {
  if (!venue) return null;

  const statusColors = {
    available: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    occupied: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    reserved: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    maintenance: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
  };

  const getEquipmentIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('projector') || lower.includes('smart')) return <Monitor className="w-4 h-4 text-indigo-500" />;
    if (lower.includes('wi-fi') || lower.includes('wifi')) return <Wifi className="w-4 h-4 text-emerald-500" />;
    if (lower.includes('ac')) return <Wind className="w-4 h-4 text-sky-500" />;
    if (lower.includes('audio') || lower.includes('speaker')) return <Volume2 className="w-4 h-4 text-purple-500" />;
    return <CheckCircle2 className="w-4 h-4 text-slate-400" />;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Venue Details: ${venue.name.split(' (')[0]}`}
      size="lg"
      footer={
        <div className="flex flex-wrap items-center justify-between w-full gap-2">
          <div className="flex items-center gap-2">
            {onToggleMaintenance && (
              <Button
                variant="outline"
                size="sm"
                icon={<Wrench className="w-3.5 h-3.5 text-amber-500" />}
                onClick={() => {
                  onToggleMaintenance(venue.id);
                  onClose();
                }}
              >
                {venue.status === 'maintenance' ? 'Set Active' : 'Set Maintenance'}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onNavigateToMap && (
              <Button
                variant="secondary"
                size="sm"
                icon={<MapPin className="w-3.5 h-3.5 text-indigo-500" />}
                onClick={() => {
                  onNavigateToMap(venue.name.split(' (')[0]);
                  onClose();
                }}
              >
                Campus Map
              </Button>
            )}
            {onRequestBooking && (
              <Button
                variant="gradient"
                size="sm"
                icon={<Calendar className="w-3.5 h-3.5" />}
                onClick={() => {
                  onRequestBooking(venue.name.split(' (')[0]);
                  onClose();
                }}
              >
                Request Booking
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6 text-left">
        {/* Banner Header Card */}
        <div className="relative rounded-2xl overflow-hidden glass-card bg-slate-900/90 text-white p-5 sm:p-6 border border-slate-700/80 shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
            <div className="flex flex-col">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {venue.name.split(' (')[0]}
                </h2>
                <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border uppercase tracking-wider ${statusColors[venue.status]}`}>
                  {venue.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-semibold mt-1 flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-indigo-400" />
                <span>{venue.buildingName}</span>
                <span className="text-slate-500">•</span>
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Floor {venue.floor}</span>
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white/10 dark:bg-slate-800/80 p-2 rounded-xl backdrop-blur-md border border-white/10">
              <img
                src={venue.qrCodeUrl}
                alt="Venue QR"
                className="w-14 h-14 rounded-lg bg-white p-1"
              />
              <div className="flex flex-col text-[10px]">
                <span className="font-bold text-slate-200">BIT SmartQR</span>
                <span className="text-slate-400">Scan for direct booking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Venue Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex flex-col">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Capacity</span>
            <div className="flex items-center gap-2 mt-1">
              <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{venue.capacity} Seats</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 flex flex-col">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Category</span>
            <div className="flex items-center gap-2 mt-1">
              <Building className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{venue.category}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 flex flex-col">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Floor Level</span>
            <div className="flex items-center gap-2 mt-1">
              <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{venue.floor === 0 ? 'Ground Floor' : `Floor ${venue.floor}`}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 flex flex-col">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Equipment</span>
            <div className="flex items-center gap-2 mt-1">
              <Monitor className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{venue.equipment.length} Available</span>
            </div>
          </div>
        </div>

        {/* Equipment & Facilities Section */}
        <div className="flex flex-col gap-2.5">
          <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-indigo-500" />
            <span>Installed Equipment & Tech Facilities</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {venue.equipment.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-xs text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                {getEquipmentIcon(item)}
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Occupancy Schedules Section */}
        {venue.status === 'occupied' && venue.schedules && venue.schedules.length > 0 && (
          <div className="p-4 rounded-2xl bg-rose-50/20 dark:bg-rose-950/10 border border-rose-200/60 dark:border-rose-900/30 flex flex-col gap-2.5">
            <h4 className="text-xs font-bold uppercase text-rose-500 tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>Current Occupancy & Booking Schedules</span>
            </h4>
            <div className="flex flex-col gap-2">
              {venue.schedules.map((sch, idx) => (
                <div key={idx} className="text-xs text-rose-700 dark:text-rose-350 leading-relaxed flex items-start gap-1.5">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{sch.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location & Department Mapping */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/80 flex flex-col gap-2">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Campus Block & Department Allocation</span>
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Located in <strong className="text-slate-900 dark:text-slate-100">{venue.buildingName}</strong>. Managed by Bannari Amman Institute of Technology Central Scheduling System. Optimized for AI room recommendation algorithms.
          </p>
        </div>
      </div>
    </Modal>
  );
};
