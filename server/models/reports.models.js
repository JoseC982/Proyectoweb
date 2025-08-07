/**
 * MODELO DE REPORTES - SEQUELIZE
 * Define la estructura para la tabla 'reports' en MySQL
 * 
 * Los reportes son las denuncias o alertas que crean los usuarios
 * Incluyen información detallada sobre incidentes ocurridos:
 * - Descripción del evento
 * - Ubicación geográfica (coordenadas GPS)
 * - Fecha y hora del incidente
 * - Estado de validación por administradores
 * - Relación con tipo de incidente y usuario creador
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize.config');

/**
 * DEFINICIÓN DEL MODELO REPORT
 * Especifica la estructura completa de un reporte en el sistema
 */
const Report = sequelize.define('Report', {
    // Campo ID - Clave primaria autoincremental
    id: {
        type: DataTypes.INTEGER,        // Número entero
        allowNull: false,               // No puede ser nulo
        autoIncrement: true,            // Se incrementa automáticamente
        primaryKey: true,               // Es la clave primaria
        validate: {
            notNull: { msg: "Id is required" }
        }
    },
    
    // Descripción detallada del incidente reportado
    description: {
        type: DataTypes.STRING,         // Cadena de texto
        allowNull: false,               // Campo obligatorio
        validate: {
            notNull: { msg: "La descripción es requerida" }
        }
    },
    
    // Dirección o nombre del lugar donde ocurrió el incidente
    location: {
        type: DataTypes.STRING,         // Cadena de texto
        allowNull: false,               // Campo obligatorio
        validate: {
            notNull: { msg: "La ubicación es requerida" }
        }
    },
    
    // Latitud GPS del lugar del incidente
    lat: {
        type: DataTypes.FLOAT,          // Número decimal
        allowNull: false,               // Campo obligatorio
        validate: {
            notNull: { msg: "La latitud es requerida" }
        }
    },
    
    // Longitud GPS del lugar del incidente
    lng: {
        type: DataTypes.FLOAT,          // Número decimal
        allowNull: false,               // Campo obligatorio
        validate: {
            notNull: { msg: "La longitud es requerida" }
        }
    },
    
    // Hora exacta cuando ocurrió el incidente
    time: {
        type: DataTypes.STRING,         // Formato de texto (ej: "14:30")
        allowNull: false,               // Campo obligatorio
        validate: {
            notNull: { msg: "La hora es requerida" }
        }
    },
    
    // Fecha cuando ocurrió el incidente
    date: {
        type: DataTypes.DATEONLY,       // Solo fecha, sin hora
        allowNull: false,               // Campo obligatorio
        validate: {
            notNull: { msg: "La fecha es requerida" }
        }
    },
    
    // Estado de validación del reporte por parte de administradores
    status: {
        type: DataTypes.STRING,         // Cadena de texto
        allowNull: false,               // Campo obligatorio
        defaultValue: "nuevo",          // Valor por defecto: "nuevo"
        validate: {
            notNull: { msg: "El estado es requerido" }
        }
        // Posibles valores: "nuevo", "validado", "rechazado", "en_proceso"
    },
    
    // Clave foránea que referencia al tipo de incidente
    incidentTypeId: {
        type: DataTypes.INTEGER,        // Número entero
        allowNull: false,               // Campo obligatorio
        references: {
            model: 'Incidents',         // Nombre de la tabla referenciada
            key: 'id'                   // Campo referenciado en la tabla Incidents
        }
    },
    
    // Clave foránea que referencia al usuario que creó el reporte
    userId: {
        type: DataTypes.INTEGER,        // Número entero
        allowNull: false,               // Campo obligatorio
        references: {
            model: 'Users',             // Nombre de la tabla referenciada
            key: 'id'                   // Campo referenciado en la tabla Users
        }
    }
});

/**
 * EXPORTACIÓN DEL MODELO
 * Permite que otros archivos utilicen este modelo
 * para realizar operaciones CRUD en la tabla reports
 */
module.exports = Report;