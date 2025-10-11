// ruta: frontend/src/pages/BackendTestPage.tsx

import React, { useState } from 'react';
import { testBackendConnection, checkBackendHealth, testSpecificEndpoint } from '../utils/backendTest';

const BackendTestPage: React.FC = () => {
  const [testResults, setTestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [healthStatus, setHealthStatus] = useState<any>(null);

  const runBackendTests = async () => {
    setIsLoading(true);
    try {
      const results = await testBackendConnection();
      setTestResults(results);
    } catch (error) {
      console.error('Error ejecutando pruebas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkHealth = async () => {
    const health = await checkBackendHealth();
    setHealthStatus(health);
  };

  const testCustomEndpoint = async () => {
    const result = await testSpecificEndpoint('/api/test');
    console.log('Resultado de endpoint personalizado:', result);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return '#28a745';
      case 'error': return '#dc3545';
      default: return '#ffc107';
    }
  };

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '1000px', 
      margin: '0 auto',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <h1>🔧 Pruebas de Conexión con Backend</h1>
      <p>Esta página te permite probar la conexión entre el frontend y tu backend en el puerto 3000.</p>

      <div style={{ 
        display: 'grid', 
        gap: '2rem', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        marginTop: '2rem'
      }}>
        
        {/* Panel de Control */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          padding: '1.5rem', 
          borderRadius: '10px',
          backdropFilter: 'blur(10px)'
        }}>
          <h2>🎮 Controles de Prueba</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button 
              onClick={checkHealth}
              style={{
                padding: '1rem',
                background: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🏥 Verificar Estado del Backend
            </button>

            <button 
              onClick={runBackendTests}
              disabled={isLoading}
              style={{
                padding: '1rem',
                background: isLoading ? '#6c757d' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              {isLoading ? '⏳ Ejecutando Pruebas...' : '🚀 Ejecutar Todas las Pruebas'}
            </button>

            <button 
              onClick={testCustomEndpoint}
              style={{
                padding: '1rem',
                background: '#fd7e14',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🎯 Probar Endpoint Personalizado
            </button>
          </div>

          {/* Estado de Salud */}
          {healthStatus && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              background: healthStatus.status === 'healthy' ? '#28a745' : '#dc3545',
              borderRadius: '5px'
            }}>
              <h4>Estado del Backend:</h4>
              <p><strong>Status:</strong> {healthStatus.status}</p>
              {healthStatus.data && <p><strong>Datos:</strong> {JSON.stringify(healthStatus.data, null, 2)}</p>}
              {healthStatus.error && <p><strong>Error:</strong> {healthStatus.error}</p>}
            </div>
          )}
        </div>

        {/* Información de Configuración */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          padding: '1.5rem', 
          borderRadius: '10px',
          backdropFilter: 'blur(10px)'
        }}>
          <h2>⚙️ Configuración</h2>
          <div style={{ fontSize: '0.9rem' }}>
            <p><strong>🌐 URL Backend:</strong> http://127.0.0.1:3000</p>
            <p><strong>🌐 URL Frontend:</strong> http://127.0.0.1:5173</p>
            <p><strong>🔑 Token JWT:</strong> {localStorage.getItem('jwt_token') ? '✅ Presente' : '❌ No encontrado'}</p>
            <p><strong>📧 Email Usuario:</strong> {localStorage.getItem('user_email') || 'No guardado'}</p>
          </div>

          <h3>📋 Endpoints Configurados:</h3>
          <ul style={{ fontSize: '0.8rem', lineHeight: '1.5' }}>
            <li>🌐 GET /health - Estado del backend</li>
            <li>📧 POST /api/auth/login - Autenticación</li>
            <li>⚡ GET /api/services - Lista de servicios</li>
            <li>📋 GET /api/quotes - Lista de cotizaciones</li>
            <li>👥 GET /api/clients - Lista de clientes</li>
            <li>🔄 POST /api/quotes - Crear cotización</li>
          </ul>
          
          <h4>🔄 Rutas Alternativas:</h4>
          <ul style={{ fontSize: '0.8rem', lineHeight: '1.5' }}>
            <li>📧 POST /auth/login (sin /api)</li>
            <li>⚡ GET /services (sin /api)</li>
            <li>📋 GET /quotes (sin /api)</li>
          </ul>
        </div>
      </div>

      {/* Resultados de las Pruebas */}
      {testResults && (
        <div style={{ 
          marginTop: '2rem', 
          background: 'rgba(255, 255, 255, 0.1)', 
          padding: '1.5rem', 
          borderRadius: '10px',
          backdropFilter: 'blur(10px)'
        }}>
          <h2>📊 Resultados de las Pruebas</h2>
          
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            {Object.entries(testResults).map(([key, result]: [string, any]) => (
              <div 
                key={key}
                style={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: `2px solid ${getStatusColor(result.status)}`
                }}
              >
                <h4 style={{ 
                  margin: '0 0 0.5rem 0',
                  color: getStatusColor(result.status)
                }}>
                  {result.status === 'success' ? '✅' : '❌'} {key.toUpperCase()}
                </h4>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Estado:</strong> {result.message}
                </p>
                {result.data && (
                  <details style={{ fontSize: '0.8rem' }}>
                    <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                      Ver datos de respuesta
                    </summary>
                    <pre style={{ 
                      background: 'rgba(0, 0, 0, 0.3)', 
                      padding: '0.5rem', 
                      borderRadius: '4px',
                      overflow: 'auto',
                      maxHeight: '200px'
                    }}>
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        background: 'rgba(255, 255, 255, 0.1)', 
        borderRadius: '10px',
        fontSize: '0.9rem'
      }}>
        <h3>🔍 Instrucciones:</h3>
        <ol>
          <li>Asegúrate de que tu backend esté ejecutándose en el puerto 3000</li>
          <li>Haz clic en "Verificar Estado del Backend" para confirmar la conexión</li>
          <li>Ejecuta "Ejecutar Todas las Pruebas" para probar todos los endpoints</li>
          <li>Revisa los resultados para identificar qué endpoints funcionan</li>
          <li>Los errores de CORS son normales durante el desarrollo</li>
        </ol>
      </div>
    </div>
  );
};

export default BackendTestPage;