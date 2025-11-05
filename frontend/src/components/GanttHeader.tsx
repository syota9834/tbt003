import React from 'react';
import { toZonedTime, format } from 'date-fns-tz';

const timeZone = 'Asia/Tokyo';

interface GanttHeaderProps {
  dates: Date[];  // 日付の配列
  bgs: { [key: string]: string };  // 背景色の辞書
}

const GanttHeader: React.FC<GanttHeaderProps> = ({ dates, bgs }) => {
  return (
    <div className="gantt-header">
      {dates.map(date => {
        const zonedDate = toZonedTime(date, timeZone);
        const dateKey = format(zonedDate, 'yyyy-MM-dd', { timeZone });
        return (
          <div key={date.toISOString()} className={`gantt-header-cell ${bgs[dateKey] || ''}`} >
            {format(zonedDate, 'M/d', { timeZone })}
          </div>
        );
      })}
    </div>
  );
};

export default GanttHeader;
