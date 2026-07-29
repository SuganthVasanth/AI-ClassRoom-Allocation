import type { Building, Classroom, BookingRequest, TimetableSlot, SystemNotification, Department } from '../types';

export const DEPARTMENTS: Department[] = [
  {
    "id": "dept-1",
    "name": "Computer Science & Engineering",
    "code": "CSE",
    "head": "Dr. A. Srinivasan",
    "buildingCode": "IB",
    "staffCount": 42,
    "studentCount": 780
  },
  {
    "id": "dept-2",
    "name": "Information Technology",
    "code": "IT",
    "head": "Dr. M. Priyadharshini",
    "buildingCode": "IB",
    "staffCount": 31,
    "studentCount": 540
  },
  {
    "id": "dept-3",
    "name": "Artificial Intelligence & Machine Learning",
    "code": "AIML",
    "head": "Dr. P. Swaminathan",
    "buildingCode": "IB",
    "staffCount": 24,
    "studentCount": 420
  },
  {
    "id": "dept-4",
    "name": "Artificial Intelligence & Data Science",
    "code": "AIDS",
    "head": "Dr. K. R. Vijay",
    "buildingCode": "IB",
    "staffCount": 22,
    "studentCount": 380
  },
  {
    "id": "dept-5",
    "name": "Computer Science & Business Systems",
    "code": "CSBS",
    "head": "Dr. V. Natesan",
    "buildingCode": "IB",
    "staffCount": 18,
    "studentCount": 300
  },
  {
    "id": "dept-6",
    "name": "Electronics & Communication Engineering",
    "code": "ECE",
    "head": "Dr. G. Rajesh",
    "buildingCode": "AS",
    "staffCount": 38,
    "studentCount": 720
  },
  {
    "id": "dept-7",
    "name": "Electrical & Electronics Engineering",
    "code": "EEE",
    "head": "Dr. K. Venkatesh",
    "buildingCode": "AS",
    "staffCount": 29,
    "studentCount": 480
  },
  {
    "id": "dept-8",
    "name": "Mechanical Engineering",
    "code": "MECH",
    "head": "Dr. S. Karthik",
    "buildingCode": "MS",
    "staffCount": 35,
    "studentCount": 600
  },
  {
    "id": "dept-9",
    "name": "Civil Engineering",
    "code": "CIVIL",
    "head": "Dr. R. Loganathan",
    "buildingCode": "MS",
    "staffCount": 22,
    "studentCount": 360
  },
  {
    "id": "dept-10",
    "name": "Biotechnology",
    "code": "BT",
    "head": "Dr. M. Vasudevan",
    "buildingCode": "AS",
    "staffCount": 20,
    "studentCount": 320
  },
  {
    "id": "dept-11",
    "name": "Biomedical Engineering",
    "code": "BME",
    "head": "Dr. S. Gayathri",
    "buildingCode": "AS",
    "staffCount": 19,
    "studentCount": 310
  },
  {
    "id": "dept-12",
    "name": "Agricultural Engineering",
    "code": "AGRI",
    "head": "Dr. N. Thangaraj",
    "buildingCode": "MS",
    "staffCount": 21,
    "studentCount": 340
  },
  {
    "id": "dept-13",
    "name": "Textile Technology",
    "code": "TEXTILE",
    "head": "Dr. C. Prakash",
    "buildingCode": "MS",
    "staffCount": 16,
    "studentCount": 280
  },
  {
    "id": "dept-14",
    "name": "Food Technology",
    "code": "FT",
    "head": "Dr. B. Anbarasu",
    "buildingCode": "AS",
    "staffCount": 17,
    "studentCount": 290
  }
];

export const BUILDINGS: Building[] = [
  {
    "id": "bld-1",
    "name": "Western Wing - IB Block",
    "code": "IB",
    "description": "Information Block - CS, IT, AI & Data Science Wing",
    "floors": 4,
    "totalClassrooms": 85,
    "coordinates": {
      "x": 22,
      "y": 35
    }
  },
  {
    "id": "bld-2",
    "name": "Eastern Wing - AS Block",
    "code": "AS",
    "description": "Applied Sciences - ECE, EEE & Physics Labs",
    "floors": 3,
    "totalClassrooms": 83,
    "coordinates": {
      "x": 55,
      "y": 25
    }
  },
  {
    "id": "bld-3",
    "name": "Sunflower Block",
    "code": "SF",
    "description": "Sunflower Lecture Wing & Seminar Halls",
    "floors": 4,
    "totalClassrooms": 39,
    "coordinates": {
      "x": 80,
      "y": 45
    }
  },
  {
    "id": "bld-4",
    "name": "Mechanical Science Block",
    "code": "MS",
    "description": "Mechanical Engineering, Civil & Drawing Halls",
    "floors": 3,
    "totalClassrooms": 48,
    "coordinates": {
      "x": 35,
      "y": 75
    }
  },
  {
    "id": "bld-5",
    "name": "Learning Centre",
    "code": "LC",
    "description": "Central Learning Centre & Conference Rooms",
    "floors": 4,
    "totalClassrooms": 15,
    "coordinates": {
      "x": 62,
      "y": 68
    }
  },
  {
    "id": "bld-6",
    "name": "Research park",
    "code": "RP",
    "description": "Research Park, Mathematics & Special Labs",
    "floors": 4,
    "totalClassrooms": 11,
    "coordinates": {
      "x": 22,
      "y": 15
    }
  }
];

