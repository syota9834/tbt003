import React, { useState, useEffect } from 'react';
import { Task, Assignee } from './types';
import GanttHeader from './GanttHeader';
import GanttSidebar from './GanttSidebar';
import GanttRow from './GanttRow';
import TaskModal from './TaskModal';
import EditModal from './EditModal';
import { toZonedTime, format } from 'date-fns-tz';
import { Box, Button, Paper, CircularProgress } from '@mui/material';

/**
 * 定数
 */
const timeZone = 'Asia/Tokyo';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';


interface gantt {
  targetDate: Date,
  setTargetDate: (date: Date) => void,
  dicHolidays: { [key: string]: any };
}

const GanttChart: React.FC<gantt> = ({targetDate, setTargetDate, dicHolidays}) => {
  const [assignees, setAssignees] = useState<Assignee[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // ローディング状態を追加

  const getUserData = async () =>{
    try {
      const response = await fetch(`${API_BASE_URL}/user`);
        if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAssignees(data);
    } catch (error) {
      console.error("Failed to fetch users:", error); // エラーメッセージを修正
    }
  }

  const getTaskData = async () =>{
    try {
      const response = await fetch(`${API_BASE_URL}/task`);
        if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error); // エラーメッセージを修正
    }
  }

  const handleOpenEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTask(null);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
    handleCloseEditModal();
  };

  const handleAddTask = (newTask: Task) => {
    setTasks([...tasks, newTask]);
    setIsModalOpen(false);
  };

  const handleDeleteTask = (deletedTask: Task) => {
    setTasks(tasks.filter(task => (task.id !== deletedTask.id)));
    handleCloseEditModal();
  }

  const handleOpenModal = (date: Date, assigneeId: string) => {
    setSelectedDate(date);
    setSelectedAssigneeId(assigneeId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setSelectedAssigneeId(null);
  };

  const startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 6);  // システム日付から１週間

  const dates: Date[] = [];  // 日付ヘッダー
  const bgs: { [key: string]: any } = {};   // 辞書型の日付背景
  const bg_weekly: { [key: number]: any } = {
    0: { backgroundColor: '#f8d7da', color: '#721c24' }, // Sunday
    1: { backgroundColor: 'white', color: 'black' },
    2: { backgroundColor: 'white', color: 'black' },
    3: { backgroundColor: 'white', color: 'black' },
    4: { backgroundColor: 'white', color: 'black' },
    5: { backgroundColor: 'white', color: 'black' },
    6: { backgroundColor: '#cfe2ff', color: '#084298' }  // Saturday
  };
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    // 曜日を判定し、ヘッダー色を変える
    let day_weekly = currentDate.getDay();
    let stringDate = format(toZonedTime(currentDate, timeZone), 'yyyy-MM-dd', { timeZone });
    bgs[stringDate] = bg_weekly[day_weekly];

    // 祝日は赤色にする
    if(stringDate in dicHolidays){
       bgs[stringDate] = dicHolidays[stringDate];
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }
  // システム日付は緑色にする
  bgs[format(toZonedTime(new Date(), timeZone), 'yyyy-MM-dd', { timeZone })] = { backgroundColor: '#d1e7dd', color: '#0f5132' };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // データフェッチ開始時にローディングをtrueに
      await Promise.all([getUserData(), getTaskData()]);
      setIsLoading(false); // データフェッチ完了時にローディングをfalseに
    };
    fetchData();
  }, []);

  return (
    <Box sx={{ flexGrow: 1}}>
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end'}}>
          <Button variant="outlined" onClick={() => setTargetDate(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() - 7))}>
            ＜＜
          </Button>
          <Button variant="outlined" sx={{ mx: 1 }} onClick={() => setTargetDate(new Date())}>
            今日
          </Button>
          <Button variant="outlined" onClick={() => setTargetDate(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 7))}>
            ＞＞
          </Button>
        </Box>
      </Paper>
      {isLoading ? (
        <Paper sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh'}}>
          <CircularProgress />
        </Paper>
      ) : (
        <>
          <Paper elevation={1} sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', border: '1px solid #ccc', fontFamily: 'Arial, sans-serif' }}>
                <Box sx={{ display: 'flex', width: '100%' }}>
                  <GanttSidebar assignees={assignees} />
                  <Box sx={{ flexGrow: 1, overflowX: 'auto' }}>
                    <GanttHeader dates={dates} bgs={bgs} />
                    <Box sx={{ position: 'relative' }}>
                      {assignees.map(assignee => (
                        <GanttRow
                          key={assignee.id}
                          assignee={assignee}
                          tasks={tasks.filter(task => task.assigneeId === assignee.id)}
                          dates={dates}
                          onCellClick={handleOpenModal}
                          onTaskClick={handleOpenEditModal}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              {isModalOpen && selectedDate && selectedAssigneeId && (
                <TaskModal
                  isOpen={isModalOpen}
                  onClose={handleCloseModal}
                  onAddTask={handleAddTask}
                  initialDate={selectedDate}
                  initialAssigneeId={selectedAssigneeId}
                  assignees={assignees}
                />
              )}
              {isEditModalOpen && selectedTask && (
                <EditModal
                  isOpen={isEditModalOpen}
                  onClose={handleCloseEditModal}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                  task={selectedTask}
                  assignees={assignees}
                />
              )}
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default GanttChart;
