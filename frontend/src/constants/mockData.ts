import type { Building, Classroom, BookingRequest, TimetableSlot, SystemNotification, Department } from '../types';

export const DEPARTMENTS: Department[] = [
  { id: 'dept-1', name: 'Computer Science & Engineering', code: 'CSE', head: 'Dr. A. Srinivasan', buildingCode: 'RAM', staffCount: 42, studentCount: 780 },
  { id: 'dept-2', name: 'Information Technology', code: 'IT', head: 'Dr. M. Priyadharshini', buildingCode: 'ARY', staffCount: 31, studentCount: 540 },
  { id: 'dept-3', name: 'Electronics & Communication', code: 'ECE', head: 'Dr. G. Rajesh', buildingCode: 'CVR', staffCount: 38, studentCount: 720 },
  { id: 'dept-4', name: 'Electrical & Electronics', code: 'EEE', head: 'Dr. K. Venkatesh', buildingCode: 'VIS', staffCount: 29, studentCount: 480 },
  { id: 'dept-5', name: 'Mechanical Engineering', code: 'MECH', head: 'Dr. S. Karthik', buildingCode: 'VIS', staffCount: 35, studentCount: 600 },
  { id: 'dept-6', name: 'Artificial Intelligence & Data Science', code: 'AIDS', head: 'Dr. P. Swaminathan', buildingCode: 'RAM', staffCount: 18, studentCount: 320 }
];

export const BUILDINGS: Building[] = [
  { id: 'bld-1', name: 'Ramanujan Block', code: 'RAM', description: 'Central IT, CSE & AI Labs', floors: 4, totalClassrooms: 12, coordinates: { x: 22, y: 35 } },
  { id: 'bld-2', name: 'CV Raman Block', code: 'CVR', description: 'ECE, Physics & Chemistry Labs', floors: 3, totalClassrooms: 9, coordinates: { x: 55, y: 25 } },
  { id: 'bld-3', name: 'Aryabhata Block', code: 'ARY', description: 'Mechanical, Civil & Administrative Wing', floors: 4, totalClassrooms: 15, coordinates: { x: 80, y: 45 } },
  { id: 'bld-4', name: 'Visvesvaraya Block', code: 'VIS', description: 'EEE, Mech Labs & Lecture Halls', floors: 3, totalClassrooms: 8, coordinates: { x: 35, y: 75 } },
  { id: 'bld-5', name: 'Dr. A.P.J. Abdul Kalam Library', code: 'LIB', description: 'Central Library & Seminar Center', floors: 2, totalClassrooms: 4, coordinates: { x: 62, y: 68 } }
];

