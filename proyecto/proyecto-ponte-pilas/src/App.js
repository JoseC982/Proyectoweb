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
import './App.css'; // Importa los estilos globales de la app
import LoginAdmin from './componentes/LoginAdmin';
import CrearCuenta from "./componentes/CrearCuenta";
import RecuperarCuenta from "./componentes/RecuperarCuenta";
import Home from "./componentes/Home";
import MenuAdministracion from './componentes/MenuAdministracion';
import GestionUsuarios from './componentes/GestionUsuarios';
import NotificacionesAlertas from './componentes/NotificacionesAlertas';
import ValidarAlertas from './componentes/ValidarAlertas';
import InformacionUsuarioAdm from './componentes/InformacionUsuarioAdm';

// Define el componente principal App
function App() {
  // Estado para almacenar la lista de usuarios
  const [usersList, setUsersList] = useState([]);
  // Estado para almacenar la lista de incidentes
  const [incidents, setIncidents] = useState([]);
  // Estado para almacenar la lista de reportes
  const [reports, setReports] = useState([]);
  // Estado para almacenar la lista de notificaciones procesadas
  const [notificaciones, setNotificaciones] = useState([]);

  const baseURL = "http://localhost:8000/";
  // ✅ CORREGIR: Estado global para el usuario autenticado con validación
  const [users, setUsers] = useState(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    // Validar que no sea null, undefined o "undefined"
    if (usuarioGuardado && usuarioGuardado !== "undefined" && usuarioGuardado !== "null") {
      try {
        return JSON.parse(usuarioGuardado);
      } catch (error) {
        console.error('Error al parsear usuario del localStorage:', error);
        // Si hay error al parsear, limpiar localStorage
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
        return null;
      }
    }
    return null;
  });

  // ✅ AGREGAR: Limpiar localStorage corrupto
  useEffect(() => {
    const token = localStorage.getItem("token");
    const usuario = localStorage.getItem("usuario");
    
    // Limpiar datos corruptos
    if (token === "undefined" || token === "null") {
      localStorage.removeItem("token");
    }
    if (usuario === "undefined" || usuario === "null") {
      localStorage.removeItem("usuario");
    }
  }, []); // Solo una vez al cargar la app

  // ✅ AGREGAR: Configurar token cuando hay usuario
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token !== "undefined" && token !== "null" && users) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [users]);

  // ✅ MODIFICAR: Solo cargar reportes si hay usuario
  useEffect(() => {
    if (users) { // ✅ Agregar esta condición
      axios.get(baseURL + "reports")
        .then(res => setNotificaciones(res.data))
        .catch(() => setNotificaciones([]));
    }
  }, [users]); // ✅ Cambiar de [] a [users]

  // ✅ MODIFICAR: Solo cargar datos si hay usuario
  useEffect(() => {
    if (users) { // ✅ Agregar esta condición
      fetchAllData();
    }
  }, [users]); // ✅ Cambiar de [] a [users]

   // ✅ Función para obtener todos los datos necesarios del backend
  const fetchAllData = () => {
    // Solo hacer peticiones si hay usuario autenticado
    if (!users) return;

    Promise.all([
      axios.get(baseURL + "users"),           // ✅ Ruta protegida
      axios.get(baseURL + "incidents/list"),  // ✅ Verificar que esta ruta exista
      axios.get(baseURL + "reports"),         // ✅ Ruta protegida
    ])
      .then(([usersRes, incidentsRes, reportsRes]) => {
        setUsersList(usersRes.data);         
        setIncidents(incidentsRes.data);     
        setReports(reportsRes.data);         
      })
      .catch((err) => {
        console.error('Error al obtener datos:', err);
        
        // Si es error 401 (no autorizado), limpiar sesión
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
          setUsers(null);
          // Limpiar axios headers
          delete axios.defaults.headers.common['Authorization'];
        }
      });
  };

  // ✅ Procesar notificaciones cuando cambien los datos
  useEffect(() => {
    if (reports.length > 0 && usersList.length > 0 && incidents.length > 0) {
      const notificacionesTabla = reports.map((rep) => {
        const usuario = usersList.find(u => String(u.id) === String(rep.userId));
        const incidente = incidents.find(i => String(i.id) === String(rep.incidentTypeId));
        return {
          nombre: usuario ? usuario.name : 'Desconocido',
          tipo: incidente ? incidente.type : 'Otro',
          descripcion: rep.description,
          fechaHora: rep.date + ' ' + rep.time,
          ubicacion: rep.location
        };
      });
      setNotificaciones(notificacionesTabla);
    }
  }, [reports, usersList, incidents]);

  // ✅ Función para silenciar un usuario (actualizar estado)
  const silenciarUsuario = (user, nuevoEstado) => {
    axios.patch(`${baseURL}users/${user.id}/estado`, { estado: nuevoEstado }) // ✅ Ruta correcta
      .then(() => fetchAllData())
      .catch((err) => {
        console.error('Error al actualizar usuario:', err);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
          setUsers(null);
        }
      });
  };

  // ✅ Función para borrar un usuario
  const borrarUsuario = (user) => {
    axios.delete(`${baseURL}users/${user.id}`) // ✅ Ruta correcta
      .then(() => fetchAllData())
      .catch((err) => {
        console.error('Error al borrar usuario:', err);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
          setUsers(null);
        }
      });
  };

  // ✅ Función para eliminar un reporte por id
  const borrarReporte = (id) => {
    axios.delete(`${baseURL}reports/${id}`) // ✅ Ruta correcta
      .then(() => fetchAllData())
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          console.error('404: Reporte no encontrado');
        } else if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
          setUsers(null);
        } else {
          console.error('Error al borrar reporte:', err);
        }
      });
  };

  // Busca el usuario con rol "admin" para pasarlo al componente de información de admin
  //const adminUser = users.find(u => u.role === "admin");

  // Renderiza las rutas de la aplicación y pasa los datos y funciones necesarias a cada componente
  // Estado global para el usuario autenticado.
  // Se inicializa leyendo el usuario guardado en localStorage (si existe).

  // Renderiza el enrutador principal de la aplicación
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta para el menú de usuario, pasa el usuario autenticado como prop */}
        <Route path="/menuUsuario" element={
          <MenuUsuario users={users} fetchAllData={fetchAllData} />
        } />
        {/* Ruta para la información del usuario, pasa el usuario y el setter como props */}
        <Route path="/informacion" element={<InformacionUsuario users={users} setUsers={setUsers} />} />
        {/* Ruta para generar un reporte */}
        <Route path="/generar-reporte" element={<GenerarReporte />} />

        {/* Ruta para visualizar reportes */}
        <Route path="/visualizar-reportes" element={<VisualizarReportes />} />

        {/* Ruta para la página de inicio */}
        <Route path="/" element={<Home />} />
        {/* Ruta para el login de administrador, pasa el setter de usuario como prop */}
        <Route path="/loginAdmin" element={<LoginAdmin setUsers={setUsers} />} />
        {/* Ruta para crear una cuenta */}

        <Route path="/crearCuenta" element={<CrearCuenta />} />
        {/* Ruta para recuperar cuenta */}
        <Route path="/recuperarCuenta" element={<RecuperarCuenta />} />
        {/* Ruta para el menú de administración */}
        <Route path="/menu-administracion" element={<MenuAdministracion users={users} />} />
        <Route path="/gestion-usuarios" element={<GestionUsuarios users={usersList} silenciarUsuario={silenciarUsuario} borrarUsuario={borrarUsuario} />} />
        <Route path="/notificaciones-alertas" element={<NotificacionesAlertas users={users} notificaciones={notificaciones} />} />
        <Route path="/validar-alertas" element={<ValidarAlertas reports={reports} users={users} usersList={usersList} incidents={incidents} borrarReporte={borrarReporte} />} />
        <Route path="/informacion-usuarioAdm" element={<InformacionUsuarioAdm users={users} setUsers={setUsers} />} />

      </Routes>
    </BrowserRouter>
  );
}

// Exporta el componente App como predeterminado
export default App;
