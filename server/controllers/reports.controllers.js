/**
 * CONTROLADOR DE REPORTES
 * Maneja todas las operaciones CRUD relacionadas con los reportes de incidentes
 * 
 * Los reportes son las denuncias/alertas que crean los usuarios sobre eventos
 * que observan en la ciudad. Incluye información de ubicación, descripción,
 * fecha/hora y tipo de incidente.
 * 
 * Funcionalidades implementadas:
 * - Consulta de reportes con filtros diversos
 * - Creación, edición y eliminación de reportes
 * - Filtros por usuario, tipo de incidente y rango de fechas
 * - Validaciones de permisos y propiedad de recursos
 */

const Report = require('../models/reports.models');

/**
 * CONTROLADOR PARA OBTENER TODOS LOS REPORTES
 * Permite filtrar reportes por usuario, tipo de incidente y rango de fechas
 * Los filtros se pasan como query parameters en la URL
 */
exports.getAllReports = async (req, res) => {
  try {
    // Extraer parámetros de filtro desde query params
    const { userId, incidentTypeId, from, to } = req.query;
    const where = {};
    
    // Aplicar filtros según los parámetros recibidos
    if (userId) where.userId = userId;
    if (incidentTypeId) where.incidentTypeId = incidentTypeId;
    if (from && to) where.date = { $between: [from, to] };
    else if (from) where.date = { $gte: from };
    else if (to) where.date = { $lte: to };

    // Ejecutar consulta con los filtros aplicados
    const reports = await Report.findAll({ where });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * CONTROLADOR PARA OBTENER REPORTE POR ID
 * Busca y devuelve un reporte específico usando su ID único
 */
exports.getReportById = async (req, res) => {
  try {
    // Buscar reporte por clave primaria (ID)
    const report = await Report.findByPk(req.params.id);
    if (!report) return res.status(404).json({ error: 'Reporte no encontrado' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// E3. Eliminar reporte por ID
exports.deleteReportById = async (req, res) => {
  try {
    const deleted = await Report.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Reporte no encontrado' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// E4. Crear reporte de incidente
exports.createReport = async (req, res) => {
  try {
    const report = await Report.create(req.body);
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// E5. Editar el tipo de incidente por ID (y otros campos si lo deseas)
exports.updateReportById = async (req, res) => {
  try {
    const [updated] = await Report.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Reporte no encontrado' });
    const updatedReport = await Report.findByPk(req.params.id);
    res.json(updatedReport);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// E6. Obtener reportes por usuario (puedes usar getAllReports con ?userId=)
exports.getReportsByUser = async (req, res) => {
  try {
    const reports = await Report.findAll({ where: { userId: req.params.userId } });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// E7. Obtener reportes por tipo de incidente (puedes usar getAllReports con ?incidentTypeId=)
exports.getReportsByIncidentType = async (req, res) => {
  try {
    const reports = await Report.findAll({ where: { incidentTypeId: req.params.incidentTypeId } });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// E8. Obtener reportes por rango de fechas (puedes usar getAllReports con ?from=YYYY-MM-DD&to=YYYY-MM-DD)
exports.getReportsByDateRange = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) return res.status(400).json({ error: 'from y to son requeridos' });
    const reports = await Report.findAll({
      where: {
        date: { $between: [from, to] }
      }
    });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// E9. Obtener reportes filtrados combinados (ya cubierto en getAllReports)