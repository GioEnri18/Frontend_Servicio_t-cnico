// Test de conectividad simple
console.log('🔗 Probando conexión con backend...');

fetch('http://127.0.0.1:3000')
  .then(response => {
    console.log('✅ Backend responde!', response.status);
    return response.text();
  })
  .then(data => {
    console.log('📄 Respuesta del backend:', data.substring(0, 100));
  })
  .catch(error => {
    console.error('❌ Error conectando con backend:', error);
  });

// Test de endpoint específico
fetch('http://127.0.0.1:3000/api/health')
  .then(response => {
    console.log('✅ Health endpoint responde!', response.status);
    return response.json();
  })
  .then(data => {
    console.log('📊 Estado del backend:', data);
  })
  .catch(error => {
    console.log('⚠️ Health endpoint no disponible:', error.message);
  });