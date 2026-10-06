import React from 'react';
import { 
  Smartphone, 
  Globe, 
  ShieldCheck, 
  Server, 
  KeyRound, 
  QrCode, 
  Database, 
  ArrowRight, 
  ArrowDown, 
  Lock, 
  WifiOff, 
  Layers, 
  FileCode2 
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase font-extrabold tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          System Architecture Diagram • University Final Year Project
        </span>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
          MMUST Digital Laptop Clearance System
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Masinde Muliro University of Science and Technology • Kakamega, Kenya
        </p>
      </div>

      {/* 3-Tier Layer Architecture - Pixel Matched to Image 1 */}
      <div className="space-y-6">
        {/* Layer 1: Presentation Layer */}
        <div className="border-2 border-blue-200 rounded-3xl p-5 bg-blue-50/40 relative">
          <div className="absolute -top-3.5 left-6 bg-[#0060df] text-white text-xs font-black uppercase px-3 py-1 rounded-md shadow-xs flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5" />
            <span>PRESENTATION LAYER (User Interface / Client Applications)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3">
            {/* Student Web Portal */}
            <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
                <Globe className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Student Web Portal</h4>
              <p className="text-[10px] font-semibold text-blue-600 mb-2">Flutter / Web &amp; Mobile</p>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• Student registration &amp; login</li>
                <li>• Laptop registration &amp; S/N capture</li>
                <li>• View clearance status &amp; QR Pass</li>
              </ul>
            </div>

            {/* Guard Mobile Scanner */}
            <div className="bg-white rounded-2xl p-4 border-2 border-emerald-300 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                <Smartphone className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Guard Mobile Scanner App</h4>
              <p className="text-[10px] font-semibold text-emerald-600 mb-2">Flutter (Android / iOS)</p>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• Camera QR scanner (mobile_scanner)</li>
                <li>• Gate clearance check (Allow/Deny)</li>
                <li>• <strong>Offline capability (Hive/SQLite)</strong></li>
                <li>• <strong>Blacklist sound &amp; visual alarm</strong></li>
              </ul>
            </div>

            {/* Admin Dashboard */}
            <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Admin Dashboard</h4>
              <p className="text-[10px] font-semibold text-blue-600 mb-2">Flutter Web / Django Admin</p>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• Manage students &amp; registered laptops</li>
                <li>• View real-time gate entry logs</li>
                <li>• Blacklist management &amp; CSV export</li>
              </ul>
            </div>
          </div>
        </div>

        {/* REST API & HTTPS Connectors */}
        <div className="flex items-center justify-center gap-3 text-xs font-bold text-emerald-700">
          <ArrowDown className="w-4 h-4 animate-bounce" />
          <span className="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            HTTPS / REST API Requests (JSON Payload)
          </span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </div>

        {/* Layer 2: Application Layer */}
        <div className="border-2 border-emerald-200 rounded-3xl p-5 bg-emerald-50/40 relative">
          <div className="absolute -top-3.5 left-6 bg-[#16a34a] text-white text-xs font-black uppercase px-3 py-1 rounded-md shadow-xs flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5" />
            <span>APPLICATION LAYER (Business Logic / Backend Services - Django)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-3">
            <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-xs">
              <Server className="w-6 h-6 text-emerald-700 mb-1" />
              <h5 className="font-bold text-xs text-slate-900">Django REST API</h5>
              <p className="text-[11px] text-slate-500 mt-1">
                Core API endpoints, routing, serializers &amp; controllers.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-xs">
              <KeyRound className="w-6 h-6 text-emerald-700 mb-1" />
              <h5 className="font-bold text-xs text-slate-900">JWT Authentication</h5>
              <p className="text-[11px] text-slate-500 mt-1">
                Token generation, refresh tokens, role-based guard/student/admin ACL.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-xs">
              <QrCode className="w-6 h-6 text-emerald-700 mb-1" />
              <h5 className="font-bold text-xs text-slate-900">QR Generator Service</h5>
              <p className="text-[11px] text-slate-500 mt-1">
                Python qrcode &amp; Pillow libraries encode secure SHA256 signatures.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-red-200 shadow-xs">
              <ShieldCheck className="w-6 h-6 text-red-600 mb-1" />
              <h5 className="font-bold text-xs text-slate-900">Blacklist Logic</h5>
              <p className="text-[11px] text-slate-500 mt-1">
                Immediate stolen status check; triggers gate alarm and blocked logs.
              </p>
            </div>
          </div>
        </div>

        {/* ORM & SQL Queries Connector */}
        <div className="flex items-center justify-center gap-3 text-xs font-bold text-cyan-700">
          <ArrowDown className="w-4 h-4" />
          <span className="bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full">
            SQL Queries / Django ORM (PostgreSQL or MySQL)
          </span>
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Layer 3: Data Layer */}
        <div className="border-2 border-cyan-200 rounded-3xl p-5 bg-cyan-50/40 relative">
          <div className="absolute -top-3.5 left-6 bg-[#0284c7] text-white text-xs font-black uppercase px-3 py-1 rounded-md shadow-xs flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5" />
            <span>DATA LAYER (Data Storage / Relational Persistence)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3">
            {/* Student Table */}
            <div className="bg-white rounded-2xl p-4 border border-cyan-100 shadow-xs">
              <div className="bg-blue-50 text-blue-900 text-xs font-bold px-2 py-1 rounded-md mb-2 flex justify-between">
                <span>Student</span>
                <span className="text-[10px] text-slate-500 font-normal">Table</span>
              </div>
              <ul className="text-xs font-mono space-y-1 text-slate-700">
                <li><span className="font-bold text-blue-700">PK</span> reg_no (VARCHAR)</li>
                <li>name (VARCHAR)</li>
                <li>email (VARCHAR)</li>
                <li>phone (VARCHAR)</li>
                <li>course (VARCHAR)</li>
                <li>department (VARCHAR)</li>
              </ul>
            </div>

            {/* Laptop Table */}
            <div className="bg-white rounded-2xl p-4 border border-cyan-100 shadow-xs">
              <div className="bg-blue-50 text-blue-900 text-xs font-bold px-2 py-1 rounded-md mb-2 flex justify-between">
                <span>Laptop</span>
                <span className="text-[10px] text-slate-500 font-normal">Table</span>
              </div>
              <ul className="text-xs font-mono space-y-1 text-slate-700">
                <li><span className="font-bold text-blue-700">PK</span> laptop_id (UUID/INT)</li>
                <li><span className="font-bold text-amber-600">FK</span> reg_no &rarr; Student</li>
                <li>model (VARCHAR)</li>
                <li>serial_no (VARCHAR UNIQUE)</li>
                <li>qr_code (IMAGE/TEXT)</li>
                <li>status (Active/Stolen)</li>
              </ul>
            </div>

            {/* GateLog Table */}
            <div className="bg-white rounded-2xl p-4 border border-cyan-100 shadow-xs">
              <div className="bg-blue-50 text-blue-900 text-xs font-bold px-2 py-1 rounded-md mb-2 flex justify-between">
                <span>GateLog</span>
                <span className="text-[10px] text-slate-500 font-normal">Table</span>
              </div>
              <ul className="text-xs font-mono space-y-1 text-slate-700">
                <li><span className="font-bold text-blue-700">PK</span> log_id (UUID/INT)</li>
                <li><span className="font-bold text-amber-600">FK</span> laptop_id &rarr; Laptop</li>
                <li><span className="font-bold text-amber-600">FK</span> guard_id &rarr; SecurityGuard</li>
                <li>entry_time / exit_time</li>
                <li>status (Cleared/Stolen)</li>
                <li>date (DATE)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Flow Summary - Image 1 */}
        <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-lg space-y-3">
          <h4 className="text-xs uppercase font-extrabold tracking-widest text-blue-400">
            DATA FLOW SUMMARY (Image 1 Specification)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-emerald-400 font-bold block mb-1">1. Student Registration</span>
              <p className="text-slate-300">
                Student registers laptop via Web Portal &rarr; Student &amp; Laptop tables populated via Django REST API &rarr; Unique QR generated and returned to phone.
              </p>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-cyan-400 font-bold block mb-1">2. Gate Security Scan</span>
              <p className="text-slate-300">
                Guard scans QR with Mobile App &rarr; JWT authenticated &rarr; Blacklist check validated &rarr; GateLog entry created (or cached locally if offline).
              </p>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-purple-400 font-bold block mb-1">3. Admin Monitoring</span>
              <p className="text-slate-300">
                Admin monitors via Dashboard &rarr; views real-time reports from GateLog &amp; Student/Laptop data &rarr; manages blacklist &amp; exports CSV logs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
