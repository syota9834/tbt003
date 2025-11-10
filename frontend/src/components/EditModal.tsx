import React, { useState, useEffect } from 'react';
import { Task, Assignee } from './types';
import { toZonedTime, fromZonedTime, format } from 'date-fns-tz';
import { Modal, Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log(format(`${startDate}T${startTime}`, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone }))
      const response = await fetch(`${API_BASE_URL}/task/update/${task.id}`, {
        method: 'PUT', // HTTPメソッドをPOSTに指定（新しいリソースの作成）
        headers: {
          'Content-Type': 'application/json', // リクエストボディの形式がJSONであることを指定
        },
        // 送信するデータ（新しいTodoのタイトルと完了状態）をJSON文字列に変換してボディに含める
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
      console.error("Failed to fetch todos:", error);
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
        width: 400,
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
            onChange={(e) => setTaskName(e.target.value)}
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            更新
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

export default EditModal;
