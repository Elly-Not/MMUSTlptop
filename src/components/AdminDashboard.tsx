import React, { useState } from 'react';
import { Laptop, Student, GateLog } from '../types';
import { MMUSTLogo } from './MMUSTLogo';
import {
  LayoutDashboard,
  Users,
  Laptop as LaptopIcon,
  ClipboardList,
  ShieldAlert,
  Settings,
  LogOut,
  Bell,
  Search,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
  FileSpreadsheet,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Monitor
} from 'lucide-react';

interface AdminDashboardProps {
  students: Student[];
  laptops: Laptop[];
  gateLogs: GateLog[];
  onToggleBlacklist: (laptopId: string, isStolen: boolean, reason?: string) => void;
  onRefreshData?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  students,
  laptops,
  gateLogs,
  onToggleBlacklist,
}) => {
  const [activeNav, setActiveNav] = useState<'dashboard' | 'students' | 'laptops' | 'gatelogs' | 'blacklist'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBlacklistModal, setShowBlacklistModal] = useState(false);
  const [selectedLaptopForBlacklist, setSelectedLaptopForBlacklist] = useState<string>('');
  const [blacklistReason, setBlacklistReason] = useState('');
  const [isMobilePreview, setIsMobilePreview] = useState(false);

  // Metrics
  const totalStudents = students.length;
  const totalLaptops = laptops.length;
  const todayEntries = gateLogs.length;
  const stolenAlerts = laptops.filter((l) => l.status === 'STOLEN' || l.status === 'BLACKLISTED').length;

  // Filtered gate logs
  const filteredLogs = gateLogs.filter((log) => {
    const q = searchQuery.toLowerCase();
    return (
      log.student_name.toLowerCase().includes(q) ||
      log.student_reg_no.toLowerCase().includes(q) ||
      log.laptop_model.toLowerCase().includes(q) ||
      log.serial_no.toLowerCase().includes(q) ||
      log.guard_name.toLowerCase().includes(q) ||
      log.status.toLowerCase().includes(q)
    );
  });

  // Export CSV functionality
  const handleExportCSV = () => {
    const headers = ['Log ID', 'Time', 'Date', 'Student Name', 'Reg No', 'Laptop Model', 'Serial No', 'Gate', 'Guard', 'Status', 'Action'];
    const rows = filteredLogs.map((log) => [
      log.log_id,
      log.timestamp,
      log.date,
      `"${log.student_name}"`,
      log.student_reg_no,
      `"${log.laptop_model}"`,
      log.serial_no,
      `"${log.gate_location}"`,
      `"${log.guard_name}"`,
      log.status,
      log.action,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MMUST_Gate_Clearance_Logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleApplyBlacklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLaptopForBlacklist) return;
    onToggleBlacklist(selectedLaptopForBlacklist, true, blacklistReason || 'Police report lodged');
    setShowBlacklistModal(false);
    setSelectedLaptopForBlacklist('');
    setBlacklistReason('');
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* View Switcher Bar (Desktop Web Layout vs Mobile Admin App Layout) */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Display Layout:</span>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setIsMobilePreview(false)}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                !isMobilePreview ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Web Dashboard (Image 5)</span>
            </button>
            <button
              onClick={() => setIsMobilePreview(true)}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                isMobilePreview ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Admin UI (Image 2)</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBlacklistModal(true)}
            className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Blacklist Device</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {isMobilePreview ? (
        /* Mobile Admin Dashboard - Matching Image 2 */
        <div className="flex justify-center p-2">
          <div className="w-full max-w-[390px] bg-slate-900 rounded-[48px] p-3 shadow-2xl ring-1 ring-slate-800">
            <div className="bg-slate-50 rounded-[40px] overflow-hidden min-h-[760px] flex flex-col text-slate-800 relative">
              {/* Header - Image 2 */}
              <div className="bg-[#0060df] text-white px-6 pt-6 pb-6 rounded-b-[32px] shadow-sm">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-extrabold tracking-tight">Admin Dashboard</h1>
                  <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 p-5 space-y-4 overflow-y-auto pb-20">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Hello Admin</h2>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5 flex items-center gap-1.5">
                    <span>📅 Overview • 30 Dec 2026</span>
                  </p>
                </div>

                {/* 2x2 Metric Grid - Matching Image 2 */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Card 1: Total Students */}
                  <div className="bg-[#e4efff] border border-blue-200/60 rounded-3xl p-4 flex flex-col justify-between h-36">
                    <div className="w-9 h-9 rounded-full bg-[#0060df] text-white flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-3xl font-black text-[#0B2F64] tracking-tight">{totalStudents}</div>
                      <div className="text-xs font-bold text-slate-700">Total Students</div>
                    </div>
                  </div>

                  {/* Card 2: Laptops Registered */}
                  <div className="bg-[#dcf4ff] border border-cyan-200/60 rounded-3xl p-4 flex flex-col justify-between h-36">
                    <div className="w-9 h-9 rounded-full bg-[#0284c7] text-white flex items-center justify-center">
                      <LaptopIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-3xl font-black text-[#0c4a6e] tracking-tight">{totalLaptops}</div>
                      <div className="text-xs font-bold text-slate-700">Laptops Registered</div>
                    </div>
                  </div>

                  {/* Card 3: Cleared Today */}
                  <div className="bg-[#ddf7e5] border border-emerald-200/60 rounded-3xl p-4 flex flex-col justify-between h-36">
                    <div className="w-9 h-9 rounded-full bg-[#16a34a] text-white flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-3xl font-black text-[#14532d] tracking-tight">{todayEntries}</div>
                      <div className="text-xs font-bold text-slate-700">Cleared Today</div>
                      <span className="inline-block mt-1 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                        ↑ 12% today
                      </span>
                    </div>
                  </div>

                  {/* Card 4: Blacklisted */}
                  <div className="bg-[#fee2e2] border border-red-200/60 rounded-3xl p-4 flex flex-col justify-between h-36">
                    <div className="w-9 h-9 rounded-full bg-[#dc2626] text-white flex items-center justify-center">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-3xl font-black text-[#7f1d1d] tracking-tight">{stolenAlerts}</div>
                      <div className="text-xs font-bold text-slate-700">Blacklisted</div>
                      <span className="inline-block mt-1 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                        Requires action
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions - Matching Image 2 */}
                <div className="pt-2">
                  <h3 className="font-extrabold text-slate-900 text-base mb-3">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setShowBlacklistModal(true)}
                      className="bg-white border-2 border-red-400 text-red-600 hover:bg-red-50 p-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs shadow-2xs"
                    >
                      <ShieldAlert className="w-4 h-4 text-red-600" />
                      <span>Blacklist Management</span>
                    </button>

                    <button
                      onClick={handleExportCSV}
                      className="bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50 p-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs shadow-2xs"
                    >
                      <Download className="w-4 h-4 text-blue-600" />
                      <span>Export Report</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Nav Bar - Image 2 */}
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200/90 px-6 py-2.5 flex items-center justify-around rounded-b-[40px]">
                <div className="flex flex-col items-center text-blue-600 font-bold">
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="text-[10px]">Dashboard</span>
                </div>
                <div className="flex flex-col items-center text-slate-400">
                  <Users className="w-5 h-5" />
                  <span className="text-[10px]">Students</span>
                </div>
                <div className="flex flex-col items-center text-slate-400">
                  <LaptopIcon className="w-5 h-5" />
                  <span className="text-[10px]">Laptops</span>
                </div>
                <div className="flex flex-col items-center text-slate-400">
                  <ClipboardList className="w-5 h-5" />
                  <span className="text-[10px]">Reports</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Full Desktop Web Responsive Layout - Pixel Matched to Image 5 */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
          {/* Top MMUST University Header Bar - Image 5 */}
          <div className="bg-[#0b4f9c] text-white px-6 py-4 flex items-center justify-between border-b border-blue-800">
            <div className="flex items-center gap-4">
              <div className="bg-white p-1 rounded-full shadow-xs">
                <MMUSTLogo size={46} />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  <span>MMUST Digital Laptop Clearance System</span>
                </h1>
                <p className="text-xs text-blue-200 font-medium tracking-wider uppercase">
                  Technology for Development
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
                  <Bell className="w-4 h-4" />
                </button>
                {stolenAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-ping" />
                )}
              </div>

              <div className="flex items-center gap-2.5 pl-3 border-l border-white/20">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Admin Avatar"
                  className="w-8 h-8 rounded-full object-cover border border-white"
                />
                <div className="text-xs font-semibold">
                  <span>Admin • mmust_admin</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row flex-1 min-h-[640px]">
            {/* Sidebar Navigation - Image 5 */}
            <div className="w-full lg:w-60 bg-slate-50/80 border-r border-slate-200 p-4 flex flex-col justify-between shrink-0">
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 px-3">
                    DIGITAL CLEARANCE
                  </span>
                  <div className="mt-2 space-y-1">
                    <button
                      onClick={() => setActiveNav('dashboard')}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                        activeNav === 'dashboard'
                          ? 'bg-[#0060df] text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-200/60'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </button>

                    <button
                      onClick={() => setActiveNav('students')}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                        activeNav === 'students'
                          ? 'bg-[#0060df] text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-200/60'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span>Students</span>
                    </button>

                    <button
                      onClick={() => setActiveNav('laptops')}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                        activeNav === 'laptops'
                          ? 'bg-[#0060df] text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-200/60'
                      }`}
                    >
                      <LaptopIcon className="w-4 h-4" />
                      <span>Laptops</span>
                    </button>

                    <button
                      onClick={() => setActiveNav('gatelogs')}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                        activeNav === 'gatelogs'
                          ? 'bg-[#0060df] text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-200/60'
                      }`}
                    >
                      <ClipboardList className="w-4 h-4" />
                      <span>Gate Logs</span>
                    </button>

                    <button
                      onClick={() => setActiveNav('blacklist')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                        activeNav === 'blacklist'
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-red-50 hover:text-red-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <ShieldAlert className="w-4 h-4" />
                        <span>Blacklist</span>
                      </div>
                      {stolenAlerts > 0 && (
                        <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 text-[10px] font-black flex items-center justify-center">
                          {stolenAlerts}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* System Footer Navigation */}
              <div className="pt-6 border-t border-slate-200 space-y-1">
                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 px-3 block mb-1">
                  System
                </span>
                <button className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-200/60">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-200/60">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 bg-slate-50/50 space-y-6 overflow-x-auto">
              {activeNav === 'dashboard' && (
                <>
                  {/* Dashboard Overview Title - Image 5 */}
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      Dashboard Overview
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Welcome back, Admin. Here's the system overview for today — 23 Sep 2026
                    </p>
                  </div>

                  {/* 4 Summary Cards - Pixel Matched to Image 5 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {/* Card 1: Total Students */}
                    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                          <Users className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="text-3xl font-black text-slate-900 tracking-tight">
                          342
                        </div>
                        <div className="text-xs font-bold text-slate-600 mt-0.5">Total Students</div>
                        <div className="text-[11px] font-bold text-emerald-600 mt-2 flex items-center gap-1">
                          <span>▲ +12 from yesterday</span>
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Total Laptops */}
                    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-[#0284c7] text-white flex items-center justify-center shadow-xs">
                          <LaptopIcon className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="text-3xl font-black text-slate-900 tracking-tight">
                          489
                        </div>
                        <div className="text-xs font-bold text-slate-600 mt-0.5">Total Laptops</div>
                        <div className="text-[11px] font-bold text-emerald-600 mt-2 flex items-center gap-1">
                          <span>▲ +5 new registered</span>
                        </div>
                      </div>
                    </div>

                    {/* Card 3: Today's Entry */}
                    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-[#0b4f9c] text-white flex items-center justify-center shadow-xs">
                          <ClipboardList className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="text-3xl font-black text-slate-900 tracking-tight">
                          56
                        </div>
                        <div className="text-xs font-bold text-slate-600 mt-0.5">Today's Entry</div>
                        <div className="text-[11px] font-bold text-slate-500 mt-2 flex items-center gap-1">
                          <span>🕒 Updated just now</span>
                        </div>
                      </div>
                    </div>

                    {/* Card 4: Stolen Alerts */}
                    <div className="bg-white rounded-3xl p-5 border border-red-200/90 shadow-xs flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-xs animate-pulse">
                          <ShieldAlert className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="text-3xl font-black text-red-600 tracking-tight">
                          {stolenAlerts}
                        </div>
                        <div className="text-xs font-bold text-slate-600 mt-0.5">Stolen Alerts</div>
                        <div className="text-[11px] font-bold text-red-600 mt-2 flex items-center gap-1">
                          <span>⚠️ Requires attention</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Gate Logs Table Card - Pixel Matched to Image 5 */}
                  <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5">
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">
                        Recent Gate Logs
                      </h3>

                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                          onClick={handleExportCSV}
                          className="bg-[#0060df] hover:bg-[#0050c0] text-white px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Export CSV</span>
                        </button>

                        <div className="relative flex-1 sm:w-56">
                          <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs focus:ring-2 focus:ring-blue-500 font-medium"
                          />
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3" />
                        </div>
                      </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-100/80 text-slate-600 font-bold border-b border-slate-200">
                            <th className="py-3 px-4 rounded-l-xl">Time</th>
                            <th className="py-3 px-4">Student</th>
                            <th className="py-3 px-4">Laptop Model</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 rounded-r-xl">Guard</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredLogs.map((log) => (
                            <tr key={log.log_id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-3.5 px-4 font-mono font-medium text-slate-600">
                                {log.timestamp}
                              </td>

                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={log.student_photo}
                                    alt={log.student_name}
                                    className="w-7 h-7 rounded-full object-cover border border-slate-200"
                                  />
                                  <span className="font-semibold text-slate-800">
                                    {log.student_name} • <span className="font-mono text-slate-500">{log.student_reg_no}</span>
                                  </span>
                                </div>
                              </td>

                              <td className="py-3.5 px-4 font-medium text-slate-700">
                                <span>{log.laptop_model}</span>
                                <span className="text-slate-400 font-mono ml-1.5">• SN: {log.serial_no}</span>
                              </td>

                              <td className="py-3.5 px-4">
                                {log.status === 'Cleared' ? (
                                  <span className="inline-flex items-center gap-1 bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-md shadow-2xs">
                                    ✓ Cleared
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 bg-red-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-md shadow-2xs animate-pulse">
                                    ⚠️ Stolen
                                  </span>
                                )}
                              </td>

                              <td className="py-3.5 px-4 font-semibold text-slate-600">
                                {log.guard_name}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination matching Image 5 */}
                    <div className="flex flex-col sm:flex-row items-center justify-between pt-5 mt-2 border-t border-slate-100 text-xs text-slate-500 gap-3">
                      <div>
                        Showing {filteredLogs.length} of 56 entries • Page 1 of 12
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium">
                          &lt; Prev
                        </button>
                        <button className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold">
                          1
                        </button>
                        <button className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium">
                          2
                        </button>
                        <button className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium">
                          3
                        </button>
                        <span className="px-1 text-slate-400">...</span>
                        <button className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium">
                          Next &gt;
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Laptops & Blacklist View */}
              {(activeNav === 'laptops' || activeNav === 'blacklist') && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        {activeNav === 'blacklist' ? 'Blacklisted & Flagged Laptops' : 'Registered Campus Laptops'}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {activeNav === 'blacklist'
                          ? 'Devices flagged as stolen will sound a security siren when scanned at any gate.'
                          : 'Complete laptop inventory registered by MMUST students.'}
                      </p>
                    </div>

                    <button
                      onClick={() => setShowBlacklistModal(true)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Blacklist Serial No</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {laptops
                      .filter((l) => activeNav !== 'blacklist' || l.status === 'STOLEN' || l.status === 'BLACKLISTED')
                      .map((laptop) => (
                        <div
                          key={laptop.laptop_id}
                          className={`rounded-2xl border p-4 transition-all ${
                            laptop.status === 'STOLEN'
                              ? 'border-red-300 bg-red-50/40'
                              : 'border-slate-200 bg-white hover:border-blue-200'
                          }`}
                        >
                          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <div>
                              <h4 className="font-bold text-slate-900 text-sm">{laptop.model}</h4>
                              <p className="text-xs font-mono text-slate-500">S/N: {laptop.serial_no}</p>
                            </div>
                            <span
                              className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                                laptop.status === 'STOLEN'
                                  ? 'bg-red-600 text-white animate-pulse'
                                  : 'bg-emerald-600 text-white'
                              }`}
                            >
                              {laptop.status}
                            </span>
                          </div>

                          <div className="py-2.5 text-xs space-y-1 text-slate-600">
                            <p><strong>Owner:</strong> {laptop.student_name} ({laptop.student_reg_no})</p>
                            <p><strong>Registered:</strong> {laptop.registered_at}</p>
                            {laptop.stolen_reason && (
                              <p className="text-red-700 font-semibold bg-red-100/80 p-2 rounded-lg mt-1 text-[11px]">
                                ⚠️ {laptop.stolen_reason}
                              </p>
                            )}
                          </div>

                          <div className="pt-2 flex justify-end gap-2">
                            {laptop.status === 'STOLEN' ? (
                              <button
                                onClick={() => onToggleBlacklist(laptop.laptop_id, false)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-xl font-bold"
                              >
                                Clear &amp; Whitelist
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedLaptopForBlacklist(laptop.laptop_id);
                                  setShowBlacklistModal(true);
                                }}
                                className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs px-3 py-1.5 rounded-xl font-bold"
                              >
                                Flag as Stolen
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Students Directory View */}
              {activeNav === 'students' && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6">
                  <h3 className="text-lg font-black text-slate-900 mb-1">MMUST Enrolled Students</h3>
                  <p className="text-xs text-slate-500 mb-4">Students registered in the Digital Laptop Clearance portal.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {students.map((st) => (
                      <div key={st.reg_no} className="border border-slate-200 rounded-2xl p-4 flex items-center gap-3 hover:shadow-sm">
                        <img src={st.photo_url} alt={st.name} className="w-12 h-12 rounded-full object-cover border-2 border-blue-100" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 text-xs truncate">{st.name}</h4>
                          <p className="text-[11px] font-mono font-medium text-blue-700">{st.reg_no}</p>
                          <p className="text-[10px] text-slate-500 truncate">{st.course}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gate Logs View */}
              {activeNav === 'gatelogs' && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-black text-slate-900">All Clearance Logs</h3>
                    <button
                      onClick={handleExportCSV}
                      className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download CSV</span>
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100 text-xs">
                    {gateLogs.map((log) => (
                      <div key={log.log_id} className="py-3 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900">{log.student_name} ({log.student_reg_no})</p>
                          <p className="text-slate-500">{log.laptop_model} • {log.serial_no} • {log.gate_location}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.status === 'Cleared' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {log.status}
                          </span>
                          <p className="text-slate-400 font-mono text-[10px] mt-0.5">{log.date} {log.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Blacklist Device */}
      {showBlacklistModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-red-200">
            <div className="flex items-center gap-2 text-red-600 pb-3 border-b border-red-100">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="font-extrabold text-base">Blacklist Laptop Serial Number</h3>
            </div>

            <form onSubmit={handleApplyBlacklist} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">
                  Select Registered Laptop
                </label>
                <select
                  value={selectedLaptopForBlacklist}
                  onChange={(e) => setSelectedLaptopForBlacklist(e.target.value)}
                  required
                  className="w-full border border-slate-300 rounded-xl p-2.5 bg-slate-50 font-medium"
                >
                  <option value="">-- Choose Device --</option>
                  {laptops.map((l) => (
                    <option key={l.laptop_id} value={l.laptop_id}>
                      {l.model} (S/N: {l.serial_no}) - Owner: {l.student_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1">
                  Police Occurrence Book (OB) Number / Report Reason
                </label>
                <textarea
                  value={blacklistReason}
                  onChange={(e) => setBlacklistReason(e.target.value)}
                  placeholder="e.g. Reported stolen in Hostel Hall 3. MMUST Police Post OB/14/09/2026..."
                  required
                  rows={3}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-red-500 font-medium"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowBlacklistModal(false)}
                  className="w-1/2 py-2.5 rounded-xl font-semibold bg-slate-100 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-md"
                >
                  Confirm Blacklist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
