import React, { useState } from 'react';
import { StandardTimeBlock } from '../types';
import './ConfigScreen.css';

interface ConfigScreenProps {
  initialBlocks: StandardTimeBlock[];
  onSave: (blocks: StandardTimeBlock[]) => void;
  onCancel: () => void;
}

const ConfigScreen: React.FC<ConfigScreenProps> = ({ initialBlocks, onSave, onCancel }) => {
  const [blocks, setBlocks] = useState<StandardTimeBlock[]>(initialBlocks);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const timeToMinutes = (time: string): number => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const overlaps = (a: { startTime: string; endTime: string }, b: { startTime: string; endTime: string }): boolean => {
    const aStart = timeToMinutes(a.startTime);
    const aEnd = timeToMinutes(a.endTime);
    const bStart = timeToMinutes(b.startTime);
    const bEnd = timeToMinutes(b.endTime);
    return aStart < bEnd && bStart < aEnd;
  };

  const handleAdd = () => {
    setError('');

    if (!startTime || !endTime) {
      setError('Please enter both start and end times.');
      return;
    }

    if (startTime >= endTime) {
      setError('End time must be after start time.');
      return;
    }

    const newBlock = { startTime, endTime };
    const hasOverlap = blocks.some(b => overlaps(b, newBlock));
    if (hasOverlap) {
      setError('This block overlaps with an existing standard block.');
      return;
    }

    const block: StandardTimeBlock = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      startTime,
      endTime,
      description: description.trim() || 'Work',
    };

    const updated = [...blocks, block].sort(
      (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
    );
    setBlocks(updated);
    setDescription('');
  };

  const handleRemove = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  return (
    <div className="config-overlay">
      <div className="config-modal">
        <h2>Standard Time Blocks</h2>
        <p className="config-description">
          Define your standard daily time blocks. Use the button on each day to apply them quickly.
        </p>

        {blocks.length > 0 && (
          <div className="config-blocks-list">
            {blocks.map(block => (
              <div key={block.id} className="config-block-item">
                <span className="config-block-time">
                  {block.startTime} - {block.endTime}
                </span>
                <span className="config-block-desc">{block.description}</span>
                <button
                  className="config-remove-btn"
                  onClick={() => handleRemove(block.id)}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="config-add-row">
          <input
            type="time"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
          />
          <span className="config-time-separator">—</span>
          <input
            type="time"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="config-desc-input"
          />
          <button className="config-add-btn" onClick={handleAdd}>
            Add
          </button>
        </div>

        {error && <div className="config-error">{error}</div>}

        <div className="config-actions">
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="submit-btn" onClick={() => onSave(blocks)}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigScreen;
