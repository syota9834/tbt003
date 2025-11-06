import React, { useState } from 'react';
import { Task, Assignee } from './types';
import GanttHeader from './GanttHeader';
import GanttSidebar from './GanttSidebar';
import GanttRow from './GanttRow';
import TaskModal from './TaskModal';
import EditModal from './EditModal';
import { fromZonedTime, toZonedTime, format } from 'date-fns-tz';
import './GanttChart.scss'; // スタイルシートを後で作成

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


/**
 * 日付定数
 */
const today = toZonedTime(new Date(), timeZone);
const systemDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
const endOfWeek = new Date(systemDate.getFullYear(), systemDate.getMonth(), systemDate.getDate() + 6);  // システム日付から１週間

const GanttChart: React.FC = () => {
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

  const dates: Date[] = [];  // 日付ヘッダー
  const bgs: { [key: string]: string } = {};   // 辞書型の日付背景
  const bg_weekly: { [key: number]: string } = {
    0: "text-bg-danger",
    1: "text-bg-white",
    2: "text-bg-white",
    3: "text-bg-white",
    4: "text-bg-white",
    5: "text-bg-white",
    6: "text-bg-primary"
  };
  let currentDate = new Date(systemDate);
  while (currentDate <= endOfWeek) {
    dates.push(new Date(currentDate));
    // 曜日を判定し、ヘッダー色を変える
    let day_weekly = currentDate.getDay();
    bgs[format(toZonedTime(currentDate, timeZone), 'yyyy-MM-dd', { timeZone })] = bg_weekly[day_weekly];
    currentDate.setDate(currentDate.getDate() + 1);
  }
  bgs[format(toZonedTime(systemDate, timeZone), 'yyyy-MM-dd', { timeZone })] = "text-bg-success";

  // タスクデータを表示用リストに格納
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  return (
    <div className="gantt-chart-container">
      <div className="gantt-header-sidebar-wrapper">
        <GanttSidebar assignees={assignees} />
        <div className="gantt-main-content">
          <GanttHeader dates={dates} bgs={bgs}/>
          <div className="gantt-rows-container">
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
          </div>
        </div>
      </div>
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
    </div>
  );
};

export default GanttChart;
