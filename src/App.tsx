import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import DashboardPage from './pages/DashboardPage';
import TestLoginPage from './pages/TestLoginPage';
import AboutPage from './pages/AboutPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import QuotationPage from './pages/QuotationPage'; // Nueva página de cotización
import QuoteManagementPage from './pages/admin/QuoteManagementPage'; // Gestión de cotizaciones
import QuoteProcessingPage from './pages/admin/QuoteProcessingPage';
import UserProfilePage from './pages/UserProfilePage';
import ClientManagementPage from './pages/admin/ClientManagementPage'; // Importar página de clientes
import CreateQuotePage from './pages/admin/CreateQuotePage'; // Nueva página de crear cotización
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/test-login" element={<TestLoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/about" element={<AboutPage />} />

      {/* Rutas Protegidas */}
      <Route path="/" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/services" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/services/:slug" element={
        <ProtectedRoute>
          <ServiceDetailPage />
        </ProtectedRoute>
      } />
      <Route path="/quotations/new" element={
        <ProtectedRoute>
          <QuotationPage />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <UserProfilePage />
        </ProtectedRoute>
      } />
      <Route path="/cotizaciones" element={
        <ProtectedRoute>
          <QuoteManagementPage />
        </ProtectedRoute>
      } />
      <Route path="/cotizaciones/new" element={
        <ProtectedRoute>
          <CreateQuotePage />
        </ProtectedRoute>
      } />

      {/* Rutas de Admin */}
      <Route path="/admin-dashboard" element={
        <ProtectedRoute>
          <AdminDashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/quotes" element={
        <ProtectedRoute>
          <QuoteManagementPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/quotes/:id" element={
        <ProtectedRoute>
          <QuoteProcessingPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/clients" element={
        <ProtectedRoute>
          <ClientManagementPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;