const { Sequelize } = require('sequelize');
const username = 'root';
const password = '090802';
const bdd_name = 'PonteOnceBDDv3';
const hostName = 'localhost'; // Cambia esto si es necesario
// Conexión inicial sin especificar la base de datos
const initialSequelize = new Sequelize(`mysql://${username}:${password}@localhost`);
initialSequelize.query(`CREATE DATABASE IF NOT EXISTS ${bdd_name};`)
    .then(() => console.log('BDD creada o ya existía'))
    .catch((error) => {
        console.error('Error al crear la BDD', error);
        process.exit(1); // Termina el proceso si hay un error
    });

// Conectar a la base de datos específica y sincronizar modelos
const sequelize = new Sequelize(bdd_name, username, password, {
    host: hostName,
    dialect: 'mysql'
});
// Se sincroniza los modelos con la base de datos
// sync permite hacer la sincronizacion de los modelos con la bdd
// sync puede tener como parametro
// * {force:true} elimina y vuelve a crear toda las tablas en la bdd (util en desarrollo pero no en produccion)
// * {alter:true} ajusta automaticamente las tablas existentes para que coincidan con los modelos, sin eliminar datos existentes. (suelen saltar muchos errores)
sequelize.sync().then(() => {
    console.log('Base de datos sincronizada');
}).catch(err => {
    console.log('Error al sincronizar la BDD', err);
});
module.exports = sequelize; //exportar para utilizar en otros modulos