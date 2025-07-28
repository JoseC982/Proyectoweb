const { DataTypes } = require('sequelize');
const sequelize = require('../config//sequelize.config');

const Incidents = sequelize.define('Incidents', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        validate: {
            notNull: { msg: "El id es requrido" }
        }
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "El tipo es requerido" }
        }
    },
    icon: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "El ícono es requerido" }
        }
    },
    color: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "El color es requerido" },
            is: {
                args: /^#([0-9A-F]{3}){1,2}$/i,
                msg: "El color debe ser un código hexadecimal válido"
            }
        }
    }


});


module.exports = Incidents; // Exportar el modelo para usarlo en otros módulos