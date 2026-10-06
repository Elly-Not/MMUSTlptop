import React from 'react';
import { MMUSTLogo } from './MMUSTLogo';
import { 
  Phone, 
  MessageSquare, 
  Camera, 
  Chrome, 
  Settings, 
  Clock, 
  Calendar, 
  Battery, 
  Wifi, 
  Signal,
  Sparkles
} from 'lucide-react';

interface PhoneHomeScreenProps {
  onLaunchApp: () => void;
}

export const PhoneHomeScreen: React.FC<PhoneHomeScreenProps> = ({ onLaunchApp }) => {
  return (
    <div className="w-full max-w-[390px] bg-slate-950 rounded-[48px] p-3 shadow-2xl ring-1 ring-slate-800 relative select-none">
      <div 
        className="rounded-[40px] overflow-hidden min-h-[760px] flex flex-col relative text-white bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.9)), url('https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80')`
        }}
      >
        {/* Top Status Bar */}
        <div className="pt-3 px-6 pb-2 flex justify-between items-center text-[12px] font-semibold text-white/90">
          <span>09:41</span>
          <div className="w-24 h-4 bg-black rounded-full mx-auto" />
          <div className="flex items-center gap-1.5 text-[11px]">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Date & Time Widget */}
        <div className="px-6 pt-10 pb-6 text-center">
          <div className="text-6xl font-light tracking-tight font-sans text-white/95">
            09:41
          </div>
          <div className="text-sm font-medium text-white/80 mt-1 flex items-center justify-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-300" />
            <span>Tuesday, 6 October 2026</span>
          </div>
          <div className="text-[11px] text-blue-200/90 font-medium mt-0.5">
            Kakamega, Kenya • 24°C Sunny
          </div>
        </div>

        {/* Interactive App Grid */}
        <div className="flex-1 px-6 pt-4 grid grid-cols-4 gap-y-6 gap-x-3 text-center">
          {/* THE HIGHLIGHTED MMUST INSTALLED APP ICON */}
          <div className="flex flex-col items-center col-span-2 col-start-2">
            <button
              onClick={onLaunchApp}
              className="group relative w-19 h-19 rounded-2xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 p-1.5 shadow-2xl ring-2 ring-white/60 hover:ring-blue-400 active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center animate-pulse"
            >
              {/* Outer Glow */}
              <div className="absolute -inset-1 bg-blue-500/30 rounded-3xl blur-xs group-hover:bg-blue-400/50 transition-all" />
              
              <div className="relative z-10 bg-white rounded-xl p-1 shadow-inner">
                <MMUSTLogo size={46} />
              </div>

              {/* Notification Badge */}
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md border-2 border-slate-900">
                1
              </div>
            </button>
            <span className="text-xs font-bold text-white mt-2 drop-shadow-md">
              MMUST Clearance
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <span>● Tap to Launch</span>
            </span>
          </div>

          {/* Standard phone apps for realism */}
          <div className="flex flex-col items-center opacity-60 col-span-1 col-start-1 -mt-20">
            <div className="w-13 h-13 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg">
              <Phone className="w-6 h-6" />
            </div>
            <span className="text-[11px] text-white/80 mt-1.5">Phone</span>
          </div>

          <div className="flex flex-col items-center opacity-60 col-span-1 col-start-4 -mt-20">
            <div className="w-13 h-13 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg">
              <MessageSquare className="w-6 h-6" />
            </div>
            <span className="text-[11px] text-white/80 mt-1.5">Messages</span>
          </div>

          <div className="flex flex-col items-center opacity-60 col-span-1">
            <div className="w-13 h-13 rounded-2xl bg-slate-700 flex items-center justify-center text-white shadow-lg">
              <Settings className="w-6 h-6" />
            </div>
            <span className="text-[11px] text-white/80 mt-1.5">Settings</span>
          </div>

          <div className="flex flex-col items-center opacity-60 col-span-1">
            <div className="w-13 h-13 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-[11px] text-white/80 mt-1.5">Clock</span>
          </div>

          <div className="flex flex-col items-center opacity-60 col-span-1">
            <div className="w-13 h-13 rounded-2xl bg-red-500 flex items-center justify-center text-white shadow-lg">
              <Chrome className="w-6 h-6" />
            </div>
            <span className="text-[11px] text-white/80 mt-1.5">Browser</span>
          </div>

          <div className="flex flex-col items-center opacity-60 col-span-1">
            <div className="w-13 h-13 rounded-2xl bg-slate-800 flex items-center justify-center text-white shadow-lg">
              <Camera className="w-6 h-6" />
            </div>
            <span className="text-[11px] text-white/80 mt-1.5">Camera</span>
          </div>
        </div>

        {/* Bottom Instruction Note */}
        <div className="p-6 text-center">
          <div className="bg-slate-900/80 backdrop-blur-md border border-white/20 rounded-2xl p-3 shadow-lg">
            <p className="text-xs text-blue-200 font-semibold">
              📱 Tap the <strong>MMUST Clearance</strong> icon above to start the mobile app!
            </p>
          </div>
        </div>

        {/* Home Bar Indicator */}
        <div className="pb-3 flex justify-center">
          <div className="w-32 h-1 bg-white/60 rounded-full" />
        </div>
      </div>
    </div>
  );
};
