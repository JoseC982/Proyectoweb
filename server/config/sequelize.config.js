const { Sequelize } = require('sequelize');
const username = 'root';
const password = '090802';
const bdd_name = 'PonteOnceBDDv4Vacia';
const hostName = 'localhost';

// ✅ MEJORADO: Conexión inicial con mejor manejo de errores
const createDatabase = async () => {
    const initialSequelize = new Sequelize(`mysql://${username}:${password}@${hostName}`, {
        logging: false // Silenciar logs de SQL durante la creación
    });
    
    try {
        await initialSequelize.query(`CREATE DATABASE IF NOT EXISTS ${bdd_name};`);
        console.log('✅ Base de datos creada o ya existía');
        await initialSequelize.close();
    } catch (error) {
        console.error('❌ Error al crear la BDD:', error);
        throw error;
    }
};

// ✅ MEJORADO: Conectar a la base de datos específica
const sequelize = new Sequelize(bdd_name, username, password, {
    host: hostName,
    dialect: 'mysql',
    logging: false, // Cambiar a console.log si quieres ver las consultas SQL
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    retry: {
        match: [
            /ETIMEDOUT/,
            /EHOSTUNREACH/,
            /ECONNRESET/,
            /ECONNREFUSED/,
            /ETIMEDOUT/,
            /ESOCKETTIMEDOUT/,
            /EHOSTUNREACH/,
            /EPIPE/,
            /EAI_AGAIN/,
            /ER_CON_COUNT_ERROR/,
            /ECONNREFUSED/
        ],
        max: 3
    }
});

// ✅ NUEVO: Función para inicializar la base de datos
const initializeDatabase = async () => {
    try {
        await createDatabase();
        
        // Probar la conexión
        await sequelize.authenticate();
        console.log('✅ Conexión a MySQL establecida exitosamente');
        
        return sequelize;
    } catch (error) {
        console.error('❌ Error al inicializar la base de datos:', error);
        throw error;
    }
};

// ✅ Sincronizar solo cuando se llame explícitamente
sequelize.sync = async (options = {}) => {
    try {
        await Sequelize.prototype.sync.call(sequelize, options);
        console.log('✅ Modelos sincronizados con la base de datos');
    } catch (error) {
        console.error('❌ Error al sincronizar modelos:', error);
        throw error;
    }
};

// ✅ Inicializar automáticamente
initializeDatabase().catch(err => {
    console.error('❌ Error fatal en la inicialización:', err);
    process.exit(1);
});

module.exports = sequelize;