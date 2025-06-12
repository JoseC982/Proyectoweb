import React, { useState, useRef, useEffect } from "react";
import "../estilos/NotificacionesAlertas.css";
import LogFondo from "../recursos/MenuAdm/LogFondo.png";
import LogNotiAlerta from "../recursos/MenuAdm/LogNotiAlerta.png";
import { useNavigate } from "react-router-dom";

const notificacionesIniciales = [
  { nombre: "Daniel", tipo: "Persona sospechosa", descripcion: ".....", fecha: "25/4/2025 10:00AM", ubicacion: "...." },
  { nombre: "Cesar", tipo: "Robo", descripcion: ".....", fecha: "30/4/2025 11:00PM", ubicacion: "...." },
  { nombre: "Jose", tipo: "Eventos de transito", descripcion: ".....", fecha: "17/4/2025 05:AM", ubicacion: "...." },
];

const NotificacionesAlertas = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const menuRef = useRef(null);
  const navigate = useNavigate();

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

  const handleCerrarSesion = () => {
    setMenuAbierto(false);
    setMensaje("Sesión Cerrada");
    setTimeout(() => setMensaje(""), 2000);
  };

  return (
    <div className="notificaciones-alertas-fondo" style={{ position: "relative", minHeight: "100vh" }}>
      {mensaje && (
        <div className="mensaje-sesion-cerrada">{mensaje}</div>
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
          <span className="nombre-usuario">César M</span>
          <button
            className="icono-desplegar-btn"
            onClick={() => setMenuAbierto((v) => !v)}
            aria-label="Abrir menú de usuario"
          >
            <span className="icono-desplegar">▼</span>
          </button>
          {menuAbierto && (
            <div className="menu-desplegable-usuario">
              <button className="menu-item" onClick={() => setMenuAbierto(false)}>Mi cuenta</button>
              <button className="menu-item" onClick={handleCerrarSesion}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>
      <main className="notificaciones-alertas-main">
        <h1 className="notificaciones-alertas-titulo">Notificaciones de Alertas</h1>
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
              </tr>
            </thead>
            <tbody>
              {notificacionesIniciales.map((n, idx) => (
                <tr key={idx}>
                  <td>{n.nombre}</td>
                  <td>{n.tipo}</td>
                  <td>{n.descripcion}</td>
                  <td>{n.fecha}</td>
                  <td>{n.ubicacion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default NotificacionesAlertas;
