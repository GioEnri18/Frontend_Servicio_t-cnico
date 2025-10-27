
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css'; // Importamos el CSS

// En una aplicación real, usar una librería como jwt-decode
const getRoleFromToken = (token: string): string | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null;
  } catch (error) {
    console.error("Error decodificando el token:", error);
    return null;
  }
};

const Header: React.FC = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      const role = getRoleFromToken(token);
      setUserRole(role);
      setIsAuthenticated(true);
    }
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setIsAuthenticated(false);
    setUserRole(null);
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="logo">Tedics</Link>
        
        <button className="menu-toggle" onClick={() => setMenuOpen(!isMenuOpen)}>
          &#9776; {/* Hamburger Icon */}
        </button>

        <nav className={`main-nav ${isMenuOpen ? 'is-open' : ''}`}>
          <Link to="/" className="nav-link">Inicio</Link>
          
          {isAuthenticated && (
            <>
              <Link to="/services" className="nav-link">Servicios</Link>
              <Link to="/cotizaciones" className="nav-link">Cotizaciones</Link>
            </>
          )}
          
          {(userRole === 'admin' || userRole === 'employee') && (
            <Link to="/admin-dashboard" className="nav-link">Panel Admin</Link>
          )}

          {isAuthenticated ? (
            <>
              <Link to="/profile" className="nav-link">👤 Mi Perfil</Link>
              <button onClick={handleLogout} className="btn-logout">
                🚪 Cerrar Sesión
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-link">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
