export interface Building {
  id: string;
  name: string;
  code: string;
  description: string;
  floors: number;
  totalClassrooms: number;
  coordinates: { x: number; y: number }; // Relative percentage for map plotting
}

export type ClassroomCategory = 'Lecture Hall' | 'Computer Lab' | 'Seminar Hall' | 'Workshop' | 'Drawing Hall';

export interface Classroom {
  id: string;
  name: string;
  buildingId: string;
  buildingName: string;
  floor: number;
  capacity: number;
  category: ClassroomCategory;
  equipment: string[];
  imageUrl: string;
  qrCodeUrl: string;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
}

export interface BookingRequest {
  id: string;
  staffId: string;
  staffName: string;
  subject: string;
  date: string;
  time: string;
  duration: number; // in hours
  strength: number;
  facilities: string[];
  preferredBuildingId: string;
  remarks: string;
  status: 'pending' | 'approved' | 'rejected';
  allocatedClassroomId?: string;
  allocatedClassroomName?: string;
  aiSuggested?: boolean;
  aiConfidence?: number; // percentage
  createdAt: string;
}

export interface TimetableSlot {
  id: string;
  classroomId: string;
  classroomName: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  timeSlot: string; // e.g. "09:00 AM - 10:00 AM"
  subject: string;
  teacher: string;
  department: string;
  batch: string;
  color: string; // Tailwind bg color class
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string; // ISO String or relative
}

export interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  buildingCode: string;
  staffCount: number;
  studentCount: number;
}
