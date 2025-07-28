const Reports = require("../controllers/reports.controllers");

module.exports = function(app) {
    // E1. Obtener todos los reportes (con filtros opcionales)
    app.get('/reports', Reports.getAllReports);

    // E2. Obtener reporte por ID
    app.get('/reports/:id', Reports.getReportById);

    // E3. Eliminar reporte por ID
    app.delete('/reports/:id', Reports.deleteReportById);

    // E4. Crear reporte de incidente
    app.post('/reports', Reports.createReport);

    // E5. Editar el tipo de incidente por ID (y otros campos si lo deseas)
    app.put('/reports/:id', Reports.updateReportById);

    // E6. Obtener reportes por usuario
    app.get('/reports/usuario/:userId', Reports.getReportsByUser);

    // E7. Obtener reportes por tipo de incidente
    app.get('/reports/incidente/:incidentTypeId', Reports.getReportsByIncidentType);

    // E8. Obtener reportes por rango de fechas
    app.get('/reports/rango-fechas', Reports.getReportsByDateRange);

    // E9. Obtener reportes filtrados combinados (ya cubierto en getAllReports con varios query params)
}