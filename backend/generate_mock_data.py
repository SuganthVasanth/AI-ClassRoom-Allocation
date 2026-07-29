import pandas as pd
import json

df = pd.read_csv('data/processed/consolidated_venues.csv')

# 1. Buildings Mapping
bld_map = {
    'Western Wing - IB Block': ('bld-1', 'IB', 'Western Wing - IB Block', 'Information Block - CS, IT, AI & Data Science Wing', 4, 85, {'x': 22, 'y': 35}),
    'Eastern Wing - AS Block': ('bld-2', 'AS', 'Eastern Wing - AS Block', 'Applied Sciences - ECE, EEE & Physics Labs', 3, 83, {'x': 55, 'y': 25}),
    'Sunflower Block': ('bld-3', 'SF', 'Sunflower Block', 'Sunflower Lecture Wing & Seminar Halls', 4, 39, {'x': 80, 'y': 45}),
    'Mechanical Science Block': ('bld-4', 'MS', 'Mechanical Science Block', 'Mechanical Engineering, Civil & Drawing Halls', 3, 48, {'x': 35, 'y': 75}),
    'Learning Centre': ('bld-5', 'LC', 'Learning Centre', 'Central Learning Centre & Conference Rooms', 4, 15, {'x': 62, 'y': 68}),
    'Research park': ('bld-6', 'RP', 'Research park', 'Research Park, Mathematics & Special Labs', 4, 11, {'x': 22, 'y': 15})
}

buildings_list = []
for k, v in bld_map.items():
    buildings_list.append({
        'id': v[0],
        'name': v[2],
        'code': v[1],
        'description': v[3],
        'floors': v[4],
        'totalClassrooms': v[5],
        'coordinates': v[6]
    })

# 2. Departments
departments_list = [
  { 'id': 'dept-1', 'name': 'Computer Science & Engineering', 'code': 'CSE', 'head': 'Dr. A. Srinivasan', 'buildingCode': 'IB', 'staffCount': 42, 'studentCount': 780 },
  { 'id': 'dept-2', 'name': 'Information Technology', 'code': 'IT', 'head': 'Dr. M. Priyadharshini', 'buildingCode': 'IB', 'staffCount': 31, 'studentCount': 540 },
  { 'id': 'dept-3', 'name': 'Artificial Intelligence & Machine Learning', 'code': 'AIML', 'head': 'Dr. P. Swaminathan', 'buildingCode': 'IB', 'staffCount': 24, 'studentCount': 420 },
  { 'id': 'dept-4', 'name': 'Artificial Intelligence & Data Science', 'code': 'AIDS', 'head': 'Dr. K. R. Vijay', 'buildingCode': 'IB', 'staffCount': 22, 'studentCount': 380 },
  { 'id': 'dept-5', 'name': 'Computer Science & Business Systems', 'code': 'CSBS', 'head': 'Dr. V. Natesan', 'buildingCode': 'IB', 'staffCount': 18, 'studentCount': 300 },
  { 'id': 'dept-6', 'name': 'Electronics & Communication Engineering', 'code': 'ECE', 'head': 'Dr. G. Rajesh', 'buildingCode': 'AS', 'staffCount': 38, 'studentCount': 720 },
  { 'id': 'dept-7', 'name': 'Electrical & Electronics Engineering', 'code': 'EEE', 'head': 'Dr. K. Venkatesh', 'buildingCode': 'AS', 'staffCount': 29, 'studentCount': 480 },
  { 'id': 'dept-8', 'name': 'Mechanical Engineering', 'code': 'MECH', 'head': 'Dr. S. Karthik', 'buildingCode': 'MS', 'staffCount': 35, 'studentCount': 600 },
  { 'id': 'dept-9', 'name': 'Civil Engineering', 'code': 'CIVIL', 'head': 'Dr. R. Loganathan', 'buildingCode': 'MS', 'staffCount': 22, 'studentCount': 360 },
  { 'id': 'dept-10', 'name': 'Biotechnology', 'code': 'BT', 'head': 'Dr. M. Vasudevan', 'buildingCode': 'AS', 'staffCount': 20, 'studentCount': 320 },
  { 'id': 'dept-11', 'name': 'Biomedical Engineering', 'code': 'BME', 'head': 'Dr. S. Gayathri', 'buildingCode': 'AS', 'staffCount': 19, 'studentCount': 310 },
  { 'id': 'dept-12', 'name': 'Agricultural Engineering', 'code': 'AGRI', 'head': 'Dr. N. Thangaraj', 'buildingCode': 'MS', 'staffCount': 21, 'studentCount': 340 },
  { 'id': 'dept-13', 'name': 'Textile Technology', 'code': 'TEXTILE', 'head': 'Dr. C. Prakash', 'buildingCode': 'MS', 'staffCount': 16, 'studentCount': 280 },
  { 'id': 'dept-14', 'name': 'Food Technology', 'code': 'FT', 'head': 'Dr. B. Anbarasu', 'buildingCode': 'AS', 'staffCount': 17, 'studentCount': 290 }
]

