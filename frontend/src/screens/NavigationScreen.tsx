import React, { useState, useEffect } from 'react';
import { BUILDINGS } from '../constants/mockData';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Dropdown } from '../components/Dropdown';
import { Map, Navigation, Compass, Search, Clock, ArrowRight, CornerUpRight, MoveUp, MapPin, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useToast } from '../components/Toast';

export const NavigationScreen: React.FC = () => {
  const { showToast } = useToast();

  const [startBuilding, setStartBuilding] = useState('bld-1'); // Ramanujan
  const [destBuilding, setDestBuilding] = useState('bld-2'); // CV Raman
  const [floor, setFloor] = useState<number>(0); // 0: Ground, 1: 1st, etc.
  const [eta, setEta] = useState(0);
  const [distance, setDistance] = useState(0);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);

  // Buildings list mapped with paths
  const buildingsMap = BUILDINGS;

  // Paths calculations
  useEffect(() => {
    if (startBuilding === destBuilding) {
      setEta(0);
      setDistance(0);
      setInstructions(['You have arrived at your destination!']);
      return;
    }

    const start = buildingsMap.find((b) => b.id === startBuilding);
    const dest = buildingsMap.find((b) => b.id === destBuilding);

    if (!start || !dest) return;

    // Direct Euclidean distance simulation
    const dx = dest.coordinates.x - start.coordinates.x;
    const dy = dest.coordinates.y - start.coordinates.y;
    const distMeters = Math.round(Math.sqrt(dx * dx + dy * dy) * 4); // Scaled multiplier

    setDistance(distMeters);
    setEta(Math.ceil(distMeters / 80)); // Walk speed proxy

    // Generating routing instructions dynamically
    const steps = [
      `Exit ${start.name} through the ${start.coordinates.y > 50 ? 'North' : 'South'} exit.`,
      `Head toward the central walkway near ${buildingsMap.find(b => b.code === 'LIB')?.name || 'Library'}.`,
      `Walk ${distMeters - 20}m along the paved campus courtyard.`,
      `Enter ${dest.name} Main Lobby.`,
    ];

    if (floor > 0) {
      steps.push(`Take the staircase or elevator to Floor ${floor} to find classroom.`);
    }

    setInstructions(steps);
  }, [startBuilding, destBuilding, floor]);

  const handleRecenter = () => {
    setZoom(1);
    showToast('Map re-centered.', 'info');
  };

  const handleBuildingClick = (id: string) => {
    if (startBuilding === id) {
      showToast('Select a different destination block.', 'warning');
      return;
    }
    setDestBuilding(id);
    showToast(`Set destination to ${buildingsMap.find(b => b.id === id)?.name}`, 'info');
  };

  // Helper variables for path plotting
  const startObj = buildingsMap.find((b) => b.id === startBuilding);
  const destObj = buildingsMap.find((b) => b.id === destBuilding);

  return (
    <div className="flex flex-col gap-6 text-left animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-primary animate-spin" style={{ animationDuration: '30s' }} /> Campus Navigation
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Plot walkways, locate buildings, and review estimated travel times with high-fidelity routing graphics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Navigation Sidebar Panel */}
        <div className="flex flex-col gap-4 col-span-1">
          <Card header={<h3 className="text-sm font-bold text-slate-705 dark:text-slate-350 flex items-center gap-2"><Navigation className="w-4 h-4 text-primary" /> Route Planner</h3>}>
            <div className="flex flex-col gap-4">
              
              <Dropdown
                id="start"
                label="Start Location"
                value={startBuilding}
                onChange={(e) => setStartBuilding(e.target.value)}
                options={buildingsMap.map((b) => ({ value: b.id, label: b.name }))}
              />

              <Dropdown
                id="destination"
                label="Destination Location"
                value={destBuilding}
                onChange={(e) => setDestBuilding(e.target.value)}
                options={buildingsMap.map((b) => ({ value: b.id, label: b.name }))}
              />

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-semibold text-slate-650 dark:text-slate-400">Indoor Level</label>
                <div className="grid grid-cols-5 gap-1 bg-slate-100 dark:bg-slate-905 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                  {[0, 1, 2, 3, 4].map((fl) => (
                    <button
                      key={fl}
                      onClick={() => setFloor(fl)}
                      className={`py-1 text-xs font-bold rounded-lg transition-all
                        ${floor === fl 
                          ? 'bg-white dark:bg-slate-800 text-primary shadow-sm border border-slate-205 dark:border-slate-700' 
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                        }
                      `}
                    >
                      {fl === 0 ? 'GF' : `${fl}F`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Summary */}
              {distance > 0 && (
                <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl flex items-center justify-between">
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Estimated Travel</span>
                    <span className="text-lg font-extrabold text-primary">{eta} Mins</span>
                  </div>
                  <div className="w-px h-8 bg-blue-100 dark:bg-blue-900/40" />
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Distance</span>
                    <span className="text-lg font-extrabold text-slate-800 dark:text-slate-200">{distance} Meters</span>
                  </div>
                </div>
              )}

            </div>
          </Card>

          {/* Step-by-Step Directions */}
          <Card className="flex-1" header={<h3 className="text-sm font-bold text-slate-705 dark:text-slate-350">Directions</h3>}>
            <div className="flex flex-col gap-4 relative pl-5 border-l border-slate-200 dark:border-slate-800">
              {instructions.map((inst, idx) => (
                <div key={idx} className="relative text-left flex gap-3.5 items-start">
                  <div className="absolute -left-[25px] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-white dark:ring-slate-900" />
                  <div className="mt-0.5 text-slate-400">
                    {idx === instructions.length - 1 ? <MapPin className="w-4 h-4 text-rose-500" /> : <MoveUp className="w-4 h-4" />}
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {inst}
                  </span>
                </div>
              ))}
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
            <button onClick={() => setZoom(prev => Math.min(2, prev + 0.1))} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850"><ZoomIn className="w-4.5 h-4.5" /></button>
            <button onClick={() => setZoom(prev => Math.max(0.6, prev - 0.1))} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850"><ZoomOut className="w-4.5 h-4.5" /></button>
            <button onClick={handleRecenter} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850"><RotateCcw className="w-4.5 h-4.5" /></button>
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

              {/* Animated Dotted Routing Line */}
              {startObj && destObj && (
                <path
                  d={`M ${startObj.coordinates.x * 5} ${startObj.coordinates.y * 4} L 270 140 L ${destObj.coordinates.x * 5} ${destObj.coordinates.y * 4}`}
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeDasharray="6, 6"
                  className="animate-[dash_2s_linear_infinite]"
                  style={{
                    strokeDashoffset: 12,
                  }}
                />
              )}

              {/* Draw Campus Buildings */}
              {buildingsMap.map((b) => {
                const isStart = b.id === startBuilding;
                const isDest = b.id === destBuilding;
                const bx = b.coordinates.x * 5;
                const by = b.coordinates.y * 4;

                return (
                  <g 
                    key={b.id} 
                    className="cursor-pointer group"
                    onClick={() => handleBuildingClick(b.id)}
                  >
                    {/* Glowing highlight for start/end nodes */}
                    {(isStart || isDest) && (
                      <circle 
                        cx={bx} 
                        cy={by} 
                        r="38" 
                        fill={isStart ? '#2563EB' : '#EF4444'} 
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
                        ${isStart 
                          ? 'fill-blue-500 stroke-blue-600 dark:fill-blue-600 dark:stroke-blue-500' 
                          : isDest 
                          ? 'fill-rose-500 stroke-rose-600 dark:fill-rose-600 dark:stroke-rose-500'
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
                        ${isStart || isDest ? 'fill-white' : 'fill-slate-700 dark:fill-slate-350'}
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
      
      {/* CSS injection for SVG drawing animation */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -24;
          }
        }
      `}</style>
    </div>
  );
};
