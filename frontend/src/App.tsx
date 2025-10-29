import { Routes, Route, NavLink } from 'react-router-dom';
import React from 'react';
import Todo from "./Todo"
import Log from "./Log"


function App(){
  return (
  <div className="row">
    <div className="col-12 mb-4">
      {/* ナビゲーションメニュー */}
      <nav className="card navbar navbar-expand-lg bg-white">
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink to="/" className="nav-link">今日のタスク</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/log" className="nav-link">過去のタスク</NavLink>
              </li>
            </ul>
            <form className="d-flex" role="search">
              <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
              <button className="btn btn-outline-success" type="submit">Search</button>
            </form>
          </div>
        </div>
      </nav>
    </div>

    {/* ここにURLに応じたコンポーネントが表示される */}
    <div className="col-12">
      <Routes>
        <Route path="/" element={<Todo />} />
        <Route path="/log" element={<Log />} />
      </Routes>
    </div>
  </div>
  );
}

export default App;
