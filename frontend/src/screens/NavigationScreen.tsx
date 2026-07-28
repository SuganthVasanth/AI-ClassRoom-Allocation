import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Compass, ZoomIn, ZoomOut, RotateCcw, MapPin, Search } from 'lucide-react';
import { useToast } from '../components/Toast';
import { api } from '../services/api';

const BLOCK_CONFIGS: Record<string, { code: string; x: number; y: number; description: string; floors: number }> = {
  'Western Wing - IB Block': { code: 'IB', x: 22, y: 35, description: 'Information Block - CS & IT labs', floors: 4 },
  'Eastern Wing - AS Block': { code: 'AS', x: 55, y: 25, description: 'Applied Sciences - ECE & Physics labs', floors: 3 },
  'Sunflower Block': { code: 'SF', x: 80, y: 45, description: 'Sunflower Lecture Wing', floors: 4 },
  'Mechanical Science Block': { code: 'MS', x: 35, y: 75, description: 'Mechanical Engineering Labs & Drawing Halls', floors: 3 },
  'Learning Centre': { code: 'LC', x: 62, y: 68, description: 'Central Learning Centre & Conference Rooms', floors: 4 },
  'Research park': { code: 'RP', x: 22, y: 15, description: 'Research Park & Mathematics Wing', floors: 4 },
  '-': { code: 'AUD', x: 62, y: 88, description: 'Bannari Amman Auditorium', floors: 1 }
};

const formatBlockName = (block: string) => {
  if (block === 'Sunflower Block') return 'SF Block';
  if (block === 'Western Wing - IB Block') return 'IB Block';
  if (block === 'Eastern Wing - AS Block') return 'AS Block';
  if (block === 'Mechanical Science Block') return 'ME Block';
  return block;
};

const formatFloorName = (floorVal: any) => {
  const fStr = String(floorVal).toLowerCase();
  if (fStr.includes('ground') || fStr === '0') return 'Ground Floor';
  if (fStr.includes('first') || fStr === '1') return '1st Floor';
  if (fStr.includes('second') || fStr === '2') return '2nd Floor';
  if (fStr.includes('third') || fStr === '3') return '3rd Floor';
  if (fStr.includes('fourth') || fStr === '4') return '4th Floor';
  if (fStr.includes('under ground') || fStr.includes('basement')) return 'Ground Floor';
  return fStr;
};

const parseFloorString = (floorVal: any): number => {
  const f = String(floorVal).toLowerCase();
  if (f.includes('ground') || f === '0') return 0;
  if (f.includes('first') || f === '1') return 1;
  if (f.includes('second') || f === '2') return 2;
  if (f.includes('third') || f === '3') return 3;
  if (f.includes('fourth') || f === '4') return 4;
  if (f.includes('under ground') || f.includes('basement')) return 0;
  return 0;
};

