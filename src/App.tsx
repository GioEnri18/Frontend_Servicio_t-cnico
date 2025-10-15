import { Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';

// Home pública (landing / catálogo sin requerir login)
import DashboardPage from './pages/DashboardPage';

// Home admin y páginas admin
import AdminDashboardPage from './pages/AdminDashboardPage';
import QuoteManagementPage from './pages/admin/QuoteManagementPage';
import QuoteProcessingPage from './pages/admin/QuoteProcessingPage';
import ClientManagementPage from './pages/admin/ClientManagementPage';

// Home del cliente autenticado (usa /services/my-services en vez de /services)
import CustomerHomePage from './pages/app/CustomerHomePage'; // ✅ crea este componente si aún no existe

import ServiceDetailPage from './pages/ServiceDetailPage';
import QuotationPage from './pages/QuotationPage';
import UserProfilePage from './pages/UserProfilePage';
import ClientQuotationsPage from './pages/ClientQuotationsPage';

import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute'; // asegúrate de que acepte roles múltiples o ajusta abajo

import './App.css';

function App() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<DashboardPage />} />
      <Route path="/services" element={<DashboardPage />} />
      <Route path="/services/:slug" element={<ServiceDetailPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Área del cliente autenticado */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <CustomerHomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quotations/new"
        element={
          <ProtectedRoute>
            <QuotationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-quotations"
        element={
          <ProtectedRoute>
            <ClientQuotationsPage />
          </ProtectedRoute>
        }
      />

      {/* Área Admin/Empleado */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            {/* Si tu RoleRoute solo admite un rol, duplica la ruta para 'employee'.
               Idealmente, actualízalo para aceptar roles={['admin','employee']}. */}
            <RoleRoute role="admin">
              <AdminDashboardPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/quotes"
        element={
          <ProtectedRoute>
            <RoleRoute roles={["admin", "employee"]}>
              <QuoteManagementPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/quotes/:id"
        element={
          <ProtectedRoute>
            <RoleRoute roles={["admin", "employee"]}>
              <QuoteProcessingPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />


      <Route
        path="/admin/clients"
        element={
          <ProtectedRoute>
            <RoleRoute role="admin">
              <ClientManagementPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* (Opcional) 404 */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}

export default App;
