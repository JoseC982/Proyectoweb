/**
 * COMPONENTE PRINCIPAL DE LA APLICACIÓN - APP.JS
 * Sistema "Ponte Pilas" - Plataforma de reportes ciudadanos
 * 
 * Este es el componente raíz que maneja:
 * - Estado global de la aplicación (usuarios, reportes, incidentes)
 * - Autenticación y autorización con JWT
 * - Configuración de rutas principales con React Router
 * - Comunicación con el backend a través de axios
 * - Gestión de localStorage para persistencia de sesión
 * 
 * El sistema permite a ciudadanos reportar incidentes y a administradores
 * gestionar usuarios y validar reportes para mejorar la seguridad urbana.
 */

// Importa React y los hooks necesarios para el manejo de estado y efectos
import React, { useState, useEffect } from 'react';
// Importa los componentes de rutas de React Router
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Importa la librería axios para hacer peticiones HTTP
import axios from 'axios';

/**
 * IMPORTACIÓN DE COMPONENTES DE LA APLICACIÓN
 * Cada componente maneja una funcionalidad específica del sistema
 */

// Componentes para usuarios regulares
import MenuUsuario from './componentes/MenuUsuario';           // Menú principal para usuarios
import InformacionUsuario from './componentes/InformacionUsuario'; // Perfil de usuario
import VisualizarReportes from './componentes/VisualizarReportes';   // Ver reportes propios
import GenerarReporte from './componentes/GenerarReporte';           // Crear nuevos reportes
import './App.css'; // Importa los estilos globales de la app

// Componentes de autenticación y registro
import LoginAdmin from './componentes/LoginAdmin';             // Login para administradores
import CrearCuenta from "./componentes/CrearCuenta";          // Registro de nuevos usuarios
import RecuperarCuenta from "./componentes/RecuperarCuenta";  // Recuperación de contraseñas
import Home from "./componentes/Home";                        // Página de inicio

// Componentes administrativos (solo para administradores)
import MenuAdministracion from './componentes/MenuAdministracion';     // Menú principal admin
import GestionUsuarios from './componentes/GestionUsuarios';           // CRUD de usuarios
import NotificacionesAlertas from './componentes/NotificacionesAlertas'; // Dashboard de reportes
import ValidarAlertas from './componentes/ValidarAlertas';             // Validación de reportes
import InformacionUsuarioAdm from './componentes/InformacionUsuarioAdm'; // Perfil admin

/**
 * DEFINICIÓN DEL COMPONENTE PRINCIPAL APP
 * Maneja el estado global y la lógica de la aplicación completa
 */
