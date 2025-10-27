
import React from 'react';
const trabajos = {
  'Instalación de Cámaras': [
    '/Tedics/IMG-20251025-WA0049.jpg',
    '/Tedics/IMG-20251025-WA0003.jpg'
  ],
  'Instalación de Lavadoras': [
    '/Tedics/IMG-20251025-WA0010.jpg',
    '/Tedics/IMG-20251025-WA0011.jpg'
  ],
  'Servicios': [
    '/Tedics/IMG-20251025-WA0020.jpg',
    '/Tedics/IMG-20251025-WA0021.jpg'
  ],
  'Instalación Industrial': [
    '/Tedics/IMG-20251025-WA0030.jpg',
    '/Tedics/IMG-20251025-WA0031.jpg'
  ]
};

const HomePage: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Bienvenido a Tedics</h1>
      <p>Esta es la página de inicio pública de la plataforma de servicios técnicos.</p>
      <h2>Trabajos realizados</h2>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        <div>
          <h3>Instalación de Cámaras</h3>
          <img src="/Tedics/IMG-20251025-WA0140.jpg" alt="Instalación de Cámaras referencia 1" style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', marginBottom: '1rem' }} />
          <img src="/Tedics/IMG-20251025-WA0141.jpg" alt="Instalación de Cámaras referencia 2" style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', marginBottom: '1rem' }} />
          <img src="/Tedics/IMG-20251025-WA0142.jpg" alt="Instalación de Cámaras referencia 3" style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} />
        </div>
        <div>
          <h3>Instalación de Lavadoras</h3>
          <img src="/Tedics/IMG-20251025-WA0010.jpg" alt="Instalación de Lavadoras 1" style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} />
          <img src="/Tedics/IMG-20251025-WA0011.jpg" alt="Instalación de Lavadoras 2" style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} />
        </div>
        <div>
          <h3>Servicios</h3>
          <img src="/Tedics/IMG-20251025-WA0020.jpg" alt="Servicios 1" style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} />
        </div>
        <div>
          <h3>Instalación Industrial</h3>
          <img src="/Tedics/IMG-20251025-WA0030.jpg" alt="Instalación Industrial 1" style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
