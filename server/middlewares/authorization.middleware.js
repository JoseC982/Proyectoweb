//aqui se va a implementar un middleware de proteccion, control de acceso binario (si tienes el token autorizo, si no mando mensaje: no estas autorizado, si es que si le doy acceso a los endpoints)


//next es un metodo, cuando lo invocamos, decimos continua a ejecutar el siguiente controlador 

// si inicia con bearer es un token al portador

// ver si la cabecera tiene una cabecera de autorizacion con un token
// luego ver si la cabecera tiene el formato bearer token

require("dotenv").config();
const jwt = require('jsonwebtoken');
const User = require('../models/users.models');
module.exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            //se obtiene el token (p.ej., Bearer DJDHFHFHHFHFHF#%>%)
            token = req.headers.authorization;
            console.log('Token recibido-con Bearer: ', token);
            token = token.split(' ')[1];
            console.log('Token extraído: ', token);
            //se verifica el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);      // verifica si el token no ha sido modificado y que coincide con la firma del servidor
            //agregamos a cada petición información del usuario - excepto el password (recuperado con base en el _id //contenido en el payload del token)
            req.user = await User.findOne({
                where: { id: decoded.id },
                attributes: { exclude: ['pass'] }
            });
            console.log(req.user);
            if (req.user.role === 'admin') {
                //se continua con la ejecución del siguiente controlador
                next();
            }else{
                res.status(401).json({ message: 'Not authorized!' });
            }
            //si el token no es válido, no se continua con la ejecución del siguiente controlador
        } catch (error) {
            res.status(401).json({ message: 'Not authorized!' });
        }
    }
    //si no se tiene un token de portador, entonces no estará autorizado
    if (!token) {
        res.status(401).json({ message: 'Not authorized, missed token!' });
    }
}