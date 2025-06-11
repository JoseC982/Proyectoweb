import React from "react";
import "../estilos/VisualizarReportes.css";
import { useLocation, useNavigate } from "react-router-dom";
import LogoAlertaContigo from "../recursos/menuUser/LogoAlertaContigo.png";

export default function VisualizarReportes() {
  const location = useLocation();
  const navigate = useNavigate();
  const reporte = location.state?.reporte;

  // Simulación de datos de reporte registrado
  const datosReporte = {
    descripcion: "Se produjo un accidente de tránsito entre 2 vehículos y hay un tráfico horrible.",
    ubicacion: "Avenida 12 de octubre y Ejido",
    hora: "09:00",
    usuario: "cesmorO2"
  };

  if (!reporte) {
    navigate("/");
    return null;
  }

  return (
    <div className="visualizar-reportes-container">
      <header className="menu-usuario-header">
        <div className="logo-titulo">
          <img src={LogoAlertaContigo} alt="Logo" className="logo-alerta" />
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
      <main className="visualizar-reportes-main">
        <section className="mapa-section">
          <div className="mapa-placeholder">
            Aquí va la API de google maps
          </div>
        </section>
        <section className="info-section">
          <div className="info-cuadro">
            <div className="info-titulo">
              Considera los siguientes incidentes ocurridos en la zona
            </div>
            <div className="reporte-info">
              <div className="reporte-tipo">
                <img src={reporte.icon} alt={reporte.texto} className="icono-reporte" />
                <span className="texto-reporte">{reporte.texto}</span>
              </div>
              <div className="info-item">
                <label>Descripción del incidente</label>
                <div className="info-dato">{datosReporte.descripcion}</div>
              </div>
              <div className="info-item">
                <label>Ubicación registrada</label>
                <div className="info-dato">{datosReporte.ubicacion}</div>
              </div>
              <div className="info-item">
                <label>Hora del incidente</label>
                <div className="info-dato">{datosReporte.hora}</div>
              </div>
              <div className="info-item">
                <label>Reportado por</label>
                <div className="info-dato">{datosReporte.usuario}</div>
              </div>
            </div>
            <div className="botones-reportes">
              <button className="btn-regresar" onClick={() => navigate("/")}>REGRESAR</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}