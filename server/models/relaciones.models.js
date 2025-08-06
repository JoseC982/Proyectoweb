/**
 * RELACIONES ENTRE MODELOS - SEQUELIZE
 * Define las asociaciones entre las tablas de la base de datos
 * 
 * Este archivo establece las relaciones de clave foránea entre:
 * - Users (usuarios del sistema)
 * - Reports (reportes/denuncias creados)
 * - Incidents (tipos de incidentes disponibles)
 * 
 * Las relaciones permiten hacer consultas JOIN y obtener datos relacionados
 * de forma eficiente usando los métodos de Sequelize
 */

// Importación de todos los modelos
const User = require('./users.models');        // Modelo de usuarios
const Report = require('./reports.models');    // Modelo de reportes
const Incident = require('./incidents.models'); // Modelo de tipos de incidentes

/**
 * DEFINICIÓN DE RELACIONES
 * Establecer las asociaciones entre tablas según el diseño de la BD
 */

// Un usuario puede tener muchos reportes (relación 1:N)
User.hasMany(Report, { 
    foreignKey: 'userId',   // Campo que conecta las tablas
    as: 'reports'          // Alias para acceder a los reportes del usuario
});

// Un tipo de incidente puede tener muchos reportes (relación 1:N)
Incident.hasMany(Report, { 
    foreignKey: 'incidentTypeId',  // Campo que conecta las tablas
    as: 'reports'                 // Alias para acceder a los reportes del tipo
});

// Un reporte pertenece a un usuario específico (relación N:1)
Report.belongsTo(User, { 
    foreignKey: 'userId',   // Campo que conecta las tablas
    as: 'user'             // Alias para acceder al usuario del reporte
});

// Un reporte pertenece a un tipo de incidente específico (relación N:1)
Report.belongsTo(Incident, { 
    foreignKey: 'incidentTypeId', // Campo que conecta las tablas
    as: 'incident'               // Alias para acceder al tipo de incidente
});

/**
 * EXPORTACIÓN DE MODELOS RELACIONADOS
 * Permite que otros módulos importen todos los modelos
 * con las relaciones ya configuradas
 */
module.exports = { User, Report, Incident };