export const NavigationScreen: React.FC = () => {
  const { showToast } = useToast();

  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [selectedVenue, setSelectedVenue] = useState<any | null>(null);

  // Search input & results states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Load all rooms from backend on mount (no availability filter — Venue Finder needs all rooms)
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const res = await api.getAllVenues();
        setRooms(res.rooms || []);
      } catch (err) {
        console.error("Failed to load venues:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }
    const q = val.toLowerCase();
    const matches = rooms.filter((r) => {
      const nameMatch = r.venue_name.toLowerCase().includes(q);
      const blockMatch = r.block.toLowerCase().includes(q);
      const typeMatch = r.venue_type.toLowerCase().includes(q);
      
      const cseSearch = q.includes('cse') || q.includes('cs') || q.includes('computer');
      const labSearch = q.includes('lab') || q.includes('leb') || q.includes('science');
      
      let isCseLabMatch = false;
      if (cseSearch && labSearch) {
        const hasThree = q.includes('3') || q.includes('three');
        if (hasThree) {
          isCseLabMatch = r.venue_name === 'SF 103';
        } else {
          isCseLabMatch = (r.block.toLowerCase().includes('ib') || r.block.toLowerCase().includes('sunflower')) &&
                          (r.venue_name.toLowerCase().includes('lab') || r.venue_type.toLowerCase().includes('lab'));
        }
      }

      return nameMatch || blockMatch || typeMatch || isCseLabMatch;
    });
    setSearchResults(matches.slice(0, 5));
    setShowSearchDropdown(true);
  };

  const handleSelectSearchResult = (r: any) => {
    setSelectedVenue(r);
    setSearchQuery(r.venue_name);
    setShowSearchDropdown(false);
    showToast(`Located ${r.venue_name} in ${formatBlockName(r.block)}!`, 'success');
  };

  // Compute unique buildings list dynamically from configuration & rooms
  const buildingsMap = React.useMemo(() => {
    return Object.keys(BLOCK_CONFIGS).map((name) => {
      const config = BLOCK_CONFIGS[name];
      const totalClassrooms = rooms.filter(r => r.block === name).length;
      return {
        id: name,
        name: name === '-' ? 'Bannari Amman Auditorium' : name,
        code: config.code,
        description: config.description,
        floors: config.floors,
        totalClassrooms: totalClassrooms || 5,
        coordinates: { x: config.x, y: config.y }
      };
    });
  }, [rooms]);

  const handleRecenter = () => {
    setZoom(1);
    showToast('Map re-centered.', 'info');
  };

  const handleBuildingClick = (id: string) => {
    const roomInBuilding = rooms.find(r => r.block === id);
    if (roomInBuilding) {
      setSelectedVenue(roomInBuilding);
      setSearchQuery(roomInBuilding.venue_name);
      showToast(`Located ${id} classrooms.`, 'info');
    } else {
      const configName = Object.keys(BLOCK_CONFIGS).find(name => name === id);
      if (configName) {
        setSelectedVenue({
          venue_name: id === '-' ? 'Auditorium' : id,
          block: id,
          floor: 'Ground',
          venue_type: id === '-' ? 'Auditorium' : 'Building Block',
          capacity: '-'
        });
        setSearchQuery(id === '-' ? 'BIT Auditorium' : id);
        showToast(`Located ${id}.`, 'info');
      } else {
        showToast(`No information for ${id}.`, 'warning');
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-primary animate-spin" style={{ animationDuration: '30s' }} /> Campus Venue Finder
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Locate lecture halls, laboratories, and seminar centers across the campus grid map.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Navigation Sidebar Panel */}
        <div className="flex flex-col gap-4 col-span-1">
          <Card header={<h3 className="text-sm font-bold text-slate-700 dark:text-slate-350 flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Venue Finder</h3>}>
            <div className="flex flex-col gap-4 relative">
              
              {/* Classroom / Venue Search Bar */}
              <div className="relative flex flex-col gap-1 text-left">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Search Venue/Classroom</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => { if (searchQuery.trim()) setShowSearchDropdown(true); }}
                    onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                    placeholder="e.g. SF B01, ME101, Smart Class..."
                    className="w-full text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-800 dark:text-slate-200 cursor-text outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                </div>

                {/* Dropdown Results Overlay */}
                {showSearchDropdown && searchResults.length > 0 && (
                  <div className="absolute top-[58px] left-0 right-0 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg flex flex-col max-h-48 overflow-y-auto overflow-x-hidden p-1.5 gap-1 animate-fade-in">
                    {searchResults.map((r, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectSearchResult(r)}
                        className="w-full text-left p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex flex-col text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                      >
                        <span className="text-xs font-extrabold">{r.venue_name}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wide">
                          {formatBlockName(r.block)} — {formatFloorName(r.floor)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                {showSearchDropdown && searchResults.length === 0 && searchQuery.trim() !== '' && (
                  <div className="absolute top-[58px] left-0 right-0 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-3 text-center text-xs text-slate-400 italic">
                    No matching venues found.
                  </div>
                )}
              </div>

              {/* Located Venue Info Card */}
              {selectedVenue ? (
                <div className="mt-2 p-4 bg-blue-50/40 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/30 rounded-xl flex flex-col gap-3 text-left animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      Located Venue
                    </span>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {selectedVenue.venue_type}
                    </span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {selectedVenue.venue_name}
                    </span>
                  </div>

                  <div className="h-px bg-blue-100 dark:bg-blue-900/40" />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Block</span>
                      <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                        {formatBlockName(selectedVenue.block)}
                      </span>
                      <span className="text-[9px] font-semibold text-slate-500 mt-0.5 truncate">
                        {selectedVenue.block}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Floor</span>
                      <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                        {formatFloorName(selectedVenue.floor)}
                      </span>
                    </div>
                  </div>

                  {selectedVenue.department_preference && selectedVenue.department_preference !== 'General' && (
                    <div className="flex flex-col pt-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Department</span>
                      <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                        {selectedVenue.department_preference}
                      </span>
                    </div>
                  )}

                  {selectedVenue.capacity && selectedVenue.capacity !== '-' && (
                    <div className="mt-1 pt-3 border-t border-blue-50 dark:border-blue-950/40 flex justify-between items-center text-[11px]">
                      <span className="font-semibold text-slate-500">Seating Capacity</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200">{selectedVenue.capacity} Students</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center gap-2">
                  <MapPin className="w-8 h-8 text-slate-300 dark:text-slate-700 animate-pulse" />
                  <span className="text-xs font-bold text-slate-400">Search for a venue or click a block on the map to locate</span>
                </div>
              )}

            </div>
          </Card>
        </div>

        {/* Map visualization block */}
        <Card className="lg:col-span-2 relative overflow-hidden bg-slate-100 dark:bg-slate-950 min-h-[480px] p-0 flex flex-col justify-between border border-slate-200 dark:border-slate-800">
          
          {/* Top Bar overlays */}
          <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center pointer-events-none">
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl flex items-center gap-2 pointer-events-auto">
              <Compass className="w-4.5 h-4.5 text-primary animate-pulse" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">BIT Campus Grid Map</span>
            </div>
          </div>

          {/* Floating map controls */}
          <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2 pointer-events-auto">
            <button onClick={() => setZoom(prev => Math.min(2, prev + 0.1))} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm text-slate-500 hover:text-slate-800 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850"><ZoomIn className="w-4.5 h-4.5" /></button>
            <button onClick={() => setZoom(prev => Math.max(0.6, prev - 0.1))} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm text-slate-500 hover:text-slate-800 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850"><ZoomOut className="w-4.5 h-4.5" /></button>
            <button onClick={handleRecenter} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm text-slate-500 hover:text-slate-800 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850"><RotateCcw className="w-4.5 h-4.5" /></button>
          </div>

          {/* SVG Map Canvas */}
          <div 
            className="flex-1 w-full h-full flex items-center justify-center transition-transform duration-300 ease-out select-none"
            style={{ transform: `scale(${zoom})` }}
          >
            <svg 
              viewBox="0 0 500 400" 
              className="w-full max-w-[480px] h-[380px] text-slate-400"
            >
              {/* Grid lines for map vibe */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-10 dark:opacity-20 text-slate-500" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Walkways / Sidewalks */}
              <path d="M 80 140 L 400 140 M 270 50 L 270 320 M 110 140 L 175 300" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round" className="dark:stroke-slate-800 opacity-60" />
              <path d="M 80 140 L 400 140 M 270 50 L 270 320 M 110 140 L 175 300" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" className="dark:stroke-slate-900 opacity-80" />

              {/* Draw Campus Buildings */}
              {buildingsMap.map((b) => {
                const isSelected = selectedVenue && b.id === selectedVenue.block;
                const bx = b.coordinates.x * 5;
                const by = b.coordinates.y * 4;

                return (
                  <g 
                    key={b.id} 
                    className="cursor-pointer group"
                    onClick={() => handleBuildingClick(b.id)}
                  >
                    {/* Glowing highlight for the selected located node */}
                    {isSelected && (
                      <circle 
                        cx={bx} 
                        cy={by} 
                        r="38" 
                        fill="#2563EB" 
                        className="opacity-15 animate-ping"
                      />
                    )}

                    {/* Building Base Card Shape */}
                    <rect
                      x={bx - 26}
                      y={by - 18}
                      width="52"
                      height="36"
                      rx="8"
                      className={`stroke-2 transition-all duration-300 shadow-sm
                        ${isSelected 
                          ? 'fill-blue-500 stroke-blue-600 dark:fill-blue-600 dark:stroke-blue-500' 
                          : 'fill-white dark:fill-slate-900 stroke-slate-300 dark:stroke-slate-800 hover:stroke-primary hover:fill-slate-50'
                        }
                      `}
                    />
                    
                    {/* Label inside building */}
                    <text
                      x={bx}
                      y={by + 3}
                      textAnchor="middle"
                      className={`text-[8.5px] font-extrabold select-none transition-colors
                        ${isSelected ? 'fill-white' : 'fill-slate-700 dark:fill-slate-350'}
                      `}
                    >
                      {b.code}
                    </text>

                    {/* Tooltip Hover tag */}
                    <text
                      x={bx}
                      y={by - 24}
                      textAnchor="middle"
                      className="text-[7.5px] font-extrabold fill-slate-500 dark:fill-slate-400 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900"
                    >
                      {b.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </Card>
      </div>
    </div>
  );
};
