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

const NotificacionesAlertas = ({ users, notificaciones }) => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mensaje] = useState("");
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Estados para los filtros
  const [columnaFiltro, setColumnaFiltro] = useState("");
  const [valorFiltro, setValorFiltro] = useState("");

  // Modal de edición
  const [modalEditar, setModalEditar] = useState(false);
  const [reporteEditar, setReporteEditar] = useState(null);
  const [nuevoTipo, setNuevoTipo] = useState("");

  // Incidentes (tipos de alerta) para el combobox de edición
  const [incidents, setIncidents] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3000/incidents")
      .then(res => setIncidents(res.data))
      .catch(() => setIncidents([]));
  }, []);

  // Opciones únicas para el segundo combobox
  const opcionesFiltro = columnaFiltro
    ? [...new Set(notificaciones.map(n => n[columnaFiltro]).filter(Boolean))]
    : [];

  // Filtrado de notificaciones
  const notificacionesFiltradas =
    columnaFiltro && valorFiltro
      ? notificaciones.filter(n => n[columnaFiltro] === valorFiltro)
      : notificaciones;

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

  // Maneja la apertura del modal de edición
  const handleEditarReporte = (notificacion, idx) => {
    setReporteEditar({ ...notificacion, idx });
    setNuevoTipo(""); // Limpiar selección
    setModalEditar(true);
  };

  // Guarda el cambio de tipo de alerta
  const guardarNuevoTipo = async () => {
    if (!nuevoTipo || !reporteEditar) return;
    // Busca el id del incidente seleccionado
    const incidente = incidents.find(i => i.type === nuevoTipo);
    if (!incidente) return;
    // Busca el reporte original por los datos de la notificación
    // (puedes necesitar el id real del reporte, aquí se asume que tienes acceso a él)
    // Si tu notificaciones tienen el id del reporte, úsalo directamente:
    // Ejemplo: notificaciones[idx].id
    // Aquí se asume que tienes acceso al id real del reporte:
    const reportesRes = await axios.get("http://localhost:3000/reports");
    const reporteOriginal = reportesRes.data.find(r =>
      r.description === reporteEditar.descripcion &&
      r.location === reporteEditar.ubicacion &&
      (r.date + ' ' + r.time) === reporteEditar.fechaHora
    );
    if (!reporteOriginal) return;
    // Actualiza el tipo de incidente
    await axios.patch(`http://localhost:3000/reports/${reporteOriginal.id}`, {
      incidentTypeId: incidente.id
    });
    setModalEditar(false);
    window.location.reload(); // O puedes llamar a fetchAllData si lo tienes disponible por props
  };

  return (
    <div className="notificaciones-alertas-fondo" style={{ position: "relative", minHeight: "100vh" }}>
      {mensaje && <div className="mensaje-sesion-cerrada">{mensaje}</div>}
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
          <span className="nombre-usuario">{users?.name}</span>
          <button
            className="icono-desplegar-btn"
            onClick={() => setMenuAbierto((v) => !v)}
            aria-label="Abrir menú de usuario"
          >
            <span className="icono-desplegar">▼</span>
          </button>
          {menuAbierto && (
            <div className="menu-desplegable-usuario">
              <button className="menu-item" onClick={() => { setMenuAbierto(false); navigate('/informacion-usuarioAdm'); }}>Mi cuenta</button>
              <button className="menu-item" onClick={() => { localStorage.removeItem("usuario"); navigate("/") }}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>
      <main className="notificaciones-alertas-main">
        <h1 className="notificaciones-alertas-titulo">Notificaciones de Alertas</h1>
        {/* Primer ComboBox */}
        <div style={{ margin: "1rem 0" }}>
          <select
            className="combo-filtro-notificaciones"
            value={columnaFiltro}
            onChange={e => setColumnaFiltro(e.target.value)}
          >
            <option value="">Filtrar por...</option>
            {encabezados.map(e => (
              <option key={e.value} value={e.value}>{e.label}</option>
            ))}
          </select>
        </div>
        {/* Segundo ComboBox, solo si hay columna seleccionada */}
        {columnaFiltro && (
          <div style={{ margin: "1rem 0" }}>
            <select
              className="combo-filtro-notificaciones"
              value={valorFiltro}
              onChange={e => setValorFiltro(e.target.value)}
            >
              <option value="">Selecciona un valor...</option>
              {opcionesFiltro.map((op, idx) => (
                <option key={idx} value={op}>{op}</option>
              ))}
            </select>
          </div>
        )}
        <button className="btn-regresar" onClick={() => navigate("/menu-administracion")}>REGRESAR</button>
        <div className="notificaciones-alertas-tabla-container">
          <table className="notificaciones-alertas-tabla">
            <thead>
              <tr>
                <th>Nombre de usuario</th>
                <th>Tipo de alerta</th>
                <th>Descripcion</th>
                <th>Fecha y Hora</th>
                <th>Ubicación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {notificacionesFiltradas && notificacionesFiltradas.length > 0 ? (
                notificacionesFiltradas.map((n, idx) => (
                  <tr key={idx}>
                    <td>{n.nombre}</td>
                    <td>{n.tipo}</td>
                    <td>{n.descripcion}</td>
                    <td>{n.fechaHora}</td>
                    <td>{n.ubicacion}</td>
                    <td>
                      <button
                        className="btn-editar-reporte"
                        onClick={() => handleEditarReporte(n, idx)}
                      >
                        Editar reporte
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} style={{ textAlign: 'center' }}>No hay notificaciones</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Modal para editar el tipo de alerta */}
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