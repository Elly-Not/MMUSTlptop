import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Laptop, Student } from '../types';
import { MMUSTLogo } from './MMUSTLogo';
import { 
  Laptop as LaptopIcon, 
  Download, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Smartphone, 
  Calendar, 
  User, 
  Home, 
  Layers, 
  Sparkles,
  X
} from 'lucide-react';

interface StudentPortalProps {
  currentStudent: Student;
  allStudents: Student[];
  laptops: Laptop[];
  onSelectStudent: (student: Student) => void;
  onRegisterLaptop: (laptop: Laptop) => void;
  onReportStolen: (laptopId: string, reason: string) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  currentStudent,
  allStudents,
  laptops,
  onSelectStudent,
  onRegisterLaptop,
  onReportStolen,
}) => {
  const studentLaptops = laptops.filter((l) => l.student_reg_no === currentStudent.reg_no);
  const [selectedLaptopId, setSelectedLaptopId] = useState<string>(
    studentLaptops[0]?.laptop_id || ''
  );
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [activeTab, setActiveTab] = useState<'home' | 'laptops' | 'profile'>('laptops');
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // New laptop form
  const [newModel, setNewModel] = useState('');
  const [newBrand, setNewBrand] = useState('HP');
  const [newSerial, setNewSerial] = useState('');
  const [newColor, setNewColor] = useState('Dark Gray');

  const selectedLaptop = studentLaptops.find((l) => l.laptop_id === selectedLaptopId) || studentLaptops[0];

  useEffect(() => {
    if (studentLaptops.length > 0 && !studentLaptops.some((l) => l.laptop_id === selectedLaptopId)) {
      setSelectedLaptopId(studentLaptops[0].laptop_id);
    }
  }, [studentLaptops, selectedLaptopId]);

  useEffect(() => {
    if (selectedLaptop) {
      QRCode.toDataURL(
        selectedLaptop.qr_payload,
        {
          width: 320,
          margin: 1.5,
          color: {
            dark: '#0B2F64',
            light: '#FFFFFF',
          },
        },
        (err, url) => {
          if (!err && url) {
            setQrDataUrl(url);
          }
        }
      );
    }
  }, [selectedLaptop]);

  const handleDownloadQR = () => {
    if (!qrDataUrl || !selectedLaptop) return;
    const link = document.createElement('a');
    link.download = `MMUST_QR_${currentStudent.reg_no.replace(/\//g, '_')}_${selectedLaptop.serial_no}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const handleCreateLaptop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModel.trim() || !newSerial.trim()) return;

    const newId = `LP-MMUST-${Math.floor(1000 + Math.random() * 9000)}`;
    const payload = JSON.stringify({
      v: 1,
      lid: newId,
      reg: currentStudent.reg_no,
      name: currentStudent.name,
      model: newModel,
      sn: newSerial,
      sig: `MMUST-SEC-${Date.now().toString(36).toUpperCase()}`
    });

    const newLaptop: Laptop = {
      laptop_id: newId,
      student_reg_no: currentStudent.reg_no,
      student_name: currentStudent.name,
      student_photo: currentStudent.photo_url,
      model: newModel,
      brand: newBrand,
      serial_no: newSerial,
      color: newColor,
      photo_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=500&q=80',
      qr_payload: payload,
      status: 'CLEARED',
      registered_at: new Date().toISOString().split('T')[0],
    };

    onRegisterLaptop(newLaptop);
    setSelectedLaptopId(newId);
    setShowRegisterModal(false);
    setNewModel('');
    setNewSerial('');
  };

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-4 w-full">
      {/* Student Switcher Bar for Demonstration */}
      <div className="w-full max-w-sm mb-3 bg-white/90 backdrop-blur border border-blue-100 rounded-xl p-2.5 shadow-xs flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">Switch Test Student:</span>
        <select
          value={currentStudent.reg_no}
          onChange={(e) => {
            const found = allStudents.find((s) => s.reg_no === e.target.value);
            if (found) onSelectStudent(found);
          }}
          className="bg-blue-50/80 text-blue-900 border border-blue-200 rounded-lg px-2 py-1 font-semibold text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
        >
          {allStudents.map((st) => (
            <option key={st.reg_no} value={st.reg_no}>
              {st.name} ({st.reg_no.split('/')[0]})
            </option>
          ))}
        </select>
      </div>

      {/* Realistic Mobile Device Mockup Frame (iPhone 16 Pro Style) */}
      <div className="w-full max-w-[390px] bg-slate-900 rounded-[48px] p-3 shadow-2xl ring-1 ring-slate-800/80 relative">
        {/* Device Outer Notch/Dynamic Island */}
        <div className="bg-slate-950 rounded-[40px] overflow-hidden border border-slate-700/60 flex flex-col min-h-[760px] bg-white text-slate-800 shadow-inner">
          {/* Top Status Bar */}
          <div className="bg-[#0060df] text-white pt-2.5 px-6 pb-1 flex justify-between items-center text-[12px] font-semibold tracking-tight">
            <span>9:41</span>
            {/* Dynamic Island */}
            <div className="w-24 h-4.5 bg-black rounded-full mx-auto" />
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="font-mono text-[10px]">5G</span>
              <div className="w-4 h-2.5 border border-white rounded-xs p-0.5 flex items-center">
                <div className="w-full h-full bg-white rounded-2xs" />
              </div>
            </div>
          </div>

          {/* Curved University Header Banner - Matching Image 4 */}
          <div className="bg-[#0060df] text-white px-5 pt-3 pb-6 rounded-b-[28px] shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-full shadow-xs">
                <MMUSTLogo size={42} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white leading-tight">
                  MMUST
                </h1>
                <p className="text-blue-100 text-sm font-medium tracking-wide">
                  Digital Clearance
                </p>
              </div>
            </div>
          </div>

          {/* Screen Content Container */}
          <div className="flex-1 px-4 pt-4 pb-20 flex flex-col overflow-y-auto">
            {activeTab === 'laptops' && (
              <>
                {/* Section Header: "My Laptops" + "+" icon */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    My Laptops
                  </h2>
                  <button
                    onClick={() => setShowRegisterModal(true)}
                    title="Register New Laptop"
                    className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors cursor-pointer border border-blue-200"
                  >
                    <Plus className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </div>

                {/* Multi-laptop switcher if student has multiple */}
                {studentLaptops.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 mb-2 no-scrollbar">
                    {studentLaptops.map((l) => (
                      <button
                        key={l.laptop_id}
                        onClick={() => setSelectedLaptopId(l.laptop_id)}
                        className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-all ${
                          selectedLaptop?.laptop_id === l.laptop_id
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {l.model.split(' ')[0]} ({l.serial_no.slice(-4)})
                      </button>
                    ))}
                  </div>
                )}

                {selectedLaptop ? (
                  /* Main Clearance Card - Pixel Matched to Image 4 */
                  <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-4 flex flex-col items-center">
                    {/* Top Device Header in Card */}
                    <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shadow-2xs">
                          <LaptopIcon className="w-6 h-6 stroke-[1.8]" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-bold text-slate-900 text-sm leading-tight">
                            {selectedLaptop.model}
                          </h3>
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                            Serial: {selectedLaptop.serial_no}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      {selectedLaptop.status === 'CLEARED' || selectedLaptop.status === 'ACTIVE' ? (
                        <div className="bg-emerald-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                          <span>Cleared</span>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="bg-red-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs animate-pulse">
                          <span>Blacklisted</span>
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    {/* QR Code Container */}
                    <div className="my-5 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
                      {qrDataUrl ? (
                        <img
                          src={qrDataUrl}
                          alt="Laptop Clearance QR"
                          className="w-52 h-52 object-contain"
                        />
                      ) : (
                        <div className="w-52 h-52 bg-slate-100 animate-pulse rounded-xl" />
                      )}
                    </div>

                    {/* Verification Caption */}
                    <p className="text-xs font-semibold text-slate-700 text-center">
                      Scan this to verify at gate
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5 mb-4">
                      Valid until 30 Dec 2026
                    </p>

                    {/* Download QR Button - Matching Image 4 */}
                    <button
                      onClick={handleDownloadQR}
                      className="w-full bg-[#0060df] hover:bg-[#0050c0] active:scale-[0.98] text-white py-3 px-4 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4 stroke-[2.5]" />
                      Download QR
                    </button>

                    {/* Secondary Action: Report Issue */}
                    <button
                      onClick={() => setShowReportModal(true)}
                      className="mt-2 text-[11px] text-slate-500 hover:text-red-600 font-medium underline underline-offset-2 py-1 transition-colors"
                    >
                      Report Issue / Stolen Laptop
                    </button>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-8 text-center">
                    <LaptopIcon className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-700">No laptops registered yet</p>
                    <p className="text-xs text-slate-500 mt-1 mb-4">
                      Register your laptop to generate a gate clearance QR pass.
                    </p>
                    <button
                      onClick={() => setShowRegisterModal(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold"
                    >
                      + Register First Laptop
                    </button>
                  </div>
                )}

                {/* Student Details Card at Bottom - Matching Image 4 */}
                <div className="mt-4 bg-[#e8f1fc] border border-blue-100 rounded-2xl p-3 flex items-center gap-3">
                  <img
                    src={currentStudent.photo_url}
                    alt={currentStudent.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 text-sm">
                      {currentStudent.name}
                    </h4>
                    <p className="text-xs font-mono font-medium text-blue-700">
                      ID: {currentStudent.reg_no}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {currentStudent.course}
                    </p>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'home' && (
              <div className="space-y-4 pt-1">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 text-white rounded-2xl p-4 shadow-md">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200">
                    Masinde Muliro University
                  </span>
                  <h3 className="text-base font-bold mt-1">Kakamega Main Gate Notice</h3>
                  <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                    All students carrying laptop computers through Gates A, B, or C must present their Digital Clearance QR code to on-duty security officers.
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2">
                    Quick Verification Checklist
                  </h4>
                  <ul className="text-xs space-y-2 text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Ensure laptop serial number matches your portal.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Carry your official MMUST Student ID Card.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Clearance works offline at gate even without Wi-Fi.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-4 pt-1">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
                  <img
                    src={currentStudent.photo_url}
                    alt={currentStudent.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-blue-100 shadow-md"
                  />
                  <h3 className="font-bold text-slate-900 text-base mt-2">{currentStudent.name}</h3>
                  <p className="text-xs font-mono text-blue-700 font-semibold">{currentStudent.reg_no}</p>
                  <p className="text-xs text-slate-500 mt-1">{currentStudent.department}</p>
                  
                  <div className="mt-4 pt-3 border-t border-slate-100 text-left text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">National ID:</span>
                      <span className="font-semibold text-slate-700">{currentStudent.id_number || '38920194'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Phone:</span>
                      <span className="font-semibold text-slate-700">{currentStudent.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Email:</span>
                      <span className="font-semibold text-slate-700">{currentStudent.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Navigation Bar - Matching Image 4 */}
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200/80 px-6 py-2.5 flex items-center justify-around rounded-b-[40px]">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-0.5 ${
                activeTab === 'home' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] font-semibold">Home</span>
            </button>

            {/* Selected Pill for Laptops - Image 4 */}
            <button
              onClick={() => setActiveTab('laptops')}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl ${
                activeTab === 'laptops'
                  ? 'bg-blue-100/70 text-blue-700 font-bold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="flex items-center gap-1">
                <LaptopIcon className="w-4 h-4" />
                <span className="text-[10px] font-bold">My Laptops</span>
              </div>
              <span className="text-[9px] -mt-1 opacity-75">Laptops</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-0.5 ${
                activeTab === 'profile' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] font-semibold">Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Register Laptop */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <LaptopIcon className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Register New Laptop</h3>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLaptop} className="mt-4 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Laptop Brand
                </label>
                <select
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 font-medium"
                >
                  <option value="HP">HP (Hewlett Packard)</option>
                  <option value="Lenovo">Lenovo</option>
                  <option value="Dell">Dell</option>
                  <option value="Apple">Apple MacBook</option>
                  <option value="Asus">ASUS</option>
                  <option value="Acer">Acer</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Model Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. ProBook 450 G9, ThinkPad E14"
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  required
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Hardware Serial Number (S/N)
                </label>
                <input
                  type="text"
                  placeholder="e.g. HP934821 or 5CD9284..."
                  value={newSerial}
                  onChange={(e) => setNewSerial(e.target.value)}
                  required
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 font-mono uppercase focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Found on the underside label or in BIOS settings.
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Chassis Color
                </label>
                <input
                  type="text"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 font-medium"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold text-xs shadow-md"
                >
                  Save &amp; Generate QR Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Report Stolen */}
      {showReportModal && selectedLaptop && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-red-200">
            <div className="flex items-center justify-between pb-3 border-b border-red-100">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-sm">Report Stolen / Missing Laptop</h3>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 text-xs text-slate-600">
              <p>
                Reporting <strong>{selectedLaptop.model}</strong> ({selectedLaptop.serial_no}) as stolen will immediately blacklist the device across all MMUST gate scanners.
              </p>

              <label className="block text-[11px] font-bold text-slate-700 uppercase mt-3 mb-1">
                Incident Details / Police OB No.
              </label>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Where was it lost? e.g. Library 2nd floor, Hostel Hall 3 Room B14..."
                rows={3}
                className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-red-500"
              />

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="w-1/2 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onReportStolen(selectedLaptop.laptop_id, reportReason || 'Reported lost by student');
                    setShowReportModal(false);
                    setReportReason('');
                  }}
                  className="w-1/2 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-md"
                >
                  Blacklist Device
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
