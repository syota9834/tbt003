import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, NavLink } from 'react-router-dom';
import App from "./App"
import { Container } from '@mui/material';
import "./App.scss";
import { AppBar, Toolbar, Typography, Button, IconButton} from '@mui/material';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/tbt003">
       <AppBar position="sticky" sx={{top: 0}}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            テストアプリ
          </Typography>
          <Button component={NavLink} to="/qualification" color="inherit">資格</Button>
          <Button component={NavLink} to="/" color="inherit">タスク一覧</Button>
          <Button component={NavLink} to="/manage" color="inherit">タスク管理</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth={false} sx={{ mt: 5,  width: 'auto'}}>
        <App />
      </Container>
    </BrowserRouter>
  </React.StrictMode>,
)
