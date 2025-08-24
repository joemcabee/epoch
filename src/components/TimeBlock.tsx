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
  // A block is active only if it has no endTime AND is marked as active
  const isActive = !block.endTime && block.isActive === true;
  const duration = block.endTime ? formatTimeBlock(block.startTime, block.endTime) : 0;
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  return (
    <div className={`time-block ${isActive ? 'active-session' : ''}`}>
      <div className="time-block-header">
        <span className="time-range">
          {block.startTime} {block.endTime ? `- ${block.endTime}` : '- Active'}
        </span>
        <div className="time-block-actions">
          {!isActive && (
            <button 
              className="edit-btn"
              onClick={() => onEdit(block)}
              title="Edit time block"
            >
              ✏️
            </button>
          )}
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
        {isActive ? (
          <span className="active-indicator">● Active Session</span>
        ) : (
          <>
            {hours > 0 && `${hours}h`}
            {minutes > 0 && ` ${minutes}m`}
          </>
        )}
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
