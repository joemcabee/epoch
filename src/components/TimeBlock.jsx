import React from 'react';
import { formatTimeBlock } from '../utils/dateUtils';
import './TimeBlock.css';

const TimeBlock = ({ block, onRemove }) => {
  const duration = formatTimeBlock(block.startTime, block.endTime);
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  return (
    <div className="time-block">
      <div className="time-block-header">
        <span className="time-range">
          {block.startTime} - {block.endTime}
        </span>
        <button 
          className="remove-btn"
          onClick={() => onRemove(block.id)}
          title="Remove time block"
        >
          ×
        </button>
      </div>
      <div className="time-block-duration">
        {hours > 0 && `${hours}h`}
        {minutes > 0 && ` ${minutes}m`}
      </div>
      {block.description && (
        <div className="time-block-description">
          {block.description}
        </div>
      )}
    </div>
  );
};

export default TimeBlock;
