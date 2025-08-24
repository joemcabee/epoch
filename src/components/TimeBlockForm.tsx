import React, { useState, useEffect } from 'react';
import { TimeBlockFormData, TimeBlock } from '../types';
import './TimeBlockForm.css';

interface TimeBlockFormProps {
  defaultStartTime?: string;
  editingBlock?: TimeBlock;
  onSubmit: (data: TimeBlockFormData) => void;
  onCancel: () => void;
}

const TimeBlockForm: React.FC<TimeBlockFormProps> = ({ 
  defaultStartTime = '09:00', 
  editingBlock,
  onSubmit, 
  onCancel 
}) => {
  const [startTime, setStartTime] = useState(defaultStartTime);
  const [endTime, setEndTime] = useState('17:00');
  const [description, setDescription] = useState('');

  // Initialize form with editing block data if provided
  useEffect(() => {
    if (editingBlock) {
      setStartTime(editingBlock.startTime);
      setEndTime(editingBlock.endTime || '17:00');
      setDescription(editingBlock.description || '');
    }
  }, [editingBlock]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!startTime) {
      alert('Please enter a start time');
      return;
    }

    if (endTime && startTime >= endTime) {
      alert('End time must be after start time');
      return;
    }

    onSubmit({
      startTime,
      endTime: endTime || '',
      description: description.trim() || 'Work'
    });
  };

  const isEditing = !!editingBlock;

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <h2>{isEditing ? 'Edit Time Block' : 'Add Time Block'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="startTime">Start Time:</label>
            <input
              type="time"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endTime">End Time (optional):</label>
            <input
              type="time"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (optional):</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Meeting, Coding, Break"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {isEditing ? 'Update Time Block' : 'Add Time Block'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimeBlockForm;
