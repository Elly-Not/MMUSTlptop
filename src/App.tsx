import React, { useState } from 'react';
import { Role, Student, Laptop, GateLog, SecurityGuard, UserAccount } from './types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_LAPTOPS, 
  INITIAL_GUARDS, 
  INITIAL_GATE_LOGS 
} from './data/mockData';
import { MMUSTLogo } from './components/MMUSTLogo';
import { PhoneHomeScreen } from './components/PhoneHomeScreen';
import { SplashScreen } from './components/SplashScreen';
import { RoleAuthScreen } from './components/RoleAuthScreen';
import { StudentPortal } from './components/StudentPortal';
import { GuardScanner } from './components/GuardScanner';
import { AdminDashboard } from './components/AdminDashboard';
import { ArchitectureView } from './components/ArchitectureView';
import { CodebaseExplorer } from './components/CodebaseExplorer';
import { 
  GraduationCap, 
  Shield, 
  ShieldAlert, 
  LogOut, 
  Smartphone, 
  Layers, 
  FileCode2, 
  RefreshCw,
  Home,
  CheckCircle2,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function App() {
  // Mobile Lifecycle Stages:
  // 'phone_home' -> 'splash' -> 'landing_auth' -> 'authenticated_role_ui'
  const [mobileStage, setMobileStage] = useState<'phone_home' | 'splash' | 'landing_auth' | 'authenticated_role_ui'>('phone_home');

  // Active Authenticated User
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // System Database State
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [laptops, setLaptops] = useState<Laptop[]>(INITIAL_LAPTOPS);
  const [guards, setGuards] = useState<SecurityGuard[]>(INITIAL_GUARDS);
  const [gateLogs, setGateLogs] = useState<GateLog[]>(INITIAL_GATE_LOGS);
  const [offlineQueue, setOfflineQueue] = useState<Omit<GateLog, 'log_id'>[]>([]);

  // Navigation mode: 'mobile_sim' | 'architecture' | 'codebase'
  const [currentTab, setCurrentTab] = useState<'mobile_sim' | 'architecture' | 'codebase'>('mobile_sim');

  // Registration handler for Students
  const handleRegisterStudent = (newStudent: Student, initialLaptop?: Laptop) => {
    setStudents((prev) => [newStudent, ...prev]);
    if (initialLaptop) {
      setLaptops((prev) => [initialLaptop, ...prev]);
    }
  };

  // Registration handler for Guards
  const handleRegisterGuard = (newGuard: SecurityGuard) => {
    setGuards((prev) => [newGuard, ...prev]);
  };

  // Student Laptop Registration inside Student Portal
  const handleRegisterLaptop = (newLaptop: Laptop) => {
    setLaptops((prev) => [newLaptop, ...prev]);
  };

  // Blacklist Laptop Toggle
  const handleToggleBlacklist = (laptopId: string, isStolen: boolean, reason?: string) => {
    setLaptops((prev) =>
      prev.map((l) => {
        if (l.laptop_id === laptopId) {
          return {
            ...l,
            status: isStolen ? 'STOLEN' : 'CLEARED',
            stolen_reported_at: isStolen ? new Date().toISOString() : undefined,
            stolen_reason: isStolen ? reason || 'Reported stolen at MMUST Police Post' : undefined,
          };
        }
        return l;
      })
    );
  };

  // Guard Gate Action Logging
  const handleLogGateAction = (newLog: Omit<GateLog, 'log_id'>) => {
    if (newLog.offline_cached) {
      setOfflineQueue((prev) => [...prev, newLog]);
    }

    const created: GateLog = {
      ...newLog,
      log_id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setGateLogs((prev) => [created, ...prev]);
  };

  // Offline Sync
  const handleSyncOfflineLogs = () => {
    setOfflineQueue([]);
  };

  // User Logs in -> direct strictly to their specific role UI
  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setMobileStage('authenticated_role_ui');
  };

  // User Logs out -> return to landing login/registration page
  const handleLogout = () => {
    setCurrentUser(null);
    setMobileStage('landing_auth');
  };

  // Lookup active student object if logged in as student
  const activeStudentObject = currentUser && currentUser.role === 'student'
    ? students.find((s) => s.reg_no === currentUser.reg_no) || {
        id: currentUser.id,
        reg_no: currentUser.reg_no || currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone || '+254 700 000 000',
        course: currentUser.course || 'BSc. Computer Science',
        department: currentUser.department || 'Computer Science',
        year_of_study: 'Year 2',
        photo_url: currentUser.avatar_url,
      }
    : students[0];

  // Lookup active guard object if logged in as guard
  const activeGuardObject = currentUser && currentUser.role === 'guard'
    ? guards.find((g) => g.guard_id === currentUser.id) || {
        guard_id: currentUser.id,
        name: currentUser.name,
        gate_assigned: currentUser.gate_assigned || 'Main Gate A',
        phone: currentUser.phone || '+254 711 000 000',
        shift: currentUser.shift || 'Day',
      }
    : guards[0];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top University Application Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* MMUST Brand Emblem */}
          <div className="flex items-center gap-3">
            <MMUSTLogo size={42} showText={true} />
            <div className="hidden lg:block pl-3 border-l border-slate-200 text-left">
              <span className="text-[11px] font-bold text-slate-500 block">Mobile App Lifecycle Simulator</span>
              <span className="text-[10px] text-blue-700 font-semibold">Department of Computer Science</span>
            </div>
          </div>

          {/* Module Switcher Tabs */}
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
              <button
                onClick={() => setCurrentTab('mobile_sim')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentTab === 'mobile_sim'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile App Flow</span>
              </button>

              <button
                onClick={() => setCurrentTab('architecture')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentTab === 'architecture'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Architecture</span>
              </button>

              <button
                onClick={() => setCurrentTab('codebase')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentTab === 'codebase'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5" />
                <span>Codebase Hub</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col items-center">
        {currentTab === 'architecture' && <ArchitectureView />}

        {currentTab === 'codebase' && <CodebaseExplorer />}

        {currentTab === 'mobile_sim' && (
          <div className="w-full flex flex-col items-center">
            {/* Interactive Flow Step Indicator Bar */}
            <div className="w-full max-w-lg mb-4 bg-white/95 backdrop-blur border border-slate-200 rounded-2xl p-2.5 shadow-xs flex items-center justify-between text-xs overflow-x-auto gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setCurrentUser(null);
                    setMobileStage('phone_home');
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                    mobileStage === 'phone_home'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Home className="w-3 h-3" />
                  <span>1. Phone Home</span>
                </button>

                <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

                <button
                  onClick={() => {
                    setCurrentUser(null);
                    setMobileStage('landing_auth');
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                    mobileStage === 'landing_auth'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>2. Login / Register</span>
                </button>

                <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

                <span
                  className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 ${
                    mobileStage === 'authenticated_role_ui'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-400'
                  }`}
                >
                  <span>3. Role-Specific UI</span>
                  {currentUser && (
                    <span className="text-[10px] uppercase font-mono bg-white/20 px-1 rounded-xs">
                      {currentUser.role}
                    </span>
                  )}
                </span>
              </div>

              {mobileStage === 'authenticated_role_ui' && (
                <button
                  onClick={handleLogout}
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Log Out</span>
                </button>
              )}
            </div>

            {/* STAGE 1: PHONE HOMESCREEN WITH INSTALLED MMUST APP ICON */}
            {mobileStage === 'phone_home' && (
              <PhoneHomeScreen
                onLaunchApp={() => setMobileStage('splash')}
              />
            )}

            {/* STAGE 2: SPLASH SCREEN (Shown on tapping app icon) */}
            {mobileStage === 'splash' && (
              <SplashScreen
                onComplete={() => setMobileStage('landing_auth')}
              />
            )}

            {/* STAGE 3: LOGIN / REGISTRATION LANDING PAGE (Roles decided here) */}
            {mobileStage === 'landing_auth' && (
              <RoleAuthScreen
                onLoginSuccess={handleLoginSuccess}
                onRegisterStudent={handleRegisterStudent}
                onRegisterGuard={handleRegisterGuard}
                onExitToPhoneHome={() => setMobileStage('phone_home')}
                existingStudents={students}
                existingGuards={guards}
              />
            )}

            {/* STAGE 4: STRICTLY DIRECTED TO ROLE-SPECIFIC UI UPON LOGIN */}
            {mobileStage === 'authenticated_role_ui' && currentUser && (
              <div className="w-full flex flex-col items-center">
                {/* Active Role Control Bar */}
                <div className="w-full max-w-md mb-3 bg-white/95 backdrop-blur border border-slate-200 rounded-2xl p-3 shadow-xs flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={currentUser.avatar_url}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-full object-cover border border-blue-200"
                    />
                    <div>
                      <span className="font-extrabold text-slate-900 block leading-tight">
                        {currentUser.name}
                      </span>
                      <span
                        className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-xs inline-block ${
                          currentUser.role === 'student'
                            ? 'bg-blue-600 text-white'
                            : currentUser.role === 'guard'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-indigo-600 text-white'
                        }`}
                      >
                        Active Role: {currentUser.role}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleLogout}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>

                {/* 1. STUDENT ROLE UI -> "My Laptops" Clearance Pass UI */}
                {currentUser.role === 'student' && (
                  <StudentPortal
                    currentStudent={activeStudentObject}
                    allStudents={students}
                    laptops={laptops}
                    onSelectStudent={(st) => {
                      setCurrentUser({
                        ...currentUser,
                        id: st.reg_no,
                        name: st.name,
                        email: st.email,
                        reg_no: st.reg_no,
                        course: st.course,
                        avatar_url: st.photo_url,
                      });
                    }}
                    onRegisterLaptop={handleRegisterLaptop}
                    onReportStolen={(laptopId, reason) => handleToggleBlacklist(laptopId, true, reason)}
                  />
                )}

                {/* 2. GUARD ROLE UI -> Gate Scanner & Camera Clearance UI */}
                {currentUser.role === 'guard' && (
                  <GuardScanner
                    guard={activeGuardObject}
                    allLaptops={laptops}
                    allStudents={students}
                    onLogGateAction={handleLogGateAction}
                    pendingOfflineCount={offlineQueue.length}
                    onSyncOfflineLogs={handleSyncOfflineLogs}
                  />
                )}

                {/* 3. ADMIN ROLE UI -> Master Admin Dashboard UI */}
                {currentUser.role === 'admin' && (
                  <AdminDashboard
                    students={students}
                    laptops={laptops}
                    gateLogs={gateLogs}
                    onToggleBlacklist={handleToggleBlacklist}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* University Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-500">
        <p>
          Masinde Muliro University of Science and Technology (MMUST) • Kakamega, Kenya • ICT Security Department
        </p>
      </footer>
    </div>
  );
}
