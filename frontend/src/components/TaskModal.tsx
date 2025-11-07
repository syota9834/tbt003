import React, { useState, useEffect } from 'react';
import { Task, Assignee } from './types';
import { toZonedTime, fromZonedTime, format } from 'date-fns-tz';
import { Modal, Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

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
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      }}>
        <Typography variant="h6" component="h2" gutterBottom>
          新しいタスクを追加
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="taskName"
            label="タスク名"
            name="taskName"
            autoFocus
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="assignee-label">担当者</InputLabel>
            <Select
              labelId="assignee-label"
              id="assignee"
              value={assigneeId}
              label="担当者"
              onChange={(e) => setAssigneeId(e.target.value as string)}
            >
              {assignees.map((assignee) => (
                <MenuItem key={assignee.id} value={assignee.id}>
                  {assignee.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            required
            fullWidth
            id="startDate"
            label="開始日"
            type="date"
            value={formatDate(startDate)}
            onChange={handleStartDateChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="startTime"
            label="開始時刻"
            type="time"
            value={formatTime(startDate)}
            onChange={handleStartTimeChange}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{ step: 1800 }} // 30分刻み
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="endDate"
            label="終了日"
            type="date"
            value={formatDate(endDate)}
            onChange={handleEndDateChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="endTime"
            label="終了時刻"
            type="time"
            value={formatTime(endDate)}
            onChange={handleEndTimeChange}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{ step: 1800 }} // 30分刻み
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            追加
          </Button>
          <Button
            type="button"
            fullWidth
            variant="outlined"
            onClick={onClose}
          >
            キャンセル
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TaskModal;
