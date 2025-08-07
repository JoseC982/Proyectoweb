/**
 * CONTROLADOR DE USUARIOS
 * Maneja todas las operaciones relacionadas con los usuarios del sistema
 * 
 * Funcionalidades implementadas:
 * - Registro y autenticación de usuarios
 * - Gestión CRUD de usuarios (crear, leer, actualizar, eliminar)
 * - Sistema de recuperación de contraseñas por email
 * - Generación y validación de tokens JWT
 * - Encriptación de contraseñas con bcrypt
 * - Validación de primer usuario como administrador
 */

const { response } = require("express");          // Utilidades de Express
const User = require("../models/users.models");  // Modelo de usuarios Sequelize
const Report = require("../models/reports.models"); // Modelo de reportes
require("dotenv").config();                       // Cargar variables de entorno
const jwt = require("jsonwebtoken");              // Librería para generar tokens JWT
const bcrypt = require("bcryptjs");               // Librería para encriptar contraseñas
const { transporter } = require('../config/emailConfig'); // Configuración de email

/**
 * ALMACÉN TEMPORAL DE CÓDIGOS DE VERIFICACIÓN
 * Guarda códigos de recuperación de contraseñas en memoria
 * Estructura: { email: { code, expires, userId } }
 */
const verifyCodes = new Map();

/**
 * FUNCIÓN PARA GENERAR TOKENS JWT
 * Crea un token de autenticación con información del usuario
 * @param {number} id - ID del usuario
 * @param {string} role - Rol del usuario ('admin' o 'user')
 * @returns {string} Token JWT firmado
 */
const generateToken = (id, role) => {
    return jwt.sign(
        { id, role },                    // Payload del token
        process.env.JWT_SECRET,          // Clave secreta para firmar
        { expiresIn: '30d' }            // Token válido por 30 días
    )
}

/**
 * CONTROLADOR PARA CREAR NUEVO USUARIO
 * Maneja el registro de nuevos usuarios en el sistema
 * Incluye validaciones, encriptación de contraseñas y verificación de duplicados
 */
module.exports.createUser = async (req, res) => {
    // Extraer datos del cuerpo de la petición
    const { name, email, pass, role, estado, fechaNacimiento, bio, username } = req.body;

    // Validar que todos los campos obligatorios estén presentes (bio es opcional)
    if (!name || !email || !pass || !role || !estado || !fechaNacimiento || !username) {
        console.log(req.body);
        return res.status(400).json({ error: "Datos incompletos" });
    } else {
        // Verificar si el correo electrónico ya está registrado
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Correo ya registrado" });
        } else {
            // Encriptar la contraseña antes de guardarla
            const salt = await bcrypt.genSalt(10);          // Generar salt para mayor seguridad
            const hashedPassword = await bcrypt.hash(pass, salt); // Hash de la contraseña
            
            try {
                // Crear el nuevo usuario en la base de datos
                const newUser = await User.create({
                    name,
                    email,
                    pass: hashedPassword,    // Guardar contraseña encriptada
                    role,
                    estado,
                    fechaNacimiento,
                    bio,
                    username
                });

                // Responder con los datos del usuario creado (sin la contraseña)
                res.status(201).json({
                    id: newUser.id.toString(),
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    estado: newUser.estado,
                    fechaNacimiento: newUser.fechaNacimiento ? newUser.fechaNacimiento.toISOString().split('T')[0] : "",
                    bio: newUser.bio,
                    username: newUser.username
                });

            } catch (err) {
                // Manejo de errores durante la creación del usuario
                res.status(400).json({ error: "Error al crear usuario" });
            }
        }
    }
};


/**
 * CONTROLADOR PARA LOGIN DE USUARIO
 * Autentica las credenciales del usuario y genera un token JWT
 * Valida email y contraseña contra la base de datos
 */
