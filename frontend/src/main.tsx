import React from 'react'
import ReactDOM from 'react-dom/client'
// BootstrapのCSS読み込みをコメントアウトし、SCSSで読み込むように変更
// import 'bootstrap/dist/css/bootstrap.min.css';
import './css/index.scss'
import { BrowserRouter } from 'react-router-dom';
import App from "./App"


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <div className="container mt-5">
        <App />
      </div>
    </BrowserRouter>
  </React.StrictMode>,
)
