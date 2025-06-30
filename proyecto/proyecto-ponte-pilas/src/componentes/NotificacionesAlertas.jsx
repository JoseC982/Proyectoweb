// Importa los hooks de React y otros módulos necesarios
import React, { useState, useRef, useEffect } from "react";
// Importa los estilos CSS específicos para este componente
import "../estilos/NotificacionesAlertas.css";
// Importa la imagen de fondo del header
import LogFondo from "../recursos/MenuAdm/LogFondo.png";
// Importa la imagen de fondo principal de la sección
import LogNotiAlerta from "../recursos/MenuAdm/LogNotiAlerta.png";
// Importa el hook para navegación entre rutas
import { useNavigate } from "react-router-dom";

// Componente funcional que recibe las notificaciones como prop
const NotificacionesAlertas = ({ users,notificaciones }) => {
  // Estado para controlar si el menú de usuario está abierto o cerrado
  const [menuAbierto, setMenuAbierto] = useState(false);
  // Estado para mostrar mensajes temporales (ej: "Sesión Cerrada")
  const [mensaje] = useState("");
  // Referencia al contenedor del menú de usuario para detectar clics fuera
  const menuRef = useRef(null);
  // Hook para navegar entre rutas
  const navigate = useNavigate();
    console.log("este es el nombre del usuario", users?.name);


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

  // Renderizado del componente
  return (
    // Contenedor principal con fondo y altura mínima
    <div className="notificaciones-alertas-fondo" style={{ position: "relative", minHeight: "100vh" }}>
      {/* Si hay mensaje, lo muestra como mensaje flotante */}
      {mensaje && (
        <div className="mensaje-sesion-cerrada">{mensaje}</div>
      )}
      {/* Imagen de fondo principal */}
      <img src={LogNotiAlerta} alt="Fondo" className="notificaciones-alertas-bg" />
      {/* Header superior con logo y menú de usuario */}
      <header className="menu-admin-header">
        <div className="menu-admin-logo">
          {/* Logo de la ciudad */}
          <img src={LogFondo} alt="Logo Quito" className="logo-quito" />
          {/* Título de la app */}
          <span className="ponte-once">
            <span className="ponte">¡PONTE</span> <span className="once">ONCE!</span>
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
      <main className="notificaciones-alertas-main">
        {/* Título de la sección */}
        <h1 className="notificaciones-alertas-titulo">Notificaciones de Alertas</h1>
        {/* Botón para regresar al menú de administración */}
        <button className="btn-regresar" onClick={() => navigate("/menu-administracion")}>REGRESAR</button>
        {/* Contenedor de la tabla de notificaciones */}
        <div className="notificaciones-alertas-tabla-container">
          {/* Contenedor de la tabla de notificaciones, permite aplicar estilos y scroll si es necesario */}
          <table className="notificaciones-alertas-tabla">
            {/* Encabezado de la tabla con los títulos de cada columna */}
            <thead>
              <tr>
                <th>Nombre de usuario</th> {/* Columna para el nombre del usuario que generó la alerta */}
                <th>Tipo de alerta</th> {/* Columna para el tipo de alerta (ej: Robo, Accidente, etc.) */}
                <th>Descripcion</th> {/* Columna para la descripción de la alerta */}
                <th>Fecha y Hora</th> {/* Columna para la fecha y hora en que se generó la alerta */}
                <th>Ubicación</th> {/* Columna para la ubicación asociada a la alerta */}
              </tr>
            </thead>
            <tbody>
              {/* Si existen notificaciones y el arreglo tiene elementos, las muestra en filas */}
              {notificaciones && notificaciones.length > 0 ? (
                // Mapea cada notificación a una fila de la tabla
                notificaciones.map((n, idx) => (
                  <tr key={idx}> {/* Cada fila tiene una clave única basada en el índice */}
                    <td>{n.nombre}</td> {/* Celda con el nombre del usuario */}
                    <td>{n.tipo}</td> {/* Celda con el tipo de alerta */}
                    <td>{n.descripcion}</td> {/* Celda con la descripción de la alerta */}
                    <td>{n.fechaHora}</td> {/* Celda con la fecha y hora de la alerta */}
                    <td>{n.ubicacion}</td> {/* Celda con la ubicación de la alerta */}
                  </tr>
                ))
              ) : (
                // Si no hay notificaciones, muestra una fila con mensaje centrado y colspan=5
                <tr><td colSpan={5} style={{textAlign:'center'}}>No hay notificaciones</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

// Exporta el componente para su uso en otras partes de la app
export default NotificacionesAlertas;
