import React from 'react';
import { Task } from './types';
interface GanttTaskProps {
  task: Task;
  style: React.CSSProperties;
  onClick: (task: Task) => void;
}

const GanttTask: React.FC<GanttTaskProps> = ({ task, style, onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();  // 新規作成モーダルを開かないように設定
    onClick(task);
  };

  return (
    <div
      className="gantt-task"
      style={style}
      title={`${task.name} (${task.startDate.toLocaleTimeString()} - ${task.endDate.toLocaleTimeString()})`}
      onClick={handleClick}
    >
      {task.name}
    </div>
  );
};

export default GanttTask;
