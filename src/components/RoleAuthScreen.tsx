import React, { useState } from 'react';
import { Role, UserAccount, Student, Laptop, SecurityGuard } from '../types';
import { MMUSTLogo } from './MMUSTLogo';
import { 
  GraduationCap, 
  Shield, 
  ShieldAlert, 
  UserPlus, 
  LogIn, 
  CheckCircle2, 
  Laptop as LaptopIcon, 
  ArrowRight,
  Info,
  Lock,
  ArrowLeft,
  KeyRound,
  Check
} from 'lucide-react';

interface RoleAuthScreenProps {
  onLoginSuccess: (user: UserAccount) => void;
  onRegisterStudent: (student: Student, initialLaptop?: Laptop) => void;
  onRegisterGuard: (guard: SecurityGuard) => void;
  onExitToPhoneHome: () => void;
  existingStudents: Student[];
  existingGuards: SecurityGuard[];
}

export const RoleAuthScreen: React.FC<RoleAuthScreenProps> = ({
  onLoginSuccess,
  onRegisterStudent,
  onRegisterGuard,
  onExitToPhoneHome,
  existingStudents,
  existingGuards,
}) => {
  // Toggle between 'login' and 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  // Role decided by user
  const [selectedRole, setSelectedRole] = useState<Role>('student');

  // Registration feedback banner
  const [registrationNotice, setRegistrationNotice] = useState<string | null>(null);

  // Registered credentials saved in-memory for immediate login
  const [registeredAccounts, setRegisteredAccounts] = useState<Record<string, { role: Role; name: string }>>({});

  // Login form state
  const [loginId, setLoginId] = useState('CSC/2023/1124');
  const [loginPass, setLoginPass] = useState('password123');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Student Register State
  const [studentName, setStudentName] = useState('');
  const [studentRegNo, setStudentRegNo] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('+254 7');
  const [studentCourse, setStudentCourse] = useState('BSc. Computer Science');
  const [studentPassword, setStudentPassword] = useState('pass123');
  const [studentLaptopModel, setStudentLaptopModel] = useState('');
  const [studentLaptopSerial, setStudentLaptopSerial] = useState('');
  const [studentLaptopBrand, setStudentLaptopBrand] = useState('HP');

  // Guard Register State
  const [guardName, setGuardName] = useState('');
  const [guardBadgeId, setGuardBadgeId] = useState('');
  const [guardGate, setGuardGate] = useState('Main Gate A (Kakamega-Webuye Rd)');
  const [guardShift, setGuardShift] = useState<'Day' | 'Night'>('Day');
  const [guardPhone, setGuardPhone] = useState('+254 7');
  const [guardPin, setGuardPin] = useState('1234');

  // Admin Register State
  const [adminName, setAdminName] = useState('');
  const [adminStaffId, setAdminStaffId] = useState('');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [adminError, setAdminError] = useState<string | null>(null);

  // Switch role changes default login placeholder
  const handleRoleTabChange = (role: Role) => {
    setSelectedRole(role);
    setLoginError(null);
    if (role === 'student') setLoginId('CSC/2023/1124');
    if (role === 'guard') setLoginId('G204');
    if (role === 'admin') setLoginId('ADM-001');
  };

  // Handle User Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (selectedRole === 'student') {
      if (!studentName.trim() || !studentRegNo.trim()) return;

      const cleanReg = studentRegNo.trim().toUpperCase();
      const email = studentEmail.trim() || `${cleanReg.toLowerCase().replace(/[^a-z0-9]/g, '')}@student.mmust.ac.ke`;

      const newStudent: Student = {
        id: cleanReg,
        reg_no: cleanReg,
        name: studentName.trim(),
        email: email,
        phone: studentPhone.trim(),
        course: studentCourse,
        department: studentCourse.includes('Eng') ? 'Engineering' : 'Computer Science',
        year_of_study: 'Year 2',
        photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        id_number: '39102844',
      };

      let initialLaptop: Laptop | undefined;
      if (studentLaptopModel.trim() && studentLaptopSerial.trim()) {
        const lid = `LP-MMUST-${Math.floor(1000 + Math.random() * 9000)}`;
        const payload = JSON.stringify({
          v: 1,
          lid: lid,
          reg: cleanReg,
          name: newStudent.name,
          model: studentLaptopModel.trim(),
          sn: studentLaptopSerial.trim().toUpperCase(),
          sig: `MMUST-SEC-${Date.now().toString(36).toUpperCase()}`,
        });

        initialLaptop = {
          laptop_id: lid,
          student_reg_no: cleanReg,
          student_name: newStudent.name,
          student_photo: newStudent.photo_url,
          model: studentLaptopModel.trim(),
          brand: studentLaptopBrand,
          serial_no: studentLaptopSerial.trim().toUpperCase(),
          photo_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=500&q=80',
          qr_payload: payload,
          status: 'CLEARED',
          registered_at: new Date().toISOString().split('T')[0],
        };
      }

      onRegisterStudent(newStudent, initialLaptop);

      setRegisteredAccounts((prev) => ({
        ...prev,
        [cleanReg]: { role: 'student', name: newStudent.name },
      }));

      // Route to login with registered credentials pre-filled
      setRegistrationNotice(`Registration successful as Student! Please log in below.`);
      setLoginId(cleanReg);
      setAuthMode('login');

    } else if (selectedRole === 'guard') {
      if (!guardName.trim() || !guardBadgeId.trim()) return;

      const cleanBadge = guardBadgeId.trim().toUpperCase();
      const newGuard: SecurityGuard = {
        guard_id: cleanBadge,
        name: guardName.trim(),
        gate_assigned: guardGate,
        phone: guardPhone.trim(),
        shift: guardShift,
      };

      onRegisterGuard(newGuard);

      setRegisteredAccounts((prev) => ({
        ...prev,
        [cleanBadge]: { role: 'guard', name: newGuard.name },
      }));

      setRegistrationNotice(`Registration successful as Security Officer! Please log in below.`);
      setLoginId(cleanBadge);
      setAuthMode('login');

    } else if (selectedRole === 'admin') {
      if (adminPasscode !== 'MMUST-SEC-2026' && adminPasscode !== 'admin') {
        setAdminError('Invalid MMUST Admin Passcode. (Enter MMUST-SEC-2026)');
        return;
      }

      const cleanStaff = (adminStaffId.trim() || 'ADM-014').toUpperCase();
      const name = adminName.trim() || 'Chief Security Admin';

      setRegisteredAccounts((prev) => ({
        ...prev,
        [cleanStaff]: { role: 'admin', name },
      }));

      setRegistrationNotice(`Registration successful as Administrator! Please log in below.`);
      setLoginId(cleanStaff);
      setAuthMode('login');
    }
  };

  // Handle Login and Route to Role-Specific UI
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const inputId = loginId.trim().toUpperCase();

    // 1. Check if user is student
    if (selectedRole === 'student') {
      const student = existingStudents.find((s) => s.reg_no.toUpperCase() === inputId) ||
        (registeredAccounts[inputId]?.role === 'student'
          ? {
              id: inputId,
              reg_no: inputId,
              name: registeredAccounts[inputId].name,
              email: `${inputId.toLowerCase()}@student.mmust.ac.ke`,
              phone: '+254 700 000 000',
              course: 'BSc. Computer Science',
              department: 'Computer Science',
              year_of_study: 'Year 2',
              photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            }
          : null);

      if (!student) {
        // Fallback for demo testing
        const defaultStudent = existingStudents[0];
        onLoginSuccess({
          id: defaultStudent.reg_no,
          name: defaultStudent.name,
          email: defaultStudent.email,
          role: 'student',
          avatar_url: defaultStudent.photo_url,
          phone: defaultStudent.phone,
          reg_no: defaultStudent.reg_no,
          course: defaultStudent.course,
          department: defaultStudent.department,
        });
        return;
      }

      onLoginSuccess({
        id: student.reg_no,
        name: student.name,
        email: student.email,
        role: 'student',
        avatar_url: student.photo_url,
        phone: student.phone,
        reg_no: student.reg_no,
        course: student.course,
        department: student.department,
        id_number: student.id_number,
      });

    } else if (selectedRole === 'guard') {
      const guard = existingGuards.find((g) => g.guard_id.toUpperCase() === inputId) || {
        guard_id: inputId,
        name: registeredAccounts[inputId]?.name || 'Officer P. Otieno',
        gate_assigned: 'Main Gate A (Kakamega-Webuye Rd)',
        phone: '+254 711 992 001',
        shift: 'Day' as const,
      };

      onLoginSuccess({
        id: guard.guard_id,
        name: guard.name,
        email: `${guard.guard_id.toLowerCase()}@security.mmust.ac.ke`,
        role: 'guard',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        phone: guard.phone,
        badge_id: guard.guard_id,
        gate_assigned: guard.gate_assigned,
        shift: guard.shift,
      });

    } else if (selectedRole === 'admin') {
      onLoginSuccess({
        id: inputId || 'ADM-001',
        name: registeredAccounts[inputId]?.name || 'Chief Security Administrator',
        email: `${(inputId || 'admin').toLowerCase()}@mmust.ac.ke`,
        role: 'admin',
        avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        admin_id: inputId || 'ADM-001',
        title: 'Chief Security Officer',
      });
    }
  };

  return (
    <div className="w-full max-w-[390px] bg-slate-900 rounded-[48px] p-3 shadow-2xl ring-1 ring-slate-800 relative select-none">
      <div className="bg-slate-50 rounded-[40px] overflow-hidden min-h-[760px] flex flex-col text-slate-800 relative">
        {/* Top Phone Status Bar */}
        <div className="bg-[#0060df] text-white pt-2.5 px-6 pb-1 flex justify-between items-center text-[12px] font-semibold">
          <span>09:41</span>
          <div className="w-24 h-4 bg-black rounded-full mx-auto" />
          <div className="flex items-center gap-1.5 text-[11px]">
            <span>5G</span>
            <div className="w-4 h-2.5 border border-white rounded-xs p-0.5">
              <div className="w-full h-full bg-white rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Top App Header with MMUST Seal and Exit to Phone Button */}
        <div className="bg-[#0060df] text-white px-5 pt-2 pb-5 rounded-b-[30px] shadow-sm relative">
          {/* Back to Phone Homescreen */}
          <button
            onClick={onExitToPhoneHome}
            title="Exit to phone home screen"
            className="absolute top-2 left-4 text-white/80 hover:text-white flex items-center gap-1 text-[11px] font-semibold py-1 px-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Phone</span>
          </button>

          <div className="text-center pt-2">
            <div className="inline-block bg-white p-1 rounded-full shadow-md mb-1.5">
              <MMUSTLogo size={46} />
            </div>
            <h1 className="text-lg font-black tracking-tight text-white leading-tight">
              MMUST Digital Clearance
            </h1>
            <p className="text-blue-100 text-[11px] font-semibold">
              Masinde Muliro University of Science &amp; Technology
            </p>
          </div>
        </div>

        {/* Role Decision Selector Tabs */}
        <div className="px-5 pt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Select Your Role:
            </span>
            <span className="text-[10px] font-bold text-blue-600">
              Dictates UI &amp; Access
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {/* Student Role */}
            <button
              type="button"
              onClick={() => handleRoleTabChange('student')}
              className={`p-2 rounded-2xl flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                selectedRole === 'student'
                  ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100/60'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                  selectedRole === 'student' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-black leading-none">Student</span>
            </button>

            {/* Guard Role */}
            <button
              type="button"
              onClick={() => handleRoleTabChange('guard')}
              className={`p-2 rounded-2xl flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                selectedRole === 'guard'
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100/60'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                  selectedRole === 'guard' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-black leading-none">Guard</span>
            </button>

            {/* Admin Role */}
            <button
              type="button"
              onClick={() => handleRoleTabChange('admin')}
              className={`p-2 rounded-2xl flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                selectedRole === 'admin'
                  ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100/60'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                  selectedRole === 'admin' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-black leading-none">Admin</span>
            </button>
          </div>

          {/* Role UI Scope Hint */}
          <div className="mt-2 bg-blue-50/80 border border-blue-200/80 rounded-xl p-2 flex items-center gap-2 text-[10px] text-blue-900 font-medium">
            <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>
              {selectedRole === 'student' && 'Directs to: "My Laptops" QR Clearance Pass UI.'}
              {selectedRole === 'guard' && 'Directs to: Camera Scanner & Gate Clearance UI.'}
              {selectedRole === 'admin' && 'Directs to: Clearance Logs & Blacklist Dashboard UI.'}
            </span>
          </div>
        </div>

        {/* Tab Toggle: Login vs Register */}
        <div className="px-5 pt-3">
          <div className="flex bg-slate-200/80 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setRegistrationNotice(null);
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                authMode === 'login' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setRegistrationNotice(null);
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                authMode === 'register' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Account</span>
            </button>
          </div>
        </div>

        {/* Success Notice if user just registered */}
        {registrationNotice && (
          <div className="mx-5 mt-2 bg-emerald-50 border border-emerald-300 text-emerald-800 px-3 py-2 rounded-xl text-[11px] font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{registrationNotice}</span>
          </div>
        )}

        {/* Content Body: Forms */}
        <div className="flex-1 px-5 pt-2 pb-6 overflow-y-auto">
          {authMode === 'login' ? (
            /* ================= LOGIN FORM ================= */
            <form onSubmit={handleLoginSubmit} className="space-y-3 pt-1 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                  {selectedRole === 'student' && 'Student Registration No. *'}
                  {selectedRole === 'guard' && 'Officer Badge / Service ID *'}
                  {selectedRole === 'admin' && 'Staff ID / Admin Username *'}
                </label>
                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder={
                    selectedRole === 'student' ? 'e.g. CSC/2023/1124' : selectedRole === 'guard' ? 'e.g. G204' : 'e.g. ADM-001'
                  }
                  required
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                  {selectedRole === 'guard' ? 'Officer Security PIN' : 'Password'}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
                </div>
              </div>

              {loginError && (
                <div className="text-[11px] text-red-600 font-semibold bg-red-50 p-2 rounded-xl border border-red-200">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className={`w-full mt-2 py-3 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer text-white transition-all ${
                  selectedRole === 'student'
                    ? 'bg-[#0060df] hover:bg-[#0050c0]'
                    : selectedRole === 'guard'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                <span>
                  Log In as {selectedRole === 'student' ? 'Student' : selectedRole === 'guard' ? 'Security Guard' : 'Admin'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick Preset Logins */}
              <div className="pt-3 border-t border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  1-Tap Instant Sign-In:
                </span>
                <div className="space-y-1.5">
                  {selectedRole === 'student' && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginId('CSC/2023/1124');
                          onLoginSuccess({
                            id: 'CSC/2023/1124',
                            name: 'John Mukono',
                            email: 'jmukono@student.mmust.ac.ke',
                            role: 'student',
                            avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
                            reg_no: 'CSC/2023/1124',
                            course: 'BSc. Computer Science',
                          });
                        }}
                        className="w-full text-left bg-white hover:bg-blue-50 border border-slate-200 px-3 py-2 rounded-xl text-[11px] flex items-center justify-between font-semibold"
                      >
                        <span>John Mukono (CSC/2023/1124)</span>
                        <span className="text-blue-600 text-[10px]">Enter UI &rarr;</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginId('CSC/2022/0879');
                          onLoginSuccess({
                            id: 'CSC/2022/0879',
                            name: 'Sarah Otieno',
                            email: 'sotieno@student.mmust.ac.ke',
                            role: 'student',
                            avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
                            reg_no: 'CSC/2022/0879',
                            course: 'BSc. Computer Science',
                          });
                        }}
                        className="w-full text-left bg-white hover:bg-blue-50 border border-slate-200 px-3 py-2 rounded-xl text-[11px] flex items-center justify-between font-semibold"
                      >
                        <span>Sarah Otieno (CSC/2022/0879)</span>
                        <span className="text-blue-600 text-[10px]">Enter UI &rarr;</span>
                      </button>
                    </>
                  )}

                  {selectedRole === 'guard' && (
                    <button
                      type="button"
                      onClick={() => {
                        onLoginSuccess({
                          id: 'G204',
                          name: 'P. Otieno',
                          email: 'g204@security.mmust.ac.ke',
                          role: 'guard',
                          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                          badge_id: 'G204',
                          gate_assigned: 'Main University Gate A',
                          shift: 'Day',
                        });
                      }}
                      className="w-full text-left bg-white hover:bg-emerald-50 border border-slate-200 px-3 py-2 rounded-xl text-[11px] flex items-center justify-between font-semibold"
                    >
                      <span>Officer P. Otieno (Badge: G204 - Gate A)</span>
                      <span className="text-emerald-700 text-[10px]">Launch Scanner &rarr;</span>
                    </button>
                  )}

                  {selectedRole === 'admin' && (
                    <button
                      type="button"
                      onClick={() => {
                        onLoginSuccess({
                          id: 'ADM-001',
                          name: 'Chief Security Officer',
                          email: 'admin@mmust.ac.ke',
                          role: 'admin',
                          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                          admin_id: 'ADM-001',
                          title: 'Chief Security Officer',
                        });
                      }}
                      className="w-full text-left bg-white hover:bg-indigo-50 border border-slate-200 px-3 py-2 rounded-xl text-[11px] flex items-center justify-between font-semibold"
                    >
                      <span>Chief Security Officer (ADM-001)</span>
                      <span className="text-indigo-700 text-[10px]">Open Dashboard &rarr;</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="text-blue-600 font-bold text-[11px] hover:underline"
                >
                  Don't have an account? Register as {selectedRole}
                </button>
              </div>
            </form>
          ) : (
            /* ================= REGISTRATION FORM ================= */
            <form onSubmit={handleRegisterSubmit} className="space-y-3 pt-1 text-xs">
              {/* STUDENT REGISTRATION */}
              {selectedRole === 'student' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                      Student Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. John Mukono"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      required
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                        Reg Number *
                      </label>
                      <input
                        type="text"
                        placeholder="CSC/2024/0981"
                        value={studentRegNo}
                        onChange={(e) => setStudentRegNo(e.target.value)}
                        required
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono uppercase font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                        Program
                      </label>
                      <select
                        value={studentCourse}
                        onChange={(e) => setStudentCourse(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-2 py-2 text-xs font-medium"
                      >
                        <option value="BSc. Computer Science">Computer Sci</option>
                        <option value="BSc. Information Technology">Info Tech</option>
                        <option value="BSc. Engineering">Engineering</option>
                      </select>
                    </div>
                  </div>

                  {/* Laptop Details Card */}
                  <div className="bg-white border border-blue-200 rounded-2xl p-3 space-y-2">
                    <div className="flex items-center gap-1.5 text-blue-900 font-bold text-[11px]">
                      <LaptopIcon className="w-3.5 h-3.5 text-blue-600" />
                      <span>Register Laptop for Clearance Pass</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Brand</label>
                        <select
                          value={studentLaptopBrand}
                          onChange={(e) => setStudentLaptopBrand(e.target.value)}
                          className="w-full border border-slate-300 rounded-lg px-2 py-1 text-xs bg-slate-50"
                        >
                          <option value="HP">HP</option>
                          <option value="Lenovo">Lenovo</option>
                          <option value="Dell">Dell</option>
                          <option value="Apple">Apple</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Model</label>
                        <input
                          type="text"
                          placeholder="HP ProBook 450 G9"
                          value={studentLaptopModel}
                          onChange={(e) => setStudentLaptopModel(e.target.value)}
                          className="w-full border border-slate-300 rounded-lg px-2 py-1 text-xs font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">
                        Serial Number (S/N) *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. HP1234509876"
                        value={studentLaptopSerial}
                        onChange={(e) => setStudentLaptopSerial(e.target.value)}
                        required
                        className="w-full border border-slate-300 rounded-lg px-2 py-1 text-xs font-mono font-bold uppercase"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0060df] hover:bg-[#0050c0] text-white py-3 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Complete Registration &rarr; Proceed to Login</span>
                  </button>
                </>
              )}

              {/* GUARD REGISTRATION */}
              {selectedRole === 'guard' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                      Officer Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Officer P. Otieno"
                      value={guardName}
                      onChange={(e) => setGuardName(e.target.value)}
                      required
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                        Badge ID *
                      </label>
                      <input
                        type="text"
                        placeholder="G-204"
                        value={guardBadgeId}
                        onChange={(e) => setGuardBadgeId(e.target.value)}
                        required
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono uppercase font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                        Shift
                      </label>
                      <select
                        value={guardShift}
                        onChange={(e) => setGuardShift(e.target.value as 'Day' | 'Night')}
                        className="w-full bg-white border border-slate-300 rounded-xl px-2 py-2 text-xs font-medium"
                      >
                        <option value="Day">Day Shift</option>
                        <option value="Night">Night Shift</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                      Gate Assignment
                    </label>
                    <select
                      value={guardGate}
                      onChange={(e) => setGuardGate(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium"
                    >
                      <option value="Main Gate A (Kakamega-Webuye Rd)">Main Gate A</option>
                      <option value="Engineering Complex Gate B">Engineering Gate B</option>
                      <option value="Rosterman Gate C">Rosterman Gate C</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Complete Registration &rarr; Proceed to Login</span>
                  </button>
                </>
              )}

              {/* ADMIN REGISTRATION */}
              {selectedRole === 'admin' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                      Admin Staff Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Chief Security Officer"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      required
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                      Staff ID (e.g. ADM-014)
                    </label>
                    <input
                      type="text"
                      placeholder="ADM-014"
                      value={adminStaffId}
                      onChange={(e) => setAdminStaffId(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono uppercase font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                      Master Authorization Passcode *
                    </label>
                    <input
                      type="password"
                      placeholder="MMUST-SEC-2026"
                      value={adminPasscode}
                      onChange={(e) => setAdminPasscode(e.target.value)}
                      required
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                    />
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Demo Code: <code className="font-bold text-blue-600">MMUST-SEC-2026</code>
                    </span>
                  </div>

                  {adminError && (
                    <div className="text-[11px] text-red-600 font-semibold bg-red-50 p-2 rounded-xl border border-red-200">
                      {adminError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Complete Registration &rarr; Proceed to Login</span>
                  </button>
                </>
              )}

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-blue-600 font-bold text-[11px] hover:underline"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
