import React, { useState, useEffect } from 'react';
import { Task, Assignee } from '../types';
import { toZonedTime, format } from 'date-fns-tz';
import { Modal, Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const timeZone = 'Asia/Tokyo';

interface DateGanttChart{
  isOpen: boolean;
  onClose: () => void;
}

const DateGanttChart: React.FC<DateGanttChart> = ({isOpen, onClose}) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "80%",
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      }}>
        <Typography variant="h6" component="h2" gutterBottom>
          詳細
        </Typography>
        <div className="MuiBox-root css-dpyh7q"><p className="MuiTypography-root MuiTypography-body1 MuiTypography-noWrap css-peqrrs-MuiTypography-root">11/11 (火)</p></div>
      </Box>
    </Modal>
  )
}

export default DateGanttChart;
