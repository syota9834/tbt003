import React from 'react';
import { toZonedTime, format } from 'date-fns-tz';
import { Box, Typography } from '@mui/material';

const timeZone = 'Asia/Tokyo';
const DicWeeklyName : { [key: number]: any } = {0: "日", 1: "月", 2: "火", 3: "水", 4: "木", 5: "金", 6: "土"};
interface GanttHeaderProps {
  dates: Date[];  // 日付の配列
  bgs: { [key: string]: any };  // 背景色の辞書
};

const GanttHeader: React.FC<GanttHeaderProps> = ({ dates, bgs }) => {
  return (
    <Box sx={{ display: 'flex', width: '100%', borderBottom: '1px solid #ccc', backgroundColor: 'white'}}>
      {dates.map(date => {
        const zonedDate = toZonedTime(date, timeZone);
        const weeklyName = DicWeeklyName[date.getDay()];
        const dateKey = format(zonedDate, 'yyyy-MM-dd', { timeZone });
        const style = bgs[dateKey] || {};

        return (
          <Box
            key={date.toISOString()}
            sx={{
              flex: 1,
              p: '10px',
              textAlign: 'center',
              borderRight: '1px solid #ccc',
              ...style
            }}
          >
            <Typography noWrap>{format(zonedDate, 'M/d', { timeZone })} ({weeklyName})</Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default GanttHeader;
