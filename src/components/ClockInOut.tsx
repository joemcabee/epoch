import React from 'react';
import { ClockState } from '../types';
import './ClockInOut.css';

interface ClockInOutProps {
  isCurrentDay: boolean;
  clockState: ClockState;
  onClockIn: () => void;
  onClockOut: () => void;
}

const ClockInOut: React.FC<ClockInOutProps> = ({ 
  isCurrentDay, 
  clockState, 
  onClockIn, 
  onClockOut 
}) => {
  if (!isCurrentDay) {
    return null;
  }

  return (
    <>
      {clockState.isClockedIn ? (
        <button 
          className="clock-out-btn"
          onClick={onClockOut}
          title="Clock Out"
        >
          ⏹️ Clock Out
        </button>
      ) : (
        <button 
          className="clock-in-btn"
          onClick={onClockIn}
          title="Clock In"
        >
          ▶️ Clock In
        </button>
      )}
    </>
  );
};

export default ClockInOut;
