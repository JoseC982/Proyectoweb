const User = require('./users.models');
const Report = require('./reports.models');
const Incident = require('./incidents.models');

// Relaciones
User.hasMany(Report, { foreignKey: 'userId', as: 'reports' });
Incident.hasMany(Report, { foreignKey: 'incidentTypeId', as: 'reports' });
Report.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Report.belongsTo(Incident, { foreignKey: 'incidentTypeId', as: 'incident' });

module.exports = { User, Report, Incident };