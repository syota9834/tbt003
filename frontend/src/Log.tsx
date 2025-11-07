import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid } from '@mui/material';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

interface TodoItem {
  id: number;        // Todoを一意に識別するID (数値)
  title: string;     // Todoの内容を示すテキスト (文字列)
  description: string;
  date: string;
  completed: boolean; // Todoが完了したかどうかを示すフラグ (真偽値)
}

function Log(){
  const [logs, setLogs] = useState<TodoItem[]>([]);

  const fetchLogs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/logs`);
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
     }
      const data: TodoItem[] = await response.json();
      setLogs(data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <Box sx={{ flexGrow: 1}}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            過去の記録
          </Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>日付</TableCell>
                  <TableCell>タスク名</TableCell>
                  <TableCell>備考</TableCell>
                  <TableCell>完了</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((todo) => (
                  <TableRow
                    key={todo.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {todo.date}
                    </TableCell>
                    <TableCell>{todo.title}</TableCell>
                    <TableCell>{todo.description}</TableCell>
                    <TableCell>{todo.completed ? "完了" : "未完了"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
    </Box>
  );
}
export default Log;
