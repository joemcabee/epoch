import { WeekData, TimeBlock, ClockState } from '../types';

// Storage utility for time tracking data
const STORAGE_KEY = 'epoch_time_data';
const CLOCK_STATE_KEY = 'epoch_clock_state';

// Helper function to sort time blocks by start time
const sortTimeBlocks = (timeBlocks: TimeBlock[]): TimeBlock[] => {
  return [...timeBlocks].sort((a, b) => {
    const timeA = new Date(`2000-01-01T${a.startTime}`).getTime();
    const timeB = new Date(`2000-01-01T${b.startTime}`).getTime();
    return timeA - timeB;
  });
};

export const getTimeData = (): Record<string, WeekData> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return {};
  }
};

export const saveTimeData = (data: Record<string, WeekData>): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getWeekData = (weekStart: Date): WeekData => {
  const allData = getTimeData();
  const weekKey = weekStart.toISOString().split('T')[0];
  return allData[weekKey] || [];
};

export const saveWeekData = (weekStart: Date, timeBlocks: WeekData): void => {
  const allData = getTimeData();
  const weekKey = weekStart.toISOString().split('T')[0];
  allData[weekKey] = timeBlocks;
  saveTimeData(allData);
};

export const addTimeBlock = (weekStart: Date, dayIndex: number, timeBlock: Omit<TimeBlock, 'id'>): WeekData => {
  const weekData = getWeekData(weekStart);
  if (!weekData[dayIndex]) {
    weekData[dayIndex] = [];
  }
  weekData[dayIndex].push({
    ...timeBlock,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
  } as TimeBlock);
  
  // Sort time blocks by start time
  weekData[dayIndex] = sortTimeBlocks(weekData[dayIndex]);
  
  saveWeekData(weekStart, weekData);
  return weekData;
};

export const removeTimeBlock = (weekStart: Date, dayIndex: number, blockId: string): WeekData => {
  const weekData = getWeekData(weekStart);
  if (weekData[dayIndex]) {
    weekData[dayIndex] = weekData[dayIndex].filter(block => block.id !== blockId);
    saveWeekData(weekStart, weekData);
  }
  return weekData;
};

export const updateTimeBlock = (weekStart: Date, dayIndex: number, blockId: string, updatedData: Omit<TimeBlock, 'id'>): WeekData => {
  const weekData = getWeekData(weekStart);
  if (weekData[dayIndex]) {
    weekData[dayIndex] = weekData[dayIndex].map(block => 
      block.id === blockId 
        ? { ...updatedData, id: blockId }
        : block
    );
    
    // Sort time blocks by start time
    weekData[dayIndex] = sortTimeBlocks(weekData[dayIndex]);
    
    saveWeekData(weekStart, weekData);
  }
  return weekData;
};

// Clock in/out functionality
export const getClockState = (): ClockState => {
  try {
    const data = localStorage.getItem(CLOCK_STATE_KEY);
    return data ? JSON.parse(data) : { isClockedIn: false };
  } catch (error) {
    console.error('Error reading clock state from localStorage:', error);
    return { isClockedIn: false };
  }
};

export const saveClockState = (state: ClockState): void => {
  try {
    localStorage.setItem(CLOCK_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving clock state to localStorage:', error);
  }
};

export const clockIn = (weekStart: Date, dayIndex: number, startTime: string): { weekData: WeekData; clockState: ClockState } => {
  const weekData = getWeekData(weekStart);
  if (!weekData[dayIndex]) {
    weekData[dayIndex] = [];
  }
  
  const newBlock: TimeBlock = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    startTime,
    description: 'Active Session',
    isActive: true
  };
  
  weekData[dayIndex].push(newBlock);
  
  // Sort time blocks by start time
  weekData[dayIndex] = sortTimeBlocks(weekData[dayIndex]);
  
  saveWeekData(weekStart, weekData);
  
  const clockState: ClockState = {
    isClockedIn: true,
    activeBlockId: newBlock.id,
    startTime
  };
  saveClockState(clockState);
  
  return { weekData, clockState };
};

export const clockOut = (weekStart: Date, dayIndex: number, blockId: string, endTime: string): { weekData: WeekData; clockState: ClockState } => {
  const weekData = getWeekData(weekStart);
  if (weekData[dayIndex]) {
    weekData[dayIndex] = weekData[dayIndex].map(block => 
      block.id === blockId 
        ? { 
            ...block, 
            endTime, 
            isActive: false,
            description: block.description === 'Active Session' ? 'Work' : block.description
          }
        : block
    );
    
    // Sort time blocks by start time
    weekData[dayIndex] = sortTimeBlocks(weekData[dayIndex]);
    
    saveWeekData(weekStart, weekData);
  }
  
  const clockState: ClockState = {
    isClockedIn: false
  };
  saveClockState(clockState);
  
  return { weekData, clockState };
};
