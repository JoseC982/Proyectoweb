const Incidents = require('../controllers/incidents.controllers');
const { protect, adminOnly } = require('../middlewares/authorization.middleware');

module.exports = (app) => {
    // Ruta para obtener todos los incidentes
    app.get('/incidents/list', Incidents.getAllIncidentes);

    // Ruta para crear un nuevo incidente (protegida, solo admin puede hacer esto)
    app.post('/incidents/create', protect, adminOnly, Incidents.createIncidente);

    // Ruta para actualizar un incidente por ID (protegida, solo admin puede hacer esto)
    app.put('/incidents/:id/update', protect, adminOnly, Incidents.updateIncidenteById);

    // Ruta para eliminar un tipo de incidente por ID (protegida, solo admin puede hacer esto)
    app.delete('/incidents/:id/delete', protect, adminOnly, Incidents.deleteIncidenteById);
}