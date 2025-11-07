import { Routes, Route, NavLink } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Todo from "./Todo"
import Log from "./Log"
import GanttChart from "./components/GanttChart";
import { AppBar, Toolbar, Typography, Button, Grid } from '@mui/material';


function App(){
  const [targetDate, setTargetDate] = useState(new Date());
  const [dicHolidays, setDicHolidays] = useState<{ [key: string]: any }>({});   // 辞書型の日付背景

  const handleSetTargetDate = (date: Date) => {
    setTargetDate(date);
  };

  // 祝日の取得
  const fetchHoliday = async () => {
    try {
      const response = await fetch("http://api.national-holidays.jp/all");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const newHolidays: { [key: string]: any } = {};
      for(const row of data){
        let day = row["date"];
        newHolidays[day] = { backgroundColor: "#f8d7da", color: "#721c24" };
      }
      setDicHolidays(newHolidays);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  useEffect(() => {
    fetchHoliday();
  }, []);

  return (
    <Grid container spacing={2}>
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              TBT
            </Typography>
            <Button component={NavLink} to="/" color="inherit">
              予約管理
            </Button>
            <Button component={NavLink} to="/daily" color="inherit">
              今日のタスク
            </Button>
            <Button component={NavLink} to="/log" color="inherit">
              過去のタスク
            </Button>
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/"
            element={<GanttChart
              targetDate={targetDate}
              setTargetDate={handleSetTargetDate}
              dicHolidays={dicHolidays}
            />}
          />
          <Route path="/daily" element={<Todo />} />
          <Route path="/log" element={<Log />} />
        </Routes>
    </Grid>
  );
}

export default App;
