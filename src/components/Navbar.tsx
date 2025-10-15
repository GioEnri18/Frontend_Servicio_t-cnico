// src/components/Navbar.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <nav>
      <Link to="/">Inicio</Link>
      <Link to="/services">Servicios</Link>

      <div style={{ marginLeft: 'auto' }}>
        {user ? (
          <>
            {user.role !== 'customer' && <Link to="/admin">Admin</Link>}
            <button onClick={async () => { await logout(); nav('/'); }}>Salir</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