module.exports.loginUser = async (req, res) => {
    const { email, pass } = req.body;
    
    try {
        // Buscar usuario por email en la base de datos
        const userFound = await User.findOne({ where: { email: email }});
        
        // Verificar que el usuario existe y la contraseña es correcta
        if (userFound && (await bcrypt.compare(pass, userFound.pass))) {
            console.log('Login exitoso para:', userFound.email);
            
            // Generar token JWT para el usuario autenticado
            const token = generateToken(userFound.id, userFound.role);
            
            // Logs para debugging del token generado
            console.log('🔑 Token generado para:', userFound.email);
            console.log('🔑 Token completo:', token);
            console.log('🔑 Primeros 20 caracteres del token:', token.substring(0, 20) + '...');
            
            // Responder con información del usuario y token (sin contraseña)
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
                token: token  // Token para autenticación en futuras peticiones
            });
        } else {
            // Credenciales incorrectas
            res.status(401).json({ message: 'Credenciales incorrectas' });
        }
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

/**
 * CONTROLADOR PARA OBTENER TODOS LOS USUARIOS
 * Devuelve una lista de todos los usuarios registrados
 * Excluye las contraseñas por seguridad
 */
module.exports.getAllUsers = async (_, res) => {
    try {
        // Obtener todos los usuarios excluyendo el campo 'pass'
        const users = await User.findAll({
            attributes: { exclude: ['pass'] }  // No incluir contraseñas en la respuesta
        });
        console.log(users.length)
        res.status(200).json(users);
    } catch (err) {
        // Manejo de errores al obtener usuarios
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

/**
 * CONTROLADOR PARA OBTENER USUARIO POR ID
 * Busca y devuelve un usuario específico por su ID
 * Excluye la contraseña por seguridad
 */
module.exports.getUserXId = async (req, res) => {
    try {
        // Buscar usuario por ID sin incluir la contraseña
        const user = await User.findOne({ 
            where: { id: req.params.id },
            attributes: { exclude: ['pass'] }
        });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json(user);
    } catch {
        res.status(500).json({ message: 'No se pudo obtener el usuario con esa id' });
    }
}

/**
 * CONTROLADOR PARA ACTUALIZAR ESTADO DE USUARIO
 * Permite cambiar el estado de un usuario (Activo/Silenciado)
 * Utilizado principalmente por administradores para moderar usuarios
 */
module.exports.updUserEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        
        console.log('Actualizando estado del usuario:', id, 'a:', estado);
        
        // Buscar usuario por ID
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        
        // Actualizar solo el campo estado
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

/**
 * CONTROLADOR PARA ACTUALIZAR PERFIL DE USUARIO
 * Permite actualizar información del perfil incluyendo contraseña
 * Encripta la nueva contraseña si se proporciona
 */
module.exports.updUserPerfil = async (req, res) => {
    try {
        let updateData = { ...req.body };

        // Si se está actualizando la contraseña, encriptarla antes de guardar
        if (updateData.pass) {
            console.log('Cifrando nueva contraseña...');
            const salt = await bcrypt.genSalt(10);
            updateData.pass = await bcrypt.hash(updateData.pass, salt);
            console.log('Contraseña cifrada correctamente');
        }

        // Actualizar los datos del usuario en la base de datos
        const [updatedRowCount] = await User.update(updateData, {
            where: { id: req.params.id }
        });
        console.log('Filas actualizadas:', updatedRowCount);

        // Verificar si se actualizó algún registro
        if (updatedRowCount) {
            console.log("Usuario actualizado exitosamente");

            // Recuperar la información actualizada del usuario (sin contraseña)
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

/**
 * CÓDIGO COMENTADO - FUNCIÓN DE LOGIN ANTERIOR
 * Esta función estaba implementada pero se mantiene comentada
 * como referencia de una implementación alternativa usando axios
 */
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

/**
 * CONTROLADOR PARA CAMBIAR CONTRASEÑA
 * Permite a un usuario cambiar su contraseña actual por una nueva
 * Valida la contraseña actual antes de permitir el cambio
 */
module.exports.cambiarPassword = async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    
    try {
        // Buscar el usuario en la base de datos
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        console.log('Usuario encontrado:', user.email);
        
        // Verificar que la contraseña actual sea correcta
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