// ruta: frontend/src/pages/ClientesPage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, userService } from '../services/api';
import styles from './ClientesPage.module.css';

// --- Tipos ---
interface ServiceRecord {
  id: string;
  serviceName: string;
  serviceType: string;
  date: string;
  status: 'completed' | 'in-progress' | 'scheduled';
  cost: number;
  description: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalServices: number;
  totalSpent: number;
  lastService: string;
  status: 'active' | 'inactive';
  registeredDate: string;
  services: ServiceRecord[];
}

interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role?: 'customer' | 'admin' | 'technician' | 'employee';
}

// --- Componente Principal ---
const ClientesPage: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isVerifyingAccess, setIsVerifyingAccess] = useState(true);

  // Verificar acceso (admin o employee)
  useEffect(() => {
    const verifyAccess = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
          navigate('/login');
          return;
        }

        const profile = await authService.getProfile();
        const userData = profile.user || profile;
        
        // Permitir acceso SOLO a admin y employee (NO a customers)
        if (userData.role !== 'admin' && userData.role !== 'employee' && userData.role !== 'technician') {
          console.log('❌ Acceso denegado. Rol:', userData.role);
          navigate('/dashboard');
          return;
        }
        
        setUserProfile(userData);
      } catch (error) {
        console.error('Error verificando acceso:', error);
        navigate('/login');
      } finally {
        setIsVerifyingAccess(false);
      }
    };

    verifyAccess();
  }, [navigate]);

  // Cargar clientes desde el backend
  useEffect(() => {
    const loadClients = async () => {
      if (!userProfile || isVerifyingAccess) return;
      
      setLoading(true);
      try {
        // Llamada real al backend
        const response = await userService.getCustomers();
        console.log('✅ Clientes cargados desde el backend:', response);
        
        // Mapear la respuesta del backend a la estructura esperada
        const mappedClients: Client[] = response.map((user: any) => ({
          id: user.id,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
          email: user.email,
          phone: user.phone || 'No registrado',
          address: user.address || 'No registrada',
          totalServices: user.totalServices || 0,
          totalSpent: user.totalSpent || 0,
          lastService: user.lastService || 'N/A',
          status: user.status || 'active',
          registeredDate: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : 'N/A',
          services: user.services || []
        }));
        
        setClients(mappedClients);
      } catch (error) {
        console.error('❌ Error cargando clientes:', error);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, [userProfile, isVerifyingAccess]);

  // Filtrar clientes
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'completed': return 'Completado';
      case 'in-progress': return 'En Proceso';
      case 'scheduled': return 'Programado';
      default: return status;
    }
  };

  const getServiceTypeColor = (type: string) => {
    switch(type) {
      case 'Instalación': return styles.typeInstallation;
      case 'Mantenimiento': return styles.typeMaintenance;
      case 'Reparación': return styles.typeRepair;
      case 'Diagnóstico': return styles.typeDiagnostic;
      case 'Energía Renovable': return styles.typeRenewable;
      default: return styles.typeDefault;
    }
  };

  if (isVerifyingAccess) {
    return (
      <div className={styles.clientesPage}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Verificando permisos...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.clientesPage}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Cargando datos de clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.clientesPage}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => navigate('/dashboard')}
              className={styles.backButton}
            >
              🏠 Dashboard
            </button>
            {userProfile?.role === 'admin' && (
              <>
                <button 
                  onClick={() => navigate('/admin-dashboard')}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  ⚙️ Panel Admin
                </button>
                <button 
                  onClick={() => navigate('/employee-list')}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  👥 Ver Empleados
                </button>
              </>
            )}
          </div>
          <h1 className={styles.pageTitle}>
            👥 Gestión de Clientes
            {userProfile?.role === 'admin' && <span style={{ color: '#10b981' }}> (Admin)</span>}
            {userProfile?.role === 'employee' && <span style={{ color: '#3b82f6' }}> (Empleado)</span>}
          </h1>
          <p className={styles.pageSubtitle}>Historial de clientes atendidos y servicios realizados</p>
        </div>
      </div>

      {/* Container Principal */}
      <div className={styles.container}>
        <div className={styles.layout}>
          
          {/* Panel Izquierdo - Lista de Clientes */}
          <div className={styles.clientsPanel}>
            
            {/* Controles de Búsqueda y Filtros */}
            <div className={styles.controls}>
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Buscar clientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              
              <div className={styles.filterContainer}>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                  className={styles.filterSelect}
                >
                  <option value="all">Todos los clientes</option>
                  <option value="active">Activos</option>
                  <option value="inactive">Inactivos</option>
                </select>
              </div>
            </div>

            {/* Lista de Clientes */}
            <div className={styles.clientsList}>
              <h2 className={styles.panelTitle}>
                Clientes ({filteredClients.length})
              </h2>
              
              {filteredClients.map(client => (
                <div 
                  key={client.id}
                  className={`${styles.clientCard} ${selectedClient?.id === client.id ? styles.selected : ''}`}
                  onClick={() => handleSelectClient(client)}
                >
                  <div className={styles.clientHeader}>
                    <h3 className={styles.clientName}>{client.name}</h3>
                    <span className={`${styles.clientStatus} ${styles[client.status]}`}>
                      {client.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  
                  <div className={styles.clientInfo}>
                    <p className={styles.clientEmail}>{client.email}</p>
                    <p className={styles.clientPhone}>{client.phone}</p>
                  </div>
                  
                  <div className={styles.clientStats}>
                    <div className={styles.stat}>
                      <span className={styles.statNumber}>{client.totalServices}</span>
                      <span className={styles.statLabel}>Servicios</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statNumber}>Q. {client.totalSpent.toFixed(2)}</span>
                      <span className={styles.statLabel}>Total Facturado</span>
                    </div>
                  </div>
                  
                  <div className={styles.lastService}>
                    <span>Último servicio: {client.lastService}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Panel Derecho - Detalles del Cliente */}
          <div className={styles.detailsPanel}>
            {selectedClient ? (
              <>
                {/* Información del Cliente */}
                <div className={styles.clientDetails}>
                  <div className={styles.detailsHeader}>
                    <h2 className={styles.clientDetailName}>{selectedClient.name}</h2>
                    <span className={`${styles.statusBadge} ${styles[selectedClient.status]}`}>
                      {selectedClient.status === 'active' ? 'Cliente Activo' : 'Cliente Inactivo'}
                    </span>
                  </div>
                  
                  <div className={styles.contactInfo}>
                    <div className={styles.contactItem}>
                      <span className={styles.contactIcon}>📧</span>
                      <span>{selectedClient.email}</span>
                    </div>
                    <div className={styles.contactItem}>
                      <span className={styles.contactIcon}>📞</span>
                      <span>{selectedClient.phone}</span>
                    </div>
                    <div className={styles.contactItem}>
                      <span className={styles.contactIcon}>📍</span>
                      <span>{selectedClient.address}</span>
                    </div>
                    <div className={styles.contactItem}>
                      <span className={styles.contactIcon}>📅</span>
                      <span>Cliente desde: {selectedClient.registeredDate}</span>
                    </div>
                  </div>

                  {/* Estadísticas del Cliente */}
                  <div className={styles.statsGrid}>
                    <div className={styles.statsCard}>
                      <h3 className={styles.statsNumber}>{selectedClient.totalServices}</h3>
                      <p className={styles.statsLabel}>Servicios Realizados</p>
                    </div>
                    <div className={styles.statsCard}>
                      <h3 className={styles.statsNumber}>Q. {selectedClient.totalSpent.toFixed(2)}</h3>
                      <p className={styles.statsLabel}>Total Facturado</p>
                    </div>
                  </div>
                </div>

                {/* Historial de Servicios */}
                <div className={styles.servicesHistory}>
                  <h3 className={styles.sectionTitle}>Historial de Servicios</h3>
                  
                  <div className={styles.servicesList}>
                    {selectedClient.services.map(service => (
                      <div key={service.id} className={styles.serviceCard}>
                        <div className={styles.serviceHeader}>
                          <h4 className={styles.serviceName}>{service.serviceName}</h4>
                          <div className={styles.serviceHeaderRight}>
                            <span className={`${styles.serviceType} ${getServiceTypeColor(service.serviceType)}`}>
                              {service.serviceType}
                            </span>
                            <span className={`${styles.serviceStatus} ${styles[service.status]}`}>
                              {getStatusLabel(service.status)}
                            </span>
                          </div>
                        </div>
                        
                        <div className={styles.serviceDetails}>
                          <div className={styles.serviceInfo}>
                            <p className={styles.serviceDescription}>{service.description}</p>
                            <div className={styles.serviceMeta}>
                              <span className={styles.serviceDate}>
                                📅 {service.date}
                              </span>
                              <span className={styles.serviceCost}>
                                💰 Q. {service.cost.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.noSelection}>
                <div className={styles.noSelectionContent}>
                  <h3>Selecciona un cliente</h3>
                  <p>Elige un cliente de la lista para ver su información detallada y historial de servicios</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientesPage;