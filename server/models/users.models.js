/**
 * MODELO DE USUARIOS - SEQUELIZE
 * Define la estructura y validaciones para la tabla 'users' en MySQL
 * 
 * Este modelo representa a todos los usuarios del sistema:
 * - Administradores: pueden gestionar usuarios y validar reportes
 * - Usuarios regulares: pueden crear reportes y consultar información
 * 
 * Incluye validaciones para datos obligatorios y formatos específicos
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config'); // Importar la configuración de BD

/**
 * DEFINICIÓN DEL MODELO USER
 * Especifica todos los campos, tipos de datos y validaciones
 * Sequelize creará automáticamente la tabla 'Users' basada en esta definición
 */
const User = sequelize.define('User', {
    // Campo ID - Clave primaria autoincremental
    id: {
        type: DataTypes.INTEGER,        // Número entero
        allowNull: false,               // No puede ser nulo
        autoIncrement: true,            // Se incrementa automáticamente
        primaryKey: true,               // Es la clave primaria de la tabla
        validate: {
            notNull: { msg: "Id is required" }
        }
    },
    
    // Nombre completo del usuario
    name: {
        type: DataTypes.STRING,         // Cadena de texto
        allowNull: false,               // Campo obligatorio
        validate: {
            notNull: { msg: "Nombre is required" }
        }
    },
    
    // Correo electrónico - Debe ser único en todo el sistema
    email: {
        type: DataTypes.STRING,         // Cadena de texto
        allowNull: false,               // Campo obligatorio
        unique: true,                   // No puede repetirse en la BD
        validate: {
            notNull: { msg: "El correo electrónico es requerido" },
            isEmail: { msg: "Debe ser un correo válido" }  // Valida formato de email
        }
    },
    
    // Contraseña del usuario (se almacena hasheada)
    pass: {
        type: DataTypes.STRING,         // Cadena de texto
        allowNull: false,               // Campo obligatorio
        validate: {
            notNull: { msg: "La contraseña es requerida" }
        }
    },
    
    // Rol del usuario en el sistema
    role: {
        type: DataTypes.ENUM('admin', 'user'),  // Solo acepta estos dos valores
        allowNull: false,                       // Campo obligatorio
        validate: {
            notNull: { msg: "El rol es requerido" }
        }
    },
    
    // Estado del usuario (para moderar comportamiento)
    estado: {
        type: DataTypes.ENUM('Activo', 'Silenciado'),  // Usuario activo o silenciado
        allowNull: false,                               // Campo obligatorio
        validate: {
            notNull: { msg: "El estado es requerido" }
        }
    },
    // Fecha de nacimiento del usuario
    fechaNacimiento: {
        type: DataTypes.DATE,           // Tipo fecha y hora
        allowNull: false,               // Campo obligatorio
        validate: {
            notNull: {msg: "La fecha de nacimiento es requerida"}
        }
    },
    
    // Biografía del usuario (campo opcional)
    bio: {
        type: DataTypes.STRING,         // Cadena de texto
        allowNull: true,                // Campo opcional
        defaultValue: ""                // Valor por defecto: cadena vacía
    },
    
    // Nombre de usuario único para identificación
    username: {
        type: DataTypes.STRING,         // Cadena de texto
        allowNull: false,               // Campo obligatorio
        validate: {
            notNull: {msg: "El nombre de usuario es requerido"}
        }
    }
});

/**
 * EXPORTACIÓN DEL MODELO
 * Permite que otros archivos utilicen este modelo
 * para realizar operaciones CRUD en la tabla users
 */
module.exports = User;