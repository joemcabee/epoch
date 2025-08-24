export interface TimeBlock {
  id: string;
  startTime: string;
  endTime?: string; // Optional to support open-ended time blocks
  description?: string;
  isActive?: boolean; // Indicates if this is an active clock-in session
}

export interface WeekData {
  [dayIndex: number]: TimeBlock[];
}

export interface TimeBlockFormData {
  startTime: string;
  endTime?: string;
  description: string;
}

export interface ClockState {
  isClockedIn: boolean;
  activeBlockId?: string;
  startTime?: string;
}