def parse_floor_num(f_str):
    f_lower = str(f_str).lower()
    if 'ground' in f_lower or f_lower == '0': return 0
    if '1' in f_lower or 'first' in f_lower: return 1
    if '2' in f_lower or 'second' in f_lower: return 2
    if '3' in f_lower or 'third' in f_lower: return 3
    if '4' in f_lower or 'fourth' in f_lower: return 4
    return 0

classrooms_list = []
for idx, row in df.iterrows():
    v_name = str(row['venue_name']).strip()
    b_name = str(row['block']).strip()
    v_type = str(row['venue_type']).strip()
    cap = int(row['capacity']) if pd.notna(row['capacity']) else 40
    floor_num = parse_floor_num(row.get('floor', '0'))
    
    b_info = bld_map.get(b_name)
    b_id = b_info[0] if b_info else 'bld-1'
    
    eqs = []
    if row.get('projector', 0) == 1: eqs.append('Projector')
    if row.get('ac', 0) == 1: eqs.append('AC')
    if row.get('wifi', 0) == 1: eqs.append('Wi-Fi')
    if row.get('smart_board', 0) == 1: eqs.append('Smart Board')
    if row.get('audio_video', 0) == 1: eqs.append('Audio System')
    if row.get('num_pcs', 0) > 0: eqs.append('Computers')
    if not eqs: eqs = ['Projector', 'Wi-Fi']
    
    if 'lab' in v_type.lower():
        img = 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=60'
        cat = 'Computer Lab'
    elif 'seminar' in v_type.lower() or 'conference' in v_type.lower():
        img = 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=60'
        cat = 'Seminar Hall'
    elif 'drawing' in v_type.lower():
        img = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=60'
        cat = 'Drawing Hall'
    else:
        img = 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60'
        cat = 'Lecture Hall'

    status = 'available' if idx % 4 != 0 else ('occupied' if idx % 4 == 1 else 'available')

    clean_id = 'room-' + v_name.lower().replace(' ', '-')
    classrooms_list.append({
        'id': clean_id,
        'name': f'{v_name} ({cat})',
        'buildingId': b_id,
        'buildingName': b_name,
        'floor': floor_num,
        'capacity': cap,
        'category': cat,
        'equipment': eqs,
        'imageUrl': img,
        'qrCodeUrl': f'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BIT-SmartCampus-{v_name}',
        'status': status
    })

ai_prompts_list = [
  {
    'prompt': 'Recommend a 60-seat lecture hall in Western Wing IB Block for CSE',
    'response': "🤖 Based on live occupancy constraints, **IB201** in Western Wing IB Block is optimal for 60 students in CSE with a 98% utilization score and zero schedule clashes.",
    'actions': ['Book IB201', 'View IB Block Map']
  },
  {
    'prompt': 'Find available Computer Labs with AC and 45 PCs for IT Department',
    'response': "🤖 **IT Lab 1** in Western Wing IB Block has 45 active PCs, AC, and high-speed Wi-Fi available during your specified time slot.",
    'actions': ['Book IT Lab 1']
  },
  {
    'prompt': 'Optimize seating capacity for upcoming semester examinations in Sunflower Block',
    'response': "🤖 **Sunflower Block (SF)** halls **SF101**, **SF102**, and **SF201** have combined capacity of 210 seats. Round-robin anti-cheating seat interleaving algorithm is ready.",
    'actions': ['Generate Seat Plan']
  }
]

ts_content = f"""import type {{ Building, Classroom, BookingRequest, TimetableSlot, SystemNotification, Department }} from '../types';

export const DEPARTMENTS: Department[] = {json.dumps(departments_list, indent=2)};

export const BUILDINGS: Building[] = {json.dumps(buildings_list, indent=2)};

export const CLASSROOMS: Classroom[] = {json.dumps(classrooms_list, indent=2)};

export const INITIAL_REQUESTS: BookingRequest[] = [
  {{
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
  }},
  {{
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
  }}
];

export const TIMETABLE_DATA: TimetableSlot[] = [
  {{
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
  }},
  {{
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
  }},
  {{
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
  }}
];

export const AI_PROMPTS = {json.dumps(ai_prompts_list, indent=2)};

export const MOCK_NOTIFICATIONS: SystemNotification[] = [
  {{
    id: 'notif-1',
    title: 'BIT SmartCampus Engine Active',
    message: 'All 281 campus venues synchronized with central DB.',
    type: 'success',
    read: false,
    timestamp: '10 mins ago'
  }},
  {{
    id: 'notif-2',
    title: 'Room Optimization Recommendation',
    message: 'IB Block AI Labs capacity optimized for peak hours.',
    type: 'info',
    read: false,
    timestamp: '1 hour ago'
  }}
];
"""

with open('../frontend/src/constants/mockData.ts', 'w') as f:
    f.write(ts_content)

print("Successfully updated mockData.ts with authentic BIT venue dataset and correct TypeScript types!")
