const express = require('express');
const cors = require('cors');

const app = express();
const port = 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// ✅ NUEVO: Importar la configuración de Sequelize
const sequelize = require('./config/sequelize.config');

// ✅ NUEVO: Importar los modelos para asegurar que las relaciones se establezcan
require('./models/relaciones.models');

// Rutas
const allUsersRoutes = require("./routes/users.routes");
allUsersRoutes(app);

const allIncidentsRoutes = require("./routes/incidents.routes");
allIncidentsRoutes(app);

const allReportsRoutes = require("./routes/reports.routes");
allReportsRoutes(app);

// ✅ MEJORADO: Iniciar servidor solo después de sincronizar la BD
const startServer = async () => {
    try {
        // ✅ Esperar a que Sequelize se conecte y sincronice
        await sequelize.authenticate();
        console.log('✅ Conexión a MySQL establecida correctamente');
        
        await sequelize.sync();
        console.log('✅ Base de datos sincronizada');
        
        // ✅ Solo después iniciar el servidor
        app.listen(port, () => {
            console.log("🚀 Servidor escuchando en el puerto", port);
            console.log(`📍 Servidor disponible en: http://localhost:${port}`);
        });
        
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error);
        process.exit(1);
    }
};

// ✅ Manejo de cierre graceful
process.on('SIGINT', async () => {
    console.log('\n🛑 Cerrando servidor...');
    try {
        await sequelize.close();
        console.log('✅ Conexión a MySQL cerrada');
    } catch (error) {
        console.error('Error al cerrar conexión:', error);
    }
    process.exit(0);
});

// ✅ Iniciar la aplicación
startServer();