import React, { useState } from "react";
import "../estilos/GenerarReporte.css";
import { useLocation, useNavigate } from "react-router-dom";

export default function GenerarReporte() {
  const location = useLocation();
  const navigate = useNavigate();
  const reporte = location.state?.reporte;

  const [descripcion, setDescripcion] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [hora, setHora] = useState("");
  const [mensaje, setMensaje] = useState("");

  if (!reporte) {
    // Si no hay reporte seleccionado, regresa al menú
    navigate("/");
    return null;
  }

  const handleGenerar = () => {
    setMensaje("Reporte Generado");
    setTimeout(() => {
      setMensaje("");
      navigate("/");
    }, 1500);
  };

  const handleCancelar = () => {
    navigate("/");
  };

  return (
    <div className="generar-reporte-container">
      <header className="menu-usuario-header">
        <div className="logo-titulo">
          <img src={require("../recursos/menuUser/LogoAlertaContigo.png")} alt="Logo" className="logo-alerta" />
          <span className="titulo-app">
            ¡PONTE <span className="once">ONCE!</span>
          </span>
        </div>
        <div className="usuario-info">
          <span className="icono-campana" role="img" aria-label="campana">🔔</span>
          <span className="usuario-nombre">César M</span>
          <span className="icono-avatar" role="img" aria-label="avatar">👤</span>
        </div>
      </header>
      <main className="generar-reporte-main">
        <section className="mapa-section">
          <div className="mapa-placeholder">
            Aquí va la API de google maps
          </div>
        </section>
        <section className="form-section">
          <div className="reporte-info">
            <div className="reporte-tipo">
              <img src={reporte.icon} alt={reporte.texto} className="icono-reporte" />
              <span className="texto-reporte">{reporte.texto}</span>
            </div>
          </div>
          <form className="formulario-reporte" onSubmit={e => { e.preventDefault(); handleGenerar(); }}>
            <label>Descripción del incidente</label>
            <textarea
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              required
              className="input-descripcion"
              placeholder="Describe el incidente..."
            />
            <label>Ubicación Registrada</label>
            <input
              type="text"
              value={ubicacion}
              onChange={e => setUbicacion(e.target.value)}
              required
              className="input-ubicacion"
              placeholder="Ej: Avenida 12 de octubre y Ejido"
            />
            <label>Hora del incidente</label>
            <input
              type="time"
              value={hora}
              onChange={e => setHora(e.target.value)}
              required
              className="input-hora"
            />
            <div className="botones-reporte">
              <button type="submit" className="btn-generar">GENERAR</button>
              <button type="button" className="btn-cancelar" onClick={handleCancelar}>CANCELAR</button>
            </div>
          </form>
        </section>
      </main>
      {mensaje && <div className="mensaje-generado">{mensaje}</div>}
    </div>
  );
}