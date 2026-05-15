import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';

import Inicio from './pages/Inicio';
import General from './pages/General';
import Presidente from './pages/Presidente';
import Comparativo from './pages/Comparativo';

function App() {
  return (
    <Router>
      {/* Navbar Premium con Glassmorphism */}
      <nav className="glass-panel main-navbar">
        <NavLink to="/" className={({ isActive }) => `nav-link logo-link ${isActive ? 'active' : ''}`}>
          INICIO
        </NavLink>
        <NavLink to="/general" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          GENERAL
        </NavLink>
        <NavLink to="/presidente" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          PRESIDENTE
        </NavLink>
        <NavLink to="/comparativo" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          COMPARATIVO
        </NavLink>
      </nav>

      {/* Contenedor Principal Centrado */}
      <main className="app-main-content">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/general" element={<General />} />
          <Route path="/presidente" element={<Presidente />} />
          <Route path="/comparativo" element={<Comparativo />} />
        </Routes>
      </main>

      {/* Footer de Autor */}
      <footer className="author-footer">
        <p>Developed by <span className="author-name">degnisDev</span></p>
        <p className="copyright">All Rights Reserved</p>
        <a href="https://degnisdev.com" target="_blank" rel="noopener noreferrer" className="author-link">degnisdev.com</a>
      </footer>
    </Router>
  );
}

export default App;

