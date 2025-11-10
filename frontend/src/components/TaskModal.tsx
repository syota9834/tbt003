import React, { useState, useEffect } from 'react';
import { Task, Assignee } from './types';
import { toZonedTime, fromZonedTime, format } from 'date-fns-tz';
import { Modal, Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const timeZone = 'Asia/Tokyo';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Task) => void;
  initialDate: Date;
  initialAssigneeId: string;
  assignees: Assignee[];
}

const FormErrorProps = {
  error: false,
  text: ""
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
  const [formError, setFormError] = useState(FormErrorProps);
  const [assigneeId, setAssigneeId] = useState(initialAssigneeId);
  const [startDate, setStartDate] = useState(toZonedTime(initialDate, timeZone));
  const [endDate, setEndDate] = useState(new Date(toZonedTime(initialDate, timeZone).getTime() + 60 * 60 * 1000));

  useEffect(() => {
    setAssigneeId(initialAssigneeId);
    const zonedInitialDate = toZonedTime(initialDate, timeZone);
    setStartDate(zonedInitialDate);
    setEndDate(new Date(zonedInitialDate.getTime() + 60 * 60 * 1000));
  }, [initialAssigneeId, initialDate]);

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
      const response = await fetch(`${API_BASE_URL}/task/create`, {
        method: 'POST', // HTTPメソッドをPOSTに指定（新しいリソースの作成）
        headers: {
          'Content-Type': 'application/json', // リクエストボディの形式がJSONであることを指定
        },
        // 送信するデータ（新しいTodoのタイトルと完了状態）をJSON文字列に変換してボディに含める
        body: JSON.stringify({
          name: taskName,
          startDate: format(startDate, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone }),
          endDate: format(endDate, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone }),
          assigneeId: assigneeId,
          DeleteFlg: false
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newTask = await response.json();
      onAddTask(newTask);
      setTaskName('');
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
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
    <>
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
            error={formError.error}
            helperText={formError.text}
            onChange={(e) => handleTaskName(e.target.value)}
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
          <Box display="flex" alignItems="center" sx={{ mt: 4}}>
            <Button type="button" fullWidth variant="outlined" sx={{ mr: 1 }} onClick={onClose}>キャンセル</Button>
            <Button type="submit" fullWidth variant="contained" color="success">追加</Button>
          </Box>
        </Box>
      </Box>
    </Modal>
    </>
  );
};

export default TaskModal;
