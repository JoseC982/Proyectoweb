/**
 * CONFIGURACIÓN DE SERVICIO DE EMAIL
 * Sistema para envío de correos electrónicos utilizando nodemailer
 * Utilizado principalmente para:
 * - Códigos de recuperación de contraseñas
 * - Notificaciones automáticas del sistema
 * - Alertas importantes a usuarios
 */

const nodemailer = require('nodemailer');

/**
 * Verificación de seguridad para nodemailer
 * Asegura que la librería se haya importado correctamente
 * antes de continuar con la configuración
 */
if (!nodemailer || typeof nodemailer.createTransport !== 'function') {
    console.error('Error: nodemailer no se importó correctamente');
    process.exit(1);
}

/**
 * CONFIGURACIÓN DEL TRANSPORTADOR DE EMAIL
 * Configura la conexión con el servidor SMTP de Gmail
 * 
 * IMPORTANTE: La contraseña debe ser una "Contraseña de aplicación" de Gmail,
 * no la contraseña regular de la cuenta. Para obtenerla:
 * 1. Ir a Configuración de Google Account
 * 2. Seguridad > Verificación en 2 pasos
 * 3. Contraseñas de aplicaciones > Generar nueva
 */
const transporter = nodemailer.createTransporter({
    service: 'gmail',                    // Usar el servicio predefinido de Gmail
    auth: {
        user: 'jcondor292@gmail.com',   // Email desde el cual se enviarán los correos
        pass: 'twzy tngp dqdp khwe'     // Contraseña de aplicación de Gmail (NO la contraseña normal)
    }
});

/**
 * VERIFICACIÓN DE LA CONFIGURACIÓN DE EMAIL
 * Prueba la conectividad con el servidor SMTP al inicializar
 * Si hay problemas, muestra un error detallado para debugging
 */
transporter.verify((error, success) => {
    if (error) {
        console.log('Error en configuración de email:', error);
    } else {
        console.log('✅ Servidor de email configurado correctamente');
    }
});

/**
 * EXPORTACIÓN DEL TRANSPORTADOR
 * Permite que otros módulos utilicen esta configuración
 * para enviar correos electrónicos
 */
module.exports = { transporter };