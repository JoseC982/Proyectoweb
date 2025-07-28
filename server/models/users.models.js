const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config'); // Ajusta la ruta según tu proyecto

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        validate: {
            notNull: { msg: "Id is required" }
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "Nombre is required" }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: { msg: "El correo electrónico es requerido" },
            isEmail: { msg: "Debe ser un correo válido" }
        }
    },
    pass: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "La contraseña es requerida" }
        }
    },
    role: {
        type: DataTypes.ENUM('admin', 'user'),
        allowNull: false,
        validate: {
            notNull: { msg: "El rol es requerido" }
        }
    },
    estado: {
        type: DataTypes.ENUM('Activo', 'Silenciado'),
        allowNull: false,
        validate: {
            notNull: { msg: "El estado es requerido" }
        }
    },
    fechaNacimiento: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            notNull: {msg: "La fecha de nacimiento es requerida"}
        }
    },
    bio: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ""
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {msg: "El nombre de usuario es requerido"}
        }
    }
});


module.exports = User;