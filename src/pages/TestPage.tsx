// ruta: frontend/src/pages/TestPage.tsx

import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉 ¡TEDICS Frontend Funciona!</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>El sistema está ejecutándose correctamente</p>
      
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '2rem',
        borderRadius: '10px',
        backdropFilter: 'blur(10px)',
        textAlign: 'center'
      }}>
        <h2>🔗 Enlaces de Navegación:</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <a href="/login" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.2)', borderRadius: '5px' }}>
            🔐 Ir al Login
          </a>
          <a href="/backend-test" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.2)', borderRadius: '5px' }}>
            🔧 Probar Backend
          </a>
          <a href="/about" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.2)', borderRadius: '5px' }}>
            ℹ️ Sobre Nosotros
          </a>
        </div>
      </div>

      <div style={{ marginTop: '2rem', fontSize: '0.9rem', opacity: 0.8 }}>
        <p>🌐 Frontend: http://localhost:5173</p>
        <p>🔧 Backend: http://localhost:3000</p>
        <p>📅 {new Date().toLocaleDateString()} - Sistema TEDICS</p>
      </div>
    </div>
  );
};

export default TestPage;