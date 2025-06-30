import React, { useState, useRef, useEffect } from "react";
import "../estilos/ValidarAlertas.css";
import LogFondo from "../recursos/MenuAdm/LogFondo.png";
import LogValidarAlerta from "../recursos/MenuAdm/LogValidarAlerta.png";
import LogMegafono from "../recursos/MenuAdm/LogMegafono.png";
import { useNavigate } from "react-router-dom";

// Componente funcional que recibe los reportes, usuarios, incidentes y la función para borrar reportes como props
const ValidarAlertas = ({ reports, usersList, users, incidents, borrarReporte }) => {
  // Estado para controlar si el menú de usuario está abierto o cerrado
  const [menuAbierto, setMenuAbierto] = useState(false);
  // Estado para mostrar mensajes temporales (ej: "Alerta Rechazada")
  const [mensaje, setMensaje] = useState("");
  // Estado para saber qué reporte se está mostrando actualmente
  const [index, setIndex] = useState(0);
  // Referencia al contenedor del menú de usuario para detectar clics fuera
  const menuRef = useRef(null);
  // Hook para navegar entre rutas
  const navigate = useNavigate();
  console.log("este es el nombre del usuario", users?.name);

  // Obtiene el reporte actual a mostrar según el índice
  const reporteActual = reports && reports.length > 0 ? reports[index] : null;
  // Variables para guardar el usuario y el incidente del reporte actual
  let usuario = null,
    incidente = null;
  // Si hay un reporte actual, busca el usuario y el incidente correspondientes
  if (reporteActual) {
    usuario = usersList.find((u) => String(u.id) === String(reporteActual.userId));
    incidente = incidents.find(
      (i) => String(i.id) === String(reporteActual.incidentTypeId)
    );
  }

  // Efecto para cerrar el menú si se hace clic fuera de él
  useEffect(() => {
    // Función que detecta clics fuera del menú
    function handleClickOutside(event) {
      // Si el menú está abierto y el clic no fue dentro del menú, lo cierra
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAbierto(false);
      }
    }
    // Agrega el event listener al montar el componente
    document.addEventListener("mousedown", handleClickOutside);
    // Limpia el event listener al desmontar el componente
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Función para ir al siguiente reporte
  const handleNext = () => {
    if (reports.length === 0) return; // Si no hay reportes, no hace nada
    setIndex((prev) => (prev + 1 < reports.length ? prev + 1 : prev)); // Avanza al siguiente si existe
  };
  // Función para ir al reporte anterior
  const handlePrev = () => {
    if (reports.length === 0) return; // Si no hay reportes, no hace nada
    setIndex((prev) => (prev - 1 >= 0 ? prev - 1 : prev)); // Retrocede si no está en el primero
  };

  // Función para rechazar (eliminar) el reporte actual
  const handleRechazar = async () => {
    if (!reporteActual) return; // Si no hay reporte, no hace nada
    await borrarReporte(reporteActual.id); // Llama a la función para borrar el reporte
    setMensaje("Alerta Rechazada"); // Muestra mensaje temporal
    setTimeout(() => setMensaje(""), 2000); // Oculta mensaje después de 2 segundos
    // Si era el último reporte y no es el primero, retrocede el índice
    if (index === reports.length - 1 && index > 0) {
      setIndex(index - 1);
    }
  };

  // Renderizado del componente
  return (
    // Contenedor principal con fondo y altura mínima
    <div
      className="validar-alertas-fondo"
      style={{ position: "relative", minHeight: "100vh" }}
    >
      {/* Imagen de fondo principal */}
      <img
        src={LogValidarAlerta}
        alt="Fondo"
        className="validar-alertas-bg"
      />
      {/* Si hay mensaje, lo muestra como mensaje flotante */}
      {mensaje && <div className="mensaje-validar-alerta">{mensaje}</div>}
      {/* Header superior con logo y menú de usuario */}
      <header className="menu-admin-header">
        <div className="menu-admin-logo">
          {/* Logo de la ciudad */}
          <img src={LogFondo} alt="Logo Quito" className="logo-quito" />
          {/* Título de la app */}
          <span className="ponte-once">
            <span className="ponte">¡PONTE</span>{" "}
            <span className="once">ONCE!</span>
          </span>
        </div>
        {/* Menú de usuario con nombre y opciones */}
        <div className="menu-admin-user" ref={menuRef}>
          <span className="icono-engranaje">⚙️</span>
          <span className="nombre-usuario">{users?.name}</span>
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
              <button className="menu-item" onClick={() => { setMenuAbierto(false); navigate('/informacion-usuarioAdm'); }}>Mi cuenta</button>
              <button className="menu-item" onClick={() => {localStorage.removeItem("usuario"); navigate("/")}}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>
      {/* Cuerpo principal de la sección */}
      <main className="validar-alertas-main">
        {/* Contenedor del título y el megáfono */}
        <div className="validar-alertas-titulo-container">
          {/* Imagen de megáfono decorativa para la sección */}
          <img
            src={LogMegafono}
            alt="Megáfono"
            className="validar-alertas-megafono"
          />
          {/* Título principal de la sección */}
          <h1 className="validar-alertas-titulo">Validación de alertas</h1>
        </div>
        {/* Si existe un reporte actual, muestra la tarjeta con la información */}
        {reporteActual ? (
          <div className="validar-alertas-card">
            {/* Botón para ir al reporte anterior, deshabilitado si es el primero */}
            <button
              className="validar-alertas-arrow left"
              onClick={handlePrev} // Llama a la función para retroceder
              disabled={index === 0} // Deshabilita si está en el primer reporte
            >
              &#9664; {/* Flecha izquierda (carácter unicode) */}
            </button>
            {/* Contenedor de la información del reporte actual */}
            <div className="validar-alertas-info">
              {/* Muestra el nombre del usuario asociado al reporte, o 'Desconocido' si no se encuentra */}
              <div>
                <b>Nombre de usuario:</b> {usuario ? usuario.name : "Desconocido"}
              </div>
              {/* Muestra el tipo de alerta, o 'Otro' si no se encuentra el incidente */}
              <div>
                <b>Tipo de alerta:</b> {incidente ? incidente.type : "Otro"}
              </div>
              {/* Muestra la fecha y hora del reporte */}
              <div>
                <b>Fecha y hora:</b> {reporteActual.date + " " + reporteActual.time}
              </div>
              {/* Muestra la descripción del reporte */}
              <div>
                <b>Descripción:</b> {reporteActual.description}
              </div>
              {/* Muestra la ubicación del reporte */}
              <div>
                <b>Ubicación:</b> {reporteActual.location}
              </div>
            </div>
            {/* Botón para ir al siguiente reporte, deshabilitado si es el último */}
            <button
              className="validar-alertas-arrow right"
              onClick={handleNext} // Llama a la función para avanzar
              disabled={index === reports.length - 1} // Deshabilita si está en el último reporte
            >
              &#9654; {/* Flecha derecha (carácter unicode) */}
            </button>
          </div>
        ) : (
          // Si no hay reportes, muestra un mensaje centrado
          <div
            className="validar-alertas-card"
            style={{ textAlign: "center", width: "100%" }}
          >
            No hay alertas para validar
          </div>
        )}
        {/* Botones de acción debajo de la tarjeta */}
        <div className="validar-alertas-botones">
          {/* Botón para rechazar (eliminar) el reporte actual, deshabilitado si no hay reporte */}
          <button
            className="btn-rechazar"
            onClick={handleRechazar} // Llama a la función para rechazar
            disabled={!reporteActual} // Deshabilita si no hay reporte actual
          >
            Rechazar <span className="icon-cross">❌</span>
          </button>
        </div>
        {/* Botón para regresar al menú de administración */}
        <button
          className="btn-regresar"
          onClick={() => navigate("/menu-administracion")}
        >
          REGRESAR
        </button>
      </main>
    </div>
  );
};

// Exporta el componente para su uso en otras partes de la app
export default ValidarAlertas;
