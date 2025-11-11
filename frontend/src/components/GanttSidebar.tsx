import React from 'react';
import { Assignee } from './types';
import { Box, Typography } from '@mui/material';

interface GanttSidebarProps {
  assignees: Assignee[];
}

const GanttSidebar: React.FC<GanttSidebarProps> = ({ assignees }) => {
  return (
    <Box sx={{ width: '150px', flexShrink: 0, borderRight: '1px solid #ccc', backgroundColor: 'white' }}>
      <Box sx={{ p: '10px', fontWeight: 'bold', borderBottom: '1px solid #ccc', backgroundColor: 'white' }}>
        <Typography>タスク名</Typography>
      </Box>
      {assignees.filter(assignee => !assignee.DeleteFlg).map(assignee => (
        <Box key={assignee.id} sx={{pl: "10px", borderBottom: '1px solid #eee', height: '40px', display: 'flex', alignItems: 'center' }}>
          <Typography>{assignee.name}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default GanttSidebar;
