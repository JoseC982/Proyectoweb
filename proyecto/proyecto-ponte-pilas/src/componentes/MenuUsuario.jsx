// Importa los hooks de React y utilidades de React Router
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Para hacer peticiones HTTP
import "../estilos/MenuUsuario.css"; // Importa los estilos

// Componente principal
export default function MenuUsuario({ usuarioActual, logout }) {
  const navigate = useNavigate(); // Hook para navegar entre rutas

  // Estado para la lista de incidentes (se carga desde la API/db.json)
  const [incidentes, setIncidentes] = useState([]);
  // Estado para el incidente seleccionado en el combo
  const [incidenteSeleccionado, setIncidenteSeleccionado] = useState("");
  // Estado para la ubicación seleccionada en el mapa
  const [ubicacion, setUbicacion] = useState("");
  // Estado para la hora del incidente
  const [hora, setHora] = useState("");
  // Estado para el nombre de quien reporta (por defecto el usuario logueado)
  const [quienReporta, setQuienReporta] = useState(usuarioActual ? usuarioActual.name : "");
  // Estado para saber si se está registrando un nuevo incidente
  const [registrando, setRegistrando] = useState(false);
  // Estado para mostrar/ocultar el menú desplegable del usuario
  const [open, setOpen] = useState(false);
  // Referencia al menú para detectar clics fuera de él
  const menuRef = useRef();

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

  // Función para limpiar todos los campos del formulario
  const limpiarCampos = () => {
    setIncidenteSeleccionado("");
    setUbicacion("");
    setHora("");
    setQuienReporta(usuarioActual ? usuarioActual.name : "");
  };

  // Función para guardar el reporte (aquí solo limpia y muestra alerta, deberías conectar con tu backend)
  const handleGuardarReporte = () => {
    limpiarCampos();
    setRegistrando(false);
    alert("Incidente registrado correctamente");
  };

  // Función para simular la selección de una ubicación en el mapa
  const handleSeleccionarUbicacion = () => {
    setUbicacion("Ubicación seleccionada en el mapa");
  };

  // Función para ir a la información del usuario
  const handleMiCuenta = () => {
    setOpen(false);
    navigate("/informacion");
  };

  // Función para cerrar sesión y volver al Home
  const handleCerrarSesion = () => {
    setOpen(false);
    logout();
    navigate("/");
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
          <span className="usuario-nombre">{usuarioActual ? usuarioActual.name : "Invitado"}</span>
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
        {/* Sección izquierda: incidentes */}
        <section className="incidentes-section">
          {/* Si NO se está registrando, muestra el listado y detalles */}
          {!registrando ? (
            <>
              <h2 className="incidentes-titulo">Considera los siguientes incidentes ocurridos en la zona</h2>
              <div className="combo-incidentes">
                <label>Tipo de incidente:</label>
                <select
                  value={incidenteSeleccionado}
                  onChange={e => setIncidenteSeleccionado(e.target.value)}
                  className="input-text"
                >
                  <option value="">Seleccione un incidente</option>
                  {incidentes.map(inc => (
                    <option key={inc.id} value={inc.id}>{inc.type}</option>
                  ))}
                </select>
              </div>
              {/* Si hay un incidente seleccionado, muestra sus detalles */}
              {incidenteSeleccionado && incidenteObj && (
                <div className="detalle-incidente">
                  <h3>{incidenteObj.type}</h3>
                  <p><b>Descripción:</b> {incidenteObj.descripcion || "Sin descripción"}</p>
                  <p><b>Ubicación registrada:</b> {ubicacion || "No seleccionada"}</p>
                  <p><b>Hora del incidente:</b> {hora || "No registrada"}</p>
                  <p><b>Quien reporta:</b> {quienReporta}</p>
                  <button
                    className="btn-generar-reporte"
                    disabled={!incidenteSeleccionado}
                    onClick={() => {
                      limpiarCampos();
                      setRegistrando(true);
                    }}
                  >
                    Crear reporte
                  </button>
                </div>
              )}
            </>
          ) : (
            // Si se está registrando, muestra el formulario de registro
            <>
              <h2 className="incidentes-titulo">Registra el Incidente</h2>
              <div className="combo-incidentes">
                <label>Tipo de incidente:</label>
                <select
                  value={incidenteSeleccionado}
                  onChange={e => setIncidenteSeleccionado(e.target.value)}
                  className="input-text"
                >
                  <option value="">Seleccione un incidente</option>
                  {incidentes.map(inc => (
                    <option key={inc.id} value={inc.id}>{inc.type}</option>
                  ))}
                </select>
              </div>
              <div className="detalle-incidente">
                <label>Descripción:</label>
                <textarea
                  value={incidenteObj ? (incidenteObj.descripcion || "Sin descripción") : ""}
                  disabled
                  className="input-text"
                />
              </div>
              <div className="detalle-incidente">
                <label>Ubicación registrada:</label>
                <input
                  type="text"
                  value={ubicacion}
                  className="input-text"
                  placeholder="Selecciona en el mapa"
                  readOnly
                />
              </div>
              <div className="detalle-incidente">
                <label>Hora del incidente:</label>
                <input
                  type="time"
                  value={hora}
                  onChange={e => setHora(e.target.value)}
                  className="input-text"
                />
              </div>
              <div className="detalle-incidente">
                <label>Quien reporta:</label>
                <input
                  type="text"
                  value={quienReporta}
                  disabled
                  className="input-text"
                />
              </div>
              {/* Botones para guardar o cancelar el registro */}
              <div className="botones-registro">
                <button
                  className="btn-generar-reporte"
                  disabled={
                    !incidenteSeleccionado ||
                    !ubicacion ||
                    !hora ||
                    !quienReporta
                  }
                  onClick={handleGuardarReporte}
                >
                  Guardar reporte
                </button>
                <button
                  className="btn-cancelar-reporte"
                  onClick={() => {
                    limpiarCampos();
                    setRegistrando(false);
                  }}
                >
                  Cancelar
                </button>
              </div>
            </>
          )}
        </section>

        {/* Sección derecha: mapa */}
        <section className="mapa-section">
          <h2>Mapa del incidente</h2>
          <div
            className="mapa-placeholder"
            onClick={registrando ? handleSeleccionarUbicacion : undefined}
          >
            <span>
              {ubicacion
                ? "Ubicación seleccionada"
                : "Haz clic para seleccionar ubicación"}
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}