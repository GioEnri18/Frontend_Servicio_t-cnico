// src/pages/admin/AdminDashboardPage.tsx
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [services, setServices] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Admin/empleado ve todos los servicios
        const { data } = await api.get('/services');
        setServices(data);
      } catch (e:any) {
        setError(e?.response?.data?.message || 'No se pudieron cargar los servicios.');
      }
    })();
  }, []);

  return (
    <div>
      <h2>Panel Administrativo</h2>
      <p>Hola {user?.firstName}</p>
      {error && <div style={{color:'crimson'}}>{error}</div>}
      <ul>{services.map(s => <li key={s.id}>{s.title}</li>)}</ul>
    </div>
  );
}
