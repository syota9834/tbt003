import React, { useState } from 'react';
import { Task, Assignee } from './types';
import GanttHeader from './GanttHeader';
import GanttSidebar from './GanttSidebar';
import GanttRow from './GanttRow';
import TaskModal from './TaskModal';
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
  { id: 't1', name: 'タスク1', assigneeId: '1', startDate: fromZonedTime('2025-11-02 09:00:00', timeZone), endDate: fromZonedTime('2025-11-02 17:00:00', timeZone) },
  { id: 't2', name: 'タスク2', assigneeId: '2', startDate: fromZonedTime('2025-11-04 10:00:00', timeZone), endDate: fromZonedTime('2025-11-04 14:30:00', timeZone) },
  { id: 't3', name: 'タスク3', assigneeId: '1', startDate: fromZonedTime('2025-11-04 13:00:00', timeZone), endDate: fromZonedTime('2025-11-04 18:00:00', timeZone) },
];

// 現在の週の月曜日を基準にタスク日付を調整するヘルパー関数
const adjustTaskDatesToCurrentWeek = (tasks: Task[], startOfWeek: Date): Task[] => {
  // initialTasksの基準日を2025年11月4日と仮定
  const initialBaseDate = fromZonedTime('2025-11-04 00:00:00', timeZone);

  return tasks.map(task => {
    const taskStartDate = toZonedTime(task.startDate, timeZone);
    const taskEndDate = toZonedTime(task.endDate, timeZone);

    const dayDiffStart = Math.round((taskStartDate.getTime() - initialBaseDate.getTime()) / (1000 * 60 * 60 * 24));
    const dayDiffEnd = Math.round((taskEndDate.getTime() - initialBaseDate.getTime()) / (1000 * 60 * 60 * 24));

    const adjustedStartDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + dayDiffStart, taskStartDate.getHours(), taskStartDate.getMinutes());
    const adjustedEndDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + dayDiffEnd, taskEndDate.getHours(), taskEndDate.getMinutes());
    
    return { ...task, startDate: fromZonedTime(adjustedStartDate, timeZone), endDate: fromZonedTime(adjustedEndDate, timeZone) };
  });
};

const GanttChart: React.FC = () => {
  const [assignees, setAssignees] = useState<Assignee[]>(initialAssignees);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string | null>(null);

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

  // JSTで現在の日付を取得
  const today = toZonedTime(new Date(), timeZone);
  const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // システム日付
  const endOfWeek = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 6);  // システム日付から１週間

  const dates: Date[] = [];  // 日付ヘッダー
  const bgs: { [key: string]: string } = {};   // 辞書型の日付背景
  const bg_weekly: { [key: number]: string } = {
    0: "text-bg-danger",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "text-bg-primary"
  };
  let currentDate = new Date(startOfWeek);
  while (currentDate <= endOfWeek) {
    dates.push(new Date(currentDate));
    // 曜日を判定し、ヘッダー色を変える
    let day_weekly = currentDate.getDay();
    bgs[format(toZonedTime(currentDate, timeZone), 'yyyy-MM-dd', { timeZone })] = bg_weekly[day_weekly];
    currentDate.setDate(currentDate.getDate() + 1);
  }
  bgs[format(toZonedTime(startOfWeek, timeZone), 'yyyy-MM-dd', { timeZone })] = "text-bg-success";

  // 初期タスクの日付を現在の週に合わせて調整
  const adjustedInitialTasks = adjustTaskDatesToCurrentWeek(initialTasks, startOfWeek);
  const [tasks, setTasks] = useState<Task[]>(adjustedInitialTasks);

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
    </div>
  );
};

export default GanttChart;
