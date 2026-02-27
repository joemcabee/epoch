import React from 'react';
import { formatDate, formatTime } from '../utils/dateUtils';
import './HistoryModal.css';

export interface WeekHistoryEntry {
  start: Date;
  end: Date;
  totalMinutes: number;
  daysWorked: number;
}

interface HistoryModalProps {
  entries: WeekHistoryEntry[];
  onClose: () => void;
  onLoadMore: () => void;
  hasMore: boolean;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ entries, onClose, onLoadMore, hasMore }) => {
  return (
    <div className="history-overlay">
      <div className="history-modal">
        <button className="history-close-btn" onClick={onClose} title="Close">
          ✖️
        </button>
        <h2>Week History</h2>
        <table className="history-table">
          <thead>
            <tr>
              <th>Week Start</th>
              <th>Week End</th>
              <th>Hours Worked</th>
              <th>Days Worked</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.start.toISOString()}>
                <td>{formatDate(e.start)}</td>
                <td>{formatDate(e.end)}</td>
                <td>{formatTime(e.totalMinutes)}</td>
                <td>{e.daysWorked}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {hasMore && (
          <div className="history-load-more">
            <button onClick={onLoadMore}>Load more</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryModal;
