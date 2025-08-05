const Reports = require("../controllers/reports.controllers");
const { protect, validateOwnReport, validateOwnUserReports } = require('../middlewares/authorization.middleware');

module.exports = function(app) {
    // ✅ RUTAS ESPECÍFICAS PRIMERO (antes de /reports/:id)
    
    // E6. Obtener reportes por usuario (protegido)
    app.get('/reports/usuario/:userId', protect, validateOwnUserReports, Reports.getReportsByUser);
    
    // E7. Obtener reportes por tipo de incidente
    app.get('/reports/incidente/:incidentTypeId', Reports.getReportsByIncidentType);
    
    // E8. Obtener reportes por rango de fechas
    app.get('/reports/rango-fechas', Reports.getReportsByDateRange);

    // ✅ RUTAS GENERALES AL FINAL
    
    // E1. Obtener todos los reportes (con filtros opcionales)
    app.get('/reports', Reports.getAllReports);

    // E2. Obtener reporte por ID (DEBE IR DESPUÉS de las rutas específicas)
    app.get('/reports/:id', Reports.getReportById);

    // E3. Eliminar reporte por ID (protegido)
    app.delete('/reports/:id', protect, validateOwnReport, Reports.deleteReportById);

    // E4. Crear reporte de incidente
    app.post('/reports', Reports.createReport);

    // E5. Editar reporte por ID (protegido)
    app.put('/reports/:id', protect, validateOwnReport, Reports.updateReportById);
}