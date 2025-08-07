/**
 * SERVIDOR PRINCIPAL DE LA APLICACIÓN "PONTE PILAS"
 * Sistema de gestión de reportes y alertas ciudadanas
 * 
 * Este archivo configura y ejecuta el servidor Express que maneja:
 * - API REST para usuarios, reportes e incidentes
 * - Conexión a base de datos MySQL via Sequelize
 * - Autenticación JWT y middleware de seguridad
 * - CORS para permitir conexiones del frontend React
 */

// Importación de dependencias principales
const express = require('express');  // Framework web para Node.js
const cors = require('cors');        // Middleware para habilitar CORS

// Crear instancia de la aplicación Express
const app = express();
const port = 8000;  // Puerto donde se ejecutará el servidor

/**
 * CONFIGURACIÓN DE MIDDLEWARES GLOBALES
 * Se ejecutan en todas las peticiones HTTP
 */
app.use(cors());                                    // Habilitar CORS para todas las rutas
app.use(express.json());                           // Parsear JSON en el body de las peticiones
app.use(express.urlencoded({extended: true}));     // Parsear datos de formularios URL-encoded

/**
 * CONFIGURACIÓN DE BASE DE DATOS
 * Importar la instancia configurada de Sequelize para MySQL
 */
const sequelize = require('./config/sequelize.config');

/**
 * IMPORTACIÓN DE MODELOS Y RELACIONES
 * Es importante importar las relaciones para que Sequelize
 * configure correctamente las asociaciones entre tablas
 */
require('./models/relaciones.models');

/**
 * CONFIGURACIÓN DE RUTAS DE LA API
 * Todas las rutas están organizadas por módulos funcionales
 */

// Rutas para gestión de usuarios (registro, login, CRUD)
const allUsersRoutes = require("./routes/users.routes");
allUsersRoutes(app);

// Rutas para gestión de incidentes (crear, validar, listar)
const allIncidentsRoutes = require("./routes/incidents.routes");
allIncidentsRoutes(app);

// Rutas para gestión de reportes (crear, consultar, estadísticas)
const allReportsRoutes = require("./routes/reports.routes");
allReportsRoutes(app);

/**
 * FUNCIÓN PARA INICIALIZAR EL SERVIDOR DE FORMA SEGURA
 * Garantiza que la base de datos esté lista antes de aceptar conexiones
 * Esto evita errores cuando el frontend intenta hacer peticiones
 */
const startServer = async () => {
    try {
        // Verificar que la conexión a MySQL esté funcionando
        await sequelize.authenticate();
        console.log('✅ Conexión a MySQL establecida correctamente');
        
        // Sincronizar modelos con la base de datos (crear/actualizar tablas)
        await sequelize.sync();
        console.log('✅ Base de datos sincronizada');
        
        // Solo después de que la BD esté lista, iniciar el servidor HTTP
        app.listen(port, () => {
            console.log("🚀 Servidor escuchando en el puerto", port);
            console.log(`📍 Servidor disponible en: http://localhost:${port}`);
        });
        
    } catch (error) {
        // Si hay error en la inicialización, terminar el proceso
        console.error('❌ Error al conectar con la base de datos:', error);
        process.exit(1);
    }
};

/**
 * MANEJO DE CIERRE GRACEFUL DEL SERVIDOR
 * Captura la señal SIGINT (Ctrl+C) para cerrar correctamente
 * la conexión a la base de datos antes de terminar el proceso
 */
process.on('SIGINT', async () => {
    console.log('\n🛑 Cerrando servidor...');
    try {
        // Cerrar la conexión a MySQL de forma segura
        await sequelize.close();
        console.log('✅ Conexión a MySQL cerrada');
    } catch (error) {
        console.error('Error al cerrar conexión:', error);
    }
    // Terminar el proceso con código de éxito
    process.exit(0);
});

/**
 * INICIALIZACIÓN DE LA APLICACIÓN
 * Punto de entrada principal que inicia todo el sistema
 */
startServer();