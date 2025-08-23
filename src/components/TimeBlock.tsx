import React from 'react';
import { formatTimeBlock } from '../utils/dateUtils';
import { TimeBlock as TimeBlockType } from '../types';
import './TimeBlock.css';

interface TimeBlockProps {
  block: TimeBlockType;
  onRemove: (id: string) => void;
  onEdit: (block: TimeBlockType) => void;
}

const TimeBlock: React.FC<TimeBlockProps> = ({ block, onRemove, onEdit }) => {
  const duration = formatTimeBlock(block.startTime, block.endTime);
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  return (
    <div className="time-block">
      <div className="time-block-header">
        <span className="time-range">
          {block.startTime} - {block.endTime}
        </span>
        <div className="time-block-actions">
          <button 
            className="edit-btn"
            onClick={() => onEdit(block)}
            title="Edit time block"
          >
            ✏️
          </button>
          <button 
            className="remove-btn"
            onClick={() => onRemove(block.id)}
            title="Remove time block"
          >
            ×
          </button>
        </div>
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
