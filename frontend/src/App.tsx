import { Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Todo from "./Todo"
import Manage from "./Manage"
import Log from "./Log"
import Metricrs from "./metrics/Metrics";
import GanttChart from "./components/GanttChart";
import QualificationGanttChart from "./qualification/GanttChart";
import { Grid } from '@mui/material';


function App(){
  const [targetDate, setTargetDate] = useState(new Date());
  const [dicHolidays, setDicHolidays] = useState<{ [key: string]: any }>({});   // 辞書型の日付背景

  const handleSetTargetDate = (date: Date) => {
    setTargetDate(date);
  };

  // 祝日の取得
  const fetchHoliday = async () => {
    try {
      const response = await fetch("https://api.national-holidays.jp/all");
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
    <>
    <Grid container spacing={2}>
        <Routes>
          <Route path="/" element={<GanttChart targetDate={targetDate} setTargetDate={handleSetTargetDate} dicHolidays={dicHolidays} />}/>
          <Route path="/metrics" element={<Metricrs />} />
          <Route path="/qualification" element={<QualificationGanttChart targetDate={targetDate} setTargetDate={handleSetTargetDate} dicHolidays={dicHolidays} />} />
          <Route path="/manage" element={<Manage />} />
          <Route path="/daily" element={<Todo />} />
          <Route path="/log" element={<Log />} />
        </Routes>
    </Grid>
    </>
  );
}

export default App;
