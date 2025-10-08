
import React, { useEffect, useState } from 'react';
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

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setIsAuthenticated(false);
    setUserRole(null);
    window.location.href = '/login';
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <a href="/" className="logo">Tedics</a>
        
        <button className="menu-toggle" onClick={() => setMenuOpen(!isMenuOpen)}>
          &#9776; {/* Hamburger Icon */}
        </button>

        <nav className={`main-nav ${isMenuOpen ? 'is-open' : ''}`}>
          <a href="/" className="nav-link">Inicio</a>
          
          {isAuthenticated && (
            <a href="/services" className="nav-link">Mis Servicios</a>
          )}
          
          {(userRole === 'admin' || userRole === 'employee') && (
            <a href="/admin-dashboard" className="nav-link">Panel Admin</a>
          )}

          {isAuthenticated ? (
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          ) : (
            <a href="/login" className="nav-link">Login</a>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
