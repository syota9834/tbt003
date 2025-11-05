import React from 'react';
import { Task, Assignee } from './types';
import GanttTask from './GanttTask';
import { toZonedTime, format } from 'date-fns-tz';
import { getHours, getMinutes, startOfDay, endOfDay } from 'date-fns';

const timeZone = 'Asia/Tokyo';

interface GanttRowProps {
  assignee: Assignee;
  tasks: Task[];
  dates: Date[];
  onCellClick: (date: Date, assigneeId: string) => void;
}

const GanttRow: React.FC<GanttRowProps> = ({ assignee, tasks, dates, onCellClick }) => {
  const getMinutesSinceStartOfDay = (date: Date) => {
    const zonedDate = toZonedTime(date, timeZone);
    return getHours(zonedDate) * 60 + getMinutes(zonedDate);
  };

  const totalMinutesInDay = 24 * 60; // 1日の総分数

  return (
    <div className="gantt-row">
      {dates.map(date => {
        const cellStart = startOfDay(toZonedTime(date, timeZone));
        const cellEnd = endOfDay(toZonedTime(date, timeZone));

        return (
          <div
            key={date.toISOString()}
            className="gantt-cell"
            onClick={() => onCellClick(date, assignee.id)}
          >
            {tasks
              .filter(task => {
                const taskStart = toZonedTime(task.startDate, timeZone);
                const taskEnd = toZonedTime(task.endDate, timeZone);
                return taskStart <= cellEnd && taskEnd >= cellStart;
              })
              .map(task => {
                const taskStart = toZonedTime(task.startDate, timeZone);
                const taskEnd = toZonedTime(task.endDate, timeZone);

                const effectiveStartDate = new Date(Math.max(taskStart.getTime(), cellStart.getTime()));
                const effectiveEndDate = new Date(Math.min(taskEnd.getTime(), cellEnd.getTime()));

                const startMinutes = getMinutesSinceStartOfDay(effectiveStartDate);
                const endMinutes = getMinutesSinceStartOfDay(effectiveEndDate);

                const left = (startMinutes / totalMinutesInDay) * 100;
                const right = (1 - (endMinutes / totalMinutesInDay)) * 100;

                return (
                  <GanttTask
                    key={task.id}
                    task={task}
                    style={{ left: `${left}%`, right: `${right}%` }}
                  />
                );
              })}
          </div>
        );
      })}
    </div>
  );
};

export default GanttRow;
