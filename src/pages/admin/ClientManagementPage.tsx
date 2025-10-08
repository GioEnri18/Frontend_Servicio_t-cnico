// ruta: frontend/src/pages/admin/ClientManagementPage.tsx

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Tipos y Datos Simulados ---
interface Client {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  isB2B: boolean; // true para corporativo, false para individual
}

const mockClients: Client[] = [
  { id: 'c-001', fullName: 'Innovatec S.A.', email: 'contacto@innovatec.com', phone: '+502 2345 6789', isB2B: true },
  { id: 'c-002', fullName: 'María Robles', email: 'maria.r@email.com', phone: '+502 8765 4321', isB2B: false },
  { id: 'c-003', fullName: 'Logística Global', email: 'admin@logiglobal.gt', phone: '+502 5555 1234', isB2B: true },
  { id: 'c-004', fullName: 'Juan Pérez', email: 'juan.perez@personal.com', phone: '+502 9876 5432', isB2B: false },
  { id: 'c-005', fullName: 'Comercial Andina', email: 'compras@andina.com.gt', phone: '+502 1122 3344', isB2B: true },
];

// --- Simulación del Hook useApi ---
const useApi = () => {
  const [loading, setLoading] = useState(false);
  const get = useCallback(async (url: string): Promise<any> => {
    setLoading(true);
    console.log(`GET: ${url}`);
    return new Promise(resolve => {
      setTimeout(() => {
        if (url === '/users' || url === '/clientes') {
          resolve(mockClients);
        }
        setLoading(false);
      }, 500);
    });
  }, []);
  // Aquí irían las funciones patch, post, etc.
  return { get, loading };
};

// --- Iconos para la UI ---
const SearchIcon = () => <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>;
const PlusIcon = () => <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>;


// --- Componente Principal ---
const ClientManagementPage: React.FC = () => {
  const { get, loading } = useApi();
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    get('/clientes').then(data => setClients(data));
  }, [get]);

  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients;
    return clients.filter(client =>
      client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);

  const handleAddNewClient = () => {
    alert('Simulación: Abrir modal para crear un nuevo cliente.');
    // Lógica para abrir modal o navegar a /admin/clients/new
  };

  const handleEditClient = (id: string) => {
    alert(`Simulación: Editar cliente con ID: ${id}`);
    // Lógica para abrir modal o navegar a /admin/clients/${id}/edit
  };

  return (
    // Este componente debería ser renderizado dentro de tu AdminLayout
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
        <p className="text-gray-500 mt-1">Busca, visualiza y gestiona la cartera de clientes.</p>
      </header>

      {/* Barra de Herramientas: Búsqueda y Botón de Añadir */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          onClick={handleAddNewClient}
          className="w-full sm:w-auto flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon />
          Añadir Nuevo Cliente
        </button>
      </div>

      {/* Contenedor de la Tabla Responsiva */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={5} className="text-center py-4">Cargando clientes...</td></tr>
            ) : (
              filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      client.isB2B 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {client.isB2B ? 'Corporativo' : 'Individual'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEditClient(client.id)} className="text-indigo-600 hover:text-indigo-900">
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientManagementPage;