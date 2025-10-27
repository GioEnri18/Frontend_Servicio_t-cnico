import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CreateEmployeePage from './pages/CreateEmployeePage';
import EmployeeListPage from './pages/EmployeeListPage';
import DashboardPage from './pages/DashboardPage';
// import HomePage from './pages/HomePage';
import TestLoginPage from './pages/TestLoginPage';
import AboutPage from './pages/AboutPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import QuotationPage from './pages/QuotationPage';
import QuoteManagementPage from './pages/QuoteManagementPage';
import ProductsManagementPage from './pages/ProductsManagementPage';
// import QuoteProcessingPage from './pages/admin/QuoteProcessingPage';
import UserProfilePage from './pages/UserProfilePage';
// import ClientManagementPage from './pages/admin/ClientManagementPage';
// import CreateQuotePage from './pages/admin/CreateQuotePage';
import ClientesPage from './pages/ClientesPage';
import BackendTestPage from './pages/BackendTestPage';
import TestPage from './pages/TestPage';
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
      <Route path="/backend-test" element={<BackendTestPage />} />
      <Route path="/test" element={<TestPage />} />

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
      <Route path="/quotations" element={
        <ProtectedRoute>
          <QuoteManagementPage />
        </ProtectedRoute>
      } />
      <Route path="/cotizaciones" element={
        <ProtectedRoute>
          <QuoteManagementPage />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <UserProfilePage />
        </ProtectedRoute>
      } />
      <Route path="/clientes" element={
        <ProtectedRoute>
          <ClientesPage />
        </ProtectedRoute>
      } />

      {/* Rutas de Admin */}
      <Route path="/admin-dashboard" element={
        <ProtectedRoute>
          <AdminDashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/create-employee" element={
        <ProtectedRoute>
          <CreateEmployeePage />
        </ProtectedRoute>
      } />
      <Route path="/employee-list" element={
        <ProtectedRoute>
          <EmployeeListPage />
        </ProtectedRoute>
      } />
      <Route path="/products" element={
        <ProtectedRoute>
          <ProductsManagementPage />
        </ProtectedRoute>
      } />
      {/* Rutas admin adicionales temporalmente comentadas
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
      */}
    </Routes>
  );
}

export default App;