import React, { useState, useEffect } from 'react';
import { getWeekStart, getWeekDays, formatDate, isToday, formatTime } from '../utils/dateUtils';
import { getWeekData, addTimeBlock, removeTimeBlock } from '../utils/storage';
import TimeBlockForm from './TimeBlockForm';
import TimeBlock from './TimeBlock';
import './TimeTracker.css';

const TimeTracker = () => {
  const [currentWeek, setCurrentWeek] = useState(getWeekStart());
  const [weekData, setWeekData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const weekDays = getWeekDays(currentWeek);

  useEffect(() => {
    loadWeekData();
  }, [currentWeek]);

  const loadWeekData = () => {
    const data = getWeekData(currentWeek);
    setWeekData(data);
  };

  const handleAddTimeBlock = (timeBlock) => {
    const updatedData = addTimeBlock(currentWeek, selectedDay, timeBlock);
    setWeekData(updatedData);
    setShowForm(false);
    setSelectedDay(null);
  };

  const handleRemoveTimeBlock = (dayIndex, blockId) => {
    const updatedData = removeTimeBlock(currentWeek, dayIndex, blockId);
    setWeekData(updatedData);
  };

  const handleDayClick = (dayIndex) => {
    setSelectedDay(dayIndex);
    setShowForm(true);
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

  const calculateDayTotal = (dayIndex) => {
    const dayBlocks = weekData[dayIndex] || [];
    return dayBlocks.reduce((total, block) => {
      const start = new Date(`2000-01-01T${block.startTime}`);
      const end = new Date(`2000-01-01T${block.endTime}`);
      const diffMs = end - start;
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return total + diffMinutes;
    }, 0);
  };

  const calculateWeekTotal = () => {
    return weekDays.reduce((total, _, dayIndex) => {
      return total + calculateDayTotal(dayIndex);
    }, 0);
  };

  return (
    <div className="time-tracker">
      <div className="header">
        <h1>Chronos - Time Tracker</h1>
        <div className="week-navigation">
          <button onClick={handlePreviousWeek}>&lt; Previous</button>
          <span className="week-display">
            {formatDate(weekDays[0])} - {formatDate(weekDays[6])}
          </span>
          <button onClick={handleNextWeek}>Next &gt;</button>
        </div>
      </div>

      <div className="week-view">
        {weekDays.map((day, dayIndex) => {
          const dayBlocks = weekData[dayIndex] || [];
          const dayTotal = calculateDayTotal(dayIndex);
          const isCurrentDay = isToday(day);

          return (
            <div 
              key={dayIndex} 
              className={`day-column ${isCurrentDay ? 'today' : ''}`}
            >
              <div className="day-header">
                <h3>{formatDate(day)}</h3>
                <div className="day-total">
                  Total: {formatTime(dayTotal)}
                </div>
              </div>
              
              <div className="time-blocks">
                {dayBlocks.map((block) => (
                  <TimeBlock
                    key={block.id}
                    block={block}
                    onRemove={() => handleRemoveTimeBlock(dayIndex, block.id)}
                  />
                ))}
              </div>
              
              <button 
                className="add-block-btn"
                onClick={() => handleDayClick(dayIndex)}
              >
                + Add Time Block
              </button>
            </div>
          );
        })}
      </div>

      <div className="week-summary">
        <h2>Week Total: {formatTime(calculateWeekTotal())}</h2>
      </div>

      {showForm && (
        <TimeBlockForm
          onSubmit={handleAddTimeBlock}
          onCancel={() => {
            setShowForm(false);
            setSelectedDay(null);
          }}
        />
      )}
    </div>
  );
};

export default TimeTracker;
