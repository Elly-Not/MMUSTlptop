import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Laptop, Student, GateLog, SecurityGuard } from '../types';
import { playScannerBeep, playSuccessChime, playAlertSiren } from '../services/soundService';
import { 
  Camera, 
  CheckCircle2, 
  AlertOctagon, 
  XCircle, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  Scan, 
  ArrowLeft, 
  Sparkles,
  ChevronDown,
  Info,
  Clock,
  UserCheck
} from 'lucide-react';

interface GuardScannerProps {
  guard: SecurityGuard;
  allLaptops: Laptop[];
  allStudents: Student[];
  onLogGateAction: (log: Omit<GateLog, 'log_id'>) => void;
  pendingOfflineCount: number;
  onSyncOfflineLogs: () => void;
}

export const GuardScanner: React.FC<GuardScannerProps> = ({
  guard,
  allLaptops,
  allStudents,
  onLogGateAction,
  pendingOfflineCount,
  onSyncOfflineLogs,
}) => {
  const [isScanning, setIsScanning] = useState(true);
  const [activeScannedLaptop, setActiveScannedLaptop] = useState<Laptop | null>(null);
  const [activeScannedStudent, setActiveScannedStudent] = useState<Student | null>(null);
  const [isBlacklistAlarm, setIsBlacklistAlarm] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);
  const [webcamActive, setWebcamActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [scanPreviewUrl, setScanPreviewUrl] = useState<string>('');

  // Default to Sarah Otieno's laptop matching Image 3 mockup
  useEffect(() => {
    const defaultLaptop = allLaptops.find((l) => l.student_reg_no === 'CSC/2022/0879') || allLaptops[0];
    if (defaultLaptop) {
      const student = allStudents.find((s) => s.reg_no === defaultLaptop.student_reg_no);
      setActiveScannedLaptop(defaultLaptop);
      setActiveScannedStudent(student || null);

      QRCode.toDataURL(defaultLaptop.qr_payload, { width: 180, margin: 1 }, (err, url) => {
        if (!err && url) setScanPreviewUrl(url);
      });
    }
  }, [allLaptops, allStudents]);

  // Handle Scanning a specific laptop payload
  const handleProcessScan = (laptop: Laptop) => {
    playScannerBeep();
    const student = allStudents.find((s) => s.reg_no === laptop.student_reg_no);
    setActiveScannedLaptop(laptop);
    setActiveScannedStudent(student || null);
    setLastActionMessage(null);

    QRCode.toDataURL(laptop.qr_payload, { width: 180, margin: 1 }, (err, url) => {
      if (!err && url) setScanPreviewUrl(url);
    });

    // CRITICAL: Check Blacklist / Stolen Status
    if (laptop.status === 'STOLEN' || laptop.status === 'BLACKLISTED') {
      setIsBlacklistAlarm(true);
      if (soundEnabled) {
        playAlertSiren();
      }
    } else {
      setIsBlacklistAlarm(false);
    }
  };

  const handleAllowExit = () => {
    if (!activeScannedLaptop || !activeScannedStudent) return;
    if (soundEnabled) playSuccessChime();

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    onLogGateAction({
      laptop_id: activeScannedLaptop.laptop_id,
      student_reg_no: activeScannedStudent.reg_no,
      student_name: activeScannedStudent.name,
      student_photo: activeScannedStudent.photo_url,
      laptop_model: activeScannedLaptop.model,
      serial_no: activeScannedLaptop.serial_no,
      guard_id: guard.guard_id,
      guard_name: `Guard: ${guard.name}`,
      gate_location: guard.gate_assigned.split('(')[0].trim(),
      action: 'EXIT',
      status: 'Cleared',
      timestamp: timeStr,
      date: dateStr,
      offline_cached: isOfflineMode,
    });

    setLastActionMessage(`Action logged • ${timeStr} • ${dateStr}`);
  };

  const handleDenyExit = (reason = 'Security Check Denied') => {
    if (!activeScannedLaptop || !activeScannedStudent) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    onLogGateAction({
      laptop_id: activeScannedLaptop.laptop_id,
      student_reg_no: activeScannedStudent.reg_no,
      student_name: activeScannedStudent.name,
      student_photo: activeScannedStudent.photo_url,
      laptop_model: activeScannedLaptop.model,
      serial_no: activeScannedLaptop.serial_no,
      guard_id: guard.guard_id,
      guard_name: `Guard: ${guard.name}`,
      gate_location: guard.gate_assigned.split('(')[0].trim(),
      action: isBlacklistAlarm ? 'BLACKLIST_INTERCEPT' : 'DENIED',
      status: isBlacklistAlarm ? 'Stolen' : 'Denied',
      timestamp: timeStr,
      date: dateStr,
      offline_cached: isOfflineMode,
    });

    setLastActionMessage(`EXIT BLOCKED • Handed to Chief Security • ${timeStr}`);
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setWebcamActive(true);
      }
    } catch {
      alert('Camera access unavailable in current browser environment. Use simulation buttons below to test scanning!');
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setWebcamActive(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-4 w-full">
      {/* Guard Controls & Quick Simulation Bar */}
      <div className="w-full max-w-md mb-3 bg-white/95 backdrop-blur border border-slate-200 rounded-2xl p-3 shadow-xs space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Gate Wi-Fi:</span>
            <button
              onClick={() => setIsOfflineMode(!isOfflineMode)}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isOfflineMode
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}
            >
              {isOfflineMode ? (
                <>
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>Offline (Gate Wi-Fi Down)</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5" />
                  <span>Online (Connected)</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Alerts' : 'Enable Siren'}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {pendingOfflineCount > 0 && (
              <button
                onClick={onSyncOfflineLogs}
                className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 shadow-xs animate-bounce"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Sync ({pendingOfflineCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Test Barcode Buttons */}
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Simulate Student QR Presentation at Gate:
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => {
                const s = allLaptops.find((l) => l.student_reg_no === 'CSC/2022/0879');
                if (s) handleProcessScan(s);
              }}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg font-medium text-[11px] flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Sarah Otieno (Cleared)</span>
            </button>

            <button
              onClick={() => {
                const s = allLaptops.find((l) => l.status === 'STOLEN');
                if (s) handleProcessScan(s);
              }}
              className="bg-red-50 hover:bg-red-100 text-red-800 border border-red-300 px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1"
            >
              <AlertOctagon className="w-3 h-3 text-red-600" />
              <span>Sheila Atieno (STOLEN ALARM!)</span>
            </button>

            <button
              onClick={() => {
                const s = allLaptops.find((l) => l.student_reg_no === 'CSC/2023/1124');
                if (s) handleProcessScan(s);
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-2.5 py-1 rounded-lg font-medium text-[11px]"
            >
              <span>John Mukono</span>
            </button>
          </div>
        </div>
      </div>

      {/* Realistic Mobile Device Mockup Frame - Matching Image 3 */}
      <div className="w-full max-w-[390px] bg-slate-900 rounded-[48px] p-3 shadow-2xl ring-1 ring-slate-800/80 relative">
        <div className="bg-slate-950 rounded-[40px] overflow-hidden border border-slate-700/60 flex flex-col min-h-[760px] relative text-white">
          {/* Top Status Bar */}
          <div className="bg-slate-950/80 backdrop-blur-md text-white pt-2.5 px-6 pb-2 flex justify-between items-center text-[12px] font-semibold tracking-tight z-20">
            <span>10:24</span>
            <div className="w-24 h-4.5 bg-black rounded-full mx-auto" />
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-[10px]">78%</span>
              <div className="w-4 h-2.5 border border-white rounded-xs p-0.5 flex items-center">
                <div className="w-full h-full bg-white rounded-2xs" />
              </div>
            </div>
          </div>

          {/* Scanner Header - Matching Image 3 */}
          <div className="px-5 pt-1 pb-3 flex items-center justify-between z-20">
            <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="text-center">
              <h2 className="text-base font-bold text-white tracking-tight">
                Security Guard Interface
              </h2>
              <p className="text-[11px] text-slate-300 font-medium">
                MMUST Digital Laptop Clearance System
              </p>
            </div>
            <div className="w-8 h-8" />
          </div>

          {/* Camera View Area - Pixel Matched to Image 3 */}
          <div className="relative flex-1 bg-gradient-to-b from-slate-900 via-slate-950 to-black overflow-hidden flex flex-col items-center justify-center min-h-[360px]">
            {/* Dark background resembling gate or lockers behind */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30 blur-xs"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80')`
              }}
            />

            {/* Optional Live Webcam stream */}
            {webcamActive && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
            )}

            {/* "LIVE SCANNING" green pill */}
            <div className="relative z-10 mb-4 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-md shadow-xs animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>• LIVE SCANNING</span>
            </div>

            {/* Green Reticle / Scanning Target Box - Image 3 */}
            <div className="relative z-10 w-64 h-64 border-2 border-emerald-500/30 rounded-3xl flex items-center justify-center p-3">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-7 h-7 border-t-3 border-l-3 border-emerald-400 rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-7 h-7 border-t-3 border-r-3 border-emerald-400 rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-7 h-7 border-b-3 border-l-3 border-emerald-400 rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-7 h-7 border-b-3 border-r-3 border-emerald-400 rounded-br-xl" />

              {/* Animated Laser Scanline */}
              <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-bounce" />

              {/* QR Code Graphic in Center */}
              <div className="bg-white p-2.5 rounded-2xl shadow-2xl">
                {scanPreviewUrl ? (
                  <img
                    src={scanPreviewUrl}
                    alt="Scanned QR"
                    className="w-40 h-40 object-contain"
                  />
                ) : (
                  <div className="w-40 h-40 bg-slate-100 flex items-center justify-center text-slate-400">
                    <Scan className="w-12 h-12" />
                  </div>
                )}
              </div>
            </div>

            {/* Camera Toggle Button */}
            <div className="relative z-10 mt-3">
              <button
                onClick={webcamActive ? stopWebcam : startWebcam}
                className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-semibold px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1"
              >
                <Camera className="w-3 h-3" />
                <span>{webcamActive ? 'Stop Camera' : 'Turn On Phone Camera'}</span>
              </button>
            </div>
          </div>

          {/* CRITICAL BLACKLIST SCREEN OVERRIDE (Requirement 5) */}
          {isBlacklistAlarm && activeScannedLaptop && activeScannedStudent ? (
            <div className="bg-red-600 text-white rounded-t-[36px] p-5 shadow-2xl border-t-4 border-red-400 animate-pulse z-30 transition-all flex flex-col">
              {/* Drag handle */}
              <div className="w-12 h-1 bg-white/40 rounded-full mx-auto mb-3" />

              <div className="flex items-center justify-between pb-2 border-b border-red-500/80">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white text-red-600 flex items-center justify-center font-black animate-spin">
                    ⚠️
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm uppercase tracking-wide">
                      SECURITY ALERT: STOLEN LAPTOP!
                    </h3>
                    <p className="text-[10px] text-red-100">
                      Blacklist Matched • Impound Immediately
                    </p>
                  </div>
                </div>
                <span className="bg-white text-red-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                  POLICE REPORTED
                </span>
              </div>

              {/* Stolen Details */}
              <div className="bg-red-700/70 rounded-2xl p-3 my-3 border border-red-400/50 text-xs space-y-1.5">
                <div className="flex items-center gap-3">
                  <img
                    src={activeScannedStudent.photo_url}
                    alt={activeScannedStudent.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white"
                  />
                  <div>
                    <p className="font-bold text-white text-sm">
                      Registered Owner: {activeScannedStudent.name}
                    </p>
                    <p className="text-red-200 text-xs font-mono">
                      Student ID: {activeScannedStudent.reg_no}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-red-600/60 text-[11px]">
                  <p>
                    <strong>Device:</strong> {activeScannedLaptop.model} (S/N: {activeScannedLaptop.serial_no})
                  </p>
                  <p className="text-red-100 mt-1">
                    <strong>Incident Report:</strong> {activeScannedLaptop.stolen_reason || 'Device flagged stolen at MMUST Police Post.'}
                  </p>
                </div>
              </div>

              {/* Detain & Deny Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => handleDenyExit('STOLEN LAPTOP DETAINED')}
                  className="w-full bg-black hover:bg-slate-950 text-white py-3.5 px-4 rounded-2xl font-black text-sm tracking-wide shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <AlertOctagon className="w-5 h-5 text-red-400" />
                  DETAIN LAPTOP &amp; HOLD BEARER
                </button>

                <button
                  onClick={() => setIsBlacklistAlarm(false)}
                  className="w-full text-center text-[11px] text-red-200 hover:text-white py-1"
                >
                  Dismiss Alarm Override
                </button>
              </div>
            </div>
          ) : (
            /* Normal Student Verified Sheet - Pixel Matched to Image 3 */
            <div className="bg-white text-slate-800 rounded-t-[36px] p-5 shadow-2xl z-30 transition-all flex flex-col">
              {/* Drag Handle */}
              <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-3" />

              {/* Status Header: Scanning... QR detected + Cleared Pill */}
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-extrabold text-slate-900 text-sm tracking-tight">
                    Scanning... QR detected
                  </span>
                </div>

                <div className="bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
                  <span>Cleared</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>

              {activeScannedStudent && activeScannedLaptop ? (
                <>
                  {/* Student Details Card */}
                  <div className="flex items-center gap-3.5 my-2">
                    <img
                      src={activeScannedStudent.photo_url}
                      alt={activeScannedStudent.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 shadow-sm"
                    />

                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 text-sm">
                        Student: {activeScannedStudent.name}
                      </h4>
                      <p className="text-xs font-mono font-medium text-slate-600 mt-0.5">
                        ID: {activeScannedStudent.reg_no}
                      </p>

                      <div className="flex items-center gap-1.5 text-xs text-slate-700 mt-1 font-medium">
                        <span className="text-slate-400">💻</span>
                        <span>Laptop: {activeScannedLaptop.model}</span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
                        <span className="w-3.5 h-3.5 rounded-full bg-emerald-100 flex items-center justify-center text-[9px]">
                          ✓
                        </span>
                        <span>Verified • Cleared to exit</span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Allow Exit Button - Image 3 */}
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={handleAllowExit}
                      className="w-full bg-[#189b53] hover:bg-[#138244] active:scale-[0.99] text-white py-3.5 px-4 rounded-2xl font-bold text-base shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                      Allow Exit
                    </button>

                    <button
                      onClick={() => handleDenyExit('Manual Guard Deny')}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <XCircle className="w-4 h-4 text-slate-500" />
                      Deny Exit (Flag Inspection)
                    </button>
                  </div>

                  {/* Action Logged Footer - Image 3 */}
                  <p className="text-[11px] text-slate-400 font-medium text-center mt-3">
                    {lastActionMessage || 'Action logged • 10:24 AM • 23 Sep 2026'}
                  </p>
                </>
              ) : (
                <div className="py-6 text-center text-slate-500 text-xs">
                  Hold student clearance QR code inside the green scanner frame.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
