import { Routes, Route, NavLink } from 'react-router-dom';
import Todo from "./Todo"
import Log from "./Log"
import GanttChart from "./components/GanttChart";


function App(){
  return (
  <div className="row">
    <div className="col-12 mb-4">
      {/* ナビゲーションメニュー */}
      <nav className="card navbar navbar-expand bg-white">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink to="/" className="nav-link">予約管理</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/daily" className="nav-link">今日のタスク</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/log" className="nav-link">過去のタスク</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>

    {/* ここにURLに応じたコンポーネントが表示される */}
    <div className="col-12">
      <Routes>
        <Route path="/" element={<GanttChart />} />
        <Route path="/daily" element={<Todo />} />
        <Route path="/log" element={<Log />} />  
      </Routes>
    </div>
  </div>
  );
}

export default App;
