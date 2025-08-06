import React, { useState, useRef, useEffect } from "react";
import "../estilos/NotificacionesAlertas.css";
import LogFondo from "../recursos/MenuAdm/LogFondo.png";
import LogNotiAlerta from "../recursos/MenuAdm/LogNotiAlerta.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const encabezados = [
  { value: "nombre", label: "Nombre de usuario" },
  { value: "tipo", label: "Tipo de alerta" },
  { value: "descripcion", label: "Descripcion" },
  { value: "fechaHora", label: "Fecha y Hora" },
  { value: "ubicacion", label: "Ubicación" }
];

const NotificacionesAlertas = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Estados para los datos
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);

  // Estados para los filtros
  const [columnaFiltro, setColumnaFiltro] = useState("");
  const [valorFiltro, setValorFiltro] = useState("");

  // Modal para crear un nuevo tipo de incidente
  const [modalNuevoTipo, setModalNuevoTipo] = useState(false);
  const [nuevoTipoNombre, setNuevoTipoNombre] = useState("");
  const [nuevoTipoColor, setNuevoTipoColor] = useState("#000000");
  const [nuevoTipoIcon, setNuevoTipoIcon] = useState("");

  // Modal de edición de reporte
  const [modalEditar, setModalEditar] = useState(false);
  const [reporteEditar, setReporteEditar] = useState(null);
  const [nuevoTipo, setNuevoTipo] = useState("");

  // ✅ NUEVO: Estados para gestión de tipos de incidentes
  const [mostrarIncidentes, setMostrarIncidentes] = useState(false);
  const [modalEditarIncidente, setModalEditarIncidente] = useState(false);
  const [incidenteEditar, setIncidenteEditar] = useState(null);
  const [editarIncidenteData, setEditarIncidenteData] = useState({
    type: "",
    color: "#000000",
    icon: ""
  });

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

  // ✅ Función para cargar todos los datos y crear notificaciones
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

      // Crear notificaciones combinando datos
      const notificacionesData = reportsData.map(report => {
        const user = usersData.find(u => u.id === report.userId);
        const incident = incidentsData.find(i => i.id === report.incidentTypeId);
        
        return {
          id: report.id,
          nombre: user ? user.name : 'Usuario desconocido',
          tipo: incident ? incident.type : 'Tipo desconocido',
          descripcion: report.description,
          fechaHora: `${report.date} ${report.time}`,
          ubicacion: report.location,
          status: report.status,
          userId: report.userId,
          incidentTypeId: report.incidentTypeId
        };
      });

      setNotificaciones(notificacionesData);

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

  // ✅ Función para crear un nuevo tipo de incidente
  const crearNuevoTipo = async () => {
    if (!nuevoTipoNombre.trim()) {
      setMensaje("❌ El nombre del tipo es requerido");
      setTimeout(() => setMensaje(""), 3000);
      return;
    }

    try {
      await authenticatedRequest('POST', 'incidents/create', {
        type: nuevoTipoNombre,
        color: nuevoTipoColor,
        icon: nuevoTipoIcon || "default-icon"
      });

      setModalNuevoTipo(false);
      setNuevoTipoNombre("");
      setNuevoTipoColor("#000000");
      setNuevoTipoIcon("");
      
      setMensaje("✅ Tipo de incidente creado exitosamente");
      setTimeout(() => setMensaje(""), 3000);
      
      // Recargar datos
      await loadAllData();

    } catch (error) {
      console.error('Error creando tipo de incidente:', error);
      setMensaje("❌ Error al crear el tipo de incidente");
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  // ✅ NUEVO: Función para abrir modal de edición de incidente
  const abrirModalEditarIncidente = (incidente) => {
    setIncidenteEditar(incidente);
    setEditarIncidenteData({
      type: incidente.type,
      color: incidente.color,
      icon: incidente.icon
    });
    setModalEditarIncidente(true);
  };

  // ✅ NUEVO: Función para guardar cambios en incidente
  const guardarCambiosIncidente = async () => {
    if (!editarIncidenteData.type.trim()) {
      setMensaje("❌ El nombre del tipo es requerido");
      setTimeout(() => setMensaje(""), 3000);
      return;
    }

    try {
      await authenticatedRequest('PUT', `incidents/${incidenteEditar.id}/update`, editarIncidenteData);

      setModalEditarIncidente(false);
      setIncidenteEditar(null);
      setEditarIncidenteData({
        type: "",
        color: "#000000",
        icon: ""
      });
      
      setMensaje("✅ Tipo de incidente actualizado exitosamente");
      setTimeout(() => setMensaje(""), 3000);
      
      // Recargar datos
      await loadAllData();

    } catch (error) {
      console.error('Error actualizando tipo de incidente:', error);
      setMensaje("❌ Error al actualizar el tipo de incidente");
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  // ✅ NUEVO: Función para eliminar incidente
  const eliminarIncidente = async (incidente) => {
    const confirmacion = window.confirm(
      `¿Estás seguro de eliminar el tipo de incidente "${incidente.type}"?\n\n` +
      `ADVERTENCIA: También se eliminarán todos los reportes asociados a este tipo.`
    );

    if (!confirmacion) return;

    try {
      await authenticatedRequest('DELETE', `incidents/${incidente.id}/delete`);
      
      setMensaje("✅ Tipo de incidente eliminado exitosamente");
      setTimeout(() => setMensaje(""), 3000);
      
      // Recargar datos
      await loadAllData();

    } catch (error) {
      console.error('Error eliminando tipo de incidente:', error);
      setMensaje("❌ Error al eliminar el tipo de incidente");
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  // ✅ Función para guardar cambio de tipo de reporte
  const guardarNuevoTipo = async () => {
    if (!nuevoTipo || !reporteEditar) {
      setMensaje("❌ Debe seleccionar un tipo de incidente");
      setTimeout(() => setMensaje(""), 3000);
      return;
    }

    try {
      // Buscar el id del incidente seleccionado
      const incidente = incidents.find(i => i.type === nuevoTipo);
      if (!incidente) {
        setMensaje("❌ Incidente no encontrado");
        setTimeout(() => setMensaje(""), 3000);
        return;
      }

      // Actualizar el reporte
      await authenticatedRequest('PUT', `reports/${reporteEditar.id}`, {
        incidentTypeId: incidente.id
      });

      setModalEditar(false);
      setMensaje("✅ Tipo de reporte actualizado exitosamente");
      setTimeout(() => setMensaje(""), 3000);
      
      // Recargar datos
      await loadAllData();

    } catch (error) {
      console.error('Error actualizando reporte:', error);
      setMensaje("❌ Error al actualizar el reporte");
      setTimeout(() => setMensaje(""), 3000);
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

  // Maneja la apertura del modal de edición de reporte
  const handleEditarReporte = (notificacion) => {
    setReporteEditar(notificacion);
    setNuevoTipo(""); // Limpiar selección
    setModalEditar(true);
  };

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

  // Si se cambia la columna, limpia el valor del filtro
  useEffect(() => {
    setValorFiltro("");
  }, [columnaFiltro]);

  // Opciones únicas para el segundo combobox
  const opcionesFiltro = columnaFiltro
    ? columnaFiltro === "tipo"
      ? incidents.map(i => i.type)
      : [...new Set(notificaciones.map(n => n[columnaFiltro]).filter(Boolean))]
    : [];

  // Filtrado de notificaciones
  const notificacionesFiltradas =
    columnaFiltro && valorFiltro
      ? notificaciones.filter(n => n[columnaFiltro] === valorFiltro)
      : notificaciones;

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
          <h2>🔄 Cargando notificaciones...</h2>
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
    <div className="notificaciones-alertas-fondo" style={{ position: "relative", minHeight: "100vh" }}>
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

      <img src={LogNotiAlerta} alt="Fondo" className="notificaciones-alertas-bg" />
      
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

      <main className="notificaciones-alertas-main">
        <h1 className="notificaciones-alertas-titulo">Notificaciones de Alertas</h1>
        
        {/* ✅ NUEVO: Botón para alternar entre vista de reportes e incidentes */}
        <div style={{ margin: "1rem 0", display: "flex", gap: "1rem", alignItems: "center" }}>
          <button
            className={`btn-toggle ${!mostrarIncidentes ? 'active' : ''}`}
            style={{
              background: !mostrarIncidentes ? "linear-gradient(90deg,#ff512f,#dd2476)" : "#ccc",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "0.5rem 1.2rem",
              fontWeight: "bold",
              cursor: "pointer"
            }}
            onClick={() => setMostrarIncidentes(false)}
          >
            Ver Reportes
          </button>
          <button
            className={`btn-toggle ${mostrarIncidentes ? 'active' : ''}`}
            style={{
              background: mostrarIncidentes ? "linear-gradient(90deg,#ff512f,#dd2476)" : "#ccc",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "0.5rem 1.2rem",
              fontWeight: "bold",
              cursor: "pointer"
            }}
            onClick={() => setMostrarIncidentes(true)}
          >
            Gestionar Tipos de Incidentes
          </button>
        </div>

        {/* Filtros (solo se muestran en la vista de reportes) */}
        {!mostrarIncidentes && (
          <>
            {/* ✅ CORREGIDO: Filtros en línea horizontal con estilos más específicos */}
            <div style={{ 
              margin: "1rem 0", 
              display: "flex", 
              flexDirection: "row",
              gap: "1rem", 
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              width: "100%"
            }}>
              {/* Primer ComboBox */}
              <select
                className="combo-filtro-notificaciones"
                value={columnaFiltro}
                onChange={e => setColumnaFiltro(e.target.value)}
                style={{ 
                  minWidth: "200px",
                  maxWidth: "250px",
                  display: "inline-block",
                  marginBottom: "0"
                }}
              >
                <option value="">Filtrar por...</option>
                {encabezados.map(e => (
                  <option key={e.value} value={e.value}>{e.label}</option>
                ))}
              </select>

              {/* ✅ CORREGIDO: Segundo ComboBox con estilos más específicos */}
              {columnaFiltro && (
                <select
                  className="combo-filtro-notificaciones"
                  value={valorFiltro}
                  onChange={e => setValorFiltro(e.target.value)}
                  style={{ 
                    minWidth: "200px",
                    maxWidth: "250px",
                    display: "inline-block",
                    marginBottom: "0",
                    marginLeft: "0"
                  }}
                >
                  <option value="">Selecciona un valor...</option>
                  {opcionesFiltro.map((op, idx) => (
                    <option key={idx} value={op}>{op}</option>
                  ))}
                </select>
              )}
            </div>
          </>
        )}

        {/* ✅ MODIFICADO: Botones condicionales según la vista */}
        <div style={{ display: "flex", gap: "1rem", margin: "1rem 0" }}>
          <button 
            className="btn-regresar" 
            onClick={() => navigateWithAuth("/menu-administracion")}
          >
            REGRESAR
          </button>
          
          {/* ✅ NUEVO: Botón solo visible en vista de tipos de incidentes */}
          {mostrarIncidentes && (
            <button
              className="btn-nuevo-tipo"
              style={{
                background: "linear-gradient(90deg,#ff512f,#dd2476)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "0.5rem 1.2rem",
                fontWeight: "bold",
                cursor: "pointer"
              }}
              onClick={() => setModalNuevoTipo(true)}
            >
              Crear nuevo tipo de reporte
            </button>
          )}
        </div>


        {/* ✅ TABLA CONDICIONAL: Reportes o Incidentes */}
        <div className="notificaciones-alertas-tabla-container">
          {!mostrarIncidentes ? (
            // TABLA DE REPORTES (ORIGINAL)
            <table className="notificaciones-alertas-tabla">
              <thead>
                <tr>
                  <th>Nombre de usuario</th>
                  <th>Tipo de alerta</th>
                  <th>Descripcion</th>
                  <th>Fecha y Hora</th>
                  <th>Ubicación</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {notificacionesFiltradas && notificacionesFiltradas.length > 0 ? (
                  notificacionesFiltradas.map((n, idx) => (
                    <tr key={n.id || idx}>
                      <td>{n.nombre}</td>
                      <td>{n.tipo}</td>
                      <td>{n.descripcion}</td>
                      <td>{n.fechaHora}</td>
                      <td>{n.ubicacion}</td>
                      <td>
                        <span style={{
                          color: n.status === 'nuevo' ? '#dc3545' : '#28a745',
                          fontWeight: 'bold'
                        }}>
                          {n.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-editar-reporte"
                          onClick={() => handleEditarReporte(n)}
                        >
                          Editar reporte
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={7} style={{ textAlign: 'center' }}>No hay notificaciones</td></tr>
                )}
              </tbody>
            </table>
          ) : (
            // ✅ NUEVA TABLA DE TIPOS DE INCIDENTES
            <table className="notificaciones-alertas-tabla">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipo de Incidente</th>
                  <th>Color</th>
                  <th>Icono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {incidents && incidents.length > 0 ? (
                  incidents.map((incidente) => (
                    <tr key={incidente.id}>
                      <td>{incidente.id}</td>
                      <td>{incidente.type}</td>
                      <td>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          backgroundColor: incidente.color,
                          borderRadius: '50%',
                          display: 'inline-block',
                          border: '1px solid #ccc'
                        }}></div>
                        <span style={{ marginLeft: '10px' }}>{incidente.color}</span>
                      </td>
                      <td>{incidente.icon}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="btn-editar-reporte"
                            style={{
                              background: "#007bff",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              padding: "0.3rem 0.6rem",
                              cursor: "pointer",
                              fontSize: "0.8rem"
                            }}
                            onClick={() => abrirModalEditarIncidente(incidente)}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            className="btn-eliminar-incidente"
                            style={{
                              background: "#dc3545",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              padding: "0.3rem 0.6rem",
                              cursor: "pointer",
                              fontSize: "0.8rem"
                            }}
                            onClick={() => eliminarIncidente(incidente)}
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={5} style={{ textAlign: 'center' }}>No hay tipos de incidentes</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal para crear nuevo tipo de incidente */}
        {modalNuevoTipo && (
          <div className="modal-overlay" style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
          }}>
            <div className="modal-content" style={{
              background: "#fff", padding: "2rem", borderRadius: "10px", minWidth: "320px", maxWidth: "90vw", boxShadow: "0 2px 16px rgba(0,0,0,0.2)"
            }}>
              <h3>Crear nuevo tipo de incidente</h3>
              <form onSubmit={e => { e.preventDefault(); crearNuevoTipo(); }}>
                <div style={{ marginBottom: "1rem" }}>
                  <label>Nombre del tipo:</label>
                  <input
                    type="text"
                    value={nuevoTipoNombre}
                    onChange={e => setNuevoTipoNombre(e.target.value)}
                    required
                    style={{ width: "100%", padding: "0.5rem", marginTop: "0.3rem" }}
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label>Color:</label>
                  <input
                    type="color"
                    value={nuevoTipoColor}
                    onChange={e => setNuevoTipoColor(e.target.value)}
                    style={{ marginLeft: "1rem" }}
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label>Icono (URL o nombre de archivo):</label>
                  <input
                    type="text"
                    value={nuevoTipoIcon}
                    onChange={e => setNuevoTipoIcon(e.target.value)}
                    style={{ width: "100%", padding: "0.5rem", marginTop: "0.3rem" }}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                  <button type="submit" className="btn-editar-reporte">
                    Guardar
                  </button>
                  <button type="button" className="btn-editar-reporte" onClick={() => setModalNuevoTipo(false)}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ✅ NUEVO: Modal para editar tipo de incidente */}
        {modalEditarIncidente && (
          <div className="modal-overlay" style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
          }}>
            <div className="modal-content" style={{
              background: "#fff", padding: "2rem", borderRadius: "10px", minWidth: "320px", maxWidth: "90vw", boxShadow: "0 2px 16px rgba(0,0,0,0.2)"
            }}>
              <h3>Editar tipo de incidente</h3>
              <form onSubmit={e => { e.preventDefault(); guardarCambiosIncidente(); }}>
                <div style={{ marginBottom: "1rem" }}>
                  <label>Nombre del tipo:</label>
                  <input
                    type="text"
                    value={editarIncidenteData.type}
                    onChange={e => setEditarIncidenteData({...editarIncidenteData, type: e.target.value})}
                    required
                    style={{ width: "100%", padding: "0.5rem", marginTop: "0.3rem" }}
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label>Color:</label>
                  <input
                    type="color"
                    value={editarIncidenteData.color}
                    onChange={e => setEditarIncidenteData({...editarIncidenteData, color: e.target.value})}
                    style={{ marginLeft: "1rem" }}
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label>Icono (URL o nombre de archivo):</label>
                  <input
                    type="text"
                    value={editarIncidenteData.icon}
                    onChange={e => setEditarIncidenteData({...editarIncidenteData, icon: e.target.value})}
                    style={{ width: "100%", padding: "0.5rem", marginTop: "0.3rem" }}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                  <button type="submit" className="btn-editar-reporte">
                    Guardar Cambios
                  </button>
                  <button 
                    type="button" 
                    className="btn-editar-reporte" 
                    onClick={() => {
                      setModalEditarIncidente(false);
                      setIncidenteEditar(null);
                      setEditarIncidenteData({type: "", color: "#000000", icon: ""});
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal para editar el tipo de alerta de un reporte */}
        {modalEditar && (
          <div className="modal-overlay" style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
          }}>
            <div className="modal-content" style={{
              background: "#fff", padding: "2rem", borderRadius: "10px", minWidth: "320px", maxWidth: "90vw", boxShadow: "0 2px 16px rgba(0,0,0,0.2)"
            }}>
              <h3>Editar tipo de alerta</h3>
              <div style={{ margin: "1rem 0" }}>
                <select
                  value={nuevoTipo}
                  onChange={e => setNuevoTipo(e.target.value)}
                  className="combo-filtro-notificaciones"
                >
                  <option value="">Selecciona un tipo...</option>
                  {incidents.map(inc => (
                    <option key={inc.id} value={inc.type}>{inc.type}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                <button className="btn-editar-reporte" onClick={guardarNuevoTipo} disabled={!nuevoTipo}>
                  Guardar
                </button>
                <button className="btn-editar-reporte" onClick={() => setModalEditar(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default NotificacionesAlertas;