import React, { useState } from 'react';
import { TimeBlockFormData } from '../types';
import './TimeBlockForm.css';

interface TimeBlockFormProps {
  defaultStartTime?: string;
  onSubmit: (data: TimeBlockFormData) => void;
  onCancel: () => void;
}

const TimeBlockForm: React.FC<TimeBlockFormProps> = ({ defaultStartTime = '09:00', onSubmit, onCancel }) => {
  const [startTime, setStartTime] = useState(defaultStartTime);
  const [endTime, setEndTime] = useState('17:00');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!startTime || !endTime) {
      alert('Please enter both start and end times');
      return;
    }

    if (startTime >= endTime) {
      alert('End time must be after start time');
      return;
    }

    onSubmit({
      startTime,
      endTime,
      description: description.trim() || 'Work'
    });
  };

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <h2>Add Time Block</h2>
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
            <label htmlFor="endTime">End Time:</label>
            <input
              type="time"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
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
              Add Time Block
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimeBlockForm;
