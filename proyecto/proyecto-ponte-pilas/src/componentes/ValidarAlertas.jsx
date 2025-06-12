import React, { useState, useRef, useEffect } from "react";
import "../estilos/ValidarAlertas.css";
import LogFondo from "../recursos/MenuAdm/LogFondo.png";
import LogValidarAlerta from "../recursos/MenuAdm/LogValidarAlerta.png";
import LogMegafono from "../recursos/MenuAdm/LogMegafono.png";
import { useNavigate } from "react-router-dom";

const alerta = {
  usuario: "Daniel N",
  tipo: "Persona sospechosa",
  fecha: "01/05/2025 13:00 PM",
  descripcion: ".............................................",
  ubicacion: "Avenida 12 de octubre y Ejido"
};

const ValidarAlertas = () => {
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

  const handleAceptar = () => {
    setMensaje("Alerta Valida");
    setTimeout(() => setMensaje(""), 2000);
  };

  const handleRechazar = () => {
    setMensaje("Alerta Rechazada");
    setTimeout(() => setMensaje(""), 2000);
  };

  return (
    <div className="validar-alertas-fondo" style={{ position: "relative", minHeight: "100vh" }}>
      <img src={LogValidarAlerta} alt="Fondo" className="validar-alertas-bg" />
      {mensaje && <div className="mensaje-validar-alerta">{mensaje}</div>}
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
      <main className="validar-alertas-main">
        <div className="validar-alertas-titulo-container">
          <img src={LogMegafono} alt="Megáfono" className="validar-alertas-megafono" />
          <h1 className="validar-alertas-titulo">Validación de alertas</h1>
        </div>
        <div className="validar-alertas-card">
          <button className="validar-alertas-arrow left">&#9664;</button>
          <div className="validar-alertas-info">
            <div><b>Nombre de usuario:</b> {alerta.usuario}</div>
            <div><b>Tipo de alerta:</b> {alerta.tipo}</div>
            <div><b>Fecha y hora:</b> {alerta.fecha}</div>
            <div><b>Descripción:</b> {alerta.descripcion}</div>
            <div><b>Ubicación:</b> {alerta.ubicacion}</div>
          </div>
          <button className="validar-alertas-arrow right">&#9654;</button>
        </div>
        <div className="validar-alertas-botones">
          <button className="btn-aceptar" onClick={handleAceptar}>Aceptar <span className="icon-check">✔️</span></button>
          <button className="btn-rechazar" onClick={handleRechazar}>Rechazar <span className="icon-cross">❌</span></button>
        </div>
        <button className="btn-regresar" onClick={() => navigate("/menu-administracion")}>REGRESAR</button>
      </main>
    </div>
  );
};

export default ValidarAlertas;
