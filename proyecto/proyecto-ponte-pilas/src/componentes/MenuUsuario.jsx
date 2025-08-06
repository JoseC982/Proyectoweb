/**
 * COMPONENTE MENU USUARIO - DASHBOARD PRINCIPAL DEL USUARIO
 * Interfaz principal para usuarios autenticados del sistema "Ponte Pilas"
 * 
 * Funcionalidades principales:
 * - Mapa interactivo con Google Maps para visualizar reportes
 * - Creación y edición de reportes de incidentes
 * - Filtrado de reportes propios vs todos los reportes
 * - Gestión completa de reportes del usuario
 * - Navegación a otras secciones del sistema
 * - Logout y gestión de sesión
 * 
 * Características del mapa:
 * - Visualización de ubicaciones de reportes con marcadores
 * - Información detallada en ventanas emergentes
 * - Diferentes colores de marcadores según tipo de incidente
 * - Interacción para crear reportes desde el mapa
 */

// Importa hooks de React para estado, efectos y referencias
import React, { useState, useEffect, useRef } from "react";
// Importa navegación de React Router
import { useNavigate } from "react-router-dom";
// Importa axios para peticiones HTTP al backend
import axios from "axios";
// Importa componentes de Google Maps para React
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
// Importa estilos específicos del componente
import "../estilos/MenuUsuario.css";

/**
 * COMPONENTE PRINCIPAL MENU USUARIO
 * @param {Object} users - Usuario autenticado actual
 * @param {Function} fetchAllData - Función para recargar datos desde el backend
 */
