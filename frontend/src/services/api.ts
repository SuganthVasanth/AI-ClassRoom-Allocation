export const API_BASE_URL = 'http://127.0.0.1:8000';

export interface RoomRequest {
  purpose: string;
  student_count: number;
  date: string;
  start_time: string;
  end_time: string;
  department: string;
  faculty_id?: string;
  strict_dept?: boolean;
}

export interface ExamRequest {
  cohort_counts: Record<string, number>;
  date: string;
  start_time: string;
  end_time: string;
}

export interface StudentInfo {
  student_id: string;
  roll_number: string;
  department: string;
  is_disabled: number;
}

export interface SeatingRequest {
  allocation_id: string;
  students: StudentInfo[];
  capacity: number;
  broken_seats?: [number, number][];
  num_cols?: number;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const parsedError = JSON.parse(errorText);
      errorMessage = parsedError.detail || errorMessage;
    } catch {
      if (errorText) errorMessage = errorText;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const api = {
  recommendRoom: (payload: RoomRequest) =>
    request<any>('/recommend-room', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  allocateExam: (payload: ExamRequest) =>
    request<any>('/allocate-exam', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  generateSeatPlan: (payload: SeatingRequest) =>
    request<any>('/generate-seat-plan', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  checkRoomAvailability: (date: string, startTime: string, endTime: string, includeOccupied: boolean = false) => {
    const params: any = {
      date,
      start_time: startTime,
      end_time: endTime,
    };
    if (includeOccupied) {
      params.include_occupied = 'true';
    }
    const query = new URLSearchParams(params).toString();
    return request<any>(`/room-availability?${query}`, {
      method: 'GET',
    });
  },
  getStudentAllotments: (email: string) => {
    return request<any>(`/student-allotment?email=${encodeURIComponent(email)}`, {
      method: 'GET',
    });
  },

  getModelInfo: () =>
    request<any>('/model-info', {
      method: 'GET',
    }),

  getAllVenues: () =>
    request<any>('/venues/all', {
      method: 'GET',
    }),

  uploadStudentExcel: async (
    file: File,
    startDate: string,
    startSession: string,
    endDate?: string,
    endSession?: string,
    fnFacilities?: string[],
    anFacilities?: string[],
    remarks?: string
  ): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('start_date', startDate);
    formData.append('start_session', startSession);
    if (endDate) {
      formData.append('end_date', endDate);
    }
    if (endSession) {
      formData.append('end_session', endSession);
    }
    if (fnFacilities && fnFacilities.length > 0) {
      formData.append('fn_facilities', fnFacilities.join(','));
    }
    if (anFacilities && anFacilities.length > 0) {
      formData.append('an_facilities', anFacilities.join(','));
    }
    if (remarks) {
      formData.append('remarks', remarks);
    }

    const response = await fetch(`${API_BASE_URL}/upload-venue-mapping`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      let msg = `HTTP error! status: ${response.status}`;
      try {
        const err = JSON.parse(text);
        msg = err.detail || msg;
      } catch { }
      throw new Error(msg);
    }
    return response.json();
  },

  downloadAllotmentUrl: (sessionId: string) => {
    return `${API_BASE_URL}/download-allotment/${sessionId}`;
  },

  getBookings: () =>
    request<any[]>('/bookings', {
      method: 'GET',
    }),

  getMyBookings: (staffId: string) =>
    request<any[]>(`/bookings?staff_id=${encodeURIComponent(staffId)}`, {
      method: 'GET',
    }),

  createBookingRequest: (payload: any) =>
    request<any>('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateBookingStatus: (id: string, status: string) =>
    request<any>(`/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};

