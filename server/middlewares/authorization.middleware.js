//aqui se va a implementar un middleware de proteccion, control de acceso binario (si tienes el token autorizo, si no mando mensaje: no estas autorizado, si es que si le doy acceso a los endpoints)


//next es un metodo, cuando lo invocamos, decimos continua a ejecutar el siguiente controlador 

// si inicia con bearer es un token al portador

// ver si la cabecera tiene una cabecera de autorizacion con un token
// luego ver si la cabecera tiene el formato bearer token

require("dotenv").config();
const jwt = require('jsonwebtoken');
const User = require('../models/users.models');
const Report = require('../models/reports.models');


module.exports.protect = async (req, res, next) => {
    console.log('🔍 MIDDLEWARE PROTECT - INICIANDO');
    console.log('Headers de authorization:', req.headers.authorization);
    
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            //se obtiene el token
            token = req.headers.authorization;
            console.log('Token recibido-con Bearer: ', token);
            token = token.split(' ')[1];
            console.log('Token extraído: ', token);
            //se verifica el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            //agregamos a cada petición información del usuario
            req.user = await User.findOne({
                where: { id: decoded.id },
                attributes: { exclude: ['pass'] }
            });
            console.log('Usuario encontrado:', req.user?.id, req.user?.role);
            
            // Solo verificar que el usuario existe, no el rol
            if (req.user) {
                console.log('✅ MIDDLEWARE PROTECT - USUARIO VÁLIDO, CONTINUANDO');
                next(); // Continuar al siguiente middleware
            } else {
                console.log('❌ MIDDLEWARE PROTECT - USUARIO NO ENCONTRADO');
                res.status(401).json({ message: 'User not found!' });
            }
            
        } catch (error) {
            console.log('❌ MIDDLEWARE PROTECT - ERROR:', error.message);
            res.status(401).json({ message: 'Not authorized!' });
        }
    } else {
        console.log('❌ MIDDLEWARE PROTECT - SIN TOKEN');
        res.status(401).json({ message: 'Not authorized, missed token!' });
    }
}

// Crear middleware específico para admins
module.exports.adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Requiere acceso de administrador!' });
    }
};

// Middleware para validar que el usuario solo edite su propia información
module.exports.validateOwnResource = (req, res, next) => {
    try {
        // El usuario ya está en req.user (viene del middleware protect)
        const userIdFromToken = req.user.id;
        const userIdFromParams = parseInt(req.params.id);

        // Verificar si el usuario es admin (puede editar cualquier usuario)
        if (req.user.role === 'admin') {
            return next();
        }

        // Verificar si el usuario intenta editar su propia información
        if (userIdFromToken === userIdFromParams) {
            return next();
        }

        // Si no coinciden, denegar acceso
        return res.status(403).json({
            error: "Al parecer la información que usted desea editar no le pertenece"
        });

    } catch (error) {
        return res.status(500).json({
            error: "Error interno del servidor"
        });
    }
};



/*  Proteccion de los reportes  */
// Middleware para validar que el usuario solo elimine sus propios reportes
module.exports.validateOwnReport = async (req, res, next) => {
    try {
        // El usuario ya está en req.user (viene del middleware protect)
        const userIdFromToken = req.user.id;
        const reportId = parseInt(req.params.id);
        console.log('ID del reporte a eliminar: ', reportId);
        console.log('ID del usuario del token: ', userIdFromToken);

        // Verificar si el usuario es admin (puede eliminar cualquier reporte)
        if (req.user.role === 'admin') {
            return next();
        }

        // Buscar el reporte y verificar si pertenece al usuario
        const report = await Report.findOne({
            where: { id: reportId }
            
        });

        console.log(report);

        if (!report) {
            return res.status(404).json({
                error: "Reporte no encontrado"
            });
        }

        // Verificar si el reporte pertenece al usuario
        if (report.userId === userIdFromToken) {
            return next();
        }

        // Si no coinciden, denegar acceso
        return res.status(403).json({
            error: "No autorizado, al parecer el reporte que tratas de eliminar no te pertenece"
        });

    } catch (error) {
        return res.status(500).json({
            error: "Error interno del servidor"
        });
    }
};


module.exports.validateOwnUserReports = (req, res, next) => {
    console.log('🔍 MIDDLEWARE validateOwnUserReports - INICIANDO');
    try {
        const userIdFromToken = req.user.id;
        const userIdFromParams = parseInt(req.params.userId);
        
        console.log('ID del usuario del token: ', userIdFromToken);
        console.log('ID del usuario de los parámetros: ', userIdFromParams);

        if (req.user.role === 'admin') {
            console.log('✅ ES ADMIN - PERMITIENDO ACCESO');
            return next();
        }

        if (userIdFromToken === userIdFromParams) {
            console.log('✅ IDs COINCIDEN - PERMITIENDO ACCESO');
            return next();
        }

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

