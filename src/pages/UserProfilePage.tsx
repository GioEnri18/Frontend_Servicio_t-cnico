import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './UserProfilePage.module.css';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';

// DTO for updating user profile, should match backend
interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  company?: string;
}

// --- Iconos SVG (reutilizados) ---
const ArrowLeftIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
const UserIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const MailIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const PhoneIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const BuildingIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12h4"/><path d="M6 8h4"/><path d="M6 16h4"/></svg>;
const MapPinIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const EditIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const LogOutIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, loading: authLoading, refresh } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UpdateUserDto>({});
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        address: user.address || '',
        company: user.company || '',
      });
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setFeedback(null);
  };

  const handleSave = async () => {
    try {
      await apiClient.patch('/users/profile', editForm);
      await refresh(); // Refetch user data to update the context
      setIsEditing(false);
      setFeedback({ type: 'success', message: 'Perfil actualizado con éxito.' });
    } catch (error) {
      console.error("Failed to update profile", error);
      setFeedback({ type: 'error', message: 'Error al actualizar el perfil.' });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        address: user.address || '',
        company: user.company || '',
      });
    }
  };

  const handleInputChange = (field: keyof UpdateUserDto, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (authLoading || !user) {
    return (
      <div className={styles.profilePage}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link to="/" className={styles.backButton}><ArrowLeftIcon /> Volver al Inicio</Link>
          <h1 className={styles.pageTitle}>Mi Perfil</h1>
        </div>

        {feedback && (
          <div className={`${styles.feedback} ${styles[feedback.type]}`}>
            {feedback.message}
          </div>
        )}

        <div className={styles.profileContent}>
          <div className={styles.profileHeader}>
            <div className={styles.avatarSection}>
              <div className={styles.avatar}><UserIcon /></div>
            </div>
            <div className={styles.mainInfo}>
              <h2 className={styles.userName}>{fullName}</h2>
              <p className={styles.userRole}>{user.role}</p>
            </div>
            <div className={styles.headerActions}>
              {!isEditing ? (
                <button onClick={handleEdit} className={styles.editButton}><EditIcon /> Editar Perfil</button>
              ) : (
                <div className={styles.editActions}>
                  <button onClick={handleSave} className={styles.saveButton}>Guardar</button>
                  <button onClick={handleCancel} className={styles.cancelButton}>Cancelar</button>
                </div>
              )}
            </div>
          </div>

          <div className={styles.infoSection}>
            <h3 className={styles.sectionTitle}>Información de Contacto</h3>
            <div className={styles.infoGrid}>
              {/* Email (Read-only) */}
              <div className={styles.infoField}>
                <div className={styles.fieldIcon}><MailIcon /></div>
                <div className={styles.fieldContent}>
                  <label className={styles.fieldLabel}>Email</label>
                  <span className={styles.fieldValue}>{user.email}</span>
                </div>
              </div>

              {/* Phone */}
              <div className={styles.infoField}>
                <div className={styles.fieldIcon}><PhoneIcon /></div>
                <div className={styles.fieldContent}>
                  <label className={styles.fieldLabel}>Teléfono</label>
                  {isEditing ? (
                    <input type="tel" value={editForm.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className={styles.fieldInput} />
                  ) : (
                    <span className={styles.fieldValue}>{user.phone || 'No especificado'}</span>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className={styles.infoField}>
                <div className={styles.fieldIcon}><MapPinIcon /></div>
                <div className={styles.fieldContent}>
                  <label className={styles.fieldLabel}>Dirección</label>
                  {isEditing ? (
                    <input type="text" value={editForm.address} onChange={(e) => handleInputChange('address', e.target.value)} className={styles.fieldInput} />
                  ) : (
                    <span className={styles.fieldValue}>{user.address || 'No especificado'}</span>
                  )}
                </div>
              </div>

              {/* Company */}
              <div className={styles.infoField}>
                <div className={styles.fieldIcon}><BuildingIcon /></div>
                <div className={styles.fieldContent}>
                  <label className={styles.fieldLabel}>Empresa</label>
                  {isEditing ? (
                    <input type="text" value={editForm.company} onChange={(e) => handleInputChange('company', e.target.value)} className={styles.fieldInput} />
                  ) : (
                    <span className={styles.fieldValue}>{user.company || 'No especificado'}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.accountActions}>
            <h3 className={styles.sectionTitle}>Acciones de Cuenta</h3>
            <div className={styles.actionButtons}>
              <button onClick={handleLogout} className={styles.logoutButton}><LogOutIcon /> Cerrar Sesión</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
