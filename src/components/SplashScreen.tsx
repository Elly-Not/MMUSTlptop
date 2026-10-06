import React, { useEffect } from 'react';
import { MMUSTLogo } from './MMUSTLogo';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="w-full max-w-[390px] bg-slate-900 rounded-[48px] p-3 shadow-2xl ring-1 ring-slate-800 select-none">
      <div 
        onClick={onComplete}
        className="bg-gradient-to-b from-[#0060df] via-[#0b4f9c] to-[#062954] rounded-[40px] overflow-hidden min-h-[760px] flex flex-col items-center justify-between p-8 text-white relative cursor-pointer"
      >
        {/* Top Status */}
        <div className="w-full flex justify-between items-center text-[12px] font-semibold text-white/90">
          <span>09:41</span>
          <div className="w-24 h-4 bg-black rounded-full mx-auto" />
          <span>5G</span>
        </div>

        {/* Center University Crest & App Identity */}
        <div className="flex flex-col items-center text-center -mt-10">
          <div className="w-32 h-32 rounded-full bg-white p-2.5 shadow-2xl ring-4 ring-white/30 flex items-center justify-center animate-bounce">
            <MMUSTLogo size={100} />
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white mt-6 leading-tight">
            MMUST
          </h1>
          <p className="text-blue-100 text-sm font-bold tracking-wide mt-0.5">
            Digital Clearance System
          </p>
          <span className="text-[11px] text-blue-200/90 font-medium italic mt-1">
            Technology for Development
          </span>

          <div className="mt-8 flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold text-blue-100 border border-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Starting Gate Security Gateway...</span>
          </div>
        </div>

        {/* Bottom Loading Indicator */}
        <div className="w-full text-center space-y-3 pb-4">
          <div className="w-36 h-1.5 bg-white/20 rounded-full mx-auto overflow-hidden">
            <div className="w-full h-full bg-white rounded-full animate-pulse" />
          </div>
          <p className="text-[10px] text-blue-200/80">
            Masinde Muliro University • Kakamega, Kenya
          </p>
        </div>
      </div>
    </div>
  );
};
