import React from 'react';
import { Task } from './types';

interface GanttTaskProps {
  task: Task;
  style: React.CSSProperties;
}

const GanttTask: React.FC<GanttTaskProps> = ({ task, style }) => {
  return (
    <div className="gantt-task" style={style} title={`${task.name} (${task.startDate.toLocaleTimeString()} - ${task.endDate.toLocaleTimeString()})`}>
      {task.name}
    </div>
  );
};

export default GanttTask;
