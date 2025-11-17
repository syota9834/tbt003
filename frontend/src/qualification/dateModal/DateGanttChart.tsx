import React, { useState, useEffect } from 'react';
import { Task, Assignee } from '../types';
import { toZonedTime, format } from 'date-fns-tz';
import { Modal, Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { ja } from 'date-fns/locale'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const timeZone = 'Asia/Tokyo';

interface DateGanttChartProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
}

const DateGanttChart: React.FC<DateGanttChartProps> = ({isOpen, onClose, selectedDate}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assignees, setAssignees] = useState<Assignee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !selectedDate) {
      return;
    }

    const fetchTasksAndAssignees = async () => {
      setLoading(true);
      setError(null);
      try {
        const tasksResponse = await fetch(`${API_BASE_URL}/task`);
        if (!tasksResponse.ok) {
          throw new Error(`HTTP error! status: ${tasksResponse.status}`);
        }
        const allTasks: Task[] = await tasksResponse.json();

        const formattedSelectedDate = format(toZonedTime(selectedDate, timeZone), 'yyyy-MM-dd', { timeZone });

        const filteredTasks = allTasks.filter(task => {
          const taskStartDate = format(toZonedTime(new Date(task.startDate), timeZone), 'yyyy-MM-dd', { timeZone });
          const taskEndDate = format(toZonedTime(new Date(task.endDate), timeZone), 'yyyy-MM-dd', { timeZone });
          return taskStartDate <= formattedSelectedDate && formattedSelectedDate <= taskEndDate;
        });
        setTasks(filteredTasks);

        const assigneesResponse = await fetch(`${API_BASE_URL}/user`);
        if (!assigneesResponse.ok) {
          throw new Error(`HTTP error! status: ${assigneesResponse.status}`);
        }
        const assigneesData: Assignee[] = await assigneesResponse.json();
        setAssignees(assigneesData);

      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasksAndAssignees();
  }, [isOpen, selectedDate]);

  const getAssigneeName = (assigneeId: number) => {
    const assignee = assignees.find(a => a.id === assigneeId);
    return assignee ? assignee.name : '未割り当て';
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "50%",
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {format(toZonedTime(selectedDate, timeZone), 'M/d (E)', { locale: ja })} のタスク
        </Typography>
        {loading && <Typography>読み込み中...</Typography>}
        {error && <Typography color="error">エラー: {error}</Typography>}
        {!loading && !error && (
          <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
            {tasks.length === 0 ? (
              <Typography>この日のタスクはありません。</Typography>
            ) : (
              tasks.map(task => (
                <div>
                  {getAssigneeName(task.assigneeId).startsWith("_") ? 
                  <Box key={task.id} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: '4px' }}>
                    <Typography variant="body2">タスク名：{getAssigneeName(task.assigneeId)}</Typography>
                    <Typography variant="body2">タイトル：{task.name}</Typography>
                    <Typography variant="body2">開始日：{format(toZonedTime(new Date(task.startDate), timeZone), 'yyyy/MM/dd HH:SS:MM', { timeZone })}</Typography>
                    <Typography variant="body2">終了日：{format(toZonedTime(new Date(task.endDate), timeZone), 'yyyy/MM/dd HH:SS:MM', { timeZone })}</Typography>
                  </Box>: ""
                  }
                </div>
              ))
            )}
          </Box>
        )}
      </Box>
    </Modal>
  )
}

export default DateGanttChart;
