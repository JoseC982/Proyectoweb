/**
 * CONTROLADOR DE TIPOS DE INCIDENTES
 * Maneja el catálogo de tipos de incidentes disponibles en el sistema
 * 
 * Los tipos de incidentes definen las categorías que pueden reportar los usuarios:
 * - Robos, asaltos, accidentes de tránsito
 * - Personas extraviadas, riñas, eventos médicos
 * - Alteraciones del orden, enfrentamientos
 * - Personas sospechosas, violencia contra la mujer
 * 
 * Cada tipo incluye un nombre, ícono visual y color para la interfaz
 * Solo los administradores pueden gestionar estos tipos de incidentes
 */

const Incidente = require('../models/incidents.models');
const Report = require('../models/reports.models');

/**
 * CONTROLADOR PARA OBTENER TODOS LOS TIPOS DE INCIDENTES
 * Devuelve el catálogo completo disponible para crear reportes
 * Disponible para todos los usuarios (sin autenticación requerida)
 */
module.exports.getAllIncidentes = async (req, res) => {
    try {
        // Obtener todos los tipos de incidentes disponibles
        const incidentes = await Incidente.findAll();
        res.status(200).json(incidentes);
    } catch (error) {
        console.error('Error al obtener los incidentes:', error);
        res.status(500).json({ message: 'Error al obtener los incidentes' });
    }
}

/**
 * CONTROLADOR PARA CREAR NUEVO TIPO DE INCIDENTE
 * Permite a los administradores agregar nuevas categorías al catálogo
 * Requiere autenticación y permisos de administrador
 */
module.exports.createIncidente = async (req, res) => {
    const { type, icon, color } = req.body;

    // Validar que todos los campos obligatorios estén presentes
    if (!type || !icon || !color) {
        return res.status(400).json({ error: "Datos incompletos" });
    }

    try {
        // Crear nuevo tipo de incidente en la base de datos
        const newIncidente = await Incidente.create({
            type,   // Nombre descriptivo del tipo de incidente
            icon,   // Archivo de ícono para la interfaz
            color   // Color en formato hexadecimal para identificación visual
        });

        // Responder con los datos del nuevo tipo creado
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