import { WeekData, TimeBlock } from '../types';

// Storage utility for time tracking data
const STORAGE_KEY = 'epoch_time_data';

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
    saveWeekData(weekStart, weekData);
  }
  return weekData;
};
