const Incidente = require('../models/incidents.models');
const Report = require('../models/reports.models');

//Se obtiene todos los Incidentes  (user o admin cualquiera)
module.exports.getAllIncidentes = async (req, res) => {
    try {
        const incidentes = await Incidente.findAll();
        res.status(200).json(incidentes);
    } catch (error) {
        console.error('Error al obtener los incidentes:', error);
        res.status(500).json({ message: 'Error al obtener los incidentes' });
    }
}

// Crear un nuevo incidente (solo admin)
module.exports.createIncidente = async (req, res) => {
    const { type, icon, color } = req.body;

    // Validar datos incompletos
    if (!type || !icon || !color) {
        return res.status(400).json({ error: "Datos incompletos" });
    }

    try {
        // Crear incidente
        const newIncidente = await Incidente.create({
            type,
            icon,
            color
        });

        res.status(201).json({
            id: newIncidente.id.toString(),
            type: newIncidente.type,
            icon: newIncidente.icon,
            color: newIncidente.color
        });
    } catch (err) {
        console.error('Error al crear el incidente:', err);
        res.status(400).json({ error: "Error al crear el incidente" });
    }
};


// Actualizar incidente por id (solo admin)
module.exports.updateIncidenteById = async (req, res) => {
    const { id } = req.params;
    const { type, icon, color } = req.body;

    try {
        // Verificar si el incidente existe
        const incidente = await Incidente.findOne({ where: { id } });
        if (!incidente) {
            return res.status(404).json({ message: "Incidente no encontrado" });
        }

        // Actualizar incidente
        await Incidente.update({ type, icon, color }, { where: { id } });

        res.json({ message: "Incidente actualizado exitosamente" });
    } catch (err) {
        console.error('Error al actualizar el incidente:', err);
        res.status(500).json({ message: "Error al actualizar el incidente" });
    }
}




// Eliminar incidente por ID (solo admin)
module.exports.deleteIncidenteById = async (req, res) => {
    try {
        const incidentId = req.params.id;
        
        // Verificar si el incidente existe
        const incidente = await Incidente.findOne({ where: { id: incidentId } });
        if (!incidente) {
            return res.status(404).json({ message: "Incidente no encontrado" });
        }

        // 1. Primero eliminar todos los reportes de este tipo de incidente
        const deletedReports = await Report.destroy({
            where: { incidentTypeId: incidentId }
        });

        // 2. Luego eliminar el tipo de incidente
        await Incidente.destroy({ where: { id: incidentId } });

        // Respuesta con información de lo que se eliminó
        res.json({
            message: "Tipo de incidente eliminado exitosamente",
            deletedIncident: incidente,
            deletedReportsCount: deletedReports
        });

    } catch (err) {
        console.error('Error al eliminar incidente:', err);
        res.status(500).json({ message: "No se pudo eliminar el incidente" });
    }
}