// src/pages/app/CustomerHomePage.tsx
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function CustomerHomePage() {
  const { user } = useAuth();
  const [myServices, setMyServices] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Cliente solo ve sus servicios:
        const { data } = await api.get('/services/my-services');
        setMyServices(data);
      } catch (e:any) {
        setError(e?.response?.data?.message || 'No se pudieron cargar tus servicios.');
      }
    })();
  }, []);

  return (
    <div>
      <h2>Bienvenido{user?.firstName ? `, ${user.firstName}` : ''}</h2>
      {error && <div style={{color:'crimson'}}>{error}</div>}
      <ul>{myServices.map(s => <li key={s.id}>{s.title}</li>)}</ul>
    </div>
  );
}
