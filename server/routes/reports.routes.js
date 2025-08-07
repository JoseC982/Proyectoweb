/**
 * RUTAS DE REPORTES - API REST
 * Define todos los endpoints para la gestión de reportes e incidentes
 * 
 * Los reportes son las denuncias/alertas que crean los usuarios ciudadanos
 * Incluye funcionalidades de CRUD y consultas específicas por filtros
 * 
 * Endpoints implementados:
 * - GET /reports/usuario/:userId - Reportes de un usuario específico (protegido)
 * - GET /reports/incidente/:incidentTypeId - Reportes por tipo de incidente
 * - GET /reports/rango-fechas - Reportes filtrados por rango de fechas
 * - GET /reports - Listar todos los reportes (con filtros opcionales)
 * - GET /reports/:id - Obtener reporte específico por ID
 * - DELETE /reports/:id - Eliminar reporte (protegido)
 * - POST /reports - Crear nuevo reporte
 * - PUT /reports/:id - Actualizar reporte existente (protegido)
 */

const Reports = require("../controllers/reports.controllers");
const { protect, validateOwnReport, validateOwnUserReports } = require('../middlewares/authorization.middleware');

module.exports = function(app) {
    /**
     * RUTAS ESPECÍFICAS CON PARÁMETROS COMPLEJOS
     * Estas deben ir ANTES de las rutas generales para evitar conflictos de enrutamiento
     */
    
    // Obtener reportes de un usuario específico (solo admin o el propio usuario)
    app.get('/reports/usuario/:userId', protect, validateOwnUserReports, Reports.getReportsByUser);
    
    // Obtener reportes filtrados por tipo de incidente
    app.get('/reports/incidente/:incidentTypeId', Reports.getReportsByIncidentType);
    
    // Obtener reportes dentro de un rango de fechas específico
    app.get('/reports/rango-fechas', Reports.getReportsByDateRange);

    /**
     * RUTAS GENERALES DE CRUD
     * Estas van al final para que no interfieran con las rutas específicas
     */
    
    // Obtener todos los reportes (con posibilidad de filtros en query params)
    app.get('/reports', Reports.getAllReports);

    // Obtener un reporte específico por su ID
    app.get('/reports/:id', Reports.getReportById);

    // Eliminar reporte (solo admin o el usuario que lo creó)
    app.delete('/reports/:id', protect, validateOwnReport, Reports.deleteReportById);

    // Crear nuevo reporte de incidente
    app.post('/reports', Reports.createReport);

    // Actualizar reporte existente (solo admin o el usuario que lo creó)
    app.put('/reports/:id', protect, validateOwnReport, Reports.updateReportById);
}