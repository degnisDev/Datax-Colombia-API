import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Inicio from './pages/Inicio';
import General from './pages/General';
import Presidente from './pages/Presidente';
import Comparativo from './pages/Comparativo';



function App() {
  return (
    <Router>
      {/* Navbar Premium con Glassmorphism */}
      <nav className="glass-panel" style={{
        margin: '20px auto',
        maxWidth: '800px',
        padding: '15px 30px',
        display: 'flex',
        gap: '30px',
        justifyContent: 'center',
        position: 'sticky',
        top: '20px',
        zIndex: 100
      }}>
        <Link to="/" style={{ color: 'var(--colombia-yellow)', textDecoration: 'none', fontWeight: '800', letterSpacing: '1px' }}>INICIO</Link>
        <Link to="/general" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.9rem' }}>GENERAL</Link>
        <Link to="/presidente" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.9rem' }}>PRESIDENTE</Link>
        <Link to="/comparativo" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.9rem' }}>COMPARATIVO</Link>
      </nav>

      {/* Contenedor Principal Centrado */}
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/general" element={<General />} />
          <Route path="/presidente" element={<Presidente />} />
          <Route path="/comparativo" element={<Comparativo />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;

