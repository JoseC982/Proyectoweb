const Incidents = require('../controllers/incidents.controllers');
module.exports = (app) => {
    // Ruta para obtener todos los incidentes
    app.get('/incidents', Incidents.getAllIncidentes);

    // Ruta para crear un nuevo incidente
    app.post('/incidents', Incidents.createIncidente);
}