// ruta: frontend/src/pages/UserProfilePage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { authService } from '../services/api';
import styles from './UserProfilePage.module.css';

// --- Tipos ---
interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin' | 'technician' | 'employee';
  createdAt?: string;
  updatedAt?: string;
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
  const { user, isAuthenticated, loading, logout } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/login');
      return;
    }

    if (user) {
      // Convertir los datos del usuario del contexto al formato UserProfile
      const userProfile: UserProfile = {
        id: user.id,
        firstName: user.firstName || user.name?.split(' ')[0] || '',
        lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email,
        phone: user.phone || '',
        role: user.role as 'customer' | 'admin' | 'technician' | 'employee',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
      setProfileData(userProfile);
      setEditForm(userProfile);
    }
  }, [user, isAuthenticated, loading, navigate]);

  const handleEdit = () => {
    if (profileData) {
      setEditForm({ ...profileData });
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!editForm) return;
    
    setIsLoading(true);
    try {
      // Aquí iría la llamada al API para actualizar el perfil
      // const updatedProfile = await authService.updateProfile(editForm);
      setProfileData(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditForm(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    if (!editForm) return;
    setEditForm(prev => ({
      ...prev!,
      [field]: value
    }));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading || !profileData) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>Cargando perfil...</div>
      </div>
    );
      [field]: value
    }));
  };

  const handleLogout = () => {
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
        {/* Header */}
        <div className={styles.header}>
          <Link to="/dashboard" className={styles.backButton}>
            <ArrowLeftIcon />
            Volver al Dashboard
          </Link>
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
              <button className={styles.avatarButton}>Cambiar Foto</button>
            </div>
            
            <div className={styles.mainInfo}>
              <h2 className={styles.userName}>{profileData.fullName}</h2>
              <p className={styles.userRole}>
                {profileData.role === 'admin' ? 'Administrador' : 
                 profileData.role === 'technician' ? 'Técnico' : 'Cliente'}
              </p>
              <p className={styles.memberSince}>
                Miembro desde {new Date(profileData.memberSince).toLocaleDateString('es-GT', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            <div className={styles.headerActions}>
              {!isEditing ? (
                <button onClick={handleEdit} className={styles.editButton}>
                  <EditIcon />
                  Editar Perfil
                </button>
              ) : (
                <div className={styles.editActions}>
                  <button onClick={handleSave} className={styles.saveButton}>
                    Guardar
                  </button>
                  <button onClick={handleCancel} className={styles.cancelButton}>
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Estadísticas */}
          <div className={styles.statsSection}>
            <div className={styles.statsCard}>
              <div className={styles.statNumber}>{profileData.totalQuotes}</div>
              <div className={styles.statLabel}>Cotizaciones Totales</div>
            </div>
            <div className={styles.statsCard}>
              <div className={styles.statNumber}>{profileData.completedProjects}</div>
              <div className={styles.statLabel}>Proyectos Completados</div>
            </div>
            <div className={styles.statsCard}>
              <div className={styles.statNumber}>
                {((profileData.completedProjects / profileData.totalQuotes) * 100).toFixed(0)}%
              </div>
              <div className={styles.statLabel}>Tasa de Éxito</div>
            </div>
          </div>

          {/* Información personal */}
          <div className={styles.infoSection}>
            <h3 className={styles.sectionTitle}>Información Personal</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoField}>
                <div className={styles.fieldIcon}>
                  <UserIcon />
                </div>
                <div className={styles.fieldContent}>
                  <label className={styles.fieldLabel}>Nombre Completo</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={styles.fieldInput}
                    />
                  ) : (
                    <span className={styles.fieldValue}>{profileData.fullName}</span>
                  )}
                </div>
              </div>

              <div className={styles.infoField}>
                <div className={styles.fieldIcon}>
                  <MailIcon />
                </div>
                <div className={styles.fieldContent}>
                  <label className={styles.fieldLabel}>Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={styles.fieldInput}
                    />
                  ) : (
                    <span className={styles.fieldValue}>{profileData.email}</span>
                  )}
                </div>
              </div>

              <div className={styles.infoField}>
                <div className={styles.fieldIcon}>
                  <PhoneIcon />
                </div>
                <div className={styles.fieldContent}>
                  <label className={styles.fieldLabel}>Teléfono</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={styles.fieldInput}
                    />
                  ) : (
                    <span className={styles.fieldValue}>{profileData.phone}</span>
                  )}
                </div>
              </div>

              <div className={styles.infoField}>
                <div className={styles.fieldIcon}>
                  <BuildingIcon />
                </div>
                <div className={styles.fieldContent}>
                  <label className={styles.fieldLabel}>Empresa</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className={styles.fieldInput}
                    />
                  ) : (
                    <span className={styles.fieldValue}>{profileData.company}</span>
                  )}
                </div>
              </div>

              <div className={styles.infoField}>
                <div className={styles.fieldIcon}>
                  <MapPinIcon />
                </div>
                <div className={styles.fieldContent}>
                  <label className={styles.fieldLabel}>Dirección</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={styles.fieldInput}
                    />
                  ) : (
                    <span className={styles.fieldValue}>{profileData.address}</span>
                  )}
                </div>
              </div>

              <div className={styles.infoField}>
                <div className={styles.fieldIcon}>
                  <MapPinIcon />
                </div>
                <div className={styles.fieldContent}>
                  <label className={styles.fieldLabel}>Ciudad, País</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={`${editForm.city}, ${editForm.country}`}
                      onChange={(e) => {
                        const [city, country] = e.target.value.split(', ');
                        handleInputChange('city', city || '');
                        handleInputChange('country', country || '');
                      }}
                      className={styles.fieldInput}
                    />
                  ) : (
                    <span className={styles.fieldValue}>{profileData.city}, {profileData.country}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Acciones de cuenta */}
          <div className={styles.accountActions}>
            <h3 className={styles.sectionTitle}>Acciones de Cuenta</h3>
            <div className={styles.actionButtons}>
              <button className={styles.changePasswordButton}>
                Cambiar Contraseña
              </button>
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