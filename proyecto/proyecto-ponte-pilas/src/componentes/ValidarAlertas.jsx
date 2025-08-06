import React, { useState, useRef, useEffect } from "react";
import "../estilos/ValidarAlertas.css";
import LogFondo from "../recursos/MenuAdm/LogFondo.png";
import LogValidarAlerta from "../recursos/MenuAdm/LogValidarAlerta.png";
import LogMegafono from "../recursos/MenuAdm/LogMegafono.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ValidarAlertas = () => {
  // Estados del componente
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [index, setIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para los datos
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [incidents, setIncidents] = useState([]);
  
  // Referencias y hooks
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // ✅ URL del backend
  const baseURL = "http://localhost:8000/";

  // ✅ Función para obtener el token
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // ✅ Función para hacer peticiones autenticadas
  const authenticatedRequest = async (method, url, data = null) => {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const config = {
      method,
      url: `${baseURL}${url}`,
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    if (data) config.data = data;

    return axios(config);
  };

  // ✅ Verificar autenticación usando localStorage
  const verifyAdminAuth = () => {
    const token = getToken();
    const userData = localStorage.getItem('usuario');
    
    if (!token) {
      setMensaje("⚠️ Sesión expirada");
      setTimeout(() => navigate('/loginAdmin'), 2000);
      return false;
    }

    if (!userData) {
      setMensaje("⚠️ No hay información de usuario");
      setTimeout(() => navigate('/loginAdmin'), 2000);
      return false;
    }

    try {
      const user = JSON.parse(userData);

      if (user.role !== 'admin') {
        setMensaje("⚠️ Acceso denegado: Solo administradores");
        setTimeout(() => logout(), 2000);
        return false;
      }

      if (user.estado !== 'Activo') {
        setMensaje("⚠️ Cuenta inactiva");
        setTimeout(() => logout(), 2000);
        return false;
      }

      setCurrentUser(user);
      return true;
    } catch (error) {
      console.error('Error parseando datos de usuario:', error);
      setMensaje("⚠️ Error en datos de usuario");
      setTimeout(() => logout(), 2000);
      return false;
    }
  };

  // ✅ Función para obtener todos los reportes
  const fetchReports = async () => {
    try {
      const response = await authenticatedRequest('GET', 'reports');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo reportes:', error);
      throw error;
    }
  };

  // ✅ Función para obtener todos los usuarios
  const fetchUsers = async () => {
    try {
      const response = await authenticatedRequest('GET', 'users');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      throw error;
    }
  };

  // ✅ Función para obtener todos los incidentes
  const fetchIncidents = async () => {
    try {
      const response = await axios.get(`${baseURL}incidents/list`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo incidentes:', error);
      throw error;
    }
  };

  // ✅ Función para cargar todos los datos
  const loadAllData = async () => {
    try {
      const [reportsData, usersData, incidentsData] = await Promise.all([
        fetchReports(),
        fetchUsers(),
        fetchIncidents()
      ]);

      setReports(reportsData);
      setUsers(usersData);
      setIncidents(incidentsData);

      // Reset index si no hay reportes
      if (reportsData.length === 0) {
        setIndex(0);
      }

    } catch (error) {
      console.error('Error cargando datos:', error);
      if (error.response?.status === 401) {
        setMensaje("⚠️ Sesión expirada");
        setTimeout(() => logout(), 2000);
      } else {
        setMensaje("❌ Error al cargar datos");
        setTimeout(() => setMensaje(""), 3000);
      }
    }
  };

  // ✅ Función para rechazar/eliminar reporte
  const borrarReporte = async (reportId) => {
    try {
      await authenticatedRequest('DELETE', `reports/${reportId}`);
      
      // Actualizar la lista local de reportes
      const nuevosReportes = reports.filter(r => r.id !== reportId);
      setReports(nuevosReportes);

      // Ajustar el índice si es necesario
      if (index >= nuevosReportes.length && nuevosReportes.length > 0) {
        setIndex(nuevosReportes.length - 1);
      } else if (nuevosReportes.length === 0) {
        setIndex(0);
      }

      return true;
    } catch (error) {
      console.error('Error eliminando reporte:', error);
      if (error.response?.status === 404) {
        setMensaje("❌ Reporte no encontrado");
      } else if (error.response?.status === 401) {
        setMensaje("⚠️ Sesión expirada");
        setTimeout(() => logout(), 2000);
      } else {
        setMensaje("❌ Error al eliminar reporte");
      }
      setTimeout(() => setMensaje(""), 3000);
      return false;
    }
  };

  // ✅ Función de logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('userBasicInfo');
    setMensaje("✅ Sesión cerrada");
    setTimeout(() => navigate('/loginAdmin'), 1000);
  };

  // ✅ Función para navegar con verificación de token
  const navigateWithAuth = (route) => {
    const token = getToken();
    if (!token) {
      setMensaje("⚠️ Sesión expirada");
      setTimeout(() => logout(), 1000);
      return;
    }
    navigate(route);
  };

  // Obtiene el reporte actual a mostrar según el índice
  const reporteActual = reports && reports.length > 0 ? reports[index] : null;
  
  // Variables para guardar el usuario y el incidente del reporte actual
  let usuario = null, incidente = null;
  
  if (reporteActual) {
    usuario = users.find((u) => String(u.id) === String(reporteActual.userId));
    incidente = incidents.find(
      (i) => String(i.id) === String(reporteActual.incidentTypeId)
    );
  }

  // ✅ Cargar datos al montar el componente
  useEffect(() => {
    const initializeComponent = async () => {
      setLoading(true);
      
      const isAuthenticated = verifyAdminAuth();
      if (isAuthenticated) {
        await loadAllData();
      }
      
      setLoading(false);
    };

    initializeComponent();
  }, []);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAbierto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Función para ir al siguiente reporte
  const handleNext = () => {
    if (reports.length === 0) return;
    setIndex((prev) => (prev + 1 < reports.length ? prev + 1 : prev));
  };

  // Función para ir al reporte anterior
  const handlePrev = () => {
    if (reports.length === 0) return;
    setIndex((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
  };

  // ✅ Función para rechazar el reporte actual (mejorada)
  const handleRechazar = async () => {
    if (!reporteActual) return;
    
    // Confirmar antes de eliminar
    if (!window.confirm(`¿Estás seguro de que quieres rechazar esta alerta?`)) {
      return;
    }

    const exito = await borrarReporte(reporteActual.id);
    if (exito) {
      setMensaje("✅ Alerta Rechazada");
      setTimeout(() => setMensaje(""), 2000);
    }
  };

  // ✅ Mostrar loading mientras verifica
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h2>🔄 Cargando validación de alertas...</h2>
          <p>Verificando permisos y obteniendo datos</p>
        </div>
      </div>
    );
  }

  // ✅ Si no hay usuario autenticado, no renderizar
  if (!currentUser) {
    return null;
  }

  return (
    <div className="validar-alertas-fondo" style={{ position: "relative", minHeight: "100vh" }}>
      {/* ✅ Mensaje temporal mejorado */}
      {mensaje && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: mensaje.includes('✅') ? '#d4edda' : '#f8d7da',
          color: mensaje.includes('✅') ? '#155724' : '#721c24',
          padding: '15px 20px',
          borderRadius: '5px',
          border: `1px solid ${mensaje.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
          zIndex: 1000,
          fontWeight: 'bold'
        }}>
          {mensaje}
        </div>
      )}

      <img src={LogValidarAlerta} alt="Fondo" className="validar-alertas-bg" />
      
      <header className="menu-admin-header">
        <div className="menu-admin-logo">
          <img src={LogFondo} alt="Logo Quito" className="logo-quito" />
          <span className="ponte-once">
            <span className="ponte">¡PONTE</span> <span className="once">ONCE!</span>
          </span>
        </div>
        
        <div className="menu-admin-user" ref={menuRef}>
          <span className="icono-engranaje">⚙️</span>
          <span className="nombre-usuario">
            {currentUser?.name}
            <span style={{ fontSize: '0.8em', color: '#666', marginLeft: '5px' }}>
              (Admin)
            </span>
          </span>
          
          <button
            className="icono-desplegar-btn"
            onClick={() => setMenuAbierto((v) => !v)}
            aria-label="Abrir menú de usuario"
          >
            <span className="icono-desplegar">▼</span>
          </button>

          {menuAbierto && (
            <div className="menu-desplegable-usuario">
              <button 
                className="menu-item" 
                onClick={() => { 
                  setMenuAbierto(false); 
                  navigateWithAuth('/informacion-usuarioAdm'); 
                }}
              >
                Mi cuenta
              </button>
              <button 
                className="menu-item" 
                onClick={() => {
                  setMenuAbierto(false);
                  logout();
                }}
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="validar-alertas-main">
        <div className="validar-alertas-titulo-container">
          <img src={LogMegafono} alt="Megáfono" className="validar-alertas-megafono" />
          <h1 className="validar-alertas-titulo">Validación de alertas</h1>
        </div>
        
        {reporteActual ? (
          <div className="validar-alertas-card">
            <button
              className="validar-alertas-arrow left"
              onClick={handlePrev}
              disabled={index === 0}
            >
              &#9664;
            </button>
            
            <div className="validar-alertas-info">
              <div>
                <b>Nombre de usuario:</b> {usuario ? usuario.name : "Desconocido"}
              </div>
              <div>
                <b>Tipo de alerta:</b> {incidente ? incidente.type : "Otro"}
              </div>
              <div>
                <b>Fecha y hora:</b> {reporteActual.date + " " + reporteActual.time}
              </div>
              <div>
                <b>Descripción:</b> {reporteActual.description}
              </div>
              <div>
                <b>Ubicación:</b> {reporteActual.location}
              </div>
              <div>
                <b>Estado:</b> 
                <span style={{
                  color: reporteActual.status === 'nuevo' ? '#dc3545' : '#28a745',
                  fontWeight: 'bold',
                  marginLeft: '5px'
                }}>
                  {reporteActual.status}
                </span>
              </div>
            </div>
            
            <button
              className="validar-alertas-arrow right"
              onClick={handleNext}
              disabled={index === reports.length - 1}
            >
              &#9654;
            </button>
          </div>
        ) : (
          <div className="validar-alertas-card" style={{ textAlign: "center", width: "100%" }}>
            No hay alertas para validar
          </div>
        )}
        
        <div className="validar-alertas-botones">
          <button
            className="btn-rechazar"
            onClick={handleRechazar}
            disabled={!reporteActual}
          >
            Rechazar <span className="icon-cross">❌</span>
          </button>
        </div>
        
        <button
          className="btn-regresar"
          onClick={() => navigateWithAuth("/menu-administracion")}
        >
          REGRESAR
        </button>
      </main>
    </div>
  );
};

export default ValidarAlertas;