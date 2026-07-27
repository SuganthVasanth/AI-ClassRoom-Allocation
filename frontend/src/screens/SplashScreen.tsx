import React, { useEffect, useState } from 'react';
import { ShieldCheck, Compass, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 600); // Small delay after hitting 100%
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white selection:bg-primary/30">
      {/* Background visual accents */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full filter blur-3xl animate-pulse-slow pointer-events-none" />

      {/* Main Brand Box */}
      <div className="relative flex flex-col items-center gap-6 animate-scale-in max-w-sm text-center px-6">
        
        {/* Animated Icon Cluster */}
        <div className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-tr from-primary to-blue-500 rounded-3xl shadow-xl shadow-blue-500/20 ring-1 ring-white/10 animate-pulse">
          <Compass className="w-12 h-12 text-white animate-spin" style={{ animationDuration: '20s' }} />
          <ShieldCheck className="absolute -top-1 -right-1 w-6 h-6 text-emerald-400 bg-slate-950 rounded-full p-0.5 border border-white/10" />
          <Sparkles className="absolute -bottom-1 -left-1 w-6 h-6 text-yellow-400 bg-slate-950 rounded-full p-1 border border-white/10 animate-bounce" />
        </div>

        {/* Brand Text */}
        <div className="flex flex-col gap-1.5 mt-2">
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
            BIT SmartCampus
          </h1>
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
            AI-Powered Infrastructure Suite
          </p>
        </div>

        {/* Loading Indicator */}
        <div className="w-64 mt-6 flex flex-col gap-2.5">
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 tracking-wider">
            <span>INITIALIZING ENGINE</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>

      {/* Skip button for quicker testing */}
      <button 
        onClick={onFinish}
        className="absolute bottom-10 text-xs font-semibold text-slate-500 hover:text-slate-350 transition-colors uppercase tracking-widest px-4 py-2 border border-slate-800 rounded-xl hover:border-slate-700 bg-slate-900/30"
      >
        Skip Loading
      </button>
    </div>
  );
};