export default function MenuUsuario({ users, fetchAllData }) {
  // Hook de navegación para cambiar de rutas
  const navigate = useNavigate();
  
  /**
   * ESTADOS DEL COMPONENTE
   * Manejo de datos y estado de la interfaz
   */
  const [incidentes, setIncidentes] = useState([]);           // Catálogo de tipos de incidentes
  const [reportes, setReportes] = useState([]);               // Lista de reportes a mostrar
  const [filtro, setFiltro] = useState("todos");             // Filtro: "todos" o "mios"
  const [incidenteSeleccionado, setIncidenteSeleccionado] = useState(""); // Tipo seleccionado en combo
  const [modalOpen, setModalOpen] = useState(false);         // Estado del modal de crear/editar
  const [editando, setEditando] = useState(null);            // ID del reporte en edición (null = nuevo)
  // Estado para el marcador seleccionado (para mostrar en el mapa y en el tooltip)
  const [markerSeleccionado, setMarkerSeleccionado] = useState(null);
  // Estado para centrar el mapa
  const [mapCenter, setMapCenter] = useState({ lat: -0.1806532, lng: -78.4678382 }); // Quito por defecto
  const [miUbicacion, setMiUbicacion] = useState(null); // Guarda la ubicación actual del usuario
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [comboAbierto, setComboAbierto] = useState(false); // Estado para mostrar/ocultar el menú de incidentes
  const menuRef = useRef(null); // <--- Añade el ref para el menú

  // ✅ NUEVO: Estado para el modal de confirmación de eliminación
  const [modalEliminarOpen, setModalEliminarOpen] = useState(false);
  const [reporteAEliminar, setReporteAEliminar] = useState(null);

  // ✅ URL base del backend
  const baseURL = "http://localhost:8000/";

  // Para el formulario de crear/editar reporte
  const [form, setForm] = useState({
    incidentTypeId: "",
    description: "",
    location: "",
    lat: null,
    lng: null,
    time: "",
    date: "",
  });

  // Carga el script de Google Maps solo una vez
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBzw-IeZMNP2ivHd-Bmxu6b1O3I2h7V3yA", //API Key real
  });

  // Al cargar, pide la ubicación actual del usuario y centra el mapa ahí
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setMapCenter({ lat: latitude, lng: longitude });
          setMiUbicacion({ lat: latitude, lng: longitude });
        },
        () => {
          // Si el usuario no da permiso, se queda en Quito
        }
      );
    }
  }, []);

  // ✅ Cargar incidentes y reportes desde el backend
  useEffect(() => {
    // ✅ Cargar tipos de incidentes (ruta pública)
    axios.get(`${baseURL}incidents/list`)
      .then(res => setIncidentes(res.data)) // Guarda los incidentes en el estado
      .catch((err) => {
        console.error('Error al cargar incidentes:', err);
        setIncidentes([]); // Si hay error, deja el array vacío
      });

    // ✅ Cargar reportes (ruta protegida)
    axios.get(`${baseURL}reports`)
      .then(res => setReportes(res.data)) // Guarda los reportes en el estado
      .catch((err) => {
        console.error('Error al cargar reportes:', err);
        setReportes([]); // Si hay error, deja el array vacío
        // Si es error 401, limpiar sesión
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
          navigate("/loginAdmin");
        }
      });
  }, [navigate, baseURL]);

  // Filtro de reportes
  let reportesFiltrados = reportes;
  if (filtro === "mios") {
    reportesFiltrados = reportes.filter(r => String(r.userId) === String(users.id));
  } else if (filtro === "combo" && incidenteSeleccionado) {
    reportesFiltrados = reportes.filter(r => String(r.incidentTypeId) === incidenteSeleccionado);
  }

  // --- FUNCIONES DE MANIPULACIÓN DE REPORTES ---
  // Abre el modal para crear un nuevo reporte
  const abrirModalCrear = (e) => {
    // Obtener la fecha local en formato YYYY-MM-DD
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const fechaHoy = `${yyyy}-${mm}-${dd}`;

    setForm({
      incidentTypeId: "",
      description: "",
      location: "",
      lat: e ? e.latLng.lat() : null,
      lng: e ? e.latLng.lng() : null,
      time: "",
      date: fechaHoy, // <-- ahora sí es la fecha de hoy local
    });
    setEditando(null);
    setModalOpen(true);
  };

  // Abre el modal para editar un reporte existente
  const abrirModalEditar = (reporte) => {
    setForm({
      incidentTypeId: reporte.incidentTypeId,
      description: reporte.description,
      location: reporte.location,
      lat: reporte.lat,
      lng: reporte.lng,
      time: reporte.time,
      date: reporte.date,
    });
    setEditando(reporte.id);
    setModalOpen(true);
  };

  // Validación: todos los campos deben estar llenos para crear/editar
  const formCompleto = form.incidentTypeId && form.description && form.location && form.lat !== null && form.lng !== null && form.time && form.date;

  // ✅ Guarda (crea o edita) un reporte - BACKEND
  const guardarReporte = () => {
    if (!formCompleto) return;

    const reporteData = {
      ...form,
      userId: users.id,
    };

    if (editando) {
      // ✅ Actualizar reporte existente
      axios.put(`${baseURL}reports/${editando}`, reporteData)
        .then(res => {
          setReportes(prev => prev.map(r => r.id === editando ? res.data : r));
          setModalOpen(false);
          if (fetchAllData) fetchAllData(); // Actualizar datos globales
        })
        .catch((err) => {
          console.error('Error al actualizar reporte:', err);
          if (err.response && err.response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            navigate("/loginAdmin");
          }
        });
    } else {
      // ✅ Crear nuevo reporte
      axios.post(`${baseURL}reports`, {
        ...reporteData,
        status: "nuevo", // Campo adicional
      })
        .then(res => {
          setReportes(prev => [...prev, res.data]);
          setModalOpen(false);
          if (fetchAllData) fetchAllData(); // Actualizar datos globales
        })
        .catch((err) => {
          console.error('Error al crear reporte:', err);
          if (err.response && err.response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            navigate("/loginAdmin");
          }
        });
    }
  };

  // ✅ NUEVO: Abre el modal de confirmación para eliminar
  const abrirModalEliminar = (reporte) => {
    setReporteAEliminar(reporte);
    setModalEliminarOpen(true);
  };

  // ✅ NUEVO: Cancela la eliminación
  const cancelarEliminacion = () => {
    setReporteAEliminar(null);
    setModalEliminarOpen(false);
  };

  // ✅ MODIFICADO: Confirma y elimina un reporte - BACKEND
  const confirmarEliminacion = () => {
    if (!reporteAEliminar) return;

    axios.delete(`${baseURL}reports/${reporteAEliminar.id}`)
      .then(() => {
        setReportes(prev => prev.filter(r => r.id !== reporteAEliminar.id));
        setMarkerSeleccionado(null); // Cerrar InfoWindow si está abierto
        if (fetchAllData) fetchAllData(); // Actualizar datos globales
        // Cerrar modal de confirmación
        setModalEliminarOpen(false);
        setReporteAEliminar(null);
      })
      .catch((err) => {
        console.error('Error al eliminar reporte:', err);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
          navigate("/loginAdmin");
        } else if (err.response && err.response.status === 404) {
          // Reporte ya no existe, eliminarlo del estado local
          setReportes(prev => prev.filter(r => r.id !== reporteAEliminar.id));
          setMarkerSeleccionado(null);
          setModalEliminarOpen(false);
          setReporteAEliminar(null);
        }
      });
  };

  // --- FUNCIONES DE MANIPULACIÓN DEL MAPA ---
  // Cuando el usuario hace click en el mapa, abre el modal para crear un reporte en esa ubicación
  const handleMapClick = (e) => {
    abrirModalCrear(e);
  };

  // Definición de handleMarkerRightClick para evitar error de no-undef
  const handleMarkerRightClick = (reporte) => {
    if (String(reporte.userId) === String(users.id)) {
      abrirModalEditar(reporte);
    }
  };

  // Botón para centrar el mapa en la ubicación actual
  const handleTuUbicacion = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setMapCenter({ lat: latitude, lng: longitude });
          setMiUbicacion({ lat: latitude, lng: longitude });
        },
        () => {
          alert("No se pudo obtener tu ubicación actual.");
        }
      );
    } else {
      alert("La geolocalización no está soportada en este navegador.");
    }
  };

  // Efecto para cerrar el menú si se hace clic fuera de él
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

  // Función para ir a la información del usuario
  const handleMiCuenta = () => {
    setMenuAbierto(false);
    navigate("/informacion");
  };

  // ✅ Función para manejar el cierre de sesión
  const handleCerrarSesion = () => {
    // Limpiar localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    // Limpiar axios headers
    delete axios.defaults.headers.common['Authorization'];
    setMenuAbierto(false);
    navigate("/");
  };

  function getMarkerIcon(color) {
    return {
      url: `data:image/svg+xml;utf-8,<svg width="32" height="32" viewBox="0 0 32 32" fill="${encodeURIComponent(color)}" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="12" /></svg>`,
      scaledSize: {
        width: 32,
        height: 32
      }
    };
  }

  // Busca el incidente por id y toma su color
  function getColorByIncidentId(id) {
    const incidente = incidentes.find(i => String(i.id) === String(id));
    return incidente?.color || "#bdbdbd";
  }

  // ✅ Verificar autenticación
  if (!users) {
    navigate("/loginAdmin");
    return null;
  }

  // Renderizado del componente
  return (
    <div className="menu-usuario-container">
      <title>Menu Usuario</title>
      {/* Header con logo, título y menú de usuario */}
      <header className="menu-usuario-header">
        <div className="logo-titulo">
          <img src={require("../recursos/menuUser/LogoAlertaContigo.png")} alt="Logo" className="logo-alerta" />
          <span className="titulo-app">
            ¡PONTE <span className="once">ONCE!</span>
          </span>
        </div>
        <div className="usuario-info" ref={menuRef}>
          <span className="icono-campana" role="img" aria-label="campana">🔔</span>
          <span className="usuario-nombre">{users?.name}</span>
          <span className="icono-avatar" role="img" aria-label="avatar">👤</span>
          {/* Botón para desplegar el menú de usuario */}
          <button
            className="icono-desplegar-btn"
            onClick={() => setMenuAbierto((v) => !v)}
            aria-label="Abrir menú de usuario"
          >
            <span className="icono-desplegar">▼</span>
          </button>
          {/* Menú desplegable de usuario */}
          {menuAbierto && (
            <div className="menu-desplegable-usuario">
              <button className="menu-item" onClick={handleMiCuenta}>Mi cuenta</button>
              <button className="menu-item" onClick={handleCerrarSesion}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>

      {/* Cuerpo principal */}
      <main className="menu-usuario-main">
        <div className="menu-usuario-panel">
          <div className="combo-incidentes-custom" tabIndex={0} onBlur={() => setComboAbierto(false)}>
            <div className="combo-selected" onClick={() => setComboAbierto(v => !v)}>
              {incidenteSeleccionado
                ? <>
                  <span className="color-circulo" style={{ background: getColorByIncidentId(incidenteSeleccionado) }}></span>
                  {incidentes.find(i => String(i.id) === incidenteSeleccionado)?.type}
                </>
                : <span>Selecciona un tipo de reporte</span>}
              <span className="combo-arrow">▼</span>
            </div>
            {comboAbierto && (
              <ul className="combo-lista">
                {incidentes.map(inc => (
                  <li key={inc.id} onClick={() => { setIncidenteSeleccionado(String(inc.id)); setFiltro("combo"); setComboAbierto(false); }}>
                    <span className="color-circulo" style={{ background: inc.color || "#bdbdbd" }}></span>
                    {inc.type}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mu-btn-filtro">
            <button className="btn-panel" onClick={() => setFiltro("mios")}>Mis reportes</button>
            <button className="btn-panel" onClick={() => { setFiltro("todos"); setIncidenteSeleccionado(""); }}>Todos los reportes</button>
          </div>

        </div>
        <div>
          <h3 className="mu-titulo-mapa">Selecciona la ubicacion en el mapa para crear el reporte</h3>
        </div>
        <div className="menu-usuario-mapa">
          <button className="btn-tu-ubicacion" onClick={handleTuUbicacion}>
            Tu ubicación
          </button>
          {isLoaded ? (
            <GoogleMap
              mapContainerClassName="mapa-google"
              center={mapCenter}
              zoom={14}
              onClick={handleMapClick}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
            >
              {/* Punto azul: tu ubicación */}
              {miUbicacion && (
                <Marker
                  position={miUbicacion}
                  icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                    scaledSize: new window.google.maps.Size(40, 40),
                  }}
                />
              )}
              {/* Marcadores de reportes */}
              {reportesFiltrados.map(reporte => {
                const color = getColorByIncidentId(reporte.incidentTypeId);
                return (
                  <Marker
                    key={reporte.id}
                    position={{ lat: Number(reporte.lat), lng: Number(reporte.lng) }}
                    onClick={() => setMarkerSeleccionado(reporte)}
                    onRightClick={() => handleMarkerRightClick(reporte)}
                    icon={getMarkerIcon(color)}
                  />
                );
              })}
              {/* Tooltip/InfoWindow */}
              {markerSeleccionado && (
                <InfoWindow
                  position={{ lat: Number(markerSeleccionado.lat), lng: Number(markerSeleccionado.lng) }}
                  onCloseClick={() => setMarkerSeleccionado(null)}
                >
                  <div>
                    <b>{incidentes.find(i => String(i.id) === String(markerSeleccionado.incidentTypeId))?.type}</b>
                    <p>{markerSeleccionado.description}</p>
                    <small>{markerSeleccionado.location}</small>
                    <br />
                    <small>{markerSeleccionado.date} {markerSeleccionado.time}</small>
                    {String(markerSeleccionado.userId) === String(users.id) && (
                      <div style={{ marginTop: 8 }}>
                        <button className="btn-panel" onClick={() => abrirModalEditar(markerSeleccionado)}>Editar</button>
                        <button className="btn-panel btn-eliminar" onClick={() => abrirModalEliminar(markerSeleccionado)}>Eliminar</button>
                      </div>
                    )}
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          ) : (
            <div>Cargando mapa...</div>
          )}
        </div>
      </main>

      {/* Modal para crear/editar reporte */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editando ? "Editar reporte" : "Crear reporte"}</h2>
            <select
              className="input-text"
              value={form.incidentTypeId}
              onChange={e => setForm(f => ({ ...f, incidentTypeId: e.target.value }))}
            >
              <option value="">Tipo de incidente</option>
              {incidentes.map(inc => (
                <option key={inc.id} value={inc.id}>{inc.type}</option>
              ))}
            </select>
            <textarea
              className="input-text"
              placeholder="Descripción"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
            <input
              className="input-text"
              placeholder="Ubicación (opcional)"
              value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
            />
            <input
              className="input-text"
              type="time"
              value={form.time}
              onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
            />
            <input
              className="input-text"
              type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            />
            <div className="modal-botones">
              <button
                className="btn-panel btn-crear"
                onClick={guardarReporte}
                disabled={!formCompleto}
              >
                {editando ? "Actualizar" : "Crear"}
              </button>
              <button className="btn-panel btn-cancelar" onClick={() => setModalOpen(false)}>
                Cancelar
              </button>
            </div>
            {!formCompleto && (
              <div style={{ color: "red", marginTop: 8, fontSize: 14 }}>
                Todos los campos son obligatorios.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ✅ NUEVO: Modal de confirmación para eliminar reporte */}
      {modalEliminarOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirmar eliminación</h2>
            <p>Está a punto de borrar un reporte generado por usted, ¿está seguro?</p>
            <div className="modal-botones">
              <button className="btn-panel btn-eliminar" onClick={confirmarEliminacion}>
                Confirmar
              </button>
              <button className="btn-panel" onClick={cancelarEliminacion}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de reportes propios */}
      {filtro === "mios" && (
        <div className="tabla-reportes">
          <h3>Mis reportes</h3>
          <table>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Ubicación</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reportesFiltrados.map(r => (
                <tr key={r.id}>
                  <td>{incidentes.find(i => String(i.id) === String(r.incidentTypeId))?.type}</td>
                  <td>{r.description}</td>
                  <td>{r.location}</td>
                  <td>{r.date}</td>
                  <td>{r.time}</td>
                  <td>
                    <button className="btn-panel" onClick={() => abrirModalEditar(r)}>Editar</button>
                    <button className="btn-panel btn-eliminar" onClick={() => abrirModalEliminar(r)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}