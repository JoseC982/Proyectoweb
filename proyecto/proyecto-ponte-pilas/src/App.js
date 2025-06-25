// Importa React y los hooks necesarios para el manejo de estado y efectos
import React, { useState, useEffect } from 'react';
// Importa los componentes de rutas de React Router
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Importa la librería axios para hacer peticiones HTTP
import axios from 'axios';
// Importa los componentes de la aplicación
import MenuUsuario from './componentes/MenuUsuario';
import InformacionUsuario from './componentes/InformacionUsuario';
import VisualizarReportes from './componentes/VisualizarReportes';
import GenerarReporte from './componentes/GenerarReporte';
import './App.css';
import LoginAdmin from './componentes/LoginAdmin';
import CrearCuenta from "./componentes/CrearCuenta";
import RecuperarCuenta from "./componentes/RecuperarCuenta";
import Home from "./componentes/Home";
import MenuAdministracion from './componentes/MenuAdministracion';
import GestionUsuarios from './componentes/GestionUsuarios';
import NotificacionesAlertas from './componentes/NotificacionesAlertas';
import ValidarAlertas from './componentes/ValidarAlertas';
import InformacionUsuarioAdm from './componentes/InformacionUsuarioAdm';

function App() {
  // Estado para almacenar la lista de usuarios
  const [users, setUsers] = useState([]);
  // Estado para almacenar la lista de incidentes
  const [incidents, setIncidents] = useState([]);
  // Estado para almacenar la lista de reportes
  const [reports, setReports] = useState([]);
  // Estado para almacenar la lista de notificaciones procesadas
  const [notificaciones, setNotificaciones] = useState([]);

  // useEffect se ejecuta una vez al montar el componente para cargar los datos
  useEffect(() => {
    fetchAllData(); // Llama a la función que obtiene todos los datos
  }, []);

  // Función para obtener todos los datos necesarios del backend
  const fetchAllData = () => {
    // Ejecuta las tres peticiones HTTP en paralelo
    Promise.all([
      axios.get('http://localhost:3000/users'),      // Pide los usuarios
      axios.get('http://localhost:3000/incidents'),  // Pide los incidentes
      axios.get('http://localhost:3000/reports'),    // Pide los reportes
    ])
      // Cuando todas las peticiones terminan, procesa los resultados
      .then(([usersRes, incidentsRes, reportsRes]) => {
        setUsers(usersRes.data);         // Guarda los usuarios en el estado
        setIncidents(incidentsRes.data); // Guarda los incidentes en el estado
        setReports(reportsRes.data);     // Guarda los reportes en el estado
        // Procesa los reportes para crear la lista de notificaciones
        const notificacionesTabla = reportsRes.data.map((rep) => {
          // Busca el usuario correspondiente al reporte
          const usuario = usersRes.data.find(u => String(u.id) === String(rep.userId));
          // Busca el tipo de incidente correspondiente
          const incidente = incidentsRes.data.find(i => String(i.id) === String(rep.incidentTypeId));
          // Devuelve un objeto con los datos listos para la tabla
          return {
            nombre: usuario ? usuario.name : 'Desconocido',           // Nombre del usuario
            tipo: incidente ? incidente.type : 'Otro',                // Tipo de incidente
            descripcion: rep.description,                             // Descripción del reporte
            fechaHora: rep.date + ' ' + rep.time,                     // Fecha y hora combinadas
            ubicacion: rep.location                                   // Ubicación del reporte
          };
        });
        setNotificaciones(notificacionesTabla); // Guarda la lista de notificaciones en el estado
      })
      // Si ocurre un error en alguna petición, lo muestra en consola
      .catch((err) => {
        console.error('Error al obtener datos:', err);
      });
  };

  // Función para silenciar un usuario (cambiar su estado a "Silenciado")
  const silenciarUsuario = (user) => {
    axios.put(`http://localhost:3000/users/${user.id}`, { ...user, estado: 'Silenciado' })
      .then(() => fetchAllData()) // Recarga los datos después de actualizar
      .catch((err) => {
        console.error('Error al silenciar usuario:', err);
      });
  };

  // Función para borrar un usuario
  const borrarUsuario = (user) => {
    axios.delete(`http://localhost:3000/users/${user.id}`)
      .then(() => fetchAllData()) // Recarga los datos después de borrar
      .catch((err) => {
        console.error('Error al borrar usuario:', err);
      });
  };

  // Función para eliminar un reporte por id
  const borrarReporte = (id) => {
    axios.delete(`http://localhost:3000/reports/${id}`)
      .then(() => fetchAllData()) // Recarga los datos después de borrar
      .catch((err) => {
        console.error('Error al borrar reporte:', err);
      });
  };

  // Busca el usuario con rol "admin" para pasarlo al componente de información de admin
  const adminUser = users.find(u => u.role === "admin");

  // Renderiza las rutas de la aplicación y pasa los datos y funciones necesarias a cada componente
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/menuUsuario" element={<MenuUsuario />} />
        <Route path="/informacion" element={<InformacionUsuario />} />
        <Route path="/generar-reporte" element={<GenerarReporte />} />
        <Route path="/visualizar-reportes" element={<VisualizarReportes/>}/>
        <Route path="/" element={<Home />} />
        <Route path="/loginAdmin" element={<LoginAdmin users={users} />} />
        <Route path="/crearCuenta" element={<CrearCuenta />} />
        <Route path="/recuperarCuenta" element={<RecuperarCuenta />} />
        <Route path="/menu-administracion" element={<MenuAdministracion />} />
        <Route path="/gestion-usuarios" element={<GestionUsuarios users={users} silenciarUsuario={silenciarUsuario} borrarUsuario={borrarUsuario} />} />
        <Route path="/notificaciones-alertas" element={<NotificacionesAlertas notificaciones={notificaciones} />} />
        <Route path="/validar-alertas" element={<ValidarAlertas reports={reports} users={users} incidents={incidents} borrarReporte={borrarReporte} />} />
        <Route path="/informacion-usuarioAdm" element={<InformacionUsuarioAdm admin={adminUser} />} />
      </Routes>
    </BrowserRouter>
  );
}

// Exporta el componente principal para que pueda ser usado por React
export default App;
