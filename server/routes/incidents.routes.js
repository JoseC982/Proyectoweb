/**
 * RUTAS DE TIPOS DE INCIDENTES - API REST
 * Define endpoints para la gestión del catálogo de tipos de incidentes
 * 
 * Los tipos de incidentes son las categorías predefinidas que pueden reportar los usuarios:
 * - Robos, asaltos, accidentes de tránsito
 * - Personas extraviadas, riñas, eventos médicos
 * - Alteraciones del orden, enfrentamientos
 * - Personas sospechosas, violencia contra la mujer
 * 
 * Endpoints implementados:
 * - GET /incidents/list - Listar todos los tipos de incidentes (público)
 * - POST /incidents/create - Crear nuevo tipo de incidente (solo admin)
 * - PUT /incidents/:id/update - Actualizar tipo de incidente (solo admin)
 * - DELETE /incidents/:id/delete - Eliminar tipo de incidente (solo admin)
 */

const Incidents = require('../controllers/incidents.controllers');
const { protect, adminOnly } = require('../middlewares/authorization.middleware');

module.exports = (app) => {
    /**
     * RUTA PÚBLICA
     * Disponible para todos los usuarios sin autenticación
     */
    
    // Obtener lista completa de tipos de incidentes disponibles
    app.get('/incidents/list', Incidents.getAllIncidentes);

    /**
     * RUTAS ADMINISTRATIVAS
     * Requieren autenticación JWT y rol de administrador
     */
    
    // Crear nuevo tipo de incidente (solo administradores)
    app.post('/incidents/create', protect, adminOnly, Incidents.createIncidente);

    // Actualizar tipo de incidente existente (solo administradores)
    app.put('/incidents/:id/update', protect, adminOnly, Incidents.updateIncidenteById);

    // Eliminar tipo de incidente (solo administradores)
    app.delete('/incidents/:id/delete', protect, adminOnly, Incidents.deleteIncidenteById);
}