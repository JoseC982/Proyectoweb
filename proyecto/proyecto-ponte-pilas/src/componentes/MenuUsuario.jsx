import React from "react";
// Importa los estilos CSS para este componente
import "../estilos/MenuUsuario.css";
// Importa hooks de React y el hook de navegación de React Router
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Importa las imágenes de los diferentes tipos de reporte y el logo
import LogoPersonSospechoso from "../recursos/menuUser/logoPersonSospechoso.png";
import LogoEnfrentamiento from "../recursos/menuUser/logoEnfrentamiento.png";
import LogoRiña from "../recursos/menuUser/LogoRiña.jpg";
import LogoAlteracion from "../recursos/menuUser/LogoAlteracion.png";
import LogoEvenTransito from "../recursos/menuUser/LogoEvenTransito.png";
import LogoRobo from "../recursos/menuUser/LogoRobo.png";
import LogoMujer from "../recursos/menuUser/LogoMujer.jpg";
import LogoMedico from "../recursos/menuUser/LogoMedico.png";
import LogoExtraviado from "../recursos/menuUser/LogoExtraviado.jpg";
import LogoAlertaContigo from "../recursos/menuUser/LogoAlertaContigo.png";

// Array con los tipos de reportes disponibles, cada uno con su icono y texto
const reportes = [
  { icon: LogoPersonSospechoso, texto: "Personas sospechosas" },
  { icon: LogoEnfrentamiento, texto: "Conflicto / Enfrentamiento" },
  { icon: LogoRiña, texto: "Riña" },
  { icon: LogoAlteracion, texto: "Alteración del orden público" },
  { icon: LogoEvenTransito, texto: "Eventos de tránsito" },
  { icon: LogoRobo, texto: "Robo" },
  { icon: LogoMujer, texto: "Violencia contra la mujer" },
  { icon: LogoMedico, texto: "Emergencia médica" },
  { icon: LogoExtraviado, texto: "Persona extraviada o no localizada" },
];

// Componente principal del menú de usuario
export default function MenuUsuario() {
    // Estado para mostrar/ocultar el menú desplegable del usuario
    const [open, setOpen] = useState(false);
    // Estado para guardar el reporte seleccionado por el usuario
    const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
    // Referencia al contenedor del menú para detectar clics fuera de él
    const menuRef = useRef();
    // Hook para navegar entre páginas
    const navigate = useNavigate();

    // Efecto para cerrar el menú desplegable si se hace clic fuera de él
    useEffect(() => {
        function handleClickOutside(event) {
            // Si el clic fue fuera del menú, cierra el menú
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        // Agrega el listener al montar el componente
        document.addEventListener("mousedown", handleClickOutside);
        // Limpia el listener al desmontar el componente
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Función para manejar el click en "Generar reporte"
    // Solo navega si hay un reporte seleccionado
    const handleGenerarReporte = () => {
        if (reporteSeleccionado) {
            navigate("/generar-reporte", { state: { reporte: reporteSeleccionado } });
        }
    };

    // Función para manejar el click en "Ver reportes registrados"
    // Solo navega si hay un reporte seleccionado
    const handleVerReportes = () => {
        if (reporteSeleccionado) {
            navigate("/visualizar-reportes", { state: { reporte: reporteSeleccionado } });
        }
    };

    // Renderizado del componente
    return (
    <div className="menu-usuario-container">
      {/* Header superior con logo, nombre de usuario y menú desplegable */}
      <title>Menu Usuario</title>
      <header className="menu-usuario-header">
        <div className="logo-titulo">
          {/* Logo de la aplicación */}
          <img src={LogoAlertaContigo} alt="Logo" className="logo-alerta" />
          <span className="titulo-app">
            ¡PONTE <span className="once">ONCE!</span>
          </span>
        </div>
        {/* Información del usuario y menú desplegable */}
        <div className="usuario-info" ref={menuRef}>
          <span className="icono-campana" role="img" aria-label="campana">🔔</span>
          <span className="usuario-nombre">César M</span>
          <span className="icono-avatar" role="img" aria-label="avatar">👤</span>
          {/* Botón para abrir/cerrar el menú desplegable */}
          <button
            className="btn-menu-desplegable"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menú"
          >
          </button>
          {/* Menú desplegable con opciones de cuenta */}
          {open && (
            <div className="menu-desplegable">
              {/* Opción para ir a la información del usuario */}
              <button className="menu-opcion" onClick={() => navigate("/informacion")}>Mi cuenta</button>
              {/* Opción para cerrar sesión (a implementar) */}
              <button className="menu-opcion" onClick={() => navigate("/")}>Cerrar sesión</button>
            </div>
          )}
        </div>
      </header>
      {/* Cuerpo principal del menú */}
      <main className="menu-usuario-main">
        {/* Sección de bienvenida y botones de acción */}
        <section className="bienvenida">
          <h1>Bienvenido César M</h1>
          {/* Botón para generar reporte, solo habilitado si hay reporte seleccionado */}
          <button
            className="btn-generar-reporte"
            onClick={handleGenerarReporte}
            disabled={!reporteSeleccionado}
            style={{ opacity: reporteSeleccionado ? 1 : 0.5, cursor: reporteSeleccionado ? "pointer" : "not-allowed" }}
          >
            Generar reporte
          </button>
          {/* Botón para ver reportes registrados, solo habilitado si hay reporte seleccionado */}
          <button
            className="btn-ver-reportes"
            onClick={handleVerReportes}
            disabled={!reporteSeleccionado}
            style={{ opacity: reporteSeleccionado ? 1 : 0.5, cursor: reporteSeleccionado ? "pointer" : "not-allowed" }}
          >
            Ver reportes registrados
          </button>
        </section>
        {/* Sección para elegir el tipo de reporte */}
        <section className="tipos-reporte">
          <h2>Elija el tipo de reporte</h2>
          <div className="grid-reportes">
            {/* Muestra todos los tipos de reporte como cuadros seleccionables */}
            {reportes.map((r, i) => (
              <div
                className={`reporte-item${reporteSeleccionado === r ? " seleccionado" : ""}`}
                key={i}
                onClick={() => setReporteSeleccionado(r)}
                // Si está seleccionado, cambia el borde y la sombra
                style={{
                  border: reporteSeleccionado === r ? "3px solid #7c4dff" : "",
                  boxShadow: reporteSeleccionado === r ? "0 0 10px #7c4dff44" : ""
                }}
              >
                {/* Icono del tipo de reporte */}
                <img src={r.icon} alt={r.texto} />
                {/* Texto del tipo de reporte */}
                <span>{r.texto}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}