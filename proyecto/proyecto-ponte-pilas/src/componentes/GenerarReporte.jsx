import React, { useState } from "react";
// Importa los estilos CSS para este componente
import "../estilos/GenerarReporte.css";
// Importa los hooks de React Router para navegación y para obtener el estado enviado por la ruta
import { useLocation, useNavigate } from "react-router-dom";

// Componente principal para generar un reporte
export default function GenerarReporte() {
  // Obtiene la información pasada por navegación (el reporte seleccionado)
  const location = useLocation();
  // Hook para navegar entre páginas
  const navigate = useNavigate();
  // Extrae el reporte seleccionado del estado de navegación
  const reporte = location.state?.reporte;

  // Estado para la descripción del incidente (input controlado)
  const [descripcion, setDescripcion] = useState("");
  // Estado para la ubicación registrada (input controlado)
  const [ubicacion, setUbicacion] = useState("");
  // Estado para la hora del incidente (input controlado)
  const [hora, setHora] = useState("");
  // Estado para mostrar mensajes temporales (ej: "Reporte Generado")
  const [mensaje, setMensaje] = useState("");

  // Si no hay reporte seleccionado (por ejemplo, si se accede directamente a la ruta), regresa al menú principal
  if (!reporte) {
    // Redirige al menú principal
    navigate("/menuUsuario");
    return null;
  }

  // Función que maneja el envío del formulario (generar reporte)
  const handleGenerar = () => {
    // Muestra mensaje de éxito
    setMensaje("Reporte Generado");
    // Después de 1.5 segundos, limpia el mensaje y regresa al menú principal
    setTimeout(() => {
      setMensaje("");
      navigate("/menuUsuario");
    }, 1500);
  };

  // Función que maneja el botón "Cancelar"
  const handleCancelar = () => {
    // Regresa al menú principal sin guardar nada
    navigate("/menuUsuario");
  };

  // Renderizado del componente
  return (
    <div className="generar-reporte-container">
      <title>Generar Reporte</title>
      {/* Header superior con logo y usuario */}
      <header className="menu-usuario-header">
        <div className="logo-titulo">
          {/* Logo de la aplicación */}
          <img src={require("../recursos/menuUser/LogoAlertaContigo.png")} alt="Logo" className="logo-alerta" />
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
      <main className="generar-reporte-main">
        {/* Columna izquierda: cuadro para el mapa (placeholder) */}
        <section className="mapa-section">
          <div className="mapa-placeholder">
            {/* Aquí se integrará la API de Google Maps en el futuro */}
            Aquí va la API de google maps
          </div>
        </section>
        {/* Columna derecha: formulario para ingresar los datos del reporte */}
        <section className="form-section">
          <div className="reporte-info">
            {/* Muestra el tipo de reporte seleccionado con su icono y texto */}
            <div className="reporte-tipo">
              <img src={reporte.icon} alt={reporte.texto} className="icono-reporte" />
              <span className="texto-reporte">{reporte.texto}</span>
            </div>
          </div>
          {/* Formulario para ingresar los datos del reporte */}
          <form
            className="formulario-reporte"
            onSubmit={e => {
              e.preventDefault(); // Evita recargar la página
              handleGenerar();    // Llama a la función para generar el reporte
            }}
          >
            {/* Campo para la descripción del incidente */}
            <label>Descripción del incidente</label>
            <textarea
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              required
              className="input-descripcion"
              placeholder="Describe el incidente..."
            />
            {/* Campo para la ubicación registrada */}
            <label>Ubicación Registrada</label>
            <input
              type="text"
              value={ubicacion}
              onChange={e => setUbicacion(e.target.value)}
              required
              className="input-ubicacion"
              placeholder="Ej: Avenida 12 de octubre y Ejido"
            />
            {/* Campo para la hora del incidente */}
            <label>Hora del incidente</label>
            <input
              type="time"
              value={hora}
              onChange={e => setHora(e.target.value)}
              required
              className="input-hora"
            />
            {/* Botones para generar o cancelar el reporte */}
            <div className="botones-reporte">
              <button type="submit" className="btn-generar">GENERAR</button>
              <button type="button" className="btn-cancelar" onClick={handleCancelar}>CANCELAR</button>
            </div>
          </form>
        </section>
      </main>
      {/* Mensaje temporal de confirmación */}
      {mensaje && <div className="mensaje-generado">{mensaje}</div>}
    </div>
  );
}