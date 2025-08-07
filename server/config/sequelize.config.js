const { Sequelize } = require('sequelize');
const username = 'root';
const password = '090802';
const bdd_name = 'PonteOnceBDD';
const hostName = 'localhost';

// ✅ NUEVO: Datos por defecto para tipos de incidentes
const defaultIncidents = [
    { type: 'Robo', color: '#ff4444', icon: 'https://media.elcomercio.com/wp-content/uploads/2024/10/robo-a-personas.jpg'},
    { type: 'Asalto', color: '#ff8800', icon: 'https://random.imagecdn.app/100/100?1' },
    { type: 'Accidente de Tránsito', color: '#ffcc00', icon: 'https://random.imagecdn.app/100/100?2' },
    { type: 'Riña', color: '#cc00ff', icon: 'https://random.imagecdn.app/100/100?3' },
    { type: 'Actividad Sospechosa', color: '#0088ff', icon: 'https://random.imagecdn.app/100/100?4' },
    { type: 'Vandalismo', color: '#ff0080', icon: 'https://random.imagecdn.app/100/100?5' },
    { type: 'Venta de Drogas', color: '#800000', icon: 'https://random.imagecdn.app/100/100?6' },
    { type: 'Violencia Doméstica', color: '#ff6600', icon: 'https://random.imagecdn.app/100/100?7' },
    { type: 'Alumbrado Público Dañado', color: '#666666', icon: 'https://random.imagecdn.app/100/100?8' },
    { type: 'Otro', color: '#888888', icon: 'https://random.imagecdn.app/100/100?9' }
];

// ✅ MEJORADO: Conexión inicial con mejor manejo de errores
const createDatabase = async () => {
    console.log("🔄 Creando base de datos si no existe...");
    const initialSequelize = new Sequelize(`mysql://${username}:${password}@${hostName}`, {
        logging: false
    });
    console.log('🔄 Intentando crear la base de datos...');
    try {
        console.log('🔄 Ejecutando consulta para crear la base de datos...', bdd_name);
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
    logging: false,
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

// ✅ CORREGIDA: Función para insertar datos por defecto
const insertDefaultData = async () => {
    try {
        console.log('🔄 Insertando datos por defecto...');
        
        // ✅ OPCIÓN 1: Usar consulta SQL directa (más confiable)
        const [results] = await sequelize.query('SELECT COUNT(*) as count FROM incidents');
        const incidentCount = results[0].count;
        
        if (incidentCount === 0) {
            console.log('🔄 Insertando tipos de incidentes por defecto...');
            
            // Preparar la consulta de inserción
            const values = defaultIncidents.map(incident => 
                `('${incident.type}', '${incident.color}', '${incident.icon || ''}', NOW(), NOW())`
            ).join(', ');
            
            const query = `INSERT INTO incidents (type, color, icon, createdAt, updatedAt) VALUES ${values}`;
            
            await sequelize.query(query);
            
            console.log(`✅ ${defaultIncidents.length} tipos de incidentes insertados exitosamente`);
            console.log('📋 Tipos disponibles: ' + defaultIncidents.map(i => i.type).join(', '));
        } else {
            console.log('ℹ️ Ya existen tipos de incidentes en la base de datos (' + incidentCount + ' registros)');
        }
        
    } catch (error) {
        console.error('❌ Error insertando datos por defecto:', error);
        
        // ✅ OPCIÓN 2: Intentar con el modelo si la consulta directa falla
        try {
            console.log('🔄 Intentando con el modelo Sequelize...');
            const Incident = sequelize.models.incidents || sequelize.models.Incident;
            
            if (Incident) {
                const existingIncidents = await Incident.findAll();
                
                if (existingIncidents.length === 0) {
                    await Incident.bulkCreate(defaultIncidents);
                    console.log(`✅ ${defaultIncidents.length} tipos de incidentes insertados con modelo Sequelize`);
                }
            } else {
                console.log('⚠️ Modelo Incident no disponible, datos no insertados');
            }
        } catch (modelError) {
            console.error('❌ Error con modelo Sequelize:', modelError);
            console.log('ℹ️ Los datos por defecto se pueden insertar manualmente después');
        }
    }
};

// ✅ MEJORADO: Función para inicializar la base de datos
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

// ✅ MEJORADO: Sincronizar e insertar datos por defecto
const syncDatabase = async (options = {}) => {
    try {
        await sequelize.sync(options);
        console.log('✅ Modelos sincronizados con la base de datos');
        
        // ✅ IMPORTANTE: Esperar un poco para que los modelos estén completamente cargados
        setTimeout(async () => {
            await insertDefaultData();
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error al sincronizar modelos:', error);
        throw error;
    }
};

// ✅ CORREGIDO: Exportar todas las funciones necesarias
module.exports = {
    sequelize,
    initializeDatabase,
    syncDatabase
};