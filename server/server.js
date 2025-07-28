const express = require('express');
const app = express();
const port = 8000;

//app es una instancia de express
//put, get, delete, son rutas que se pueden definir en express
//app.use() es un middleware, se va a ejecutar antes de todas las rutas
app.use(express.json()); // para poder recibir datos en formato JSON, funciones que se van a ejecutar antes de las funciones que coincidad con la peticion, parsea el json y transforma en objeto de js
app.use(express.urlencoded({extended:true}));
const allUsersRoutes = require("./routes/users.routes");
allUsersRoutes(app);

const allIncidentsRoutes = require("./routes/incidents.routes");
allIncidentsRoutes(app);

const allReportsRoutes = require("./routes/reports.routes");
allReportsRoutes(app);

app.listen(port, () => {
console.log("Server escuchando en el puerto", port);
})