function App() {
  /**
   * ESTADOS GLOBALES DE LA APLICACIÓN
   * Estos estados son compartidos entre componentes para mantener consistencia
   */

  // Estado para almacenar la lista completa de usuarios del sistema
  const [usersList, setUsersList] = useState([]);
  // Estado para almacenar los tipos de incidentes disponibles (catálogo)
  const [incidents, setIncidents] = useState([]);
  // Estado para almacenar todos los reportes del sistema
  const [reports, setReports] = useState([]);
  // Estado para almacenar notificaciones procesadas para la vista admin
  const [notificaciones, setNotificaciones] = useState([]);

  const baseURL = "http://192.168.100.29:8000/";
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

  /**
   * EFFECT PARA LIMPIAR DATOS CORRUPTOS DEL LOCALSTORAGE
   * Se ejecuta una sola vez al cargar la aplicación
   * Elimina tokens y usuarios con valores inválidos
   */
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

  /**
   * EFFECT PARA CONFIGURAR AUTORIZACIÓN EN AXIOS
   * Configura el header Authorization con el token JWT
   * Se ejecuta cada vez que cambia el estado del usuario
   */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token !== "undefined" && token !== "null" && users) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [users]);

  /**
   * EFFECT PARA CARGAR REPORTES INICIALES
   * Solo carga reportes si hay un usuario autenticado
   * Evita peticiones innecesarias sin autenticación
   */
  useEffect(() => {
    if (users) { // Solo si hay usuario autenticado
      axios.get(baseURL + "reports")
        .then(res => setNotificaciones(res.data))
        .catch(() => setNotificaciones([]));
    }
  }, [users]); // Se ejecuta cuando cambia el usuario

  /**
   * EFFECT PARA CARGAR DATOS COMPLETOS DE LA APLICACIÓN
   * Carga usuarios, incidentes y reportes cuando hay usuario autenticado
   */
  useEffect(() => {
    if (users) { // Solo si hay usuario autenticado
      fetchAllData();
    }
  }, [users]); // Se ejecuta cuando cambia el usuario

  /**
  * FUNCIÓN PARA OBTENER TODOS LOS DATOS DEL BACKEND
  * Realiza peticiones simultáneas para cargar usuarios, incidentes y reportes
  * Incluye manejo de errores y limpieza de sesión en caso de token inválido
  */
  const fetchAllData = () => {
    // Solo hacer peticiones si hay usuario autenticado
    if (!users) return;

    // Realizar peticiones paralelas para optimizar tiempo de carga
    Promise.all([
      axios.get(baseURL + "users"),           // Obtener lista de usuarios
      axios.get(baseURL + "incidents/list"),  // Obtener catálogo de incidentes
      axios.get(baseURL + "reports"),         // Obtener todos los reportes
    ])
      .then(([usersRes, incidentsRes, reportsRes]) => {
        // Actualizar estados con los datos obtenidos
        setUsersList(usersRes.data);
        setIncidents(incidentsRes.data);
        setReports(reportsRes.data);
      })
      .catch((err) => {
        console.error('Error al obtener datos:', err);

        // Si es error 401 (no autorizado), limpiar sesión completamente
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
          setUsers(null);
          // Limpiar headers de autorización en axios
          delete axios.defaults.headers.common['Authorization'];
        }
      });
  };

  /**
   * EFFECT PARA PROCESAR NOTIFICACIONES
   * Combina datos de reportes, usuarios e incidentes para crear notificaciones
   * útiles para el dashboard administrativo
   */
  useEffect(() => {
    if (reports.length > 0 && usersList.length > 0 && incidents.length > 0) {
      // Mapear reportes con información completa de usuario e incidente
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

  /**
   * FUNCIÓN PARA SILENCIAR/ACTIVAR USUARIOS
   * Permite a los administradores cambiar el estado de los usuarios
   * Estados: "Activo" o "Silenciado"
   */
  const silenciarUsuario = (user, nuevoEstado) => {
    axios.patch(`${baseURL}users/${user.id}/estado`, { estado: nuevoEstado })
      .then(() => fetchAllData()) // Recargar datos después del cambio
      .catch((err) => {
        console.error('Error al actualizar usuario:', err);
        // Manejar pérdida de autenticación
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
          setUsers(null);
        }
      });
  };

  /**
   * FUNCIÓN PARA ELIMINAR USUARIOS
   * Permite a los administradores eliminar usuarios del sistema
   */
  const borrarUsuario = (user) => {
    axios.delete(`${baseURL}users/${user.id}`)
      .then(() => fetchAllData()) // Recargar datos después de la eliminación
      .catch((err) => {
        console.error('Error al borrar usuario:', err);
        // Manejar pérdida de autenticación
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
          setUsers(null);
        }
      });
  };

  /**
   * FUNCIÓN PARA ELIMINAR REPORTES
   * Permite eliminar reportes específicos por su ID
   * Incluye manejo de diferentes tipos de errores
   */
  const borrarReporte = (id) => {
    axios.delete(`${baseURL}reports/${id}`)
      .then(() => fetchAllData()) // Recargar datos después de la eliminación
      .catch((err) => {
        // Manejo específico de diferentes errores HTTP
        if (err.response && err.response.status === 404) {
          console.error('404: Reporte no encontrado');
        } else if (err.response && err.response.status === 401) {
          // Limpiar sesión si el token es inválido
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
          setUsers(null);
        } else {
          console.error('Error al borrar reporte:', err);
        }
      });
  };

  /**
   * CONFIGURACIÓN DE RUTAS DE LA APLICACIÓN
   * Define todas las rutas disponibles y sus componentes correspondientes
   * Utiliza React Router para navegación SPA (Single Page Application)
   */
  return (
    <BrowserRouter>
      <Routes>
        {/* ========== RUTAS PARA USUARIOS REGULARES ========== */}

        {/* Menú principal del usuario autenticado */}
        <Route path="/menuUsuario" element={
          <MenuUsuario users={users} fetchAllData={fetchAllData} baseURL={baseURL} />
        } />

        {/* Página de información/perfil del usuario */}
        <Route path="/informacion" element={<InformacionUsuario users={users} setUsers={setUsers} baseURL={baseURL} />} />

        {/* Formulario para crear nuevos reportes de incidentes */}
        <Route path="/generar-reporte" element={<GenerarReporte baseURL={baseURL}/>} />

        {/* Visualización de reportes propios del usuario
        <Route path="/visualizar-reportes" element={<VisualizarReportes baseURL={baseURL}/>} /> */}

        {/* ========== RUTAS PÚBLICAS ========== */}

        {/* Página de inicio/landing page */}
        <Route path="/" element={<Home baseURL={baseURL}/>} />

        {/* Formulario de login para administradores */}
        <Route path="/loginAdmin" element={<LoginAdmin setUsers={setUsers} baseURL={baseURL}/>} />

        {/* Formulario de registro de nuevos usuarios */}
        <Route path="/crearCuenta" element={<CrearCuenta baseURL={baseURL}/>} />

        {/* Sistema de recuperación de contraseñas */}
        <Route path="/recuperarCuenta" element={<RecuperarCuenta baseURL={baseURL}/>} />

        {/* ========== RUTAS ADMINISTRATIVAS ========== */}

        {/* Menú principal para administradores */}
        <Route path="/menu-administracion" element={<MenuAdministracion users={users}/>} />

        {/* Gestión completa de usuarios (CRUD) */}
        <Route path="/gestion-usuarios" element={<GestionUsuarios users={usersList} silenciarUsuario={silenciarUsuario} borrarUsuario={borrarUsuario} baseURL={baseURL}/>} />

        {/* Dashboard de notificaciones y reportes */}
        <Route path="/notificaciones-alertas" element={<NotificacionesAlertas users={users} notificaciones={notificaciones} baseURL={baseURL}/>} />

        {/* Sistema de validación y moderación de reportes */}
        <Route path="/validar-alertas" element={<ValidarAlertas reports={reports} users={users} usersList={usersList} incidents={incidents} borrarReporte={borrarReporte} baseURL={baseURL}/>} />

        {/* Perfil de usuario desde vista administrativa */}
        <Route path="/informacion-usuarioAdm" element={<InformacionUsuarioAdm users={users} setUsers={setUsers} baseURL={baseURL}/>} />

      </Routes>
    </BrowserRouter>
  );
}

/**
 * EXPORTACIÓN DEL COMPONENTE APP
 * Permite que otros archivos puedan importar y utilizar este componente
 * Este es el punto de entrada principal de toda la aplicación React
 */
export default App;
