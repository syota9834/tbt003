import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, List, ListItem, ListItemText, IconButton, Paper, Grid, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Task, Assignee } from './components/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const UserItem = {
  name: ""
}

function Manage(){
  const [inputUser, setInputUser] = useState(UserItem);
  const [users, setUsers] = useState<Assignee[]>([]);
  const [isLoading, setIsLoading] = useState(true); // ローディング状態を追加

  const getUserData = async () =>{
    try {
      const response = await fetch(`${API_BASE_URL}/user`);
        if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error); // エラーメッセージを修正
    }
  };

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();  // submitをさせない
    // 入力欄が空、または空白のみの場合は何もしない
    if (inputUser.name.trim() === '') {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/user/create`, {
        method: 'POST', // HTTPメソッドをPOSTに指定（新しいリソースの作成）
        headers: {
          'Content-Type': 'application/json', // リクエストボディの形式がJSONであることを指定
        },
        // 送信するデータ（新しいTodoのタイトルと完了状態）をJSON文字列に変換してボディに含める
        body: JSON.stringify({
          name: inputUser.name,
          DeleteFlg: false
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers([...users, data]);
      setInputUser(UserItem);
    } catch (error) {
      console.error("Failed to fetch users:", error); // エラーメッセージを修正
    } 
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
      setInputUser(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const removeUser = async (userId: string, deleteFlg: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
        method: 'PUT', // HTTPメソッドをPOSTに指定（新しいリソースの作成）
        headers: {
          'Content-Type': 'application/json', // リクエストボディの形式がJSONであることを指定
        },
        // 送信するデータ（新しいTodoのタイトルと完了状態）をJSON文字列に変換してボディに含める
        body: JSON.stringify({
          DeleteFlg: deleteFlg
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedUser = await response.json(); // 更新されたユーザー情報
      console.log(updatedUser);

      // usersステートを更新し、該当するユーザーを置き換える
      setUsers(prevUsers =>
        prevUsers.map(user => (user.id === userId ? updatedUser : user))
      );

    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true); // データフェッチ開始時にローディングをtrueに
        await Promise.all([getUserData()]);
        setIsLoading(false); // データフェッチ完了時にローディングをfalseに
      };
      fetchData();
    }, []);

  return (
    <Box sx={{ flexGrow: 1}}>

      <Paper elevation={3} sx={{ p: 2, mb:2 }}>
        <Typography variant="h6" gutterBottom>
          タスク名
        </Typography>
        <Box component="form" onSubmit={addUser} sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <TextField
            label="タスク名"
            name="name"
            value={inputUser.name}
            onChange={handleChange}
            fullWidth
            required
            size="small"
          />
          <Button variant="contained" type="submit">
            追加
          </Button>
        </Box>
      </Paper>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh'}}>
          <CircularProgress />
        </Box>
      ) : (
      <Grid container spacing={2}>
        <Grid size={6}>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'success.main' }}>
              タスク
            </Typography>
            <List>
              {users.filter(user => !user.DeleteFlg).map((user) => (
                <ListItem
                  key={user.id}
                  secondaryAction={
                    <>
                      <IconButton edge="end" aria-label="削除" onClick={() => removeUser(user.id, !user.DeleteFlg)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText primary={user.name} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
    
        <Grid size={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'error.main' }}>
              削除済
            </Typography>
            <List>
              {users.filter(user => user.DeleteFlg).map((user) => (
                <ListItem
                  key={user.id}
                  secondaryAction={
                    <>
                      <IconButton edge="end" aria-label="戻す" onClick={() => removeUser(user.id, !user.DeleteFlg)}>
                        <RadioButtonUncheckedIcon color="success" />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText primary={user.name} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
      )}
    </Box>
  )
}

export default Manage;
