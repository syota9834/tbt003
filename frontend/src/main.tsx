import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from "./App"
import { Container } from '@mui/material';
import "./App.scss";


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <App />
      </Container>
    </BrowserRouter>
  </React.StrictMode>,
)
