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

  checkRoomAvailability: (date: string, startTime: string, endTime: string) => {
    const query = new URLSearchParams({
      date,
      start_time: startTime,
      end_time: endTime,
    }).toString();
    return request<any>(`/room-availability?${query}`, {
      method: 'GET',
    });
  },

  getModelInfo: () =>
    request<any>('/model-info', {
      method: 'GET',
    }),

  uploadStudentExcel: async (
    file: File,
    mode: string,
    startDate: string,
    startSession: string,
    endDate?: string,
    endSession?: string
  ): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', mode);
    formData.append('start_date', startDate);
    formData.append('start_session', startSession);
    if (endDate) {
      formData.append('end_date', endDate);
    }
    if (endSession) {
      formData.append('end_session', endSession);
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
      } catch {}
      throw new Error(msg);
    }
    return response.json();
  },

  downloadAllotmentUrl: (sessionId: string) => {
    return `${API_BASE_URL}/download-allotment/${sessionId}`;
  },
};