export const CLASSROOMS: Classroom[] = [
  // Ramanujan Block Classrooms
  {
    id: 'room-101',
    name: 'RAM-101 (Lecture Hall)',
    buildingId: 'bld-1',
    buildingName: 'Ramanujan Block',
    floor: 1,
    capacity: 65,
    category: 'Lecture Hall',
    equipment: ['Projector', 'Wi-Fi', 'Smart Board', 'Audio System'],
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-RAM101',
    status: 'available'
  },
  {
    id: 'room-102',
    name: 'RAM-102 (AI Lab)',
    buildingId: 'bld-1',
    buildingName: 'Ramanujan Block',
    floor: 1,
    capacity: 45,
    category: 'Computer Lab',
    equipment: ['Computers', 'AC', 'Projector', 'Wi-Fi', 'Smart Board'],
    imageUrl: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-RAM102',
    status: 'occupied'
  },
  {
    id: 'room-201',
    name: 'RAM-201 (Lecture Hall)',
    buildingId: 'bld-1',
    buildingName: 'Ramanujan Block',
    floor: 2,
    capacity: 75,
    category: 'Lecture Hall',
    equipment: ['Projector', 'Wi-Fi', 'Audio System'],
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=60',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-RAM201',
    status: 'available'
  },
  {
    id: 'room-202',
    name: 'RAM-202 (IoT Lab)',
    buildingId: 'bld-1',
    buildingName: 'Ramanujan Block',
    floor: 2,
    capacity: 40,
    category: 'Computer Lab',
    equipment: ['Computers', 'AC', 'Projector', 'Wi-Fi'],
    imageUrl: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&auto=format&fit=crop&q=60',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-RAM202',
    status: 'maintenance'
  },
  {
    id: 'room-301',
    name: 'RAM-301 (VCS Hall)',
    buildingId: 'bld-1',
    buildingName: 'Ramanujan Block',
    floor: 3,
    capacity: 120,
    category: 'Seminar Hall',
    equipment: ['Projector', 'AC', 'Wi-Fi', 'Smart Board', 'Audio System', 'Microphones'],
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=60',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-RAM301',
    status: 'available'
  },

  // CV Raman Block Classrooms
  {
    id: 'room-cvr-101',
    name: 'CVR-101 (Physics Lab)',
    buildingId: 'bld-2',
    buildingName: 'CV Raman Block',
    floor: 1,
    capacity: 35,
    category: 'Workshop',
    equipment: ['Projector', 'Wi-Fi', 'Audio System'],
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?w=600&auto=format&fit=crop&q=60',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-CVR101',
    status: 'occupied'
  },
  {
    id: 'room-cvr-201',
    name: 'CVR-201 (Lecture Hall)',
    buildingId: 'bld-2',
    buildingName: 'CV Raman Block',
    floor: 2,
    capacity: 60,
    category: 'Lecture Hall',
    equipment: ['Projector', 'Wi-Fi'],
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-CVR201',
    status: 'available'
  },
  {
    id: 'room-cvr-301',
    name: 'CVR-301 (Seminar Hall)',
    buildingId: 'bld-2',
    buildingName: 'CV Raman Block',
    floor: 3,
    capacity: 90,
    category: 'Seminar Hall',
    equipment: ['Projector', 'AC', 'Wi-Fi', 'Audio System'],
    imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&auto=format&fit=crop&q=60',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-CVR301',
    status: 'available'
  },

  // Aryabhata Block Classrooms
  {
    id: 'room-ary-101',
    name: 'ARY-101 (Lecture Hall)',
    buildingId: 'bld-3',
    buildingName: 'Aryabhata Block',
    floor: 1,
    capacity: 80,
    category: 'Lecture Hall',
    equipment: ['Projector', 'Wi-Fi', 'Audio System', 'Smart Board'],
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=60',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-ARY101',
    status: 'available'
  },
  {
    id: 'room-ary-201',
    name: 'ARY-201 (CAD/CAM Lab)',
    buildingId: 'bld-3',
    buildingName: 'Aryabhata Block',
    floor: 2,
    capacity: 50,
    category: 'Computer Lab',
    equipment: ['Computers', 'AC', 'Projector', 'Wi-Fi', 'Smart Board'],
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=60',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-ARY201',
    status: 'occupied'
  },
  {
    id: 'room-ary-301',
    name: 'ARY-301 (Drawing Hall)',
    buildingId: 'bld-3',
    buildingName: 'Aryabhata Block',
    floor: 3,
    capacity: 70,
    category: 'Drawing Hall',
    equipment: ['Projector', 'Wi-Fi', 'Audio System'],
    imageUrl: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=600&auto=format&fit=crop&q=60',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-ARY301',
    status: 'available'
  },

  // Visvesvaraya Block
  {
    id: 'room-vis-101',
    name: 'VIS-101 (Power Systems Lab)',
    buildingId: 'bld-4',
    buildingName: 'Visvesvaraya Block',
    floor: 1,
    capacity: 40,
    category: 'Workshop',
    equipment: ['Wi-Fi', 'Audio System'],
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=60',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-VIS101',
    status: 'available'
  },
  {
    id: 'room-vis-201',
    name: 'VIS-201 (Lecture Hall)',
    buildingId: 'bld-4',
    buildingName: 'Visvesvaraya Block',
    floor: 2,
    capacity: 60,
    category: 'Lecture Hall',
    equipment: ['Projector', 'Wi-Fi'],
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=60',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-VIS201',
    status: 'available'
  },

  // Library
  {
    id: 'room-lib-201',
    name: 'LIB-201 (Kalam Seminar Center)',
    buildingId: 'bld-5',
    buildingName: 'Dr. A.P.J. Abdul Kalam Library',
    floor: 2,
    capacity: 150,
    category: 'Seminar Hall',
    equipment: ['Projector', 'AC', 'Wi-Fi', 'Smart Board', 'Audio System', 'Microphones'],
    imageUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=600&auto=format&fit=crop&q=60',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-LIB201',
    status: 'reserved'
  }
];

