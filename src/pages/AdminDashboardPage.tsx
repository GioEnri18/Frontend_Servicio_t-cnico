
import React from 'react';

// En un futuro, este componente estaría protegido por una ruta privada.
const AdminDashboardPage: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Panel de Administración</h1>
      <p>Esta área es accesible solo para Administradores y Empleados.</p>
      <p>Aquí se gestionarían servicios, cotizaciones, productos y usuarios.</p>
    </div>
  );
};

export default AdminDashboardPage;
