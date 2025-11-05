import React, { useState, useEffect } from 'react';
import { Task, Assignee } from './types';
import { toZonedTime, fromZonedTime, format } from 'date-fns-tz';

const timeZone = 'Asia/Tokyo';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Task) => void;
  initialDate: Date;
  initialAssigneeId: string;
  assignees: Assignee[];
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  initialDate,
  initialAssigneeId,
  assignees,
}) => {
  const [taskName, setTaskName] = useState('');
  const [assigneeId, setAssigneeId] = useState(initialAssigneeId);
  const [startDate, setStartDate] = useState(toZonedTime(initialDate, timeZone));
  const [endDate, setEndDate] = useState(new Date(toZonedTime(initialDate, timeZone).getTime() + 60 * 60 * 1000));

  useEffect(() => {
    setAssigneeId(initialAssigneeId);
    const zonedInitialDate = toZonedTime(initialDate, timeZone);
    setStartDate(zonedInitialDate);
    setEndDate(new Date(zonedInitialDate.getTime() + 60 * 60 * 1000));
  }, [initialAssigneeId, initialDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    const newTask: Task = {
      id: String(Date.now()),
      name: taskName,
      assigneeId: assigneeId,
      startDate: fromZonedTime(startDate, timeZone),
      endDate: fromZonedTime(endDate, timeZone),
    };
    onAddTask(newTask);
    setTaskName('');
  };

  if (!isOpen) return null;

  const formatDate = (date: Date) => format(date, 'yyyy-MM-dd', { timeZone });
  const formatTime = (date: Date) => format(date, 'HH:mm', { timeZone });

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [year, month, day] = e.target.value.split('-').map(Number);
    const newDate = new Date(startDate);
    newDate.setFullYear(year, month - 1, day);
    setStartDate(newDate);
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    const newDate = new Date(startDate);
    newDate.setHours(hours, minutes);
    setStartDate(newDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [year, month, day] = e.target.value.split('-').map(Number);
    const newDate = new Date(endDate);
    newDate.setFullYear(year, month - 1, day);
    setEndDate(newDate);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    const newDate = new Date(endDate);
    newDate.setHours(hours, minutes);
    setEndDate(newDate);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>新しいタスクを追加</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="taskName">タスク名:</label>
            <input
              type="text"
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="assignee">担当者:</label>
            <select
              id="assignee"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
            >
              {assignees.map((assignee) => (
                <option key={assignee.id} value={assignee.id}>
                  {assignee.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="startDate">開始日:</label>
            <input
              type="date"
              id="startDate"
              value={formatDate(startDate)}
              onChange={handleStartDateChange}
            />
            <input
              type="time"
              id="startTime"
              value={formatTime(startDate)}
              onChange={handleStartTimeChange}
              step="1800" // 30分刻み
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">終了日:</label>
            <input
              type="date"
              id="endDate"
              value={formatDate(endDate)}
              onChange={handleEndDateChange}
            />
            <input
              type="time"
              id="endTime"
              value={formatTime(endDate)}
              onChange={handleEndTimeChange}
              step="1800" // 30分刻み
            />
          </div>
          <div className="modal-actions">
            <button type="submit">追加</button>
            <button type="button" onClick={onClose}>キャンセル</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
