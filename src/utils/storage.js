// Storage utility for time tracking data
const STORAGE_KEY = 'chronos_time_data';

export const getTimeData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return {};
  }
};

export const saveTimeData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getWeekData = (weekStart) => {
  const allData = getTimeData();
  const weekKey = weekStart.toISOString().split('T')[0];
  return allData[weekKey] || [];
};

export const saveWeekData = (weekStart, timeBlocks) => {
  const allData = getTimeData();
  const weekKey = weekStart.toISOString().split('T')[0];
  allData[weekKey] = timeBlocks;
  saveTimeData(allData);
};

export const addTimeBlock = (weekStart, dayIndex, timeBlock) => {
  const weekData = getWeekData(weekStart);
  if (!weekData[dayIndex]) {
    weekData[dayIndex] = [];
  }
  weekData[dayIndex].push({
    ...timeBlock,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
  });
  saveWeekData(weekStart, weekData);
  return weekData;
};

export const removeTimeBlock = (weekStart, dayIndex, blockId) => {
  const weekData = getWeekData(weekStart);
  if (weekData[dayIndex]) {
    weekData[dayIndex] = weekData[dayIndex].filter(block => block.id !== blockId);
    saveWeekData(weekStart, weekData);
  }
  return weekData;
};
