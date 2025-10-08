import React from 'react';

const TestCotizaciones: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '2rem',
        borderRadius: '10px',
        textAlign: 'center'
      }}>
        <h1>🎉 ¡Navegación a Cotizaciones Funciona!</h1>
        <p>Esta es una página de prueba para verificar que la navegación funcione correctamente.</p>
        <p>Si ves este mensaje, significa que el enlace "Cotizaciones" está funcionando.</p>
      </div>
    </div>
  );
};

export default TestCotizaciones;