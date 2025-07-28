const Incidente = require('../models/incidents.models');

//Se ontiene todos los Incidentes 
module.exports.getAllIncidentes = async (req, res) => {
    try {
        const incidentes = await Incidente.findAll();
        res.status(200).json(incidentes);
    } catch (error) {
        console.error('Error al obtener los incidentes:', error);
        res.status(500).json({ message: 'Error al obtener los incidentes' });
    }
}

// Crear un nuevo incidente
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