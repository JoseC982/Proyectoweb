/**
 * COMPONENTE DE VISUALIZACIÓN DETALLADA DE REPORTES
 * 
 * Este componente muestra los detalles completos de un reporte específico seleccionado
 * desde otros componentes del sistema. Proporciona una vista detallada con toda la
 * información relevante del incidente reportado.
 * 
 * Funcionalidades principales:
 * - Visualización de detalles completos del reporte
 * - Información del usuario que reportó
 * - Datos de ubicación y tiempo del incidente
 * - Descripción detallada del evento
 * - Navegación de regreso al componente anterior
 * - Validación de existencia de reporte seleccionado
 * 
 * Navegación:
 * - Recibe datos del reporte a través del estado de navegación (location.state)
 * - Redirige automáticamente si no hay reporte seleccionado
 * - Botón de regreso al menú o lista de reportes
 * 
 * @returns {JSX.Element} Componente de visualización de reporte detallado
 */

// Importa React sin hooks adicionales (componente de solo lectura)
import React from "react";
// Importa los estilos CSS específicos para este componente
import "../estilos/VisualizarReportes.css";
// Importa los hooks de React Router para navegación y para obtener el estado enviado por la ruta
import { useLocation, useNavigate } from "react-router-dom";
// Importa el logo de la aplicación para la interfaz
import LogoAlertaContigo from "../recursos/menuUser/LogoAlertaContigo.png";

// Componente principal para visualizar reportes registrados en detalle
export default function VisualizarReportes() {
  // Obtiene la información pasada por navegación (el reporte seleccionado desde otro componente)
  const location = useLocation();
  // Hook para navegar entre páginas del sistema
  const navigate = useNavigate();
  // Extrae el reporte seleccionado del estado de navegación enviado por el componente anterior
  const reporte = location.state?.reporte;

  // Simulación de datos de un reporte registrado (en un caso real, estos vendrían de una base de datos o API)
  const datosReporte = {
    descripcion: "Se produjo un accidente de tránsito entre 2 vehículos y hay un tráfico horrible.", // Descripción del incidente
    ubicacion: "Avenida 12 de octubre y Ejido", // Ubicación específica del evento
    hora: "09:00", // Hora en que ocurrió el incidente
    usuario: "cesmorO2" // Usuario que reportó el incidente
  };

  // Si no hay reporte seleccionado (acceso directo a la ruta), regresa al menú principal para evitar errores
  if (!reporte) {
    navigate("/");
    return null;
  }

  // Renderizado del componente
  return (
    <div className="visualizar-reportes-container">
      {/* Header superior con logo y usuario */}
      <title>Reportes</title>
      <header className="menu-usuario-header">
        <div className="logo-titulo">
          {/* Logo de la aplicación */}
          <img src={LogoAlertaContigo} alt="Logo" className="logo-alerta" />
          <span className="titulo-app">
            ¡PONTE <span className="once">ONCE!</span>
          </span>
        </div>
        <div className="usuario-info">
          {/* Iconos de campana y avatar, y nombre del usuario */}
          <span className="icono-campana" role="img" aria-label="campana">🔔</span>
          <span className="usuario-nombre">César M</span>
          <span className="icono-avatar" role="img" aria-label="avatar">👤</span>
        </div>
      </header>
      {/* Cuerpo principal dividido en dos columnas */}
      <main className="visualizar-reportes-main">
        {/* Columna izquierda: cuadro para el mapa (placeholder) */}
        <section className="mapa-section">
          <div className="mapa-placeholder">
            {/* Aquí se integrará la API de Google Maps en el futuro */}
            Aquí va la API de google maps
          </div>
        </section>
        {/* Columna derecha: información del reporte */}
        <section className="info-section">
          <div className="info-cuadro">
            {/* Título de la sección de incidentes */}
            <div className="info-titulo">
              Considera los siguientes incidentes ocurridos en la zona
            </div>
            {/* Información detallada del reporte */}
            <div className="reporte-info">
              {/* Tipo de reporte con icono y texto */}
              <div className="reporte-tipo">
                <img src={reporte.icon} alt={reporte.texto} className="icono-reporte" />
                <span className="texto-reporte">{reporte.texto}</span>
              </div>
              {/* Descripción del incidente */}
              <div className="info-item">
                <label>Descripción del incidente</label>
                <div className="info-dato">{datosReporte.descripcion}</div>
              </div>
              {/* Ubicación registrada */}
              <div className="info-item">
                <label>Ubicación registrada</label>
                <div className="info-dato">{datosReporte.ubicacion}</div>
              </div>
              {/* Hora del incidente */}
              <div className="info-item">
                <label>Hora del incidente</label>
                <div className="info-dato">{datosReporte.hora}</div>
              </div>
              {/* Usuario que reportó el incidente */}
              <div className="info-item">
                <label>Reportado por</label>
                <div className="info-dato">{datosReporte.usuario}</div>
              </div>
            </div>
            {/* Botón para regresar al menú principal */}
            <div className="botones-reportes">
              <button className="us-btn-regresar" onClick={() => navigate("/menuUsuario")}>REGRESAR</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}