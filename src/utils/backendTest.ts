// ruta: frontend/src/utils/backendTest.ts

import { authService, servicesService, quotationsService, userService, checkConnectivity } from '../services/api';

// Función para probar la conexión con el backend
export const testBackendConnection = async () => {
  console.log('🔗 Probando conexión con backend en puerto 3000...');
  
  const results = {
    connectivity: { status: 'pending', message: '', data: null as any },
    auth: { status: 'pending', message: '', data: null as any },
    services: { status: 'pending', message: '', data: null as any },
    quotes: { status: 'pending', message: '', data: null as any },
    clients: { status: 'pending', message: '', data: null as any }
  };

  // Probar conectividad básica
  try {
    console.log('🌐 Probando conectividad básica...');
    const connectivityResult = await checkConnectivity();
    if (connectivityResult.success) {
      results.connectivity = { 
        status: 'success', 
        message: 'Backend conectado correctamente', 
        data: { status: connectivityResult.status || 200 }
      };
      console.log('✅ Conectividad: OK');
    } else {
      throw new Error(connectivityResult.error);
    }
  } catch (error: any) {
    results.connectivity = { 
      status: 'error', 
      message: error.message || 'Error de conectividad', 
      data: null 
    };
    console.log('❌ Conectividad: Error', error.message);
  }

  // Probar endpoints de autenticación (solo si hay conectividad)
  if (results.connectivity.status === 'success') {
    try {
      console.log('📧 Probando autenticación...');
      // Usar credenciales de prueba
      const loginResult = await authService.login('test@test.com', 'test123');
      results.auth = { 
        status: 'success', 
        message: 'Endpoint de login funcional', 
        data: loginResult 
      };
      console.log('✅ Login: OK', loginResult);
    } catch (error: any) {
      // Error 401 es esperado con credenciales incorrectas
      if (error.response?.status === 401) {
        results.auth = { 
          status: 'success', 
          message: 'Endpoint de login funcional (401 esperado)', 
          data: { note: 'Endpoint responde correctamente' } 
        };
        console.log('✅ Login: OK (401 esperado)');
      } else {
        results.auth = { 
          status: 'error', 
          message: error.message || 'Error de autenticación', 
          data: error.response?.data 
        };
        console.log('❌ Login: Error', error.message);
      }
    }

    // Probar endpoints de servicios
    try {
      console.log('⚡ Probando servicios...');
      const servicesResult = await servicesService.getAll();
      results.services = { 
        status: 'success', 
        message: 'Servicios obtenidos correctamente', 
        data: servicesResult 
      };
      console.log('✅ Servicios: OK', servicesResult);
    } catch (error: any) {
      results.services = { 
        status: 'error', 
        message: error.message || 'Error al obtener servicios', 
        data: error.response?.data 
      };
      console.log('❌ Servicios: Error', error.message);
    }

    // Probar endpoints de cotizaciones
    try {
      console.log('📋 Probando cotizaciones...');
      const quotesResult = await quotationsService.getAll();
      results.quotes = { 
        status: 'success', 
        message: 'Cotizaciones obtenidas correctamente', 
        data: quotesResult 
      };
      console.log('✅ Cotizaciones: OK', quotesResult);
    } catch (error: any) {
      results.quotes = { 
        status: 'error', 
        message: error.message || 'Error al obtener cotizaciones', 
        data: error.response?.data 
      };
      console.log('❌ Cotizaciones: Error', error.message);
    }

    // Probar endpoints de clientes
    try {
      console.log('👥 Probando clientes...');
      const clientsResult = await userService.getAll();
      results.clients = { 
        status: 'success', 
        message: 'Clientes obtenidos correctamente', 
        data: clientsResult 
      };
      console.log('✅ Clientes: OK', clientsResult);
    } catch (error: any) {
      results.clients = { 
        status: 'error', 
        message: error.message || 'Error al obtener clientes', 
        data: error.response?.data 
      };
      console.log('❌ Clientes: Error', error.message);
    }
  }

  // Resumen de resultados
  console.log('\n📊 RESUMEN DE CONEXIÓN CON BACKEND:');
  console.log('=========================================');
  Object.entries(results).forEach(([key, result]) => {
    const emoji = result.status === 'success' ? '✅' : '❌';
    console.log(`${emoji} ${key.toUpperCase()}: ${result.message}`);
  });

  return results;
};

// Función para probar endpoints específicos
export const testSpecificEndpoint = async (endpoint: string, method: 'GET' | 'POST' = 'GET', data?: any) => {
  try {
    console.log(`🔍 Probando endpoint: ${method} ${endpoint}`);
    
    // Usando 127.0.0.1 en lugar de localhost
    const response = await fetch(`http://127.0.0.1:3000${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt_token') || ''}`
      },
      body: data ? JSON.stringify(data) : undefined
    });

    const result = await response.json();
    console.log(`✅ Respuesta de ${endpoint}:`, result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error(`❌ Error en ${endpoint}:`, error);
    return { success: false, error: error.message };
  }
};

// Función para verificar el estado del backend
export const checkBackendHealth = async () => {
  try {
    console.log('🏥 Verificando salud del backend...');
    const response = await fetch('http://127.0.0.1:3000/health');
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend funcionando correctamente:', data);
      return { status: 'healthy', data };
    } else {
      console.log('⚠️ Backend responde pero con errores:', response.status);
      return { status: 'unhealthy', error: `HTTP ${response.status}` };
    }
  } catch (error: any) {
    console.log('❌ Backend no disponible:', error.message);
    return { status: 'offline', error: error.message };
  }
};