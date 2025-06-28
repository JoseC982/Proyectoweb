// Importa los hooks de React y utilidades de React Router
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Para hacer peticiones HTTP
import "../estilos/MenuUsuario.css"; // Importa los estilos

// Componente principal
export default function MenuUsuario({ users }) {
  const navigate = useNavigate(); // Hook para navegar entre rutas
  // Estado para la lista de incidentes (se carga desde la API/db.json)
  const [incidentes, setIncidentes] = useState([]);

  // Estado para el incidente seleccionado en el combo
  const [incidenteSeleccionado, setIncidenteSeleccionado] = useState("");
  // Estado para el nombre de quien reporta (por defecto el usuario logueado)
  const [quienReporta, setQuienReporta] = useState(users ? users.name : "");
  // Estado para saber si se está registrando un nuevo incidente
  const [registrando, setRegistrando] = useState(false);
  // Estado para mostrar/ocultar el menú desplegable del usuario
  const [open, setOpen] = useState(false);
  // Referencia al menú para detectar clics fuera de él
  const menuRef = useRef();
  const [modalAbierto, setModalAbierto] = useState(false);

  const [modalCrearReporte, setModalCrearReporte] = useState(false);


  // useEffect para cargar los incidentes desde la API/db.json al montar el componente
  useEffect(() => {
    axios.get("http://localhost:3000/incidents")
      .then(res => setIncidentes(res.data)) // Guarda los incidentes en el estado
      .catch(err => setIncidentes([])); // Si hay error, deja el array vacío
  }, []);

  // useEffect para cerrar el menú desplegable si se hace clic fuera de él
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false); // Cierra el menú
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Estados para el formulario de reporte
  const [descripcion, setDescripcion] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  // ...otros estados y lógica...

  // Función para abrir el modal de crear reporte
  const handleAbrirModalCrearReporte = () => {
    if (!incidenteSeleccionado) {
      alert("Primero selecciona el tipo de reporte");
      return;
    }
    setModalCrearReporte(true);
  };

  // Función para guardar el reporte (puedes adaptarla a tu lógica)
  const handleGuardarReporte = () => {
    // Construir el objeto reporte
    const nuevoReporte = {
      // id se genera automáticamente por el backend/db
      userId: users.id,
      incidentTypeId: incidenteSeleccionado,
      description: descripcion,
      location: ubicacion,
      date: fecha,
      time: hora,
      status: "nuevo"
    };
    // Aquí puedes hacer la petición POST a tu backend/db.json
    axios.post("http://localhost:3000/reports", nuevoReporte)
      .then(() => {
        alert("Reporte creado exitosamente");
        setModalCrearReporte(false);
        // Limpia los campos del formulario
        setDescripcion("");
        setUbicacion("");
        setFecha("");
        setHora("");
      })
      .catch(() => {
        alert("Error al crear el reporte");
      });
  };
 

  // Función para ir a la información del usuario
  const handleMiCuenta = () => {
    setOpen(false);
    navigate("/informacion");
  };

  // Función para cerrar sesión y volver al Home
  const handleCerrarSesion = () => {
    setOpen(false);
    navigate("/");
    localStorage.removeItem("usuario");
  };

  // Busca el objeto del incidente seleccionado para mostrar sus datos
  const incidenteObj = incidentes.find(i => String(i.id) === String(incidenteSeleccionado));

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
          <button
            className="btn-menu-desplegable"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            ☰
          </button>
          {open && (
            <div className="menu-desplegable">
              <button className="menu-opcion" onClick={handleMiCuenta}>Mi cuenta</button>
              <button className="menu-opcion" onClick={handleCerrarSesion}>Cerrar sesión</button>
            </div>
          )}
        </div>
      </header>

      {/* Cuerpo principal */}
      <main className="menu-usuario-main">
        <h2 className="incidentes-titulo">Considera los siguientes incidentes ocurridos en la zona</h2>

        {/* Sección izquierda: incidentes */}
        <section className="incidentes-section">
          <div className="combo-incidentes">
            <select
              value={incidenteSeleccionado}
              onChange={e => setIncidenteSeleccionado(e.target.value)}
              className="input-text"
            >
              <option value="">Seleccione un tipo incidente</option>
              {incidentes.map(inc => (
                <option key={inc.id} value={inc.id}>{inc.type}</option>
              ))}
            </select>
          </div>
          {/* Botón para abrir el modal con la información del incidente */}
          {incidenteSeleccionado && incidenteObj && (
            <button
              className="btn-generar-reporte"
              style={{ marginTop: "1rem" }}
              onClick={() => setModalAbierto(true)}
            >
              Ver información del incidente
            </button>
          )}
          {/* Contenedor derecho: botones adicionales */}
          <div className="botones-adicionales">
            <button className="btn-generar-reporte" onClick={() => alert("Botón 1")}>Ver todos los reportes</button>
            <button className="btn-generar-reporte" onClick={handleAbrirModalCrearReporte}>Crear Reporte</button>
            <button className="btn-generar-reporte" onClick={() => alert("Botón 3")}>Mis reportes</button>
          </div>
        </section>

        {/* Modal para mostrar la información del incidente */}
        {modalAbierto && incidenteObj && (
          <div className="modal-overlay" style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
          }}>
            <div className="modal-content" style={{
              background: "#fff", padding: "2rem", borderRadius: "10px", minWidth: "320px", maxWidth: "90vw", boxShadow: "0 2px 16px rgba(0,0,0,0.2)"
            }}>
              <h3>{incidenteObj.type}</h3>
              <p><b>Descripción:</b> {incidenteObj.descripcion || "Sin descripción"}</p>
              <p><b>Ubicación registrada:</b> {ubicacion || "No seleccionada"}</p>
              <p><b>Hora del incidente:</b> {hora || "No registrada"}</p>
              <p><b>Quien reporta:</b> {quienReporta}</p>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem" }}>
                <button className="btn-generar-reporte" onClick={() => setModalAbierto(false)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Modal para crear un reporte */}
        {modalCrearReporte && (
          <div className="modal-overlay" style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
          }}>
            <div className="modal-content" style={{
              background: "#fff", padding: "2rem", borderRadius: "10px", minWidth: "320px", maxWidth: "90vw", boxShadow: "0 2px 16px rgba(0,0,0,0.2)"
            }}>
              <h2>Crear Reporte</h2>
              <form onSubmit={e => { e.preventDefault(); handleGuardarReporte(); }}>
                {/* Tipo de incidente (no editable, solo muestra el seleccionado) */}
                <div>
                  <label>Tipo de incidente:</label>
                  <input
                    type="text"
                    value={incidentes.find(inc => inc.id == incidenteSeleccionado)?.type || ""}
                    disabled
                    className="input-text"
                  />
                </div>
                {/* Descripción */}
                <div>
                  <label>Descripción:</label>
                  <textarea
                    value={descripcion}
                    onChange={e => setDescripcion(e.target.value)}
                    className="input-text"
                    required
                  />
                </div>
                {/* Ubicación */}
                <div>
                  <label>Ubicación:</label>
                  <input
                    type="text"
                    value={ubicacion}
                    onChange={e => setUbicacion(e.target.value)}
                    className="input-text"
                    required
                  />
                </div>
                {/* Fecha */}
                <div>
                  <label>Fecha:</label>
                  <input
                    type="date"
                    value={fecha}
                    onChange={e => setFecha(e.target.value)}
                    className="input-text"
                    required
                  />
                </div>
                {/* Hora */}
                <div>
                  <label>Hora:</label>
                  <input
                    type="time"
                    value={hora}
                    onChange={e => setHora(e.target.value)}
                    className="input-text"
                    required
                  />
                </div>
                {/* Estado (no editable, siempre "nuevo") */}
                <div>
                  <label>Estado:</label>
                  <input
                    type="text"
                    value="nuevo"
                    disabled
                    className="input-text"
                  />
                </div>
                {/* Botones */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1.5rem" }}>
                  <button type="button" className="btn-generar-reporte" onClick={() => setModalCrearReporte(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-generar-reporte">
                    Guardar Reporte
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Sección derecha: mapa */}
        <section className="mapa-section">
          <h2>Mapa del incidente</h2>
          <div >
            
          </div>
        </section>
      </main>
    </div>
  );
}