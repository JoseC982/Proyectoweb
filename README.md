# 🚨 PONTE PILAS - Plataforma Ciudadana de Reportes de Seguridad

<div align="center">
  <img src="./proyecto/proyecto-ponte-pilas/src/recursos/policia-logo.png" alt="Logo Ponte Pilas" width="200">
  
  **Una plataforma web que permite a los ciudadanos de Quito contribuir activamente a la seguridad y bienestar de su ciudad**
  
  [![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
  [![MySQL](https://img.shields.io/badge/Database-MySQL-orange.svg)](https://mysql.com/)
  [![JWT](https://img.shields.io/badge/Auth-JWT-red.svg)](https://jwt.io/)
</div>

## 📋 Descripción del Proyecto

**PONTE PILAS** es una plataforma web integral que permite a los ciudadanos reportar incidentes de seguridad en tiempo real, ayudando a crear una ciudad más segura y conectada. El sistema incluye funcionalidades para usuarios regulares y administradores, con un enfoque en la facilidad de uso y la gestión eficiente de reportes.

### 🎯 Objetivos Principales

- **Facilitar el reporte ciudadano** de incidentes de seguridad
- **Mejorar la respuesta** de las autoridades ante emergencias
- **Crear una red colaborativa** entre ciudadanos y autoridades
- **Proporcionar datos en tiempo real** sobre la seguridad urbana
- **Integrar tecnologías modernas** como geolocalización y mapas interactivos

## ⚡ Características Principales

### 👥 Para Usuarios Ciudadanos
- ✅ **Registro e inicio de sesión** seguro con JWT
- ✅ **Reporte de incidentes** con categorización (robos, accidentes, emergencias médicas, etc.)
- ✅ **Geolocalización automática** y selección manual en mapas
- ✅ **Seguimiento de reportes** enviados
- ✅ **Perfil de usuario** editable
- ✅ **Recuperación de contraseña** por email
- ✅ **Interfaz intuitiva** y responsive

### 👨‍💼 Para Administradores
- ✅ **Dashboard administrativo** completo
- ✅ **Gestión de usuarios** (CRUD completo)
- ✅ **Validación y moderación** de reportes
- ✅ **Generación de reportes** y estadísticas
- ✅ **Notificaciones y alertas** en tiempo real
- ✅ **Configuración del sistema**

### 🔧 Características Técnicas
- ✅ **Autenticación JWT** con roles de usuario
- ✅ **API RESTful** documentada
- ✅ **Base de datos relacional** MySQL
- ✅ **Integración con Google Maps**
- ✅ **Arquitectura MVC** en el backend
- ✅ **Componentes React** reutilizables
- ✅ **Responsive design** para dispositivos móviles

## 🏗️ Arquitectura del Sistema

```
PONTE PILAS/
├── 🎨 FRONTEND (React SPA)
│   ├── Autenticación de usuarios
│   ├── Dashboard interactivo
│   ├── Formularios de reporte
│   ├── Integración con mapas
│   └── Panel administrativo
│
├── ⚙️ BACKEND (Node.js + Express)
│   ├── API RESTful
│   ├── Autenticación JWT
│   ├── Controladores MVC
│   ├── Modelos de datos
│   └── Middlewares de seguridad
│
└── 🗄️ BASE DE DATOS (MySQL)
    ├── Usuarios y roles
    ├── Reportes e incidentes
    ├── Relaciones y metadatos
    └── Logs del sistema
```

## 🛠️ Tecnologías Utilizadas

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 19.1.0 | Framework principal |
| **React Router DOM** | 7.6.2 | Navegación SPA |
| **Axios** | 1.9.0 | Cliente HTTP |
| **Google Maps API** | 2.20.7 | Mapas y geolocalización |
| **CSS3** | - | Estilos y diseño responsive |

### Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | - | Runtime de JavaScript |
| **Express.js** | 5.1.0 | Framework web |
| **MySQL2** | 3.14.2 | Driver de base de datos |
| **Sequelize** | - | ORM para MySQL |
| **JWT** | 9.0.2 | Autenticación |
| **bcryptjs** | 3.0.2 | Encriptación de contraseñas |
| **Nodemailer** | - | Envío de emails |
| **CORS** | 2.8.5 | Política de recursos cruzados |

### Base de Datos
- **MySQL** - Base de datos relacional principal
- **Esquema normalizado** con relaciones bien definidas
- **Índices optimizados** para consultas frecuentes

## 📁 Estructura del Proyecto

```
Proyectoweb/
├── 📁 proyecto/                          # FRONTEND (React Application)
│   └── proyecto-ponte-pilas/
│       ├── 📁 public/                    # Archivos públicos y estáticos
│       │   ├── index.html               # Template HTML principal
│       │   ├── favicon.ico              # Icono de la aplicación
│       │   └── manifest.json            # Configuración PWA
│       ├── 📁 src/                      # Código fuente de React
│       │   ├── 📄 App.js                # Componente raíz con rutas y estado global
│       │   ├── 📄 index.js              # Punto de entrada de React
│       │   ├── 📁 componentes/          # Componentes React
│       │   │   ├── 🏠 Home.jsx          # Página de inicio/landing
│       │   │   ├── 👤 CrearCuenta.jsx   # Registro de usuarios
│       │   │   ├── 📱 MenuUsuario.jsx   # Dashboard principal con mapas
│       │   │   ├── 🔐 LoginAdmin.jsx    # Autenticación de administradores
│       │   │   ├── ⚙️ MenuAdministracion.jsx # Panel administrativo
│       │   │   ├── 📝 GenerarReporte.jsx # Formulario de reportes
│       │   │   ├── 👥 GestionUsuarios.jsx # CRUD de usuarios (admin)
│       │   │   ├── 🔔 NotificacionesAlertas.jsx # Dashboard de reportes
│       │   │   ├── ✅ ValidarAlertas.jsx # Moderación de reportes
│       │   │   ├── 📊 InformacionUsuario.jsx # Perfil de usuario
│       │   │   ├── 👨‍💼 InformacionUsuarioAdm.jsx # Perfil de admin
│       │   │   ├── 🔑 RecuperarCuenta.jsx # Recuperación de contraseña
│       │   │   └── 👁️ VisualizarReportes.jsx # Vista detallada de reportes
│       │   ├── 📁 estilos/              # Hojas de estilo CSS por componente
│       │   └── 📁 recursos/             # Imágenes, logos e iconos
│       ├── 📄 package.json              # Dependencias y scripts de React
│       └── 📄 README.md                 # Documentación del frontend
│
├── 📁 server/                           # BACKEND (Node.js + Express API)
│   ├── 📄 server.js                     # Servidor principal de Express
│   ├── 📁 config/                       # Configuraciones del sistema
│   │   ├── 📄 sequelize.config.js       # Configuración de base de datos
│   │   └── 📄 emailConfig.js            # Configuración de envío de emails
│   ├── 📁 controllers/                  # Controladores MVC
│   │   ├── 📄 users.controllers.js      # Lógica de usuarios y autenticación
│   │   ├── 📄 incidents.controllers.js  # Lógica de reportes/incidentes
│   │   └── 📄 reports.controllers.js    # Lógica de reportes y estadísticas
│   ├── 📁 models/                       # Modelos de datos (Sequelize)
│   │   ├── 📄 users.models.js           # Modelo de usuarios
│   │   ├── 📄 incidents.models.js       # Modelo de incidentes
│   │   ├── 📄 reports.models.js         # Modelo de reportes
│   │   └── 📄 relaciones.models.js      # Relaciones entre modelos
│   ├── 📁 routes/                       # Rutas de la API REST
│   │   ├── 📄 users.routes.js           # Endpoints de usuarios
│   │   ├── 📄 incidents.routes.js       # Endpoints de incidentes
│   │   └── 📄 reports.routes.js         # Endpoints de reportes
│   ├── 📁 middlewares/                  # Middlewares de Express
│   │   └── 📄 authorization.middleware.js # Verificación JWT y autorización
│   └── 📄 package.json                  # Dependencias del backend
│
└── 📄 README.md                         # Documentación principal del proyecto
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- **Node.js** (versión 16 o superior)
- **MySQL** (versión 8.0 o superior)
- **Git** para clonar el repositorio
- **Editor de código** (VS Code recomendado)

### 1. Clonar el Repositorio
```bash
git clone https://github.com/JoseC982/Proyectoweb.git
cd Proyectoweb
```

### 2. Configuración del Backend

```bash
# Navegar a la carpeta del servidor
cd server

# Instalar dependencias
npm install

# Crear archivo de configuración
cp .env.example .env
```

**Configurar variables de entorno en `.env`:**
```env
# Base de datos MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ponte_pilas_db
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña

# JWT Secret
JWT_SECRET=tu_clave_secreta_muy_segura

# Configuración de email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_app

# Puerto del servidor
PORT=8000
```

**Crear la base de datos:**
```sql
CREATE DATABASE ponte_pilas_db;
USE ponte_pilas_db;
```

**Iniciar el servidor:**
```bash
# Desarrollo con nodemon
npm run nodemon

# Producción
npm start
```

### 3. Configuración del Frontend

```bash
# Navegar a la carpeta del frontend
cd ../proyecto/proyecto-ponte-pilas

# Instalar dependencias
npm install

# Configurar API de Google Maps (opcional)
# Crear archivo .env en la raíz del frontend
echo "REACT_APP_GOOGLE_MAPS_API_KEY=tu_api_key_de_google_maps" > .env

# Iniciar la aplicación en desarrollo
npm start
```

### 4. Verificación de Instalación

1. **Backend**: Abrir http://localhost:8000 (debería mostrar "API funcionando")
2. **Frontend**: Abrir http://localhost:3000 (aplicación React)
3. **Base de datos**: Verificar conexión en logs del servidor

## 📖 Guía de Uso

### Para Usuarios Ciudadanos

1. **Registro**: Crear cuenta en la página principal
2. **Login**: Iniciar sesión con credenciales
3. **Reportar**: Usar el formulario para reportar incidentes
4. **Ubicación**: Permitir geolocalización o seleccionar manualmente
5. **Seguimiento**: Ver el estado de reportes enviados

### Para Administradores

1. **Acceso**: Login especial para administradores
2. **Dashboard**: Ver estadísticas y reportes en tiempo real
3. **Gestión**: Administrar usuarios y validar reportes
4. **Moderación**: Aprobar o rechazar reportes ciudadanos
5. **Reportes**: Generar informes y estadísticas

## 🔐 Seguridad

- **Autenticación JWT** con tokens de acceso y refresh
- **Encriptación bcrypt** para contraseñas
- **Validación de datos** en frontend y backend
- **Sanitización de inputs** para prevenir inyecciones
- **CORS configurado** para requests seguros
- **Rate limiting** para prevenir spam
- **Roles y permisos** diferenciados

## 📚 API Endpoints

### Autenticación
```
POST /api/users/register     # Registro de usuario
POST /api/users/login        # Inicio de sesión
POST /api/users/refresh      # Renovar token
POST /api/users/logout       # Cerrar sesión
```

### Usuarios
```
GET    /api/users/profile    # Obtener perfil
PUT    /api/users/profile    # Actualizar perfil
DELETE /api/users/:id        # Eliminar usuario (admin)
GET    /api/users/           # Listar usuarios (admin)
```

### Incidentes/Reportes
```
POST   /api/incidents/       # Crear reporte
GET    /api/incidents/       # Listar reportes
GET    /api/incidents/:id    # Obtener reporte específico
PUT    /api/incidents/:id    # Actualizar reporte (admin)
DELETE /api/incidents/:id    # Eliminar reporte (admin)
```

## 🧪 Testing

```bash
# Backend
cd server
npm test

# Frontend
cd proyecto/proyecto-ponte-pilas
npm test
```

## 🚀 Deployment

### Producción con PM2
```bash
# Instalar PM2
npm install -g pm2

# Configurar y ejecutar
pm2 start server.js --name "ponte-pilas-api"
pm2 startup
pm2 save
```

### Build del Frontend
```bash
cd proyecto/proyecto-ponte-pilas
npm run build
# Los archivos estáticos estarán en la carpeta 'build'
```

## 🤝 Contribución

1. **Fork** el repositorio
2. **Crear rama** para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Crear Pull Request**

### Estándares de Código
- **ESLint** para JavaScript
- **Prettier** para formateo
- **Comentarios en español** para documentación
- **Commits descriptivos** en español
- **Testing** para nuevas funcionalidades

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo de Desarrollo

- **Desarrollador Principal**: JoseC982
- **Frontend**: React.js con componentes funcionales
- **Backend**: Node.js con arquitectura MVC
- **Base de Datos**: MySQL con Sequelize ORM

## 📞 Contacto y Soporte

- **GitHub**: [@JoseC982](https://github.com/JoseC982)
- **Repositorio**: [Proyectoweb](https://github.com/JoseC982/Proyectoweb)
- **Issues**: [Reportar problemas](https://github.com/JoseC982/Proyectoweb/issues)

## 🔄 Versiones y Changelog

### v1.0.0 (Actual)
- ✅ Sistema completo de usuarios y autenticación
- ✅ Reportes de incidentes con geolocalización
- ✅ Panel administrativo funcional
- ✅ Integración con Google Maps
- ✅ API RESTful completa
- ✅ Frontend responsive

### Próximas Versiones
- 🔮 Notificaciones push en tiempo real
- 🔮 App móvil nativa
- 🔮 Integración con redes sociales
- 🔮 Dashboard avanzado con gráficos
- 🔮 Sistema de chat interno

---

<div align="center">
  <p><strong>🚨 PONTE PILAS - Construyendo una ciudad más segura, juntos 🚨</strong></p>
  <p><em>Desarrollado con ❤️ para la ciudadanía de Quito</em></p>
</div>
