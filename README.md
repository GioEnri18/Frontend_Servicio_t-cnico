# 🔧 Sistema de Gestión de Servicios Técnicos - Frontend

Sistema web para gestión de servicios técnicos, cotizaciones, empleados y clientes. Desarrollado con **React + TypeScript + Vite**.

---

## 📋 Tabla de Contenidos

- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Roles de Usuario](#roles-de-usuario)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)

---

## ✨ Características

### 🔐 Autenticación y Autorización
- Sistema de login con JWT
- 3 roles: **Admin**, **Employee**, **Customer**
- Rutas protegidas según rol
- Cierre de sesión seguro

### 👥 Gestión de Usuarios
- **Administrador**:
  - Crear empleados
  - Ver lista de empleados
  - Ver lista de clientes
  - Gestionar productos y categorías
  
### 📊 Gestión de Cotizaciones
- Ver todas las cotizaciones (Admin/Employee)
- Ver mis cotizaciones (Customer)
- Agregar productos a cotizaciones
- Cálculo automático de precios:
  - Subtotal (precio base)
  - IVA (12% sobre productos)
  - Total final
- Actualizar notas y precios

### 📦 Gestión de Productos
- Crear, editar y eliminar productos
- Categorías de productos
- Stock y precios
- Activar/desactivar productos
- Especificaciones técnicas

### 🎨 Interfaz de Usuario
- Diseño moderno y responsivo
- CSS Modules para estilos aislados
- Animaciones y transiciones suaves
- Feedback visual en todas las acciones

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v18 o superior) - [Descargar](https://nodejs.org/)
- **npm** o **yarn** (incluido con Node.js)
- **Backend en ejecución** en `http://localhost:3000`

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/GioEnri18/Frontend_Servicio_t-cnico.git
cd Frontend_Servicio_t-cnico
```

### 2. Instalar dependencias

```bash
npm install
```

O con yarn:

```bash
yarn install
```

---

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3000
```

**Importante:** El backend debe estar corriendo en el puerto especificado.

### Configuración del Backend

Asegúrate de que el backend esté configurado correctamente:

1. Backend corriendo en `http://localhost:3000`
2. Endpoints disponibles:
   - `POST /api/auth/login`
   - `POST /api/auth/register`
   - `GET /api/auth/profile`
   - `GET /api/users/employees`
   - `GET /api/users/customers`
   - `GET /api/quotations`
   - `GET /api/products`
   - `GET /api/categories`
   - Y más...

---

## 🏃 Ejecución

### Modo Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

### Compilar para Producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

### Vista Previa de Producción

```bash
npm run preview
```

---

## 📁 Estructura del Proyecto

```
Frontend_Servicio_t-cnico/
├── public/                    # Archivos estáticos
├── src/
│   ├── assets/               # Imágenes, iconos, etc.
│   ├── components/           # Componentes reutilizables
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   └── Header.css
│   │   └── ProtectedRoute.tsx
│   ├── context/              # Context API
│   │   └── AuthContext.tsx
│   ├── hooks/                # Custom Hooks
│   │   └── useAuth.ts
│   ├── pages/                # Páginas principales
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── AdminDashboardPage.tsx
│   │   ├── EmployeeListPage.tsx
│   │   ├── ClientesPage.tsx
│   │   ├── ProductsManagementPage.tsx
│   │   ├── QuoteManagementPage.tsx
│   │   ├── QuotationPage.tsx
│   │   └── UserProfilePage.tsx
│   ├── services/             # Servicios API
│   │   └── api.ts
│   ├── App.css
│   ├── AppClean.tsx          # Router principal
│   ├── index.css
│   └── main.tsx
├── .env                      # Variables de entorno
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 👤 Roles de Usuario

### 🔴 Administrador (Admin)
**Acceso completo al sistema**

- ✅ Panel de administración
- ✅ Crear empleados
- ✅ Ver lista de empleados
- ✅ Ver lista de clientes
- ✅ Gestionar productos (crear, editar, eliminar)
- ✅ Gestionar categorías
- ✅ Ver y editar todas las cotizaciones
- ✅ Ver reportes

**Login de prueba:**
```
Email: admin@example.com
Password: (consultar con backend)
```

### 🟡 Empleado (Employee)
**Gestión operativa**

- ✅ Ver cotizaciones
- ✅ Editar cotizaciones
- ✅ Agregar productos a cotizaciones
- ✅ Ver clientes
- ✅ Ver productos

**Login de prueba:**
```
Email: employee@example.com
Password: (consultar con backend)
```

### 🟢 Cliente (Customer)
**Vista limitada**

- ✅ Ver sus propias cotizaciones
- ✅ Ver detalles de servicios
- ✅ Actualizar perfil

**Login de prueba:**
```
Email: customer@example.com
Password: (consultar con backend)
```

---

## 🛠️ Tecnologías Utilizadas

### Core
- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool ultra rápido

### Routing & State
- **React Router DOM** - Navegación SPA
- **Context API** - Estado global (autenticación)

### HTTP Client
- **Axios** - Cliente HTTP con interceptores

### Estilos
- **CSS Modules** - Estilos aislados por componente
- **CSS Custom Properties** - Variables CSS
- **Flexbox & Grid** - Layouts responsivos

### Development
- **ESLint** - Linter
- **TypeScript ESLint** - Reglas de linting

---

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Compila para producción
npm run preview      # Vista previa de build

# Linting
npm run lint         # Ejecuta ESLint
```

---

## 📝 Flujo de Uso

### 1. Inicio de Sesión
1. Accede a `http://localhost:5173`
2. Ingresa credenciales
3. El sistema te redirige según tu rol

### 2. Panel de Administración (Admin)
1. Clic en **"Gestionar Productos"**
2. Crea productos con categorías
3. Clic en **"Ver Cotizaciones"**
4. Selecciona una cotización
5. Agrega productos
6. Guarda cambios

### 3. Crear Empleado (Admin)
1. Clic en **"Crear Empleado"**
2. Llena el formulario
3. Guarda

### 4. Gestionar Cotizaciones (Admin/Employee)
1. Ve a **"Ver Cotizaciones"**
2. Selecciona una cotización
3. Modifica precio base
4. Agrega productos
5. El sistema calcula automáticamente:
   - Subtotal
   - IVA (12%)
   - Total

---

## 🐛 Solución de Problemas

### Error: "Network Error" o "Failed to fetch"
**Causa:** El backend no está corriendo o la URL es incorrecta.

**Solución:**
1. Verifica que el backend esté corriendo: `http://localhost:3000`
2. Revisa el archivo `.env`
3. Revisa la consola del navegador

### Error: "Unauthorized" (401)
**Causa:** Token JWT inválido o expirado.

**Solución:**
1. Cierra sesión
2. Vuelve a iniciar sesión

### Error: "product.price.toFixed is not a function"
**Causa:** El precio viene como string del backend.

**Solución:** Ya está corregido en el código actual con `Number(product.price)`

### Los inputs aparecen con texto invisible
**Causa:** Conflicto de estilos CSS.

**Solución:** Ya está corregido con `color: #1f2937 !important` en los estilos

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es privado y de uso exclusivo para [Nombre de la Empresa].

---

## 📞 Contacto

**Desarrollador:** GioEnri18  
**GitHub:** [https://github.com/GioEnri18](https://github.com/GioEnri18)

---

## 🔄 Actualizaciones Recientes

### v1.0.0 (Octubre 2025)
- ✅ Sistema de autenticación con JWT
- ✅ Gestión de productos y categorías
- ✅ Gestión de cotizaciones con cálculo automático
- ✅ Vista de empleados y clientes
- ✅ Diseño responsivo
- ✅ Corrección de errores de visualización de precios
- ✅ Mejoras en accesibilidad de formularios

---

**¡Gracias por usar el Sistema de Gestión de Servicios Técnicos! 🚀**
