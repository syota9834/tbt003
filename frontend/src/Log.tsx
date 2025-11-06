import React, { useState, useEffect } from 'react';
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
    <div className="row justify-content-center">
      <div className="col">
        <div className="card">
          <div className="card-header">
            過去の記録
          </div>
          <div className="card-body">
            <table className="table table-bordered">
              <thead className="table-primary">
                <tr>
                  <th>日付</th>
                  <th>タスク名</th>
                  <th>備考</th>
                  <th>完了</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((todo) => (
                <tr key={todo.id}>
                  <td>{todo.date}</td>
                  <td>{todo.title}</td>
                  <td>{todo.description}</td>
                  {todo.completed === false ? (<td>未完了</td>) : (<td>完了</td>)}
                      
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Log;
