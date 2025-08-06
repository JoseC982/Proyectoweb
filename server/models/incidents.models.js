/**
 * MODELO DE TIPOS DE INCIDENTES - SEQUELIZE
 * Define la estructura para la tabla 'incidents' en MySQL
 * 
 * Esta tabla contiene los diferentes tipos de incidentes que pueden reportarse:
 * - Robos, asaltos, accidentes de tránsito
 * - Personas extraviadas, riñas, eventos médicos
 * - Alteraciones del orden público, enfrentamientos
 * - Personas sospechosas, violencia contra la mujer
 * 
 * Cada tipo tiene un ícono y color específico para la interfaz de usuario
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config//sequelize.config'); // Importar configuración de BD

/**
 * DEFINICIÓN DEL MODELO INCIDENTS
 * Catálogo de tipos de incidentes disponibles en el sistema
 */
const Incidents = sequelize.define('Incidents', {
    // Campo ID - Clave primaria autoincremental
    id: {
        type: DataTypes.INTEGER,        // Número entero
        allowNull: false,               // No puede ser nulo
        autoIncrement: true,            // Se incrementa automáticamente
        primaryKey: true,               // Es la clave primaria
        validate: {
            notNull: { msg: "El id es requrido" }
        }
    },
    
    // Nombre descriptivo del tipo de incidente
    type: {
        type: DataTypes.STRING,         // Cadena de texto
        allowNull: false,               // Campo obligatorio
        validate: {
            notNull: { msg: "El tipo es requerido" }
        }
        // Ejemplos: "Robo", "Asalto", "Accidente de tránsito", etc.
    },
    
    // Nombre del archivo de ícono para mostrar en la interfaz
    icon: {
        type: DataTypes.STRING,         // Cadena de texto
        allowNull: false,               // Campo obligatorio
        validate: {
            notNull: { msg: "El ícono es requerido" }
        }
        // Ejemplos: "LogoRobo.png", "LogoMedico.png", etc.
    },
    
    // Color en formato hexadecimal para identificar el tipo de incidente
    color: {
        type: DataTypes.STRING,         // Cadena de texto
        allowNull: false,               // Campo obligatorio
        validate: {
            notNull: { msg: "El color es requerido" },
            is: {
                args: /^#([0-9A-F]{3}){1,2}$/i,    // Validación regex para hex
                msg: "El color debe ser un código hexadecimal válido"
            }
        }
        // Ejemplos: "#FF0000" (rojo), "#00FF00" (verde), "#0000FF" (azul)
    }
});

/**
 * EXPORTACIÓN DEL MODELO
 * Permite que otros módulos utilicen este modelo
 * para realizar operaciones CRUD en la tabla incidents
 */
module.exports = Incidents;