/**
 * RUTAS DE USUARIOS - API REST
 * Define todos los endpoints relacionados con la gestión de usuarios
 * 
 * Endpoints implementados:
 * - GET /users - Listar todos los usuarios
 * - POST /users/login - Autenticar usuario
 * - POST /users - Crear nuevo usuario
 * - GET /users/:id - Obtener usuario por ID (protegido)
 * - PATCH /users/:id/estado - Actualizar estado de usuario (solo admin)
 * - PATCH /users/:id/infoPerfil - Actualizar perfil de usuario (protegido)
 * - DELETE /users/:id - Eliminar usuario (protegido)
 * - PATCH /users/:id/cambiarPassword - Cambiar contraseña (protegido)
 * - POST /users/enviar-codigo-recuperacion - Enviar código de recuperación
 * - POST /users/verificar-codigo-cambiar-password - Verificar código y cambiar contraseña
 */

const User = require("../controllers/users.controllers");
const { protect, validateOwnResource, adminOnly } = require('../middlewares/authorization.middleware');

module.exports = function(app) {
    /**
     * RUTAS PÚBLICAS (sin autenticación requerida)
     */
    
    // Obtener lista de todos los usuarios
    app.get("/users", User.getAllUsers);
    
    // Autenticar usuario (login)
    app.post("/users/login", User.loginUser);
    
    // Crear nuevo usuario (registro)
    app.post("/users", User.createUser);
    
    /**
     * RUTAS PROTEGIDAS (requieren autenticación JWT)
     */
    
    // Obtener usuario por ID - Solo admin o el propio usuario
    app.get("/users/:id", protect, validateOwnResource, User.getUserXId);

    // Actualizar estado del usuario - Solo administradores
    app.patch("/users/:id/estado", protect, adminOnly, User.updUserEstado);
    
    // Actualizar información del perfil - Solo admin o el propio usuario
    app.patch("/users/:id/infoPerfil", protect, validateOwnResource, User.updUserPerfil);
    
    // Eliminar usuario - Solo admin o el propio usuario
    app.delete("/users/:id", protect, validateOwnResource, User.delUserXId);
    
    // Cambiar contraseña - Solo admin o el propio usuario
    app.patch("/users/:id/cambiarPassword", protect, validateOwnResource, User.cambiarPassword);
    
    /**
     * RUTAS PARA RECUPERACIÓN DE CONTRASEÑA (públicas)
     */
    
    // Enviar código de verificación por email
    app.post("/users/enviar-codigo-recuperacion", User.enviarCodigoRecuperacion);
    
    // Verificar código y cambiar contraseña
    app.post("/users/verificar-codigo-cambiar-password", User.verificarCodigoYCambiarPassword);
}