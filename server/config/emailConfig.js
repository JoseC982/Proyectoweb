const nodemailer = require('nodemailer');

// Verificar que nodemailer se importó correctamente
if (!nodemailer || typeof nodemailer.createTransport !== 'function') {
    console.error('Error: nodemailer no se importó correctamente');
    process.exit(1);
}

// Configuración del transportador de email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'jcondor292@gmail.com', // Cambia por tu email
        pass: 'twzy tngp dqdp khwe' // Contraseña de aplicación de Gmail
    }
});

// Verificar la configuración
transporter.verify((error, success) => {
    if (error) {
        console.log('Error en configuración de email:', error);
    } else {
        console.log('✅ Servidor de email configurado correctamente');
    }
});

module.exports = { transporter };