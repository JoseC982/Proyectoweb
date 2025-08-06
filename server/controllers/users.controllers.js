const { response } = require("express");
const User = require("../models/users.models");
const Report = require("../models/reports.models"); 
require("dotenv").config();             // Importa el módulo dotenv para cargar variables de entorno
const jwt = require("jsonwebtoken");    // Importa la biblioteca jwt para generar tokens
const bcrypt = require("bcryptjs");     // Importa la biblioteca bcrypt para encriptar contraseñas
const { transporter } = require('../config/emailConfig');
// ✅ Almacén de códigos de verificación en memoria
const verifyCodes = new Map(); // { email: { code, expires, userId } }


// Aqui se crea el token
const generateToken = (id, role) => {      // Al token se le puede enviar los atributos que creamos necesarios
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' })
}   //aqui se añade el tiempo de expiracion

// Crear un usuario
module.exports.createUser = async (req, res) => {
    const { name, email, pass, role, estado, fechaNacimiento, bio, username } = req.body;

    // Validar datos incompletos (bio puede ser opcional)
    if (!name || !email || !pass || !role || !estado || !fechaNacimiento || !username) {
        console.log(req.body);
        return res.status(400).json({ error: "Datos incompletos" });
    } else {

        // Verificar si el correo ya existe
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Correo ya registrado" });
        } else {
            const salt = await bcrypt.genSalt(10);      //aunque las contraseñas sean iguales, el hash es distinto, añadiendo asi una capa mas de seguridad
            const hashedPassword = await bcrypt.hash(pass, salt);
            try {
                // Crear usuario
                const newUser = await User.create({
                    name,
                    email,
                    pass: hashedPassword,
                    role,
                    estado,
                    fechaNacimiento,
                    bio,
                    username
                });

                res.status(201).json({
                    id: newUser.id.toString(),
                    name: newUser.name,
                    email: newUser.email,
                    pass: newUser.pass,
                    role: newUser.role,
                    estado: newUser.estado,
                    fechaNacimiento: newUser.fechaNacimiento ? newUser.fechaNacimiento.toISOString().split('T')[0] : "",
                    bio: newUser.bio,
                    username: newUser.username
                });

            } catch (err) {
                res.status(400).json({ error: "Error al crear usuario" });
            }
        }
    }
};


// Login de usuario
module.exports.loginUser = async (req, res) => {
    const { email, pass } = req.body;
    
    try {
        const userFound = await User.findOne({ where: { email: email }});
        
        if (userFound && (await bcrypt.compare(pass, userFound.pass))) {
            console.log('Login exitoso para:', userFound.email);
            
            // ✅ Generar el token
            const token = generateToken(userFound.id, userFound.role);
            
            // ✅ IMPRIMIR TOKEN EN CONSOLA DEL SERVIDOR
            console.log('🔑 Token generado para:', userFound.email);
            console.log('🔑 Token completo:', token);
            console.log('🔑 Primeros 20 caracteres del token:', token.substring(0, 20) + '...');
            
            // ✅ CORREGIR: Devolver user y token como espera el frontend
            res.json({ 
                user: {
                    id: userFound.id,
                    name: userFound.name,
                    email: userFound.email,
                    role: userFound.role,
                    estado: userFound.estado,
                    fechaNacimiento: userFound.fechaNacimiento,
                    bio: userFound.bio,
                    username: userFound.username
                },
                token: token
            });
        } else {
            res.status(401).json({ message: 'Credenciales incorrectas' });
        }
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

// Obtener todos los usuarios (excluyendo las contraseñas)
module.exports.getAllUsers = async (_, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['pass'] }
        });
        console.log(users.length)
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

/// Obtener un usuario por id se excluye la contraseña
module.exports.getUserXId = async (req, res) => {
    try {
        const user = await User.findOne({ 
            where: { id: req.params.id },
            attributes: { exclude: ['pass'] } // ✅ Excluir contraseña de la respuesta
        });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json(user);
    } catch {
        res.status(500).json({ message: 'No se pudo obtener el usuario con esa id' });
    }
}


// actualizar (parcialmente: estado) un usuario por id
module.exports.updUserEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        
        console.log('Actualizando estado del usuario:', id, 'a:', estado);
        
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        
        await user.update({ estado });
        
        res.json({ 
            message: "Estado actualizado correctamente",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                estado: user.estado
            }
        });
    } catch (err) {
        console.error('Error actualizando estado:', err);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// actualizar (parcialmente: info perfil usuario) un usuario por id
module.exports.updUserPerfil = async (req, res) => {
    try {
        let updateData = { ...req.body };

        // ✅ Si se está actualizando la contraseña, cifrarla
        if (updateData.pass) {
            console.log('Cifrando nueva contraseña...');
            const salt = await bcrypt.genSalt(10);
            updateData.pass = await bcrypt.hash(updateData.pass, salt);
            console.log('Contraseña cifrada correctamente');
        }

        // Se actualiza el usuario
        const [updatedRowCount] = await User.update(updateData, {
            where: { id: req.params.id }
        });
        console.log('Filas actualizadas:', updatedRowCount);

        // Se verifica si se ha actualizado algún registro
        if (updatedRowCount) {
            console.log("Usuario actualizado exitosamente");

            // Recupera la información actualizada del usuario (sin la contraseña)
            const updatedUser = await User.findOne({ 
                where: { id: req.params.id },
                attributes: { exclude: ['pass'] } // ✅ Excluir contraseña de la respuesta
            });
            
            res.json({
                message: "Usuario actualizado exitosamente",
                user: updatedUser
            });
        } else {
            res.status(404).json({ message: "Usuario no encontrado" });
        }
    }
    catch (err) {
        console.error('Error al actualizar usuario:', err);
        res.status(500).json({ 
            message: 'No se pudo actualizar el usuario', 
            error: err.message 
        });
    }
}

// Eliminar usuario por ID (se modifico para que elimine los reportes asociados y asi no haya conflictos en la bdd)
module.exports.delUserXId = async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Verificar si el usuario existe
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // 1. Primero eliminar todos los reportes del usuario
        const deletedReports = await Report.destroy({
            where: { userId: userId }
        });

        // 2. Luego eliminar el usuario
        await User.destroy({ where: { id: userId } });

        // Respuesta con información de lo que se eliminó
        res.json({
            message: "Usuario eliminado exitosamente",
            deletedUser: user,
            deletedReportsCount: deletedReports
        });

    } catch (err) {
        console.error('Error al eliminar usuario:', err);
        res.status(500).json({ message: "No se pudo eliminar el usuario" });
    }
}

