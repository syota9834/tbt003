import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Typography, Paper, Grid } from '@mui/material';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

interface UserMetric {
  name: string;
  completedTime: number;
}

const formatMinutesToHours = (tick: number) => {
  const hours = Math.floor(tick / 60);
  const minutes = tick % 60;
  return `${hours}h ${minutes}m`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
        <p className="label">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${formatMinutesToHours(entry.value)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Metrics = () => {
  const [metricsData, setMetricsData] = useState<UserMetric[]>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/metrics/completed_task_time_by_user`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: UserMetric[] = await response.json();
        setMetricsData(data);
      } catch (error) {
        console.error("Failed to fetch metrics:", error);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={3}>
          <Grid>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                完了タスク時間
              </Typography>
              <div style={{ width: '100%', height: "70vh" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    width={500}
                    height={300}
                    data={metricsData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-90} textAnchor="end" interval={0} height={200}/>
                    <YAxis tickFormatter={formatMinutesToHours} label={{ value: '', angle: -90, position: 'insideLeft' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="completedTime" fill="#8884d8" name="完了時間" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default Metrics;
