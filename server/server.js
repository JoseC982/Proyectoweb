const express = require('express');
const cors = require('cors');

const app = express();
const port = 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// ✅ CORREGIDO: Importar la nueva función de sincronización
const { sequelize, initializeDatabase, syncDatabase } = require('./config/sequelize.config');

// ✅ NUEVO: Importar los modelos para asegurar que las relaciones se establezcan
require('./models/relaciones.models');

// Rutas
const allUsersRoutes = require("./routes/users.routes");
allUsersRoutes(app);

const allIncidentsRoutes = require("./routes/incidents.routes");
allIncidentsRoutes(app);

const allReportsRoutes = require("./routes/reports.routes");
allReportsRoutes(app);

const startServer = async () => {
    try {
        // Inicializar la base de datos
        await initializeDatabase();
        
        // ✅ NUEVO: Usar la función que incluye datos por defecto
        await syncDatabase();
        
        app.listen(port, () => {
            console.log("🚀 Servidor escuchando en el puerto", port);
            console.log("🎯 La aplicación está lista para usar");
        });
        
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error);
        process.exit(1);
    }
};

startServer();