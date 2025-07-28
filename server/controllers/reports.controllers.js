const Report = require('../models/reports.models');

// E1. Obtener todos los reportes (con filtros opcionales)
exports.getAllReports = async (req, res) => {
  try {
    const { userId, incidentTypeId, from, to } = req.query;
    const where = {};
    if (userId) where.userId = userId;
    if (incidentTypeId) where.incidentTypeId = incidentTypeId;
    if (from && to) where.date = { $between: [from, to] };
    else if (from) where.date = { $gte: from };
    else if (to) where.date = { $lte: to };

    const reports = await Report.findAll({ where });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// E2. Obtener reporte por ID
exports.getReportById = async (req, res) => {
  try {
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