import React, { useEffect, useRef, useState } from 'react';
import { Task } from '../types';
import './TaskModal.css';

interface TaskModalProps {
  dateLabel: string;
  tasks: Task[];
  onAddTask: (name: string) => void;
  onToggleTaskCompletion: (taskId: string, completed: boolean) => void;
  onDeleteTask: (taskId: string) => void;
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  dateLabel,
  tasks,
  onAddTask,
  onToggleTaskCompletion,
  onDeleteTask,
  onClose,
}) => {
  const [taskName, setTaskName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTaskName('');
    inputRef.current?.focus();
  }, [dateLabel]);

  const handleAdd = () => {
    const trimmed = taskName.trim();
    if (!trimmed) return;
    onAddTask(trimmed);
    setTaskName('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAdd();
    }
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="task-modal-backdrop" onClick={handleBackdropClick}>
      <div className="task-modal" role="dialog" aria-modal="true" aria-label={`Tasks for ${dateLabel}`}>
        <div className="task-modal-header">
          <h3>Tasks for {dateLabel}</h3>
          <button type="button" className="task-modal-close-icon" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="task-input-row">
          <input
            ref={inputRef}
            type="text"
            placeholder="Add a new task"
            value={taskName}
            onChange={e => setTaskName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button type="button" onClick={handleAdd} className="task-add-btn">
            Add
          </button>
        </div>

        <div className="task-table-wrapper">
          <table className="task-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Completed</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={3} className="task-empty">
                    No tasks for this day yet.
                  </td>
                </tr>
              ) : (
                tasks.map(task => (
                  <tr key={task.id}>
                    <td>{task.name}</td>
                    <td>
                      <label className="task-checkbox">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={e => onToggleTaskCompletion(task.id, e.target.checked)}
                        />
                      </label>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="task-delete-btn"
                        onClick={() => onDeleteTask(task.id)}
                        aria-label={`Delete ${task.name}`}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <button type="button" className="task-modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default TaskModal;
