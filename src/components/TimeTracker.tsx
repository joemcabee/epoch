import React, { useState, useEffect } from 'react';
import { getWeekStart, getWeekDays, formatDate, isToday, formatTime, isFutureDate, getCurrentTime, getTimeInDecimalFormat } from '../utils/dateUtils';
import { getWeekData, addTimeBlock, removeTimeBlock, updateTimeBlock, getClockState, clockIn, clockOut } from '../utils/storage';
import { TimeBlockFormData, WeekData, TimeBlock as TimeBlockType, ClockState } from '../types';
import TimeBlockForm from './TimeBlockForm';
import TimeBlock from './TimeBlock';
import ClockInOut from './ClockInOut';
import './TimeTracker.css';

const TimeTracker: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState<Date>(getWeekStart());
  const [weekData, setWeekData] = useState<WeekData>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showWeekends, setShowWeekends] = useState<boolean>(false);
  const [editingBlock, setEditingBlock] = useState<TimeBlockType | null>(null);
  const [clockState, setClockState] = useState<ClockState>({ isClockedIn: false });

  const weekDays = getWeekDays(currentWeek);
  const filteredWeekDays = showWeekends ? weekDays : weekDays.filter((_, index) => index < 5);

  useEffect(() => {
    loadWeekData();
    loadClockState();
  }, [currentWeek]);

  const loadWeekData = () => {
    const data = getWeekData(currentWeek);
    setWeekData(data);
  };

  const loadClockState = () => {
    const state = getClockState();
    setClockState(state);
  };

  const handleAddTimeBlock = (timeBlock: TimeBlockFormData) => {
    const updatedData = addTimeBlock(currentWeek, selectedDay!, timeBlock);
    setWeekData(updatedData);
    setShowForm(false);
    setSelectedDay(null);
  };

  const handleUpdateTimeBlock = (timeBlock: TimeBlockFormData) => {
    if (editingBlock && selectedDay !== null) {
      const updatedData = updateTimeBlock(currentWeek, selectedDay, editingBlock.id, timeBlock);
      setWeekData(updatedData);
      setShowForm(false);
      setSelectedDay(null);
      setEditingBlock(null);
    }
  };

  const handleRemoveTimeBlock = (dayIndex: number, blockId: string) => {
    const updatedData = removeTimeBlock(currentWeek, dayIndex, blockId);
    setWeekData(updatedData);
  };

  const handleEditTimeBlock = (block: TimeBlockType) => {
    setEditingBlock(block);
    setSelectedDay(weekDays.findIndex(day => {
      const dayBlocks = weekData[weekDays.findIndex(d => d.toDateString() === day.toDateString())] || [];
      return dayBlocks.some(b => b.id === block.id);
    }));
    setShowForm(true);
  };

  const handleDayClick = (dayIndex: number) => {
    setSelectedDay(dayIndex);
    setEditingBlock(null);
    setShowForm(true);
  };

  const handleClockIn = () => {
    const todayIndex = weekDays.findIndex(day => isToday(day));
    if (todayIndex !== -1) {
      const currentTime = getCurrentTime();
      const { weekData: updatedWeekData, clockState: updatedClockState } = clockIn(currentWeek, todayIndex, currentTime);
      setWeekData(updatedWeekData);
      setClockState(updatedClockState);
    }
  };

  const handleClockOut = () => {
    if (clockState.activeBlockId) {
      const todayIndex = weekDays.findIndex(day => isToday(day));
      if (todayIndex !== -1) {
        const currentTime = getCurrentTime();
        const { weekData: updatedWeekData, clockState: updatedClockState } = clockOut(currentWeek, todayIndex, clockState.activeBlockId, currentTime);
        setWeekData(updatedWeekData);
        setClockState(updatedClockState);
      }
    }
  };

  const getLastEndTime = (dayIndex: number): string => {
    const dayBlocks = weekData[dayIndex] || [];
    if (dayBlocks.length === 0) return '09:00';
    
    // Sort blocks by start time and get the latest end time
    const sortedBlocks = [...dayBlocks].sort((a, b) => {
      return new Date(`2000-01-01T${a.startTime}`).getTime() - new Date(`2000-01-01T${b.startTime}`).getTime();
    });
    
    const lastBlock = sortedBlocks[sortedBlocks.length - 1];
    return lastBlock.endTime || lastBlock.startTime;
  };

  const handlePreviousWeek = () => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(newWeek);
  };

  const handleNextWeek = () => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(newWeek);
  };

  const calculateDayTotal = (dayIndex: number): number => {
    const dayBlocks = weekData[dayIndex] || [];
    return dayBlocks.reduce((total, block) => {
      if (!block.endTime) return total; // Skip active sessions in total calculation
      const start = new Date(`2000-01-01T${block.startTime}`);
      const end = new Date(`2000-01-01T${block.endTime}`);
      const diffMs = end.getTime() - start.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return total + diffMinutes;
    }, 0);
  };

  const calculateWeekTotal = (): number => {
    return filteredWeekDays.reduce((total, _, dayIndex) => {
      return total + calculateDayTotal(dayIndex);
    }, 0);
  };

  const handleFormSubmit = (data: TimeBlockFormData) => {
    if (editingBlock) {
      handleUpdateTimeBlock(data);
    } else {
      handleAddTimeBlock(data);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedDay(null);
    setEditingBlock(null);
  };

  return (
    <div className="time-tracker">
      <div className="header">
        <h1>Epoch - Time Tracker</h1>
        <div className="week-navigation">
          <button onClick={handlePreviousWeek}>&lt; Previous</button>
          <span className="week-display">
            {formatDate(weekDays[0])} - {formatDate(weekDays[showWeekends ? 6 : 4])}
          </span>
          <button onClick={handleNextWeek}>Next &gt;</button>
        </div>
        
        <div className="settings">
          <label className="weekend-toggle">
            <input
              type="checkbox"
              checked={showWeekends}
              onChange={(e) => setShowWeekends(e.target.checked)}
            />
            <span className="checkbox-label">Show weekends (Saturday & Sunday)</span>
          </label>
        </div>
      </div>

      <div className={`week-view ${!showWeekends ? 'weekdays-only' : ''}`}>
        {filteredWeekDays.map((day, dayIndex) => {
          const dayBlocks = weekData[dayIndex] || [];
          const dayTotal = calculateDayTotal(dayIndex);
          const isCurrentDay = isToday(day);
          const isFutureDay = isFutureDate(day);
          const dayTotalInDecimal = getTimeInDecimalFormat(dayTotal);

          return (
            <div 
              key={dayIndex} 
              className={`day-column ${isCurrentDay ? 'today' : ''}`}
            >
              <div className="day-header">
                <h3>{formatDate(day)}</h3>
                <div className="day-total">
                  Total: {formatTime(dayTotal)}
                  <br/>
                  ({dayTotalInDecimal})
                </div>
              </div>
              
              <div className="time-blocks">
                {dayBlocks.map((block) => (
                  <TimeBlock
                    key={block.id}
                    block={block}
                    onRemove={() => handleRemoveTimeBlock(dayIndex, block.id)}
                    onEdit={handleEditTimeBlock}
                  />
                ))}
              </div>
              
              <ClockInOut
                isCurrentDay={isCurrentDay}
                clockState={clockState}
                onClockIn={handleClockIn}
                onClockOut={handleClockOut}
              />
              
              {!isFutureDay && (
                <button 
                  className="add-block-btn"
                  onClick={() => handleDayClick(dayIndex)}
                >
                  + Add Time Block
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="week-summary">
        <div className="week-stats">
          <div className="stat-item">
            <span className="stat-label">Hours Worked:</span>
            <span className="stat-value">{formatTime(calculateWeekTotal())}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Remaining to 40h:</span>
            <span className="stat-value">{formatTime(Math.max(0, 40 * 60 - calculateWeekTotal()))}</span>
          </div>
        </div>
      </div>

      {showForm && (
        <TimeBlockForm
          defaultStartTime={selectedDay !== null && !editingBlock ? getLastEndTime(selectedDay) : '09:00'}
          editingBlock={editingBlock || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default TimeTracker;
