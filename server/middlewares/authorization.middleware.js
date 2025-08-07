/**
 * MIDDLEWARE DE AUTORIZACIÓN Y AUTENTICACIÓN
 * Sistema de protección de rutas usando JSON Web Tokens (JWT)
 * 
 * Este archivo implementa la seguridad del backend:
 * - Verificación de tokens JWT válidos
 * - Control de acceso basado en roles (admin/user)
 * - Protección de recursos propios del usuario
 * - Validación de permisos para operaciones específicas
 * 
 * Los middlewares se ejecutan antes de los controladores principales
 * para garantizar que solo usuarios autorizados accedan a los recursos
 */

// next es un método que permite continuar al siguiente middleware/controlador
// Los tokens JWT siguen el formato "Bearer <token>" en el header Authorization

/**
 * CONFIGURACIÓN E IMPORTACIONES
 */
require("dotenv").config();                     // Cargar variables de entorno
const jwt = require('jsonwebtoken');            // Librería para manejo de JWT
const User = require('../models/users.models'); // Modelo de usuarios
const Report = require('../models/reports.models'); // Modelo de reportes

/**
 * MIDDLEWARE PRINCIPAL DE PROTECCIÓN
 * Verifica que el usuario tenga un token JWT válido
 * Extrae la información del usuario y la adjunta a la request
 */
module.exports.protect = async (req, res, next) => {
    console.log('🔍 MIDDLEWARE PROTECT - INICIANDO');
    console.log('Headers de authorization:', req.headers.authorization);
    
    let token;
    // Verificar si existe el header Authorization y si empieza con "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extraer el token del header (formato: "Bearer <token>")
            token = req.headers.authorization;
            console.log('Token recibido-con Bearer: ', token);
            token = token.split(' ')[1]; // Obtener solo la parte del token
            console.log('Token extraído: ', token);
            
            // Verificar y decodificar el token usando la clave secreta
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Buscar el usuario en la BD usando el ID del token decodificado
            req.user = await User.findOne({
                where: { id: decoded.id },
                attributes: { exclude: ['pass'] } // Excluir la contraseña por seguridad
            });
            console.log('Usuario encontrado:', req.user?.id, req.user?.role);
            
            // Verificar que el usuario existe en la base de datos
            if (req.user) {
                console.log('✅ MIDDLEWARE PROTECT - USUARIO VÁLIDO, CONTINUANDO');
                next(); // Continuar al siguiente middleware/controlador
            } else {
                console.log('❌ MIDDLEWARE PROTECT - USUARIO NO ENCONTRADO');
                res.status(401).json({ message: 'User not found!' });
            }
            
        } catch (error) {
            // Error al verificar el token (token inválido, expirado, etc.)
            console.log('❌ MIDDLEWARE PROTECT - ERROR:', error.message);
            res.status(401).json({ message: 'Not authorized!' });
        }
    } else {
        // No se proporcionó token de autorización
        console.log('❌ MIDDLEWARE PROTECT - SIN TOKEN');
        res.status(401).json({ message: 'Not authorized, missed token!' });
    }
}

/**
 * MIDDLEWARE PARA RUTAS EXCLUSIVAS DE ADMINISTRADORES
 * Verifica que el usuario autenticado tenga rol de 'admin'
 * Debe usarse DESPUÉS del middleware 'protect'
 */
module.exports.adminOnly = (req, res, next) => {
    // req.user ya está disponible gracias al middleware 'protect'
    if (req.user && req.user.role === 'admin') {
        next(); // Usuario es admin, continuar
    } else {
        res.status(403).json({ message: 'Requiere acceso de administrador!' });
    }
};

/**
 * MIDDLEWARE PARA VALIDAR ACCESO A RECURSOS PROPIOS
 * Permite que usuarios editen solo su propia información
 * Los administradores pueden editar cualquier usuario
 */
module.exports.validateOwnResource = (req, res, next) => {
    try {
        // Extraer IDs para comparación
        const userIdFromToken = req.user.id;           // ID del token JWT
        const userIdFromParams = parseInt(req.params.id); // ID de los parámetros de URL

        // Los administradores tienen acceso total
        if (req.user.role === 'admin') {
            return next();
        }

        // Verificar si el usuario intenta editar su propia información
        if (userIdFromToken === userIdFromParams) {
            return next();
        }

        // Denegar acceso si los IDs no coinciden
        return res.status(403).json({
            error: "Al parecer la información que usted desea editar no le pertenece"
        });

    } catch (error) {
        return res.status(500).json({
            error: "Error interno del servidor"
        });
    }
};


/**
 * MIDDLEWARES DE PROTECCIÓN PARA REPORTES
 * Controlan el acceso a operaciones sobre reportes según la propiedad
 */

/**
 * MIDDLEWARE PARA VALIDAR ACCESO A REPORTES PROPIOS
 * Permite que usuarios eliminen solo sus propios reportes
 * Los administradores pueden eliminar cualquier reporte
 */
module.exports.validateOwnReport = async (req, res, next) => {
    try {
        // Extraer información necesaria
        const userIdFromToken = req.user.id;
        const reportId = parseInt(req.params.id);
        console.log('ID del reporte a eliminar: ', reportId);
        console.log('ID del usuario del token: ', userIdFromToken);

        // Los administradores tienen acceso total a todos los reportes
        if (req.user.role === 'admin') {
            return next();
        }

        // Buscar el reporte en la base de datos
        const report = await Report.findOne({
            where: { id: reportId }
        });

        console.log(report);

        // Verificar que el reporte existe
        if (!report) {
            return res.status(404).json({
                error: "Reporte no encontrado"
            });
        }

        // Verificar si el reporte pertenece al usuario autenticado
        if (report.userId === userIdFromToken) {
            return next(); // El usuario es propietario, permitir acceso
        }

        // Denegar acceso si el reporte no pertenece al usuario
        return res.status(403).json({
            error: "No autorizado, al parecer el reporte que tratas de eliminar no te pertenece"
        });

    } catch (error) {
        return res.status(500).json({
            error: "Error interno del servidor"
        });
    }
};

/**
 * MIDDLEWARE PARA VALIDAR ACCESO A REPORTES POR USUARIO
 * Controla que usuarios solo puedan ver sus propios reportes
 * Los administradores pueden ver reportes de cualquier usuario
 */
module.exports.validateOwnUserReports = (req, res, next) => {
    console.log('🔍 MIDDLEWARE validateOwnUserReports - INICIANDO');
    try {
        // Extraer IDs para comparación
        const userIdFromToken = req.user.id;
        const userIdFromParams = parseInt(req.params.userId);
        
        console.log('ID del usuario del token: ', userIdFromToken);
        console.log('ID del usuario de los parámetros: ', userIdFromParams);

        // Los administradores pueden ver reportes de cualquier usuario
        if (req.user.role === 'admin') {
            console.log('✅ ES ADMIN - PERMITIENDO ACCESO');
            return next();
        }

        // Verificar que el usuario solicita sus propios reportes
        if (userIdFromToken === userIdFromParams) {
            console.log('✅ IDs COINCIDEN - PERMITIENDO ACCESO');
            return next();
        }

        // Denegar acceso si los IDs no coinciden
        console.log('❌ IDs NO COINCIDEN - DENEGANDO ACCESO');
        return res.status(403).json({
            error: "No autorizado, solo puedes obtener tus propios reportes"
        });

    } catch (error) {
        console.log('❌ ERROR EN validateOwnUserReports:', error.message);
        return res.status(500).json({
            error: "Error interno del servidor"
        });
    }
};

