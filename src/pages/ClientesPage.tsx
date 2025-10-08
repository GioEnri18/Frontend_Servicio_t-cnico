// ruta: frontend/src/pages/ClientesPage.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

// --- Datos simulados ---
const mockClients: Client[] = [
  {
    id: '1',
    name: 'Juan Pérez García',
    email: 'juan.perez@email.com',
    phone: '+502 1234-5678',
    address: 'Zona 10, Ciudad de Guatemala',
    totalServices: 3,
    totalSpent: 2450.00,
    lastService: '2024-10-05',
    status: 'active',
    registeredDate: '2024-01-15',
    services: [
      {
        id: 's1',
        serviceName: 'Instalación Eléctrica Residencial',
        serviceType: 'Instalación',
        date: '2024-10-05',
        status: 'completed',
        cost: 850.00,
        description: 'Instalación completa de sistema eléctrico en sala y cocina'
      },
      {
        id: 's2',
        serviceName: 'Mantenimiento Sistema Eléctrico',
        serviceType: 'Mantenimiento',
        date: '2024-08-20',
        status: 'completed',
        cost: 300.00,
        description: 'Revisión general y mantenimiento preventivo'
      },
      {
        id: 's3',
        serviceName: 'Reparación Interruptores',
        serviceType: 'Reparación',
        date: '2024-06-10',
        status: 'completed',
        cost: 1300.00,
        description: 'Reemplazo de interruptores defectuosos en toda la casa'
      }
    ]
  },
  {
    id: '2',
    name: 'María González López',
    email: 'maria.gonzalez@empresa.com',
    phone: '+502 9876-5432',
    address: 'Zona 15, Guatemala',
    totalServices: 2,
    totalSpent: 1680.00,
    lastService: '2024-09-28',
    status: 'active',
    registeredDate: '2024-03-20',
    services: [
      {
        id: 's4',
        serviceName: 'Configuración de Cámaras de Seguridad',
        serviceType: 'Instalación',
        date: '2024-09-28',
        status: 'completed',
        cost: 940.00,
        description: 'Instalación de 4 cámaras de seguridad con sistema de monitoreo'
      },
      {
        id: 's5',
        serviceName: 'Instalación Sistema Domótico',
        serviceType: 'Instalación',
        date: 'in-progress',
        status: 'in-progress',
        cost: 740.00,
        description: 'Sistema de automatización para luces y climatización'
      }
    ]
  },
  {
    id: '3',
    name: 'Carlos Mendoza Ruiz',
    email: 'carlos.mendoza@gmail.com',
    phone: '+502 5555-1234',
    address: 'Antigua Guatemala',
    totalServices: 5,
    totalSpent: 4250.00,
    lastService: '2024-10-01',
    status: 'active',
    registeredDate: '2023-11-08',
    services: [
      {
        id: 's6',
        serviceName: 'Instalación Panel Solar',
        serviceType: 'Energía Renovable',
        date: '2024-10-01',
        status: 'completed',
        cost: 1800.00,
        description: 'Instalación de panel solar de 5kW para casa residencial'
      },
      {
        id: 's7',
        serviceName: 'Mantenimiento Sistema Solar',
        serviceType: 'Mantenimiento',
        date: '2024-07-15',
        status: 'completed',
        cost: 200.00,
        description: 'Limpieza y verificación de sistema solar'
      }
    ]
  },
  {
    id: '4',
    name: 'Ana Lucía Morales',
    email: 'ana.morales@hotmail.com',
    phone: '+502 7777-8888',
    address: 'Zona 7, Quetzaltenango',
    totalServices: 1,
    totalSpent: 450.00,
    lastService: '2024-09-15',
    status: 'active',
    registeredDate: '2024-09-01',
    services: [
      {
        id: 's8',
        serviceName: 'Diagnóstico Eléctrico',
        serviceType: 'Diagnóstico',
        date: '2024-09-15',
        status: 'completed',
        cost: 450.00,
        description: 'Evaluación completa del sistema eléctrico residencial'
      }
    ]
  }
];

// --- Componente Principal ---
const ClientesPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [loading, setLoading] = useState(true);

  // Simular carga de datos
  useEffect(() => {
    setTimeout(() => {
      setClients(mockClients);
      setLoading(false);
    }, 1000);
  }, []);

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
          <Link to="/" className={styles.backButton}>
            ← Volver al Panel Principal
          </Link>
          <h1 className={styles.pageTitle}>Gestión de Clientes</h1>
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