export const TIMETABLE_DATA: TimetableSlot[] = [
  // RAM-101 Schedule
  {
    id: 'tt-1',
    classroomId: 'room-101',
    classroomName: 'RAM-101',
    day: 'Monday',
    timeSlot: '09:00 AM - 10:00 AM',
    subject: 'Data Structures & Algorithms',
    teacher: 'Dr. Rajesh Kumar',
    department: 'CSE',
    batch: 'CSE-A (Year II)',
    color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
  },
  {
    id: 'tt-2',
    classroomId: 'room-101',
    classroomName: 'RAM-101',
    day: 'Monday',
    timeSlot: '10:15 AM - 11:15 AM',
    subject: 'Computer Networks',
    teacher: 'Prof. Amit Sharma',
    department: 'CSE',
    batch: 'CSE-B (Year III)',
    color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
  },
  {
    id: 'tt-3',
    classroomId: 'room-101',
    classroomName: 'RAM-101',
    day: 'Tuesday',
    timeSlot: '11:30 AM - 12:30 PM',
    subject: 'Database Systems',
    teacher: 'Dr. M. Priyadharshini',
    department: 'IT',
    batch: 'IT-A (Year II)',
    color: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
  },
  {
    id: 'tt-4',
    classroomId: 'room-102',
    classroomName: 'RAM-102',
    day: 'Monday',
    timeSlot: '09:00 AM - 10:00 AM',
    subject: 'Machine Learning Lab',
    teacher: 'Dr. P. Swaminathan',
    department: 'AIDS',
    batch: 'AIDS-A (Year III)',
    color: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
  },
  {
    id: 'tt-5',
    classroomId: 'room-102',
    classroomName: 'RAM-102',
    day: 'Wednesday',
    timeSlot: '02:00 PM - 04:00 PM',
    subject: 'AI Deep Learning Practical',
    teacher: 'Dr. P. Swaminathan',
    department: 'AIDS',
    batch: 'AIDS-B (Year IV)',
    color: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
  },
  {
    id: 'tt-6',
    classroomId: 'room-cvr-101',
    classroomName: 'CVR-101',
    day: 'Thursday',
    timeSlot: '10:15 AM - 11:15 AM',
    subject: 'Solid State Physics',
    teacher: 'Dr. G. Rajesh',
    department: 'ECE',
    batch: 'ECE-A (Year I)',
    color: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
  }
];

export const MOCK_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'Booking Approved',
    message: 'Your request for RAM-301 on July 18th for CSE Seminar has been approved.',
    type: 'success',
    read: false,
    timestamp: '2 hours ago'
  },
  {
    id: 'notif-2',
    title: 'Classroom Maintenance Alert',
    message: 'RAM-202 (IoT Lab) is scheduled for air conditioner repairs. Status set to Maintenance.',
    type: 'warning',
    read: false,
    timestamp: 'Today, 10:00 AM'
  },
  {
    id: 'notif-3',
    title: 'AI Smart Re-allocation',
    message: 'AI successfully resolved a clash: Rescheduled CVR-101 tutorial to ARY-101 for tomorrow.',
    type: 'info',
    read: true,
    timestamp: 'Yesterday'
  },
  {
    id: 'notif-4',
    title: 'High Resource Utilization Warning',
    message: 'Visvesvaraya Block has reached 92% capacity today between 2:00 PM and 4:00 PM.',
    type: 'warning',
    read: true,
    timestamp: 'Yesterday'
  },
  {
    id: 'notif-5',
    title: 'New Account Created',
    message: 'New Staff Profile activated for Prof. K. Sundar (Mechanical Dept).',
    type: 'success',
    read: true,
    timestamp: '3 days ago'
  }
];

