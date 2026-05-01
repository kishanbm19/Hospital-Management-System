import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/home';
import Hospitals from './pages/hospitals';
import BloodBank from './pages/bloodbank';
import './App.css';

function App() {
  const location = useLocation();

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-brand">
          <span className="brand-icon">🏥</span>
          <h1>Medicore HMS</h1>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/hospitals" className={location.pathname === '/hospitals' ? 'active' : ''}>
              Hospitals
            </Link>
          </li>
          <li>
            <Link to="/bloodbank" className={location.pathname === '/bloodbank' ? 'active' : ''}>
              Blood Bank
            </Link>
          </li>
        </ul>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/bloodbank" element={<BloodBank />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
