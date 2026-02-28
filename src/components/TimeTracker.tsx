import React, { useState, useEffect } from 'react';
import { getWeekStart, getWeekDays, formatDate, isToday, formatTime, isFutureDate, getCurrentTime, getTimeInDecimalFormat } from '../utils/dateUtils';
import { getWeekData, addTimeBlock, removeTimeBlock, updateTimeBlock, getClockState, clockIn, clockOut, getStandardBlocks, saveStandardBlocks, getAllWeekData } from '../utils/storage';
import { TimeBlockFormData, WeekData, TimeBlock as TimeBlockType, ClockState, StandardTimeBlock } from '../types';
import TimeBlockForm from './TimeBlockForm';
import TimeBlock from './TimeBlock';
import ClockInOut from './ClockInOut';
import ConfigScreen from './ConfigScreen';
import HistoryModal, { WeekHistoryEntry } from './HistoryModal';
import './TimeTracker.css';

const TimeTracker: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState<Date>(getWeekStart());
  const [weekData, setWeekData] = useState<WeekData>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showWeekends, setShowWeekends] = useState<boolean>(false);
  const [editingBlock, setEditingBlock] = useState<TimeBlockType | null>(null);
  const [clockState, setClockState] = useState<ClockState>({ isClockedIn: false });
  const [standardBlocks, setStandardBlocks] = useState<StandardTimeBlock[]>([]);
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [historyEntries, setHistoryEntries] = useState<WeekHistoryEntry[]>([]);
  const [historyPage, setHistoryPage] = useState<number>(1);
  const HISTORY_PAGE_SIZE = 4;

  const weekDays = getWeekDays(currentWeek);
  const filteredWeekDays = showWeekends ? weekDays : weekDays.filter((_, index) => index < 5);

  // determine if the displayed week is the same as the current calendar week
  const isDisplayingCurrentWeek = (() => {
    const today = new Date();
    const thisWeekStart = getWeekStart(today);
    return thisWeekStart.getTime() === currentWeek.getTime();
  })();

  // flag for when the viewed week is before the current week
  const isPastWeek = !isDisplayingCurrentWeek && currentWeek.getTime() < getWeekStart().getTime();

  const goToCurrentWeek = () => {
    setCurrentWeek(getWeekStart());
  };

  useEffect(() => {
    try {
      loadWeekData();
      loadClockState();
      setStandardBlocks(getStandardBlocks());
    } catch (error) {
      console.error('Error loading data:', error);
      // Optionally show user-friendly error message
    }
  }, [currentWeek]);

  // Automatically show weekends when week data is loaded if weekend data exists
  useEffect(() => {
    const hasWeekendData = (weekData[5] && weekData[5].length > 0) || (weekData[6] && weekData[6].length > 0);
    if (hasWeekendData) {
      setShowWeekends(true);
    }
  }, [weekData]);

  // Automatically show weekends if viewing current week and clock is active
  useEffect(() => {
    const isCurrentWeek = (() => {
      const currentWeekStart = getWeekStart();
      const currentWeekStartDate = new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth(), currentWeekStart.getDate());
      const displayedWeekStartDate = new Date(currentWeek.getFullYear(), currentWeek.getMonth(), currentWeek.getDate());
      return currentWeekStartDate.getTime() === displayedWeekStartDate.getTime();
    })();

    if (isCurrentWeek && clockState.isClockedIn) {
      setShowWeekends(true);
    }
  }, [clockState.isClockedIn, currentWeek]);

  const loadWeekData = () => {
    try {
      const data = getWeekData(currentWeek);
      console.log('Loaded week data for', currentWeek.toLocaleDateString(), ':', data);
      setWeekData(data);
    } catch (error) {
      console.error('Failed to load week data:', error);
      setWeekData([]);
    }
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

  const handleSaveConfig = (blocks: StandardTimeBlock[]) => {
    saveStandardBlocks(blocks);
    setStandardBlocks(blocks);
    setShowConfig(false);
  };

  // ---------- history helpers ----------
  const computeWeekStats = (weekData: WeekData): { totalMinutes: number; daysWorked: number } => {
    let total = 0;
    let daysWorked = 0;
    for (let i = 0; i < 7; i++) {
      const dayBlocks = weekData[i] || [];
      if (dayBlocks.length > 0) {
        daysWorked++;
      }
      total += dayBlocks.reduce((subtotal, block) => {
        if (!block.endTime) return subtotal;
        const start = new Date(`2000-01-01T${block.startTime}`);
        const end = new Date(`2000-01-01T${block.endTime}`);
        const diffMs = end.getTime() - start.getTime();
        const diffMin = Math.floor(diffMs / (1000 * 60));
        return subtotal + diffMin;
      }, 0);
    }
    return { totalMinutes: total, daysWorked };
  };

  const loadHistory = () => {
    const allData = getAllWeekData();
    const entries: WeekHistoryEntry[] = Object.keys(allData)
      .map(key => {
        const start = new Date(key);
        const weekData = allData[key];
        const stats = computeWeekStats(weekData);
        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        return {
          start,
          end,
          totalMinutes: stats.totalMinutes,
          daysWorked: stats.daysWorked,
        };
      })
      .sort((a, b) => b.start.getTime() - a.start.getTime());

    setHistoryEntries(entries);
    setHistoryPage(1);
  };

  const handleOpenHistory = () => {
    loadHistory();
    setShowHistory(true);
  };

  const handleLoadMoreHistory = () => {
    setHistoryPage(prev => prev + 1);
  };

  const displayedHistory = historyEntries.slice(0, historyPage * HISTORY_PAGE_SIZE);
  const hasMoreHistory = historyEntries.length > displayedHistory.length;

  const handleAddStandardBlocks = (dayIndex: number) => {
    const dayBlocks = weekData[dayIndex] || [];
    let updatedData = { ...weekData };

    for (const std of standardBlocks) {
      const alreadyExists = dayBlocks.some(
        b => b.startTime === std.startTime && b.endTime === std.endTime
      );
      if (!alreadyExists) {
        updatedData = addTimeBlock(currentWeek, dayIndex, {
          startTime: std.startTime,
          endTime: std.endTime,
          description: std.description,
        });
      }
    }

    setWeekData(updatedData);
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
          {!isDisplayingCurrentWeek && (
            <>
              {isPastWeek && (
                <button className="current-btn" onClick={goToCurrentWeek} title="Go to current week">
                  Today
                </button>
              )}
              <button onClick={handleNextWeek}>Next &gt;</button>
            </>
          )}
        </div>
        
        <div className="settings">
          <label className="weekend-toggle">
            <input
              type="checkbox"
              checked={showWeekends}
              onChange={(e) => setShowWeekends(e.target.checked)}
            />
            <span className="checkbox-label">Show weekends</span>
          </label>
          <button
            className="history-btn"
            onClick={handleOpenHistory}
            title="History"
          >
            📊
          </button>
          <button
            className="config-btn"
            onClick={() => setShowConfig(true)}
            title="Configuration"
          >
            ⚙️
          </button>
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
              
              {!isFutureDay && standardBlocks.length > 0 && (
                <button
                  className="add-standard-btn"
                  onClick={() => handleAddStandardBlocks(dayIndex)}
                >
                  + Add Standard Blocks
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

      {showConfig && (
        <ConfigScreen
          initialBlocks={standardBlocks}
          onSave={handleSaveConfig}
          onCancel={() => setShowConfig(false)}
        />
      )}

      {showHistory && (
        <HistoryModal
          entries={displayedHistory}
          onClose={() => setShowHistory(false)}
          onLoadMore={handleLoadMoreHistory}
          hasMore={hasMoreHistory}
        />
      )}
    </div>
  );
};

export default TimeTracker;