export const INITIAL_REQUESTS: BookingRequest[] = [
  {
    id: 'req-1',
    staffId: 'usr-3',
    staffName: 'Prof. Amit Sharma',
    subject: 'Computer Networks Seminar',
    date: '2026-07-18',
    time: '14:00',
    duration: 2,
    strength: 85,
    facilities: ['Projector', 'AC', 'Wi-Fi', 'Audio System'],
    preferredBuildingId: 'bld-1',
    remarks: 'Invited guest lecture. Needs high stability internet.',
    status: 'approved',
    allocatedClassroomId: 'room-301',
    allocatedClassroomName: 'RAM-301 (VCS Hall)',
    aiSuggested: true,
    aiConfidence: 96,
    createdAt: '2026-07-15T09:30:00Z'
  },
  {
    id: 'req-2',
    staffId: 'usr-3',
    staffName: 'Prof. Amit Sharma',
    subject: 'Remedial Class - Discrete Math',
    date: '2026-07-20',
    time: '16:00',
    duration: 1,
    strength: 30,
    facilities: ['Projector', 'Wi-Fi'],
    preferredBuildingId: 'bld-1',
    remarks: 'For second-year students requiring additional aid.',
    status: 'pending',
    createdAt: '2026-07-16T08:15:00Z'
  },
  {
    id: 'req-3',
    staffId: 'usr-staff2',
    staffName: 'Dr. Vinitha Nair',
    subject: 'Analog Design Workshop',
    date: '2026-07-19',
    time: '09:30',
    duration: 3,
    strength: 55,
    facilities: ['Projector', 'Wi-Fi', 'Smart Board'],
    preferredBuildingId: 'bld-2',
    remarks: 'Required lab bench space and smart whiteboard capability.',
    status: 'pending',
    createdAt: '2026-07-16T11:00:00Z'
  },
  {
    id: 'req-4',
    staffId: 'usr-staff3',
    staffName: 'Prof. S. Rangarajan',
    subject: 'EEE Board of Studies Meeting',
    date: '2026-07-14',
    time: '11:00',
    duration: 2,
    strength: 25,
    facilities: ['AC', 'Wi-Fi', 'Smart Board'],
    preferredBuildingId: 'bld-4',
    remarks: 'Annual curriculum review session.',
    status: 'approved',
    allocatedClassroomId: 'room-vis-201',
    allocatedClassroomName: 'VIS-201 (Lecture Hall)',
    aiSuggested: false,
    createdAt: '2026-07-13T10:00:00Z'
  }
];

// Presets for simulated AI assistant responses
export const AI_PROMPTS = [
  {
    prompt: 'Find a free room for 60 students in Ramanujan Block tomorrow morning.',
    response: 'Checking schedules... 🤖 I found **RAM-201** which is completely free tomorrow (July 17th) between **09:00 AM and 12:00 PM**. It has a capacity of **75 students**, equipped with a Projector, Wi-Fi, and Audio System. Would you like me to draft a booking request?',
    actions: ['Draft Request for RAM-201']
  },
  {
    prompt: 'Show me classrooms currently unused and not booked today.',
    response: 'Analysis of live timetables... 📊 I found **5 rooms** currently vacant and ready for use:\n\n1. **RAM-201** (Capacity: 75, Ramanujan Block)\n2. **CVR-201** (Capacity: 60, CV Raman Block)\n3. **CVR-301** (Capacity: 90, CV Raman Block)\n4. **ARY-101** (Capacity: 80, Aryabhata Block)\n5. **VIS-101** (Capacity: 40, Visvesvaraya Block)',
    actions: ['View Vacant Rooms']
  },
  {
    prompt: 'Are there any resource clashes scheduled for next Monday?',
    response: 'Scanning next Monday\'s timetable... 🛡️ **No clashes detected**. However, **RAM-101** is heavily booked (90% occupancy). I recommend scheduling any extra seminars in **CVR-301** or the **Library Seminar Hall** to avoid congestion.',
    actions: ['Check Monday Timeline']
  },
  {
    prompt: 'Allocate a laboratory with computers and AC for 40 students.',
    response: 'Searching specific lab configurations... 💻 I suggest **RAM-102 (AI Lab)** in Ramanujan Block. It features **45 computers, central AC, a Smart Board, and High-Speed Wi-Fi**. It is currently vacant after **12:30 PM**.',
    actions: ['Draft Request for RAM-102']
  }
];
