import React from 'react';
import { Task } from './types';
import { Box, Typography } from '@mui/material';

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
    <Box
      sx={{
        position: 'absolute',
        height: '80%',
        paddingTop: "5px",
        top: '10%',
        backgroundColor: task.completed ? 'error.main' : 'primary.main',
        color: 'white',
        alignItems: 'center',
        textAlign: 'center',
        lineHeight: 'normal',
        borderRadius: '3px',
        fontSize: '0.8em',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        display: 'block',
        boxSizing: 'border-box',
        '&:hover': {
                  backgroundColor: task.completed ? "#5e2319ff" : '#0058b1ff',
                },
        ...style,
      }}
      title={`${task.name} (${task.startDate} - ${task.endDate})`}
      onClick={handleClick}
    >
      <Typography variant="body2" noWrap >
        {task.name}
      </Typography>
    </Box>
  );
};

export default GanttTask;