export const CLASSROOMS: Classroom[] = [
  {
    "id": "room-me002",
    "name": "ME002 (Lecture Hall)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 0,
    "capacity": 8,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-ME002",
    "status": "available"
  },
  {
    "id": "room-me004",
    "name": "ME004 (Lecture Hall)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 0,
    "capacity": 18,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-ME004",
    "status": "available"
  },
  {
    "id": "room-me005",
    "name": "ME005 (Lecture Hall)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 0,
    "capacity": 8,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-ME005",
    "status": "available"
  },
  {
    "id": "room-me101",
    "name": "ME101 (Lecture Hall)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 1,
    "capacity": 90,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-ME101",
    "status": "available"
  },
  {
    "id": "room-me102",
    "name": "ME102 (Lecture Hall)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 1,
    "capacity": 90,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-ME102",
    "status": "available"
  },
  {
    "id": "room-me107",
    "name": "ME107 (Lecture Hall)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 1,
    "capacity": 90,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-ME107",
    "status": "available"
  },
  {
    "id": "room-me108",
    "name": "ME108 (Lecture Hall)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 1,
    "capacity": 90,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-ME108",
    "status": "available"
  },
  {
    "id": "room-me201",
    "name": "ME201 (Lecture Hall)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 2,
    "capacity": 90,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-ME201",
    "status": "available"
  },
  {
    "id": "room-me202",
    "name": "ME202 (Lecture Hall)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 2,
    "capacity": 90,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-ME202",
    "status": "available"
  },
  {
    "id": "room-me203",
    "name": "ME203 (Lecture Hall)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 2,
    "capacity": 90,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-ME203",
    "status": "available"
  },
  {
    "id": "room-me204",
    "name": "ME204 (Lecture Hall)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 2,
    "capacity": 90,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-ME204",
    "status": "available"
  },
  {
    "id": "room-me205",
    "name": "ME205 (Lecture Hall)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 2,
    "capacity": 90,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-ME205",
    "status": "available"
  },
  {
    "id": "room-me206",
    "name": "ME206 (Lecture Hall)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 2,
    "capacity": 90,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-ME206",
    "status": "available"
  },
  {
    "id": "room-me301",
    "name": "ME301 (Lecture Hall)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 3,
    "capacity": 90,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-ME301",
    "status": "available"
  },
  {
    "id": "room-me302",
    "name": "ME302 (Lecture Hall)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 3,
    "capacity": 90,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-ME302",
    "status": "available"
  },
  {
    "id": "room-me303",
    "name": "ME303 (Lecture Hall)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 3,
    "capacity": 90,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-ME303",
    "status": "available"
  },
  {
    "id": "room-me304",
    "name": "ME304 (Lecture Hall)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 3,
    "capacity": 90,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-ME304",
    "status": "available"
  },
  {
    "id": "room-me305",
    "name": "ME305 (Lecture Hall)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 3,
    "capacity": 90,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-ME305",
    "status": "available"
  },
  {
    "id": "room-me306",
    "name": "ME306 (Lecture Hall)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 3,
    "capacity": 90,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-ME306",
    "status": "available"
  },
  {
    "id": "room-me103",
    "name": "ME103 (Lecture Hall)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 1,
    "capacity": 40,
    "category": "Lecture Hall",
    "equipment": [
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-ME103",
    "status": "available"
  },
  {
    "id": "room-me104",
    "name": "ME104 (Lecture Hall)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 1,
    "capacity": 40,
    "category": "Lecture Hall",
    "equipment": [
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-ME104",
    "status": "available"
  },
  {
    "id": "room-me105",
    "name": "ME105 (Lecture Hall)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 1,
    "capacity": 12,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-ME105",
    "status": "available"
  },
  {
    "id": "room-me106",
    "name": "ME106 (Lecture Hall)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 1,
    "capacity": 18,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-ME106",
    "status": "available"
  },
  {
    "id": "room-mech-smart-class",
    "name": "Mech Smart class (Lecture Hall)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 0,
    "capacity": 32,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Mech Smart class",
    "status": "available"
  },
  {
    "id": "room-mech-library",
    "name": "Mech library (Lecture Hall)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 0,
    "capacity": 40,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Mech library",
    "status": "available"
  },
  {
    "id": "room-mech-conferencee-room",
    "name": "Mech Conferencee Room (Seminar Hall)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 0,
    "capacity": 10,
    "category": "Seminar Hall",
    "equipment": [
      "Projector",
      "Audio System"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Mech Conferencee Room",
    "status": "available"
  },
  {
    "id": "room-cyber-security-lab",
    "name": "Cyber security Lab (Computer Lab)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 0,
    "capacity": 60,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Cyber security Lab",
    "status": "available"
  },
  {
    "id": "room-thermal-engineering-lab",
    "name": "Thermal engineering lab (Computer Lab)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 0,
    "capacity": 24,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Thermal engineering lab",
    "status": "available"
  },
  {
    "id": "room-fluid-mechanics-and-machinery-lab",
    "name": "Fluid Mechanics and Machinery lab (Computer Lab)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 0,
    "capacity": 32,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Fluid Mechanics and Machinery lab",
    "status": "available"
  },
  {
    "id": "room-strength-of-materials",
    "name": "Strength of materials (Computer Lab)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 0,
    "capacity": 48,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Strength of materials",
    "status": "available"
  },
  {
    "id": "room-kinematics-and-dynamics-lab",
    "name": "Kinematics and Dynamics Lab (Computer Lab)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 0,
    "capacity": 34,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Kinematics and Dynamics Lab",
    "status": "available"
  },
  {
    "id": "room-metallargy-lab",
    "name": "Metallargy Lab (Computer Lab)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 0,
    "capacity": 24,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Metallargy Lab",
    "status": "available"
  },
  {
    "id": "room-computer-lab---(18)",
    "name": "Computer lab - (18) (Computer Lab)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 1,
    "capacity": 89,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Computer lab - (18)",
    "status": "available"
  },
  {
    "id": "room-computer-lab--(19)---harita-lab",
    "name": "Computer Lab  (19) - Harita Lab (Computer Lab)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 1,
    "capacity": 39,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Computer Lab  (19) - Harita Lab",
    "status": "available"
  },
  {
    "id": "room-computer-lab-(20)",
    "name": "Computer Lab (20) (Computer Lab)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 1,
    "capacity": 59,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Computer Lab (20)",
    "status": "available"
  },
  {
    "id": "room-computer-lab-(21)",
    "name": "Computer Lab (21) (Computer Lab)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 1,
    "capacity": 59,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Computer Lab (21)",
    "status": "available"
  },
  {
    "id": "room-computer-lab-(22)",
    "name": "Computer Lab (22) (Computer Lab)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 1,
    "capacity": 59,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Computer Lab (22)",
    "status": "available"
  },
  {
    "id": "room-computer-lab-(23)",
    "name": "Computer Lab (23) (Computer Lab)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 1,
    "capacity": 59,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Computer Lab (23)",
    "status": "available"
  },
  {
    "id": "room-computer-lab--(24)---cad-lab",
    "name": "Computer Lab  (24) - CAD Lab (Computer Lab)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 1,
    "capacity": 79,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Computer Lab  (24) - CAD Lab",
    "status": "available"
  },
  {
    "id": "room-computer-lab-(25)",
    "name": "Computer Lab (25) (Computer Lab)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 1,
    "capacity": 59,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Computer Lab (25)",
    "status": "available"
  },
  {
    "id": "room-computer-lab-(26)",
    "name": "Computer Lab (26) (Computer Lab)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 1,
    "capacity": 69,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Computer Lab (26)",
    "status": "available"
  },
  {
    "id": "room-mech-drawing-hall",
    "name": "Mech Drawing Hall (Drawing Hall)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 2,
    "capacity": 150,
    "category": "Drawing Hall",
    "equipment": [
      "Projector",
      "AC"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Mech Drawing Hall",
    "status": "available"
  },
  {
    "id": "room-agri-lab",
    "name": "Agri Lab (Computer Lab)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 2,
    "capacity": 45,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Agri Lab",
    "status": "available"
  },
  {
    "id": "room-godrej-lab",
    "name": "Godrej lab (Computer Lab)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 2,
    "capacity": 56,
    "category": "Computer Lab",
    "equipment": [
      "Projector"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Godrej lab",
    "status": "available"
  },
  {
    "id": "room-industrial-safety-lab",
    "name": "Industrial Safety lab (Computer Lab)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 2,
    "capacity": 18,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Industrial Safety lab",
    "status": "available"
  },
  {
    "id": "room-heat-and-mass-transfer-lab",
    "name": "Heat and Mass Transfer lab (Computer Lab)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 2,
    "capacity": 50,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Heat and Mass Transfer lab",
    "status": "available"
  },
  {
    "id": "room-basic-work-shop",
    "name": "Basic work shop (Computer Lab)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 0,
    "capacity": 40,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Basic work shop",
    "status": "available"
  },
  {
    "id": "room-metrology-lab",
    "name": "Metrology Lab (Computer Lab)",
    "buildingId": "bld-4",
    "buildingName": "Mechanical Science Block",
    "floor": 0,
    "capacity": 4,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Metrology Lab",
    "status": "available"
  },
  {
    "id": "room-sf-b01",
    "name": "SF B01 (Lecture Hall)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 0,
    "capacity": 80,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-SF B01",
    "status": "available"
  },
  {
    "id": "room-sf-b02",
    "name": "SF B02 (Lecture Hall)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 0,
    "capacity": 80,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-SF B02",
    "status": "available"
  },
  {
    "id": "room-sf-b03",
    "name": "SF B03 (Lecture Hall)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 0,
    "capacity": 80,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-SF B03",
    "status": "available"
  },
  {
    "id": "room-sf-001",
    "name": "SF 001 (Lecture Hall)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 0,
    "capacity": 80,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-SF 001",
    "status": "available"
  },
  {
    "id": "room-sf-002",
    "name": "SF 002 (Lecture Hall)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 0,
    "capacity": 80,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-SF 002",
    "status": "available"
  },
  {
    "id": "room-sf-101",
    "name": "SF 101 (Lecture Hall)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 1,
    "capacity": 80,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-SF 101",
    "status": "available"
  },
  {
    "id": "room-sf-102",
    "name": "SF 102 (Lecture Hall)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 1,
    "capacity": 80,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-SF 102",
    "status": "available"
  },
  {
    "id": "room-sf-103",
    "name": "SF 103 (Lecture Hall)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 1,
    "capacity": 80,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-SF 103",
    "status": "available"
  },
  {
    "id": "room-sf-201",
    "name": "SF 201 (Lecture Hall)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 2,
    "capacity": 80,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-SF 201",
    "status": "available"
  },
  {
    "id": "room-sf-202",
    "name": "SF 202 (Lecture Hall)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 2,
    "capacity": 80,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-SF 202",
    "status": "available"
  },
  {
    "id": "room-sf-203",
    "name": "SF 203 (Lecture Hall)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 2,
    "capacity": 80,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-SF 203",
    "status": "available"
  },
  {
    "id": "room-sun-flower-block---seminar-hall-i",
    "name": "SUN FLOWER BLOCK - SEMINAR HALL I (Seminar Hall)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 0,
    "capacity": 304,
    "category": "Seminar Hall",
    "equipment": [
      "AC",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-SUN FLOWER BLOCK - SEMINAR HALL I",
    "status": "available"
  },
  {
    "id": "room-sun-flower-block---seminar-hall-ii",
    "name": "SUN FLOWER BLOCK - SEMINAR HALL II (Seminar Hall)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 0,
    "capacity": 180,
    "category": "Seminar Hall",
    "equipment": [
      "AC",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-SUN FLOWER BLOCK - SEMINAR HALL II",
    "status": "available"
  },
  {
    "id": "room-sun-flower-block---seminar-hall-iii",
    "name": "SUN FLOWER BLOCK - SEMINAR HALL III (Seminar Hall)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 2,
    "capacity": 195,
    "category": "Seminar Hall",
    "equipment": [
      "AC",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-SUN FLOWER BLOCK - SEMINAR HALL III",
    "status": "available"
  },
  {
    "id": "room-mba-syndicate-room",
    "name": "MBA SYNDICATE ROOM (Lecture Hall)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 0,
    "capacity": 13,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-MBA SYNDICATE ROOM",
    "status": "available"
  },
  {
    "id": "room-class-room-1",
    "name": "Class Room 1 (Lecture Hall)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 0,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Class Room 1",
    "status": "available"
  },
  {
    "id": "room-class-room-2",
    "name": "Class Room 2 (Lecture Hall)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 0,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Class Room 2",
    "status": "available"
  },
  {
    "id": "room-tutorial-hall",
    "name": "Tutorial Hall (Lecture Hall)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 0,
    "capacity": 28,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Tutorial Hall",
    "status": "available"
  },
  {
    "id": "room-bas-lab(computer-lab-1)",
    "name": "BAS Lab(Computer Lab 1) (Computer Lab)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 0,
    "capacity": 40,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-BAS Lab(Computer Lab 1)",
    "status": "available"
  },
  {
    "id": "room-board-room",
    "name": "BOARD ROOM (Lecture Hall)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 0,
    "capacity": 12,
    "category": "Lecture Hall",
    "equipment": [
      "Projector"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-BOARD ROOM",
    "status": "available"
  },
  {
    "id": "room-it-discussion-room",
    "name": "IT DISCUSSION ROOM (Lecture Hall)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 0,
    "capacity": 10,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-IT DISCUSSION ROOM",
    "status": "available"
  },
  {
    "id": "room-cse-discussion-room",
    "name": "CSE DISCUSSION ROOM (Lecture Hall)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 1,
    "capacity": 15,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-CSE DISCUSSION ROOM",
    "status": "available"
  },
  {
    "id": "room-artificial-intelligence-lab(computer-lab-2)",
    "name": "Artificial Intelligence Lab(COMPUTER LAB 2) (Computer Lab)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 0,
    "capacity": 71,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Artificial Intelligence Lab(COMPUTER LAB 2)",
    "status": "available"
  },
  {
    "id": "room-data-mining-lab(computer-lab-3)",
    "name": "Data Mining Lab(COMPUTER LAB 3) (Computer Lab)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 0,
    "capacity": 59,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Data Mining Lab(COMPUTER LAB 3)",
    "status": "available"
  },
  {
    "id": "room-cloud-computing(computer-lab-4)",
    "name": "Cloud Computing(COMPUTER LAB 4) (Computer Lab)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 0,
    "capacity": 59,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Cloud Computing(COMPUTER LAB 4)",
    "status": "available"
  },
  {
    "id": "room-database-management-system(computer-lab-5)",
    "name": "Database management system(computer lab 5) (Computer Lab)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 0,
    "capacity": 59,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Database management system(computer lab 5)",
    "status": "available"
  },
  {
    "id": "room-programming-lab(computer-lab-6)",
    "name": "Programming Lab(COMPUTER LAB 6) (Computer Lab)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 0,
    "capacity": 59,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Programming Lab(COMPUTER LAB 6)",
    "status": "available"
  },
  {
    "id": "room-computer-lab---7",
    "name": "COMPUTER LAB - 7 (Computer Lab)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 1,
    "capacity": 71,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-COMPUTER LAB - 7",
    "status": "available"
  },
  {
    "id": "room-computer-lab---8",
    "name": "COMPUTER LAB - 8 (Computer Lab)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 1,
    "capacity": 59,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-COMPUTER LAB - 8",
    "status": "available"
  },
  {
    "id": "room-computer-lab---9",
    "name": "COMPUTER LAB - 9 (Computer Lab)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 1,
    "capacity": 59,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-COMPUTER LAB - 9",
    "status": "available"
  },
  {
    "id": "room-computer-lab---10",
    "name": "COMPUTER LAB - 10 (Computer Lab)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 1,
    "capacity": 59,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-COMPUTER LAB - 10",
    "status": "available"
  },
  {
    "id": "room-computer-lab---11",
    "name": "COMPUTER LAB - 11 (Computer Lab)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 1,
    "capacity": 59,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-COMPUTER LAB - 11",
    "status": "available"
  },
  {
    "id": "room-computer-lab---12",
    "name": "COMPUTER LAB - 12 (Computer Lab)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 2,
    "capacity": 59,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-COMPUTER LAB - 12",
    "status": "available"
  },
  {
    "id": "room-data-structure-lab-(computer--lab-13)",
    "name": "Data Structure Lab (Computer  Lab-13) (Computer Lab)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 2,
    "capacity": 59,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Data Structure Lab (Computer  Lab-13)",
    "status": "available"
  },
  {
    "id": "room-artificial-intellicence-lab-(computer--lab-14)",
    "name": "Artificial Intellicence Lab (Computer  Lab-14) (Computer Lab)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 2,
    "capacity": 29,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Artificial Intellicence Lab (Computer  Lab-14)",
    "status": "available"
  },
  {
    "id": "room-machine-learning--lab-(computer--lab-15)",
    "name": "Machine Learning  Lab (Computer  Lab-15) (Computer Lab)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 2,
    "capacity": 29,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Machine Learning  Lab (Computer  Lab-15)",
    "status": "available"
  },
  {
    "id": "room-programming--lab-(computer--lab-16)",
    "name": "Programming  Lab (Computer  Lab-16) (Computer Lab)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 2,
    "capacity": 29,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Programming  Lab (Computer  Lab-16)",
    "status": "available"
  },
  {
    "id": "room-programming-lab-(computer--lab-17)",
    "name": "Programming Lab (Computer  Lab-17) (Computer Lab)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 2,
    "capacity": 29,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Programming Lab (Computer  Lab-17)",
    "status": "available"
  },
  {
    "id": "room-fesem-lab",
    "name": "FESEM LAB (Computer Lab)",
    "buildingId": "bld-3",
    "buildingName": "Sunflower Block",
    "floor": 0,
    "capacity": 40,
    "category": "Computer Lab",
    "equipment": [
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-FESEM LAB",
    "status": "available"
  },
  {
    "id": "room-ww-101",
    "name": "WW 101 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 1,
    "capacity": 50,
    "category": "Lecture Hall",
    "equipment": [
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 101",
    "status": "available"
  },
  {
    "id": "room-ww-102",
    "name": "WW 102 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 1,
    "capacity": 50,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 102",
    "status": "available"
  },
  {
    "id": "room-ww-103",
    "name": "WW 103 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 1,
    "capacity": 50,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 103",
    "status": "available"
  },
  {
    "id": "room-ww-104",
    "name": "WW 104 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 1,
    "capacity": 50,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 104",
    "status": "available"
  },
  {
    "id": "room-ww-105",
    "name": "WW 105 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 1,
    "capacity": 50,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 105",
    "status": "available"
  },
  {
    "id": "room-ww-106",
    "name": "WW 106 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 1,
    "capacity": 50,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 106",
    "status": "available"
  },
  {
    "id": "room-ww-201",
    "name": "WW 201 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 2,
    "capacity": 50,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 201",
    "status": "available"
  },
  {
    "id": "room-ww-202",
    "name": "WW 202 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 2,
    "capacity": 50,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 202",
    "status": "available"
  },
  {
    "id": "room-ww-203",
    "name": "WW 203 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 2,
    "capacity": 64,
    "category": "Lecture Hall",
    "equipment": [
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 203",
    "status": "available"
  },
  {
    "id": "room-ww-204",
    "name": "WW 204 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 2,
    "capacity": 76,
    "category": "Lecture Hall",
    "equipment": [
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 204",
    "status": "available"
  },
  {
    "id": "room-ww-205",
    "name": "WW 205 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 2,
    "capacity": 40,
    "category": "Lecture Hall",
    "equipment": [
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 205",
    "status": "available"
  },
  {
    "id": "room-ww-107",
    "name": "WW 107 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 1,
    "capacity": 50,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 107",
    "status": "available"
  },
  {
    "id": "room-ww-108",
    "name": "WW 108 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 1,
    "capacity": 50,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 108",
    "status": "available"
  },
  {
    "id": "room-ww-109",
    "name": "WW 109 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 1,
    "capacity": 50,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 109",
    "status": "available"
  },
  {
    "id": "room-ww-110",
    "name": "WW 110 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 1,
    "capacity": 50,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 110",
    "status": "available"
  },
  {
    "id": "room-ww-111",
    "name": "WW 111 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 1,
    "capacity": 50,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 111",
    "status": "available"
  },
  {
    "id": "room-ww-112",
    "name": "WW 112 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 1,
    "capacity": 50,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 112",
    "status": "available"
  },
  {
    "id": "room-ww-206",
    "name": "WW 206 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 2,
    "capacity": 100,
    "category": "Lecture Hall",
    "equipment": [
      "AC"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 206",
    "status": "available"
  },
  {
    "id": "room-ww-207",
    "name": "WW 207 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 2,
    "capacity": 100,
    "category": "Lecture Hall",
    "equipment": [
      "AC"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 207",
    "status": "available"
  },
  {
    "id": "room-ww-208",
    "name": "WW 208 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 2,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 208",
    "status": "available"
  },
  {
    "id": "room-ww-209",
    "name": "WW 209 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 2,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 209",
    "status": "available"
  },
  {
    "id": "room-ww-210",
    "name": "WW 210 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 2,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 210",
    "status": "available"
  },
  {
    "id": "room-ww-113",
    "name": "WW 113 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 1,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 113",
    "status": "available"
  },
  {
    "id": "room-ww-114",
    "name": "WW 114 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 1,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 114",
    "status": "available"
  },
  {
    "id": "room-ww-115",
    "name": "WW 115 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 1,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 115",
    "status": "available"
  },
  {
    "id": "room-ww-117",
    "name": "WW 117 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 1,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 117",
    "status": "available"
  },
  {
    "id": "room-ww-118",
    "name": "WW 118 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 1,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 118",
    "status": "available"
  },
  {
    "id": "room-ww-211",
    "name": "WW 211 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 2,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 211",
    "status": "available"
  },
  {
    "id": "room-ww-212",
    "name": "WW 212 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 2,
    "capacity": 100,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 212",
    "status": "available"
  },
  {
    "id": "room-ww-213",
    "name": "WW 213 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 2,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 213",
    "status": "available"
  },
  {
    "id": "room-ww-214",
    "name": "WW 214 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 2,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 214",
    "status": "available"
  },
  {
    "id": "room-ww-215",
    "name": "WW 215 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 2,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 215",
    "status": "available"
  },
  {
    "id": "room-ww-002",
    "name": "WW 002 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 0,
    "capacity": 40,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 002",
    "status": "available"
  },
  {
    "id": "room-ww-003",
    "name": "WW 003 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 0,
    "capacity": 40,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 003",
    "status": "available"
  },
  {
    "id": "room-ww-004",
    "name": "WW 004 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 0,
    "capacity": 40,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 004",
    "status": "available"
  },
  {
    "id": "room-ww-005",
    "name": "WW 005 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 0,
    "capacity": 50,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 005",
    "status": "available"
  },
  {
    "id": "room-ww-006",
    "name": "WW 006 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 0,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 006",
    "status": "available"
  },
  {
    "id": "room-ww-007",
    "name": "WW 007 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 0,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 007",
    "status": "available"
  },
  {
    "id": "room-ww-008",
    "name": "WW 008 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 0,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 008",
    "status": "available"
  },
  {
    "id": "room-ww-011",
    "name": "WW 011 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 0,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 011",
    "status": "available"
  },
  {
    "id": "room-ww-012",
    "name": "WW 012 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 0,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 012",
    "status": "available"
  },
  {
    "id": "room-ww-216",
    "name": "WW 216 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 2,
    "capacity": 40,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 216",
    "status": "available"
  },
  {
    "id": "room-ww-217",
    "name": "WW 217 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 2,
    "capacity": 40,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 217",
    "status": "available"
  },
  {
    "id": "room-ww-218",
    "name": "WW 218 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 2,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 218",
    "status": "available"
  },
  {
    "id": "room-ww-219",
    "name": "WW 219 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 2,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 219",
    "status": "available"
  },
  {
    "id": "room-ww-220",
    "name": "WW 220 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 2,
    "capacity": 40,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 220",
    "status": "available"
  },
  {
    "id": "room-ww-221",
    "name": "WW 221 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 2,
    "capacity": 40,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 221",
    "status": "available"
  },
  {
    "id": "room-ww-222",
    "name": "WW 222 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 2,
    "capacity": 100,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 222",
    "status": "available"
  },
  {
    "id": "room-ww-223",
    "name": "WW 223 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 2,
    "capacity": 100,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 223",
    "status": "available"
  },
  {
    "id": "room-ww-224",
    "name": "WW 224 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 2,
    "capacity": 100,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 224",
    "status": "available"
  },
  {
    "id": "room-ww-225",
    "name": "WW 225 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 2,
    "capacity": 100,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 225",
    "status": "available"
  },
  {
    "id": "room-ww-226",
    "name": "WW 226 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 2,
    "capacity": 100,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 226",
    "status": "available"
  },
  {
    "id": "room-ww-227",
    "name": "WW 227 (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 2,
    "capacity": 100,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-WW 227",
    "status": "available"
  },
  {
    "id": "room-iecc-launch-pad",
    "name": "IECC Launch Pad (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 0,
    "capacity": 40,
    "category": "Lecture Hall",
    "equipment": [
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-IECC Launch Pad",
    "status": "available"
  },
  {
    "id": "room-eee-smart-class",
    "name": "EEE smart class (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 0,
    "capacity": 70,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EEE smart class",
    "status": "available"
  },
  {
    "id": "room-eie-smart-class",
    "name": "EIE smart class (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 2,
    "capacity": 50,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EIE smart class",
    "status": "available"
  },
  {
    "id": "room-eie-cc-lab",
    "name": "EIE CC Lab (Computer Lab)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 0,
    "capacity": 59,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EIE CC Lab",
    "status": "available"
  },
  {
    "id": "room-training-&-placement-conference-hall-i",
    "name": "TRAINING & PLACEMENT CONFERENCE HALL I (Seminar Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 0,
    "capacity": 13,
    "category": "Seminar Hall",
    "equipment": [
      "Projector",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-TRAINING & PLACEMENT CONFERENCE HALL I",
    "status": "available"
  },
  {
    "id": "room-training-&-placement-conference-hall-ii",
    "name": "TRAINING & PLACEMENT CONFERENCE HALL II (Seminar Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 0,
    "capacity": 13,
    "category": "Seminar Hall",
    "equipment": [
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-TRAINING & PLACEMENT CONFERENCE HALL II",
    "status": "available"
  },
  {
    "id": "room-tbi-conference-hall",
    "name": "TBI CONFERENCE HALL (Seminar Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 1,
    "capacity": 15,
    "category": "Seminar Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-TBI CONFERENCE HALL",
    "status": "available"
  },
  {
    "id": "room-eie-conference-hall",
    "name": "EIE CONFERENCE HALL (Seminar Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 2,
    "capacity": 24,
    "category": "Seminar Hall",
    "equipment": [
      "Projector",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EIE CONFERENCE HALL",
    "status": "available"
  },
  {
    "id": "room-eie-seminar-hall",
    "name": "EIE SEMINAR HALL (Seminar Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 0,
    "capacity": 160,
    "category": "Seminar Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EIE SEMINAR HALL",
    "status": "available"
  },
  {
    "id": "room-biotech-seminar-hall",
    "name": "BIOTECH SEMINAR HALL (Seminar Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 0,
    "capacity": 120,
    "category": "Seminar Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-BIOTECH SEMINAR HALL",
    "status": "available"
  },
  {
    "id": "room-eee-seminar-hall",
    "name": "EEE SEMINAR HALL (Seminar Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 0,
    "capacity": 160,
    "category": "Seminar Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EEE SEMINAR HALL",
    "status": "available"
  },
  {
    "id": "room-iecc-seminar-hall",
    "name": "IECC SEMINAR HALL (Seminar Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 0,
    "capacity": 160,
    "category": "Seminar Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-IECC SEMINAR HALL",
    "status": "available"
  },
  {
    "id": "room-tbi-conference-hall---second-floor",
    "name": "TBI Conference Hall - Second Floor (Lecture Hall)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 2,
    "capacity": 10,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-TBI Conference Hall - Second Floor",
    "status": "available"
  },
  {
    "id": "room-bio-process-laboratory",
    "name": "Bio Process laboratory (Computer Lab)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 1,
    "capacity": 48,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Bio Process laboratory",
    "status": "available"
  },
  {
    "id": "room-internet-center",
    "name": "Internet Center (Computer Lab)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 0,
    "capacity": 100,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Internet Center",
    "status": "available"
  },
  {
    "id": "room-centre-of-excellence",
    "name": "Centre of Excellence (Computer Lab)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 0,
    "capacity": 70,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Centre of Excellence",
    "status": "available"
  },
  {
    "id": "room-plc-gurugulam",
    "name": "PLC Gurugulam (Computer Lab)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 2,
    "capacity": 70,
    "category": "Computer Lab",
    "equipment": [
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-PLC Gurugulam",
    "status": "available"
  },
  {
    "id": "room-eee-cc-lab",
    "name": "EEE CC LAB (Computer Lab)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 1,
    "capacity": 130,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EEE CC LAB",
    "status": "available"
  },
  {
    "id": "room-gurugulam---embedded-lab",
    "name": "Gurugulam - Embedded Lab (Computer Lab)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 1,
    "capacity": 130,
    "category": "Computer Lab",
    "equipment": [
      "AC",
      "Wi-Fi",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Gurugulam - Embedded Lab",
    "status": "available"
  },
  {
    "id": "room-mechatronics---sew-eurodrive-centre-for-drives-and-automation",
    "name": "Mechatronics - SEW EURODRIVE Centre for Drives and Automation (Computer Lab)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 1,
    "capacity": 26,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Mechatronics - SEW EURODRIVE Centre for Drives and Automation",
    "status": "available"
  },
  {
    "id": "room-mechatronics---sensor-and-instrumentation-laboratory",
    "name": "Mechatronics - Sensor and Instrumentation Laboratory (Computer Lab)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 1,
    "capacity": 36,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Audio System"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Mechatronics - Sensor and Instrumentation Laboratory",
    "status": "available"
  },
  {
    "id": "room-mechatronics---conference-room",
    "name": "Mechatronics - Conference Room (Computer Lab)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 1,
    "capacity": 7,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Mechatronics - Conference Room",
    "status": "available"
  },
  {
    "id": "room-mechatronics---computer-center-49",
    "name": "Mechatronics - Computer Center 49 (Computer Lab)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 1,
    "capacity": 30,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Mechatronics - Computer Center 49",
    "status": "available"
  },
  {
    "id": "room-process-control-laboratory",
    "name": "Process control laboratory (Computer Lab)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 0,
    "capacity": 16,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Process control laboratory",
    "status": "available"
  },
  {
    "id": "room-pskill-lab-1",
    "name": "PSKILL Lab 1 (Computer Lab)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 1,
    "capacity": 66,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-PSKILL Lab 1",
    "status": "available"
  },
  {
    "id": "room-pskill-lab-2",
    "name": "PSKILL Lab 2 (Computer Lab)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 1,
    "capacity": 66,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-PSKILL Lab 2",
    "status": "available"
  },
  {
    "id": "room-pskill-lab-3",
    "name": "PSKILL Lab 3 (Computer Lab)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 1,
    "capacity": 66,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-PSKILL Lab 3",
    "status": "available"
  },
  {
    "id": "room-industrial-instrumetation-laboratary",
    "name": "Industrial instrumetation Laboratary (Computer Lab)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 1,
    "capacity": 21,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Industrial instrumetation Laboratary",
    "status": "available"
  },
  {
    "id": "room-electronics-laboratary",
    "name": "Electronics laboratary (Computer Lab)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 1,
    "capacity": 54,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Electronics laboratary",
    "status": "available"
  },
  {
    "id": "room-research-laboratary",
    "name": "Research laboratary (Computer Lab)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 1,
    "capacity": 36,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Research laboratary",
    "status": "available"
  },
  {
    "id": "room-power-electronics-laboratary",
    "name": "Power electronics laboratary (Computer Lab)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 1,
    "capacity": 72,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Power electronics laboratary",
    "status": "available"
  },
  {
    "id": "room-advanced-embedded-system-laboratary",
    "name": "Advanced embedded system laboratary (Computer Lab)",
    "buildingId": "bld-1",
    "buildingName": "Western Wing - IB Block",
    "floor": 1,
    "capacity": 72,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Advanced embedded system laboratary",
    "status": "available"
  },
  {
    "id": "room-ew-101",
    "name": "EW 101 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 1,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 101",
    "status": "available"
  },
  {
    "id": "room-ew-102",
    "name": "EW 102 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 1,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 102",
    "status": "available"
  },
  {
    "id": "room-ew-103",
    "name": "EW 103 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 1,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 103",
    "status": "available"
  },
  {
    "id": "room-ew-104",
    "name": "EW 104 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 1,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 104",
    "status": "available"
  },
  {
    "id": "room-ew-105",
    "name": "EW 105 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 1,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 105",
    "status": "available"
  },
  {
    "id": "room-ew-106",
    "name": "EW 106 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 1,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 106",
    "status": "available"
  },
  {
    "id": "room-ew-201",
    "name": "EW 201 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 201",
    "status": "available"
  },
  {
    "id": "room-ew-202",
    "name": "EW 202 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 202",
    "status": "available"
  },
  {
    "id": "room-ew-203",
    "name": "EW 203 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 203",
    "status": "available"
  },
  {
    "id": "room-ew-204",
    "name": "EW 204 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 40,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 204",
    "status": "available"
  },
  {
    "id": "room-ew-205",
    "name": "EW 205 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 40,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 205",
    "status": "available"
  },
  {
    "id": "room-ew-206",
    "name": "EW 206 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 100,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 206",
    "status": "available"
  },
  {
    "id": "room-ew-107",
    "name": "EW 107 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 1,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 107",
    "status": "available"
  },
  {
    "id": "room-ew-108",
    "name": "EW 108 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 1,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 108",
    "status": "available"
  },
  {
    "id": "room-ew-109",
    "name": "EW 109 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 1,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 109",
    "status": "available"
  },
  {
    "id": "room-ew-111",
    "name": "EW 111 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 1,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 111",
    "status": "available"
  },
  {
    "id": "room-ew-112",
    "name": "EW 112 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 1,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 112",
    "status": "available"
  },
  {
    "id": "room-ew-207",
    "name": "EW 207 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 207",
    "status": "available"
  },
  {
    "id": "room-ew-208",
    "name": "EW 208 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 208",
    "status": "available"
  },
  {
    "id": "room-ew-209",
    "name": "EW 209 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 209",
    "status": "available"
  },
  {
    "id": "room-ew-210",
    "name": "EW 210 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 40,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 210",
    "status": "available"
  },
  {
    "id": "room-ew-211",
    "name": "EW 211 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 40,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 211",
    "status": "available"
  },
  {
    "id": "room-ew-212",
    "name": "EW 212 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 100,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 212",
    "status": "available"
  },
  {
    "id": "room-ew-113",
    "name": "EW 113 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 1,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 113",
    "status": "available"
  },
  {
    "id": "room-ew-114",
    "name": "EW 114 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 1,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 114",
    "status": "available"
  },
  {
    "id": "room-ew-116",
    "name": "EW 116 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 1,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 116",
    "status": "available"
  },
  {
    "id": "room-ew-117",
    "name": "EW 117 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 1,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 117",
    "status": "available"
  },
  {
    "id": "room-ew-118",
    "name": "EW 118 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 1,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 118",
    "status": "available"
  },
  {
    "id": "room-ew-115",
    "name": "EW 115 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 1,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 115",
    "status": "available"
  },
  {
    "id": "room-ew-214",
    "name": "EW 214 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 214",
    "status": "available"
  },
  {
    "id": "room-ew-215",
    "name": "EW 215 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 215",
    "status": "available"
  },
  {
    "id": "room-ew-216",
    "name": "EW 216 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 40,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 216",
    "status": "available"
  },
  {
    "id": "room-ew-217",
    "name": "EW 217 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 40,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 217",
    "status": "available"
  },
  {
    "id": "room-ew-218",
    "name": "EW 218 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 100,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 218",
    "status": "available"
  },
  {
    "id": "room-ew-213",
    "name": "EW 213 (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 60,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-EW 213",
    "status": "available"
  },
  {
    "id": "room-special-lab-conference-hall-1",
    "name": "Special lab Conference Hall 1 (Seminar Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 10,
    "category": "Seminar Hall",
    "equipment": [
      "Projector",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Special lab Conference Hall 1",
    "status": "available"
  },
  {
    "id": "room-special-lab-conference-hall-2",
    "name": "Special lab Conference Hall 2 (Seminar Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 10,
    "category": "Seminar Hall",
    "equipment": [
      "Projector",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Special lab Conference Hall 2",
    "status": "available"
  },
  {
    "id": "room-textile-seminar-hall",
    "name": "TEXTILE SEMINAR HALL (Seminar Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 0,
    "capacity": 180,
    "category": "Seminar Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-TEXTILE SEMINAR HALL",
    "status": "available"
  },
  {
    "id": "room-ece-seminar-hall",
    "name": "ECE SEMINAR HALL (Seminar Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 0,
    "capacity": 180,
    "category": "Seminar Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-ECE SEMINAR HALL",
    "status": "available"
  },
  {
    "id": "room-civil-conference-hall",
    "name": "CIVIL CONFERENCE HALL (Seminar Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 0,
    "capacity": 30,
    "category": "Seminar Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-CIVIL CONFERENCE HALL",
    "status": "available"
  },
  {
    "id": "room-full-stack-lab",
    "name": "Full Stack lab (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 85,
    "category": "Computer Lab",
    "equipment": [
      "AC",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Full Stack lab",
    "status": "available"
  },
  {
    "id": "room-data-science-lab",
    "name": "Data Science Lab (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 90,
    "category": "Computer Lab",
    "equipment": [
      "AC"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Data Science Lab",
    "status": "available"
  },
  {
    "id": "room-iot-lab",
    "name": "IOT Lab (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 30,
    "category": "Computer Lab",
    "equipment": [
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-IOT Lab",
    "status": "available"
  },
  {
    "id": "room-hackathon-lab",
    "name": "HACKATHON LAB (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 75,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-HACKATHON LAB",
    "status": "available"
  },
  {
    "id": "room-data-science-lab-2",
    "name": "DATA SCIENCE LAB 2 (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 30,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-DATA SCIENCE LAB 2",
    "status": "available"
  },
  {
    "id": "room-ai-lab",
    "name": "AI Lab (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 0,
    "capacity": 10,
    "category": "Computer Lab",
    "equipment": [
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-AI Lab",
    "status": "available"
  },
  {
    "id": "room-embeded-lab",
    "name": "Embeded Lab (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 1,
    "capacity": 100,
    "category": "Computer Lab",
    "equipment": [
      "AC",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Embeded Lab",
    "status": "available"
  },
  {
    "id": "room-xr-studio",
    "name": "XR Studio (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 0,
    "capacity": 20,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-XR Studio",
    "status": "available"
  },
  {
    "id": "room-smart-agri",
    "name": "Smart AGRI (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 1,
    "capacity": 40,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Smart AGRI",
    "status": "available"
  },
  {
    "id": "room-robotics-and-automation-lab",
    "name": "Robotics and Automation Lab (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 1,
    "capacity": 30,
    "category": "Computer Lab",
    "equipment": [
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Robotics and Automation Lab",
    "status": "available"
  },
  {
    "id": "room-cps-lab-1",
    "name": "CPS LAB 1 (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 0,
    "capacity": 40,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-CPS LAB 1",
    "status": "available"
  },
  {
    "id": "room-cps-lab-2",
    "name": "CPS LAB 2 (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 0,
    "capacity": 40,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-CPS LAB 2",
    "status": "available"
  },
  {
    "id": "room-physics-lab-1",
    "name": "Physics Lab 1 (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 1,
    "capacity": 150,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "AC",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Physics Lab 1",
    "status": "available"
  },
  {
    "id": "room-iot-lab-1",
    "name": "IOT Lab 1 (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 45,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-IOT Lab 1",
    "status": "available"
  },
  {
    "id": "room-iot-lab-2",
    "name": "IOT Lab 2 (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 45,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-IOT Lab 2",
    "status": "available"
  },
  {
    "id": "room-physics-lab-2",
    "name": "Physics Lab 2 (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 100,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Physics Lab 2",
    "status": "available"
  },
  {
    "id": "room-chemistry-lab-1",
    "name": "Chemistry Lab 1 (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 1,
    "capacity": 100,
    "category": "Computer Lab",
    "equipment": [
      "AC",
      "Wi-Fi",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Chemistry Lab 1",
    "status": "available"
  },
  {
    "id": "room-chemistry-lab-2",
    "name": "Chemistry Lab 2 (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 1,
    "capacity": 100,
    "category": "Computer Lab",
    "equipment": [
      "AC",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Chemistry Lab 2",
    "status": "available"
  },
  {
    "id": "room-cps-lab-3",
    "name": "CPS LAB 3 (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 0,
    "capacity": 39,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-CPS LAB 3",
    "status": "available"
  },
  {
    "id": "room-analog-communication-lab",
    "name": "Analog Communication Lab (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 36,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Analog Communication Lab",
    "status": "available"
  },
  {
    "id": "room-digital-communication-lab",
    "name": "Digital Communication Lab (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 36,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Digital Communication Lab",
    "status": "available"
  },
  {
    "id": "room-microwave-lab",
    "name": "Microwave Lab (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 48,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Microwave Lab",
    "status": "available"
  },
  {
    "id": "room-network-lab",
    "name": "Network Lab (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 1,
    "capacity": 53,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Network Lab",
    "status": "available"
  },
  {
    "id": "room-pg-communication-lab",
    "name": "PG Communication Lab (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 0,
    "capacity": 21,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-PG Communication Lab",
    "status": "available"
  },
  {
    "id": "room-dsp-lab",
    "name": "DSP Lab (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 0,
    "capacity": 35,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-DSP Lab",
    "status": "available"
  },
  {
    "id": "room-vlsi-design",
    "name": "VLSI Design (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 40,
    "category": "Computer Lab",
    "equipment": [
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-VLSI Design",
    "status": "available"
  },
  {
    "id": "room-microcontroller-lab",
    "name": "Microcontroller Lab (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 26,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Microcontroller Lab",
    "status": "available"
  },
  {
    "id": "room-digital-electronics-lab",
    "name": "Digital Electronics Lab (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 48,
    "category": "Computer Lab",
    "equipment": [
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Digital Electronics Lab",
    "status": "available"
  },
  {
    "id": "room-signal-processing-lab",
    "name": "Signal Processing Lab (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 0,
    "capacity": 40,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Signal Processing Lab",
    "status": "available"
  },
  {
    "id": "room-pcb-design-lab",
    "name": "PCB Design Lab (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 0,
    "capacity": 40,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-PCB Design Lab",
    "status": "available"
  },
  {
    "id": "room-pcb-fabrication-lab",
    "name": "PCB Fabrication Lab (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 0,
    "capacity": 36,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-PCB Fabrication Lab",
    "status": "available"
  },
  {
    "id": "room-sensor-and-tamil-computing-lab",
    "name": "Sensor and Tamil Computing Lab (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 0,
    "capacity": 20,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Sensor and Tamil Computing Lab",
    "status": "available"
  },
  {
    "id": "room-drai-lab",
    "name": "DRAI Lab (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 40,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-DRAI Lab",
    "status": "available"
  },
  {
    "id": "room-ai-based-industrial-automation",
    "name": "AI BASED INDUSTRIAL AUTOMATION (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 2,
    "capacity": 40,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-AI BASED INDUSTRIAL AUTOMATION",
    "status": "available"
  },
  {
    "id": "room-elcc-smart-class",
    "name": "ELCC smart class (Lecture Hall)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 1,
    "capacity": 40,
    "category": "Lecture Hall",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-ELCC smart class",
    "status": "available"
  },
  {
    "id": "room-servo-lab",
    "name": "Servo Lab (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 0,
    "capacity": 204,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Servo Lab",
    "status": "available"
  },
  {
    "id": "room-next-generation-food-laboratary",
    "name": "Next generation food laboratary (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 1,
    "capacity": 5,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Next generation food laboratary",
    "status": "available"
  },
  {
    "id": "room-unit-operation-laboratary",
    "name": "Unit operation laboratary (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 1,
    "capacity": 24,
    "category": "Computer Lab",
    "equipment": [
      "Projector",
      "Wi-Fi",
      "Smart Board",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Unit operation laboratary",
    "status": "available"
  },
  {
    "id": "room-food-processing-laboratary",
    "name": "Food processing laboratary (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 1,
    "capacity": 50,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Food processing laboratary",
    "status": "available"
  },
  {
    "id": "room-food-informatics-center",
    "name": "Food informatics center (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 1,
    "capacity": 24,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Food informatics center",
    "status": "available"
  },
  {
    "id": "room-baking-and-confictionary-laboratary",
    "name": "Baking and confictionary laboratary (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 1,
    "capacity": 10,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Baking and confictionary laboratary",
    "status": "available"
  },
  {
    "id": "room-food-innovation-center",
    "name": "Food innovation center (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 1,
    "capacity": 6,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Food innovation center",
    "status": "available"
  },
  {
    "id": "room-food-microbiology",
    "name": "Food microbiology (Computer Lab)",
    "buildingId": "bld-2",
    "buildingName": "Eastern Wing - AS Block",
    "floor": 1,
    "capacity": 10,
    "category": "Computer Lab",
    "equipment": [
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Food microbiology",
    "status": "available"
  },
  {
    "id": "room-ae301",
    "name": "AE301 (Lecture Hall)",
    "buildingId": "bld-6",
    "buildingName": "Research park",
    "floor": 3,
    "capacity": 50,
    "category": "Lecture Hall",
    "equipment": [
      "AC"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-AE301",
    "status": "available"
  },
  {
    "id": "room-ae302",
    "name": "AE302 (Lecture Hall)",
    "buildingId": "bld-6",
    "buildingName": "Research park",
    "floor": 3,
    "capacity": 50,
    "category": "Lecture Hall",
    "equipment": [
      "AC"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-AE302",
    "status": "available"
  },
  {
    "id": "room-mh301",
    "name": "MH301 (Lecture Hall)",
    "buildingId": "bld-6",
    "buildingName": "Research park",
    "floor": 3,
    "capacity": 50,
    "category": "Lecture Hall",
    "equipment": [
      "AC",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-MH301",
    "status": "available"
  },
  {
    "id": "room-mh302",
    "name": "MH302 (Lecture Hall)",
    "buildingId": "bld-6",
    "buildingName": "Research park",
    "floor": 3,
    "capacity": 50,
    "category": "Lecture Hall",
    "equipment": [
      "AC",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-MH302",
    "status": "available"
  },
  {
    "id": "room-mh303",
    "name": "MH303 (Lecture Hall)",
    "buildingId": "bld-6",
    "buildingName": "Research park",
    "floor": 3,
    "capacity": 50,
    "category": "Lecture Hall",
    "equipment": [
      "AC",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-MH303",
    "status": "available"
  },
  {
    "id": "room-mh305",
    "name": "MH305 (Lecture Hall)",
    "buildingId": "bld-6",
    "buildingName": "Research park",
    "floor": 3,
    "capacity": 50,
    "category": "Lecture Hall",
    "equipment": [
      "AC",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-MH305",
    "status": "available"
  },
  {
    "id": "room-mh306",
    "name": "MH306 (Lecture Hall)",
    "buildingId": "bld-6",
    "buildingName": "Research park",
    "floor": 3,
    "capacity": 50,
    "category": "Lecture Hall",
    "equipment": [
      "AC",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-MH306",
    "status": "available"
  },
  {
    "id": "room-ae-202",
    "name": "AE 202 (Lecture Hall)",
    "buildingId": "bld-6",
    "buildingName": "Research park",
    "floor": 2,
    "capacity": 50,
    "category": "Lecture Hall",
    "equipment": [
      "AC",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-AE 202",
    "status": "available"
  },
  {
    "id": "room-aero-dh",
    "name": "Aero DH (Drawing Hall)",
    "buildingId": "bld-6",
    "buildingName": "Research park",
    "floor": 1,
    "capacity": 94,
    "category": "Drawing Hall",
    "equipment": [
      "AC"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Aero DH",
    "status": "available"
  },
  {
    "id": "room-aero-conference-hall",
    "name": "Aero Conference Hall (Seminar Hall)",
    "buildingId": "bld-6",
    "buildingName": "Research park",
    "floor": 0,
    "capacity": 20,
    "category": "Seminar Hall",
    "equipment": [
      "AC"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Aero Conference Hall",
    "status": "available"
  },
  {
    "id": "room-aero-seminar-hall",
    "name": "AERO SEMINAR HALL (Seminar Hall)",
    "buildingId": "bld-6",
    "buildingName": "Research park",
    "floor": 0,
    "capacity": 72,
    "category": "Seminar Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi",
      "Smart Board",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-AERO SEMINAR HALL",
    "status": "available"
  },
  {
    "id": "room-learning-centre-conference-hall---i-floor",
    "name": "LEARNING CENTRE CONFERENCE HALL - I FLOOR (Seminar Hall)",
    "buildingId": "bld-5",
    "buildingName": "Learning Centre",
    "floor": 1,
    "capacity": 13,
    "category": "Seminar Hall",
    "equipment": [
      "Projector",
      "AC",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-LEARNING CENTRE CONFERENCE HALL - I FLOOR",
    "status": "available"
  },
  {
    "id": "room-learning-centre-conference-hall---ii-floor",
    "name": "LEARNING CENTRE CONFERENCE HALL - II FLOOR (Seminar Hall)",
    "buildingId": "bld-5",
    "buildingName": "Learning Centre",
    "floor": 2,
    "capacity": 14,
    "category": "Seminar Hall",
    "equipment": [
      "Projector",
      "AC"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-LEARNING CENTRE CONFERENCE HALL - II FLOOR",
    "status": "available"
  },
  {
    "id": "room-learning-centre-conference-hall---iii-floor",
    "name": "LEARNING CENTRE CONFERENCE HALL - III FLOOR (Seminar Hall)",
    "buildingId": "bld-5",
    "buildingName": "Learning Centre",
    "floor": 3,
    "capacity": 14,
    "category": "Seminar Hall",
    "equipment": [
      "Projector",
      "AC"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-LEARNING CENTRE CONFERENCE HALL - III FLOOR",
    "status": "available"
  },
  {
    "id": "room-learning-centre-conference-hall---iv-floor",
    "name": "LEARNING CENTRE CONFERENCE HALL - IV FLOOR (Seminar Hall)",
    "buildingId": "bld-5",
    "buildingName": "Learning Centre",
    "floor": 4,
    "capacity": 13,
    "category": "Seminar Hall",
    "equipment": [
      "AC"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-LEARNING CENTRE CONFERENCE HALL - IV FLOOR",
    "status": "available"
  },
  {
    "id": "room-learning-centre-discussion-room--1-i-floor",
    "name": "LEARNING CENTRE DISCUSSION ROOM- 1 I FLOOR (Lecture Hall)",
    "buildingId": "bld-5",
    "buildingName": "Learning Centre",
    "floor": 1,
    "capacity": 10,
    "category": "Lecture Hall",
    "equipment": [
      "AC",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-LEARNING CENTRE DISCUSSION ROOM- 1 I FLOOR",
    "status": "available"
  },
  {
    "id": "room-learning-centre-discussion-room--2-i-floor",
    "name": "LEARNING CENTRE DISCUSSION ROOM- 2 I FLOOR (Lecture Hall)",
    "buildingId": "bld-5",
    "buildingName": "Learning Centre",
    "floor": 1,
    "capacity": 10,
    "category": "Lecture Hall",
    "equipment": [
      "AC",
      "Wi-Fi",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-LEARNING CENTRE DISCUSSION ROOM- 2 I FLOOR",
    "status": "available"
  },
  {
    "id": "room-learning-centre-discussion-room--1-ii-floor",
    "name": "LEARNING CENTRE DISCUSSION ROOM- 1 II FLOOR (Lecture Hall)",
    "buildingId": "bld-5",
    "buildingName": "Learning Centre",
    "floor": 2,
    "capacity": 10,
    "category": "Lecture Hall",
    "equipment": [
      "AC",
      "Wi-Fi",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-LEARNING CENTRE DISCUSSION ROOM- 1 II FLOOR",
    "status": "available"
  },
  {
    "id": "room-learning-centre-discussion-room--2-ii-floor",
    "name": "LEARNING CENTRE DISCUSSION ROOM- 2 II FLOOR (Lecture Hall)",
    "buildingId": "bld-5",
    "buildingName": "Learning Centre",
    "floor": 2,
    "capacity": 10,
    "category": "Lecture Hall",
    "equipment": [
      "AC"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-LEARNING CENTRE DISCUSSION ROOM- 2 II FLOOR",
    "status": "available"
  },
  {
    "id": "room-learning-centre-discussion-room--1-iii-floor",
    "name": "LEARNING CENTRE DISCUSSION ROOM- 1 III FLOOR (Lecture Hall)",
    "buildingId": "bld-5",
    "buildingName": "Learning Centre",
    "floor": 3,
    "capacity": 10,
    "category": "Lecture Hall",
    "equipment": [
      "AC"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-LEARNING CENTRE DISCUSSION ROOM- 1 III FLOOR",
    "status": "available"
  },
  {
    "id": "room-learning-centre-discussion-room--2-iii-floor",
    "name": "LEARNING CENTRE DISCUSSION ROOM- 2 III FLOOR (Lecture Hall)",
    "buildingId": "bld-5",
    "buildingName": "Learning Centre",
    "floor": 3,
    "capacity": 10,
    "category": "Lecture Hall",
    "equipment": [
      "AC",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-LEARNING CENTRE DISCUSSION ROOM- 2 III FLOOR",
    "status": "available"
  },
  {
    "id": "room-learning-centre-discussion-room--1-iv-floor",
    "name": "LEARNING CENTRE DISCUSSION ROOM- 1 IV FLOOR (Lecture Hall)",
    "buildingId": "bld-5",
    "buildingName": "Learning Centre",
    "floor": 4,
    "capacity": 10,
    "category": "Lecture Hall",
    "equipment": [
      "AC",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-LEARNING CENTRE DISCUSSION ROOM- 1 IV FLOOR",
    "status": "available"
  },
  {
    "id": "room-learning-centre-discussion-room--2-iv-floor",
    "name": "LEARNING CENTRE DISCUSSION ROOM- 2 IV FLOOR (Lecture Hall)",
    "buildingId": "bld-5",
    "buildingName": "Learning Centre",
    "floor": 4,
    "capacity": 10,
    "category": "Lecture Hall",
    "equipment": [
      "AC",
      "Wi-Fi"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-LEARNING CENTRE DISCUSSION ROOM- 2 IV FLOOR",
    "status": "available"
  },
  {
    "id": "room-library-first-floor",
    "name": "Library First Floor (Lecture Hall)",
    "buildingId": "bld-5",
    "buildingName": "Learning Centre",
    "floor": 1,
    "capacity": 120,
    "category": "Lecture Hall",
    "equipment": [
      "AC",
      "Wi-Fi",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Library First Floor",
    "status": "available"
  },
  {
    "id": "room-library-second-floor",
    "name": "Library Second Floor (Lecture Hall)",
    "buildingId": "bld-5",
    "buildingName": "Learning Centre",
    "floor": 2,
    "capacity": 150,
    "category": "Lecture Hall",
    "equipment": [
      "AC",
      "Wi-Fi",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Library Second Floor",
    "status": "available"
  },
  {
    "id": "room-library-third-floor",
    "name": "Library Third Floor (Lecture Hall)",
    "buildingId": "bld-5",
    "buildingName": "Learning Centre",
    "floor": 3,
    "capacity": 150,
    "category": "Lecture Hall",
    "equipment": [
      "AC",
      "Wi-Fi",
      "Audio System",
      "Computers"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-Library Third Floor",
    "status": "available"
  }
];

export const INITIAL_REQUESTS: BookingRequest[] = [
  {
    id: 'req-1',
    staffId: 'FAC5001',
    staffName: 'Dr. C. Palanisamy',
    subject: 'AI & Neural Networks Seminar',
    date: '2026-07-29',
    time: '09:00',
    duration: 2,
    strength: 65,
    facilities: ['Projector', 'Wi-Fi', 'Audio System'],
    preferredBuildingId: 'bld-1',
    remarks: 'Special AI guest lecture',
    status: 'pending',
    allocatedClassroomId: 'room-ib201',
    allocatedClassroomName: 'IB201 (Lecture Hall)',
    createdAt: '2026-07-29T08:00:00Z'
  },
  {
    id: 'req-2',
    staffId: 'FAC5002',
    staffName: 'Dr. M. Priyadharshini',
    subject: 'Cloud Computing Lab Exam',
    date: '2026-07-29',
    time: '11:15',
    duration: 2,
    strength: 45,
    facilities: ['Computers', 'AC'],
    preferredBuildingId: 'bld-1',
    remarks: 'Practical exam',
    status: 'approved',
    allocatedClassroomId: 'room-it-lab-1',
    allocatedClassroomName: 'IT Lab 1 (Computer Lab)',
    createdAt: '2026-07-29T08:30:00Z'
  }
];

export const TIMETABLE_DATA: TimetableSlot[] = [
  {
    id: 'slot-1',
    day: 'Monday',
    timeSlot: '09:00 AM - 10:00 AM',
    subject: 'Deep Learning & Neural Nets',
    teacher: 'Dr. A. Srinivasan',
    department: 'CSE',
    batch: 'IV Year CSE-A',
    classroomId: 'room-ib201',
    classroomName: 'IB201',
    color: 'bg-indigo-500'
  },
  {
    id: 'slot-2',
    day: 'Monday',
    timeSlot: '10:15 AM - 11:15 AM',
    subject: 'Data Analytics & Visualization',
    teacher: 'Dr. K. R. Vijay',
    department: 'AIDS',
    batch: 'III Year AIDS',
    classroomId: 'room-ib202',
    classroomName: 'IB202',
    color: 'bg-purple-500'
  },
  {
    id: 'slot-3',
    day: 'Tuesday',
    timeSlot: '02:00 PM - 03:00 PM',
    subject: 'VLSI Design & Embedded Systems',
    teacher: 'Dr. G. Rajesh',
    department: 'ECE',
    batch: 'III Year ECE-B',
    classroomId: 'room-as101',
    classroomName: 'AS101',
    color: 'bg-emerald-500'
  }
];

export const AI_PROMPTS = [
  {
    "prompt": "Recommend a 60-seat lecture hall in Western Wing IB Block for CSE",
    "response": "\ud83e\udd16 Based on live occupancy constraints, **IB201** in Western Wing IB Block is optimal for 60 students in CSE with a 98% utilization score and zero schedule clashes.",
    "actions": [
      "Book IB201",
      "View IB Block Map"
    ]
  },
  {
    "prompt": "Find available Computer Labs with AC and 45 PCs for IT Department",
    "response": "\ud83e\udd16 **IT Lab 1** in Western Wing IB Block has 45 active PCs, AC, and high-speed Wi-Fi available during your specified time slot.",
    "actions": [
      "Book IT Lab 1"
    ]
  },
  {
    "prompt": "Optimize seating capacity for upcoming semester examinations in Sunflower Block",
    "response": "\ud83e\udd16 **Sunflower Block (SF)** halls **SF101**, **SF102**, and **SF201** have combined capacity of 210 seats. Round-robin anti-cheating seat interleaving algorithm is ready.",
    "actions": [
      "Generate Seat Plan"
    ]
  }
];

export const MOCK_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'BIT SmartCampus Engine Active',
    message: 'All 281 campus venues synchronized with central DB.',
    type: 'success',
    read: false,
    timestamp: '10 mins ago'
  },
  {
    id: 'notif-2',
    title: 'Room Optimization Recommendation',
    message: 'IB Block AI Labs capacity optimized for peak hours.',
    type: 'info',
    read: false,
    timestamp: '1 hour ago'
  }
];
