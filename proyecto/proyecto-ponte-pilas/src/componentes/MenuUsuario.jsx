import React from "react";
import "../estilos/MenuUsuario.css";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Importa las imágenes
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


export default function MenuUsuario() {
    const [open, setOpen] = useState(false);
    const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
    const menuRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleGenerarReporte = () => {
        if (reporteSeleccionado) {
            navigate("/generar-reporte", { state: { reporte: reporteSeleccionado } });
        }
    };

    const handleVerReportes = () => {
        if (reporteSeleccionado) {
            navigate("/visualizar-reportes", { state: { reporte: reporteSeleccionado } });
        }
    };

    return (
    <div className="menu-usuario-container">
      <header className="menu-usuario-header">
      <div className="logo-titulo">
        <img src={LogoAlertaContigo} alt="Logo" className="logo-alerta" />
        <span className="titulo-app">
          ¡PONTE <span className="once">ONCE!</span>
        </span>
      </div>
      <div className="usuario-info" ref={menuRef}>
        <span className="icono-campana" role="img" aria-label="campana">🔔</span>
        <span className="usuario-nombre">César M</span>
        <span className="icono-avatar" role="img" aria-label="avatar">👤</span>
        <button
          className="btn-menu-desplegable"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
        >
        </button>
        {open && (
          <div className="menu-desplegable">
            <button className="menu-opcion" onClick={() => navigate("/informacion")}>Mi cuenta</button>
            <button className="menu-opcion">Cerrar sesión</button>
          </div>
        )}
      </div>
    </header>
      <main className="menu-usuario-main">
        <section className="bienvenida">
          <h1>Bienvenido César M</h1>
          <button
            className="btn-generar-reporte"
            onClick={handleGenerarReporte}
            disabled={!reporteSeleccionado}
            style={{ opacity: reporteSeleccionado ? 1 : 0.5, cursor: reporteSeleccionado ? "pointer" : "not-allowed" }}
          >
            Generar reporte
          </button>
          <button
  className="btn-ver-reportes"
  onClick={handleVerReportes}
  disabled={!reporteSeleccionado}
  style={{ opacity: reporteSeleccionado ? 1 : 0.5, cursor: reporteSeleccionado ? "pointer" : "not-allowed" }}
>
  Ver reportes registrados
</button>
        </section>
        <section className="tipos-reporte">
          <h2>Elija el tipo de reporte</h2>
          <div className="grid-reportes">
            {reportes.map((r, i) => (
              <div
                className={`reporte-item${reporteSeleccionado === r ? " seleccionado" : ""}`}
                key={i}
                onClick={() => setReporteSeleccionado(r)}
                style={{
                  border: reporteSeleccionado === r ? "3px solid #7c4dff" : "",
                  boxShadow: reporteSeleccionado === r ? "0 0 10px #7c4dff44" : ""
                }}
              >
                <img src={r.icon} alt={r.texto} />
                <span>{r.texto}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}