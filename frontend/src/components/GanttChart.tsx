import React, { useState } from 'react';
import { Task, Assignee } from './types';
import GanttHeader from './GanttHeader';
import GanttSidebar from './GanttSidebar';
import GanttRow from './GanttRow';
import TaskModal from './TaskModal';
import EditModal from './EditModal';
import { fromZonedTime, toZonedTime, format } from 'date-fns-tz';
import { Box, Button, Paper, Typography } from '@mui/material';
// import './GanttChart.scss'; // スタイルシートを後で作成

const timeZone = 'Asia/Tokyo';

const initialAssignees: Assignee[] = [
  { id: '1', name: '担当者A' },
  { id: '2', name: '担当者B' },
  { id: '3', name: '担当者C' },
  { id: '4', name: '担当者D' },
  { id: '5', name: '担当者E' },
  { id: '6', name: '担当者F' },
  { id: '7', name: '担当者G' },
  { id: '8', name: '担当者H' },
  { id: '9', name: '担当者I' },
  { id: '10', name: '担当者J' },
];

const initialTasks: Task[] = [
  { id: 't1', name: 'タスク1', assigneeId: '1', startDate: fromZonedTime('2025-11-06 09:00:00', timeZone), endDate: fromZonedTime('2025-11-06 12:00:00', timeZone) },
  { id: 't2', name: 'タスク2', assigneeId: '2', startDate: fromZonedTime('2025-11-04 10:00:00', timeZone), endDate: fromZonedTime('2025-11-04 14:30:00', timeZone) },
  { id: 't3', name: 'タスク3', assigneeId: '3', startDate: fromZonedTime('2025-11-07 13:00:00', timeZone), endDate: fromZonedTime('2025-11-07 18:00:00', timeZone) },
];


interface gantt {
  targetDate: Date,
  setTargetDate: (date: Date) => void,
  dicHolidays: { [key: string]: any };
}

const GanttChart: React.FC<gantt> = ({targetDate, setTargetDate, dicHolidays}) => {
  const [assignees, setAssignees] = useState<Assignee[]>(initialAssignees);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string | null>(null);

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

  // タスクデータを表示用リストに格納
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  return (
    <Box sx={{ flexGrow: 1}}>
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
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
              task={selectedTask}
              assignees={assignees}
            />
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default GanttChart;
