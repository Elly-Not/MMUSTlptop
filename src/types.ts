export type Role = 'student' | 'guard' | 'admin';

export type LaptopStatus = 'ACTIVE' | 'CLEARED' | 'STOLEN' | 'PENDING' | 'BLACKLISTED';

export interface UserAccount {
  id: string; // Reg no, Guard ID, or Admin ID
  name: string;
  email: string;
  role: Role;
  avatar_url: string;
  phone?: string;
  // Student-specific
  reg_no?: string;
  course?: string;
  department?: string;
  id_number?: string;
  // Guard-specific
  badge_id?: string;
  gate_assigned?: string;
  shift?: 'Day' | 'Night';
  // Admin-specific
  admin_id?: string;
  title?: string;
}

export interface Student {
  id: string; // e.g. STU/2023/1124 or CSC/2023/1124
  reg_no: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  department: string;
  year_of_study: string;
  photo_url: string;
  id_number?: string;
}

export interface Laptop {
  laptop_id: string;
  student_reg_no: string;
  student_name: string;
  student_photo?: string;
  model: string;
  brand: string;
  serial_no: string;
  color?: string;
  photo_url: string;
  qr_payload: string;
  status: LaptopStatus;
  registered_at: string;
  last_cleared_at?: string;
  stolen_reported_at?: string;
  stolen_reason?: string;
}

export interface SecurityGuard {
  guard_id: string;
  name: string;
  gate_assigned: string; // Main Gate A, Engineering Gate B, Rosterman Gate C
  phone: string;
  shift: 'Day' | 'Night';
}

export interface GateLog {
  log_id: string;
  laptop_id: string;
  student_reg_no: string;
  student_name: string;
  student_photo: string;
  laptop_model: string;
  serial_no: string;
  guard_id: string;
  guard_name: string;
  gate_location: string;
  action: 'EXIT' | 'ENTRY' | 'DENIED' | 'BLACKLIST_INTERCEPT';
  status: 'Cleared' | 'Stolen' | 'Pending' | 'Denied';
  timestamp: string;
  date: string;
  offline_cached?: boolean;
}
