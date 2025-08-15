export interface TimeBlock {
  id: string;
  startTime: string;
  endTime: string;
  description?: string;
}

export interface WeekData {
  [dayIndex: number]: TimeBlock[];
}

export interface TimeBlockFormData {
  startTime: string;
  endTime: string;
  description: string;
}