/*
// Función para realizar el login del usuario
const loginUsuario = async (email, password) => {
    try {
        // Realiza la solicitud GET al endpoint de login
        const response = await axios.get(`http://localhost:8000/api/v1/auth/login`, {
            params: {
                email,
                password,
            }
        });

        if (response.status === 200) {
            // Si el login es exitoso, guarda los datos del usuario en el localStorage
            const usuario = response.data[0];  // Asumiendo que la respuesta es un arreglo con un único objeto
            localStorage.setItem("usuario", JSON.stringify(usuario)); // Guarda los datos en el localStorage

            // Devuelve el usuario para usar en otros componentes
            return usuario;
        }
    } catch (error) {
        if (error.response) {
            // Si la respuesta del servidor contiene un error
            const errorMessage = error.response.data.error || 'Error desconocido';
            throw new Error(errorMessage);
        } else {
            // Si no hay respuesta, es un error en la conexión
            throw new Error('Error al intentar conectar con el servidor');
        }
    }
};*/

// ✅ NUEVO: Cambiar contraseña del usuario
module.exports.cambiarPassword = async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    
    try {
        // Buscar el usuario
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        console.log('Usuario encontrado:', user.email);
        
        // Verificar la contraseña actual
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.pass);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({ message: 'Contraseña actual incorrecta' });
        }
        
        // Cifrar la nueva contraseña
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        
        // Actualizar la contraseña
        await user.update({ pass: hashedNewPassword });
        
        res.json({ 
            message: 'Contraseña actualizada exitosamente'
        });
    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

// ✅ Enviar código de verificación por email
module.exports.enviarCodigoRecuperacion = async (req, res) => {
    const { email } = req.body;
    
    try {
        if (!email || !email.trim()) {
            return res.status(400).json({ message: 'Email es requerido' });
        }

        const user = await User.findOne({ where: { email: email.trim() } });
        
        if (!user) {
            return res.json({ 
                message: 'Si el email existe, recibirás un código de verificación' 
            });
        }

        // Generar código de 6 dígitos
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiryTime = Date.now() + 900000; // 15 minutos

        // Guardar código
        verifyCodes.set(email.trim(), {
            code: verifyCode,
            expires: expiryTime,
            userId: user.id
        });

        // Limpiar códigos expirados
        for (const [key, value] of verifyCodes.entries()) {
            if (value.expires < Date.now()) {
                verifyCodes.delete(key);
            }
        }

        // Enviar email con código
        const mailOptions = {
            from: 'tu_email@gmail.com', // Cambia por tu email
            to: email,
            subject: '🔐 Código de Recuperación - Ponte Once',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #007bff; color: white; padding: 20px; text-align: center;">
                        <h1>🚨 Ponte Once - Recuperación de Contraseña</h1>
                    </div>
                    <div style="padding: 20px; text-align: center;">
                        <h2>Hola ${user.name},</h2>
                        <p>Tu código de recuperación es:</p>
                        <h1 style="color: #007bff; font-size: 3em; margin: 20px 0;">${verifyCode}</h1>
                        <p><strong>Este código expira en 15 minutos.</strong></p>
                        <p>Si no solicitaste esto, puedes ignorar este email.</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        
        res.json({ 
            message: 'Si el email existe, recibirás un código de verificación'
        });
        
    } catch (error) {
        console.error('Error enviando código:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// ✅ Verificar código y cambiar contraseña
module.exports.verificarCodigoYCambiarPassword = async (req, res) => {
    const { email, code, newPassword } = req.body;
    
    try {
        if (!email || !code || !newPassword) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ 
                message: 'La contraseña debe tener al menos 6 caracteres' 
            });
        }

        // Verificar código
        const codeData = verifyCodes.get(email.trim());
        
        if (!codeData || codeData.code !== code || codeData.expires < Date.now()) {
            return res.status(400).json({ 
                message: 'Código inválido o expirado' 
            });
        }

        // Buscar usuario
        const user = await User.findByPk(codeData.userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Actualizar contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ pass: hashedPassword });

        // Eliminar código usado
        verifyCodes.delete(email.trim());

        res.json({ 
            message: 'Contraseña actualizada exitosamente' 
        });
        
    } catch (error) {
        console.error('Error verificando código:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};