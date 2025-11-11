import React, { useState, useEffect } from 'react';
import { Task, Assignee } from './types';
import { toZonedTime, format } from 'date-fns-tz';
import { Modal, Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const timeZone = 'Asia/Tokyo';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  task: Task;
  assignees: Assignee[];
}
const FormErrorProps = {
  error: false,
  text: ""
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onUpdateTask, onDeleteTask, task, assignees }) => {
  const [taskName, setTaskName] = useState('');
  const [formError, setFormError] = useState(FormErrorProps);
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

  const handleTaskName = (formTaskName: string) => {
    setTaskName(formTaskName);
    if (!formTaskName.trim()){
      setFormError({error: true, text: "タスク名を入力してください"});
    }else{
      setFormError(FormErrorProps);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()){
      setFormError({error: true, text: "タスク名を入力してください"});
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/task/update/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: taskName,
          startDate: format(`${startDate}T${startTime}`, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone }),
          endDate: format(`${endDate}T${endTime}`, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone }),
          assigneeId: assigneeId,
          DeleteFlg: false
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedTask = await response.json();
      onUpdateTask(updatedTask);
    } catch (error) {
      console.error("Failed to fetch task:", error);
    }
  };

  const onDelete = async() => {
    try {
      const response = await fetch(`${API_BASE_URL}/task/delete/${task.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      onDeleteTask(task);
    } catch (error) {
      console.error("Failed to fetch task:", error);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      }}>
        <Typography variant="h6" component="h2" gutterBottom>
          タスク編集
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
            error={formError.error}
            helperText={formError.text}
            onChange={(e) => handleTaskName(e.target.value)}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="assignee-label">担当者</InputLabel>
            <Select
              labelId="assignee-label"
              id="assigneeId"
              value={assigneeId}
              label="担当者"
              onChange={(e) => setAssigneeId(e.target.value as string)}
            >
              {assignees.map(a => (
                <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>
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
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
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
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="endDate"
            label="終了日"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
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
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Box display="flex" alignItems="center" sx={{ mt: 4}}>
            <Button fullWidth type="button" variant="outlined" onClick={onClose} sx={{ mr: 1 }}>キャンセル</Button>
            <Button fullWidth type="submit" variant="contained" color="success" sx={{ mr: 1 }}>更新</Button>
            <Button fullWidth type="button" variant="outlined" color="error" onClick={onDelete}>削除</Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditModal;
