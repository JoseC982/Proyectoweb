// Importa la librería Sequelize para el manejo de la base de datos MySQL
const { Sequelize } = require('sequelize');
<<<<<<< HEAD
const username = 'root';
const password = '090802';
const bdd_name = 'PonteOnceBDDv3';
const hostName = 'localhost'; // Cambia esto si es necesario
// Conexión inicial sin especificar la base de datos
const initialSequelize = new Sequelize(`mysql://${username}:${password}@localhost`);
initialSequelize.query(`CREATE DATABASE IF NOT EXISTS ${bdd_name};`)
    .then(() => console.log('BDD creada o ya existía'))
    .catch((error) => {
        console.error('Error al crear la BDD', error);
        process.exit(1); // Termina el proceso si hay un error
    });
=======
>>>>>>> 6f2ea83fab62dd932f825e707e0dc769784a7766

// Configuración de credenciales y parámetros de conexión a la base de datos
const username = 'root';          // Usuario de MySQL
const password = '090802';        // Contraseña del usuario MySQL
const bdd_name = 'PonteOnceBDDv4Vacia';  // Nombre de la base de datos
const hostName = 'localhost';     // Servidor donde está alojada la BD (local)

// ✅ MEJORADO: Conexión inicial con mejor manejo de errores
/**
 * Función asíncrona para crear la base de datos si no existe
 * Utiliza una conexión temporal para ejecutar el comando CREATE DATABASE
 * @returns {Promise<void>} - Promesa que se resuelve cuando la BD está creada
 */
const createDatabase = async () => {
    // Crear una instancia temporal de Sequelize para conectarse al servidor MySQL
    // sin especificar una base de datos particular
    const initialSequelize = new Sequelize(`mysql://${username}:${password}@${hostName}`, {
        logging: false // Silenciar logs de SQL durante la creación para evitar spam en consola
    });
    
    try {
        // Ejecutar la query SQL para crear la base de datos si no existe
        await initialSequelize.query(`CREATE DATABASE IF NOT EXISTS ${bdd_name};`);
        console.log('✅ Base de datos creada o ya existía');
        
        // Cerrar la conexión temporal para liberar recursos
        await initialSequelize.close();
    } catch (error) {
        console.error('❌ Error al crear la BDD:', error);
        throw error; // Re-lanzar el error para que sea manejado por el llamador
    }
};

/**
 * Configuración e inicialización de Sequelize
 * Crea la instancia principal de Sequelize para interactuar con la base de datos MySQL
 * Incluye configuración de pool de conexiones y manejo de errores de conexión
 */
const sequelize = new Sequelize(bdd_name, username, password, {
    host: hostName,          // Servidor donde está alojada la base de datos
    dialect: 'mysql',        // Especifica que usaremos MySQL como sistema de BD
    logging: false,          // Silenciar logs SQL (cambiar a console.log para debugging)
    
    // Configuración del pool de conexiones para optimizar el rendimiento
    pool: {
        max: 5,             // Máximo número de conexiones simultáneas al pool
        min: 0,             // Mínimo número de conexiones mantenidas en el pool
        acquire: 30000,     // Tiempo máximo (30s) para obtener una conexión del pool
        idle: 10000         // Tiempo máximo (10s) que una conexión puede estar inactiva
    },
    
    // Configuración de reintentos automáticos para diferentes tipos de errores de red
    retry: {
        // Lista de errores que activarán el mecanismo de reintento automático
        match: [
            /ETIMEDOUT/,        // Error de timeout de conexión
            /EHOSTUNREACH/,     // Host no alcanzable
            /ECONNRESET/,       // Conexión reseteada por el servidor
            /ECONNREFUSED/,     // Conexión rechazada por el servidor
            /ETIMEDOUT/,        // Timeout general
            /ESOCKETTIMEDOUT/,  // Timeout de socket
            /EHOSTUNREACH/,     // Host inalcanzable
            /EPIPE/,            // Error de pipe roto
            /EAI_AGAIN/,        // Error de DNS temporal
            /ER_CON_COUNT_ERROR/, // Demasiadas conexiones en MySQL
            /ECONNREFUSED/      // Conexión rechazada
        ],
        max: 3              // Máximo 3 intentos de reconexión automática
    }
});

// ✅ NUEVO: Función para inicializar la base de datos
/**
 * Función principal para inicializar la base de datos
 * Se encarga de crear la BD y establecer la conexión inicial con Sequelize
 * @returns {Promise<Sequelize>} - Retorna la instancia de Sequelize configurada
 */
const initializeDatabase = async () => {
    try {
        // Crear la base de datos si no existe utilizando conexión temporal
        await createDatabase();
        
        // Establecer y probar la conexión principal con la base de datos específica
        await sequelize.authenticate();
        console.log('✅ Conexión a MySQL establecida exitosamente');
        
        // Retornar la instancia configurada de Sequelize para uso en la aplicación
        return sequelize;
    } catch (error) {
        console.error('❌ Error al inicializar la base de datos:', error);
        throw error; // Propagar el error para manejo en niveles superiores
    }
};

/**
 * Sobrescribir el método sync de Sequelize para añadir logging personalizado
 * Este método se encarga de sincronizar los modelos de Sequelize con las tablas de la BD
 * Añade mensajes informativos sobre el proceso de sincronización
 */
sequelize.sync = async (options = {}) => {
    try {
        // Llamar al método sync original de Sequelize con las opciones proporcionadas
        await Sequelize.prototype.sync.call(sequelize, options);
        console.log('✅ Modelos sincronizados con la base de datos');
    } catch (error) {
        console.error('❌ Error al sincronizar modelos:', error);
        throw error; // Re-lanzar el error para que pueda ser manejado externamente
    }
};

/**
 * Inicialización automática de la base de datos al cargar el módulo
 * Esta llamada se ejecuta tan pronto como se importa este archivo
 * Si hay algún error durante la inicialización, el proceso se detiene
 */
initializeDatabase().catch(err => {
    console.error('❌ Error fatal en la inicialización:', err);
    process.exit(1); // Terminar el proceso con código de error si falla la inicialización
});

/**
 * Exportar la instancia configurada de Sequelize
 * Esta instancia será utilizada por todos los modelos y controladores
 * de la aplicación para interactuar con la base de datos
 */
module.exports = sequelize;