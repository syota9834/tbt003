import React, { useState, useEffect } from 'react';
import { toZonedTime, format } from 'date-fns-tz';
import { Box, Typography } from '@mui/material';
import DateGanttChart from "./dateModal/DateGanttChart"
import { ja } from 'date-fns/locale'

const timeZone = 'Asia/Tokyo';
interface GanttHeaderProps {
  dates: Date[];  // 日付の配列
  bgs: { [key: string]: any };  // 背景色の辞書
};

const GanttHeader: React.FC<GanttHeaderProps> = ({ dates, bgs }) => {
  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleClick = (date: Date) => {
    setSelectedDate(date);
    setIsHeaderModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setIsHeaderModalOpen(false);
    setSelectedDate(null);
  };

  return (
    <>
      <Box sx={{ display: 'flex', width: '100%', borderBottom: '1px solid #ccc', backgroundColor: 'white'}}>
        {dates.map(date => {
          const zonedDate = toZonedTime(date, timeZone);
          const dateKey = format(zonedDate, 'yyyy-MM-dd', { timeZone });
          const style = bgs[dateKey] || {};
          const targetDate = "a"

          return (
            <Box
              onClick={() => handleClick(date)}
              key={date.toISOString()}
              sx={{
                flex: 1,
                p: '10px',
                textAlign: 'center',
                borderRight: '1px solid #ccc',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                },
                ...style
              }}
            >
              <Typography noWrap>{format(toZonedTime(zonedDate, timeZone), 'M/d (E)', { locale: ja })}</Typography>
            </Box>
          );
        })}
      </Box>
      {isHeaderModalOpen && selectedDate && (
        <DateGanttChart
          isOpen={isHeaderModalOpen}
          onClose={handleCloseEditModal}
          selectedDate={selectedDate}
        />
      )}
    </>
  );
};

export default GanttHeader;
