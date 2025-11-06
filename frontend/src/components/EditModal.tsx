import React, { useState, useEffect } from 'react';
import { Task, Assignee } from './types';
import { toZonedTime, fromZonedTime, format } from 'date-fns-tz';

const timeZone = 'Asia/Tokyo';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask: (task: Task) => void;
  task: Task;
  assignees: Assignee[];
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onUpdateTask, task, assignees }) => {
  const [taskName, setTaskName] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    if (task) {
      const zonedStartDate = toZonedTime(task.startDate, timeZone);
      const zonedEndDate = toZonedTime(task.endDate, timeZone);

      setTaskName(task.name);
      setAssigneeId(task.assigneeId);
      setStartDate(format(zonedStartDate, 'yyyy-MM-dd'));
      setStartTime(format(zonedStartDate, 'HH:mm'));
      setEndDate(format(zonedEndDate, 'yyyy-MM-dd'));
      setEndTime(format(zonedEndDate, 'HH:mm'));
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTask: Task = {
      ...task,
      name: taskName,
      assigneeId,
      startDate: fromZonedTime(`${startDate}T${startTime}`, timeZone),
      endDate: fromZonedTime(`${endDate}T${endTime}`, timeZone),
    };
    onUpdateTask(updatedTask);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>タスク編集</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>タスク名</label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>担当者</label>
            <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} required>
              {assignees.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>開始日時</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>終了日時</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="submit">更新</button>
            <button type="button" onClick={onClose}>キャンセル</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
