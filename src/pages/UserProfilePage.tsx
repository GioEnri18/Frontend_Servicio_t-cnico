// ruta: frontend/src/pages/UserProfilePage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import styles from './UserProfilePage.module.css';

// --- Tipos ---
interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string; // Para compatibilidad con datos estáticos
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  address?: string;
  city?: string;
  country?: string;
  avatar?: string;
  memberSince?: string;
  createdAt?: string; // Fecha del backend
  totalQuotes?: number;
  completedProjects?: number;
  role?: 'customer' | 'admin' | 'technician' | 'employee';
}

// --- Iconos SVG ---
const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7"/>
    <path d="M19 12H5"/>
  </svg>
);

const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const BuildingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
    <path d="M6 12h4"/>
    <path d="M6 8h4"/>
    <path d="M6 16h4"/>
  </svg>
);

const MapPinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const LogOutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16,17 21,12 16,7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Datos por defecto (fallback)
  const defaultProfileData: UserProfile = {
    id: '1',
    fullName: 'Usuario Anónimo',
    email: 'usuario@tedics.com',
    phone: '+502 0000-0000',
    company: 'TEDICS Guatemala',
    position: 'Usuario',
    address: 'Ciudad de Guatemala',
    city: 'Guatemala',
    country: 'Guatemala',
    avatar: '',
    memberSince: '2023-01-15',
    totalQuotes: 0,
    completedProjects: 0,
    role: 'customer'
  };

  const [profileData, setProfileData] = useState<UserProfile>(defaultProfileData);
  const [editForm, setEditForm] = useState<UserProfile>(defaultProfileData);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Verificar si hay token
      const token = localStorage.getItem('jwt_token');
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Intentar obtener perfil del backend
      const userProfile = await authService.getProfile();
      
      // Extraer los datos del objeto user anidado
      const userData = userProfile.user || userProfile;
      
      // Transformar datos del backend al formato esperado
      const transformedProfile: UserProfile = {
        id: userData.id || '1',
        firstName: userData.firstName || userData.name?.split(' ')[0] || '',
        lastName: userData.lastName || userData.name?.split(' ').slice(1).join(' ') || '',
        fullName: userData.name || userData.fullName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Usuario',
        email: userData.email || 'usuario@tedics.com',
        phone: userData.phone || '',
        role: userData.role as 'customer' | 'admin' | 'technician' | 'employee' || 'customer',
        memberSince: userData.createdAt || '2023-01-15',
        createdAt: userData.createdAt,
        // Datos por defecto para campos que no vienen del backend
        company: 'TEDICS Guatemala',
        position: userProfile.role === 'admin' ? 'Administrador' : 
                 userProfile.role === 'technician' ? 'Técnico' : 'Cliente',
        address: 'Ciudad de Guatemala',
        city: 'Guatemala',
        country: 'Guatemala',
        avatar: '',
        totalQuotes: 0,
        completedProjects: 0
      };

      setProfileData(transformedProfile);
      setEditForm(transformedProfile);
      
    } catch (error: any) {
      console.error('Error al cargar perfil:', error);
      
      // IMPORTANTE: NO redirigir automáticamente, solo mostrar datos por defecto
      setError('No se pudieron cargar los datos del perfil desde el backend. Mostrando datos locales.');
      
      // Usar datos por defecto con email del localStorage si existe
      const userEmail = localStorage.getItem('user_email') || 'usuario@tedics.com';
      const fallbackProfile = {
        ...defaultProfileData,
        email: userEmail,
        fullName: 'Usuario Logueado',
      };
      setProfileData(fallbackProfile);
      setEditForm(fallbackProfile);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setEditForm(profileData);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfileData(editForm);
    setIsEditing(false);
    // Aquí iría la llamada al API para guardar
  };

  const handleCancel = () => {
    setEditForm(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogout = () => {
    // Aquí iría la lógica de logout
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_email');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className={styles.profilePage}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        {/* Mostrar error si existe */}
        {error && (
          <div style={{ 
            backgroundColor: '#f8d7da', 
            color: '#721c24', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '20px',
            border: '1px solid #f5c6cb'
          }}>
            ⚠️ {error}
          </div>
        )}
        {/* Header */}
        <div className={styles.header}>
          <button onClick={() => navigate('/dashboard')} className={styles.backButton}>
            <ArrowLeftIcon />
            Volver al Dashboard
          </button>
          <h1 className={styles.pageTitle}>Mi Perfil</h1>
          <p className={styles.pageSubtitle}>Gestiona tu información personal y configuración</p>
        </div>

        <div className={styles.profileContent}>
          {/* Avatar y información principal */}
          <div className={styles.profileHeader}>
            <div className={styles.avatarSection}>
              <div className={styles.avatar}>
                {profileData.avatar ? (
                  <img src={profileData.avatar} alt="Avatar" />
                ) : (
                  <UserIcon />
                )}
              </div>
            </div>
            <div className={styles.userInfo}>
              <h2 className={styles.userName}>{profileData.fullName}</h2>
              <p className={styles.userEmail}>{profileData.email}</p>
              <p className={styles.userRole}>
                {profileData.role === 'admin' ? 'Administrador' : 
                 profileData.role === 'customer' ? 'Cliente' : 'Técnico'}
              </p>
              <p className={styles.memberSince}>
                Miembro desde {profileData.memberSince ? new Date(profileData.memberSince).toLocaleDateString('es-GT', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'No disponible'}
              </p>
            </div>
          </div>

          {/* Estadísticas */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📊</div>
              <div className={styles.statNumber}>{profileData.totalQuotes || 0}</div>
              <div className={styles.statLabel}>Cotizaciones</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>✅</div>
              <div className={styles.statNumber}>{profileData.completedProjects || 0}</div>
              <div className={styles.statLabel}>Completados</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📈</div>
              <div className={styles.statNumber}>
                {profileData.totalQuotes && profileData.completedProjects 
                  ? (((profileData.completedProjects / profileData.totalQuotes) * 100).toFixed(0) + '%')
                  : '0%'
                }
              </div>
              <div className={styles.statLabel}>Éxito</div>
            </div>
          </div>

          {/* Información detallada */}
          <div className={styles.infoSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Información Personal</h3>
              {!isEditing && (
                <button onClick={handleEdit} className={styles.editButton}>
                  <EditIcon />
                  Editar
                </button>
              )}
            </div>
            
            <div className={styles.infoGrid}>
              {/* Nombre completo */}
              <div className={styles.infoField}>
                <UserIcon />
                <div className={styles.fieldContent}>
                  <label className={styles.fieldLabel}>Nombre completo</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className={styles.fieldInput}
                      value={editForm.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                    />
                  ) : (
                    <span className={styles.fieldValue}>{profileData.fullName}</span>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className={styles.infoField}>
                <MailIcon />
                <div className={styles.fieldContent}>
                  <label className={styles.fieldLabel}>Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      className={styles.fieldInput}
                      value={editForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  ) : (
                    <span className={styles.fieldValue}>{profileData.email}</span>
                  )}
                </div>
              </div>

              {/* Teléfono */}
              <div className={styles.infoField}>
                <PhoneIcon />
                <div className={styles.fieldContent}>
                  <label className={styles.fieldLabel}>Teléfono</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      className={styles.fieldInput}
                      value={editForm.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  ) : (
                    <span className={styles.fieldValue}>{profileData.phone}</span>
                  )}
                </div>
              </div>

              {/* Empresa */}
              <div className={styles.infoField}>
                <BuildingIcon />
                <div className={styles.fieldContent}>
                  <label className={styles.fieldLabel}>Empresa</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className={styles.fieldInput}
                      value={editForm.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                    />
                  ) : (
                    <span className={styles.fieldValue}>{profileData.company}</span>
                  )}
                </div>
              </div>

              {/* Dirección */}
              <div className={styles.infoField}>
                <MapPinIcon />
                <div className={styles.fieldContent}>
                  <label className={styles.fieldLabel}>Dirección</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className={styles.fieldInput}
                      value={editForm.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                  ) : (
                    <span className={styles.fieldValue}>{profileData.address}</span>
                  )}
                </div>
              </div>

              {/* Ubicación */}
              <div className={styles.infoField}>
                <MapPinIcon />
                <div className={styles.fieldContent}>
                  <label className={styles.fieldLabel}>Ubicación</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className={styles.fieldInput}
                      value={`${editForm.city}, ${editForm.country}`}
                      readOnly
                      placeholder="Ciudad, País"
                    />
                  ) : (
                    <span className={styles.fieldValue}>{profileData.city}, {profileData.country}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            {isEditing && (
              <div className={styles.actionButtons}>
                <button onClick={handleSave} className={styles.saveButton}>
                  Guardar Cambios
                </button>
                <button onClick={handleCancel} className={styles.cancelButton}>
                  Cancelar
                </button>
              </div>
            )}
          </div>

          {/* Sección de logout */}
          <div className={styles.dangerZone}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Sesión</h3>
            </div>
            <div className={styles.actionButtons}>
              <button onClick={handleLogout} className={styles.logoutButton}>
                <LogOutIcon />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;