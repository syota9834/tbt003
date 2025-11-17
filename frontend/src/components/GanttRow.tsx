import React from 'react';
import { Task, Assignee } from './types';
import GanttTask from './GanttTask';
import { toZonedTime } from 'date-fns-tz';
import { getHours, getMinutes, startOfDay, endOfDay } from 'date-fns';
import { Box } from '@mui/material';

const timeZone = 'Asia/Tokyo';

interface GanttRowProps {
  assignee: Assignee;
  tasks: Task[];
  dates: Date[];
  onCellClick: (date: Date, assigneeId: number) => void;
  onTaskClick: (task: Task) => void;
}

const GanttRow: React.FC<GanttRowProps> = ({ assignee, tasks, dates, onCellClick, onTaskClick }) => {
  // Ganttチャート全体の表示期間の開始日と終了日
  const chartStartDate = startOfDay(toZonedTime(dates[0], timeZone));
  const chartEndDate = endOfDay(toZonedTime(dates[dates.length - 1], timeZone));
  const totalChartDurationMinutes = (chartEndDate.getTime() - chartStartDate.getTime()) / (1000 * 60); // チャート全体の分数

  return (
    <Box sx={{ display: 'flex', width: '100%', borderBottom: '1px solid #eee', height: '40px', position: 'relative' }}>
      {/* 日付セルはクリックイベントのために残す */}
      {dates.map(date => (
        <Box
          key={date.toISOString()}
          sx={{
            flex: 1,
            borderRight: '1px solid #eee',
            '&:hover': {
              backgroundColor: '#f0f0f0',
            },
          }}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const cellWidth = e.currentTarget.offsetWidth;
            const clickHour = Math.floor((offsetX / cellWidth) * 24);
            const clickedDate = new Date(date);
            clickedDate.setHours(clickHour);
            // 60分単位で丸める
            clickedDate.setMinutes(0);
            clickedDate.setSeconds(0);
            clickedDate.setMilliseconds(0);

            onCellClick(clickedDate, assignee.id);
          }}
        />
      ))}

      {/* タスクを日付セルに依存せず、GanttRow全体にわたってレンダリング */}
      {tasks.map(task => {
        const taskStart = toZonedTime(task.startDate, timeZone);
        const taskEnd = toZonedTime(task.endDate, timeZone);

        // タスクがチャートの表示期間内にあるかチェック
        if (taskStart > chartEndDate || taskEnd < chartStartDate) {
          return null; // 表示期間外のタスクはレンダリングしない
        }

        // チャートの開始日を基準としたタスクの開始位置と幅を計算
        const effectiveStartDate = new Date(Math.max(taskStart.getTime(), chartStartDate.getTime()));
        const effectiveEndDate = new Date(Math.min(taskEnd.getTime(), chartEndDate.getTime()));

        const startOffsetMinutes = (effectiveStartDate.getTime() - chartStartDate.getTime()) / (1000 * 60);
        const durationMinutes = (effectiveEndDate.getTime() - effectiveStartDate.getTime()) / (1000 * 60);

        const left = (startOffsetMinutes / totalChartDurationMinutes) * 100;
        const width = (durationMinutes / totalChartDurationMinutes) * 100;

        return (
          <GanttTask
            key={task.id}
            task={task}
            style={{
              position: 'absolute', // 絶対配置でGanttRow全体にわたって配置
              top: '4px', // 上に2pxの余白
              height: 'calc(100% - 8px)', // 上下2pxずつの余白を考慮して高さを調整
              left: `${left}%`,
              width: `${width}%`,
              zIndex: 1, // タスクが日付セルより手前に来るように
            }}
            onClick={onTaskClick}
          />
        );
      })}
    </Box>
  );
};

export default GanttRow;
