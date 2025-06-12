import React, { useState, useRef, useEffect } from "react";
import "../estilos/MenuAdministracion.css";
import LogFondo from "../recursos/MenuAdm/LogFondo.png";
import LogGestionUsuario from "../recursos/MenuAdm/LogGestionUsuario.png";
import LogNotiAlerta from "../recursos/MenuAdm/LogNotiAlerta.png";
import LogValidarAlerta from "../recursos/MenuAdm/LogValidarAlerta.png";
import { useNavigate } from "react-router-dom";

const MenuAdministracion = () => {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const menuRef = useRef(null);

  const handleCerrarSesion = () => {
    setMenuAbierto(false);
    setMensaje("Sesión Cerrada");
    setTimeout(() => setMensaje(""), 2000);
  }

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

  return (
    <div className="menu-admin-fondo">
      {mensaje && (
        <div className="mensaje-sesion-cerrada">{mensaje}</div>
      )}
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
              <button className="menu-item" onClick={() => { setMenuAbierto(false); navigate('/informacion-usuarioAdm'); }}>Mi cuenta</button>
              <button className="menu-item" onClick={handleCerrarSesion}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>
      <main className="menu-admin-main">
        <h1 className="menu-admin-titulo">Menú de Administrador</h1>
        <div className="menu-admin-opciones">
          <div className="opcion-admin">
            <button className="btn-opcion rojo-morado" onClick={() => navigate('/gestion-usuarios')}>Gestión de Usuarios</button>
            <img src={LogGestionUsuario} alt="Gestión de Usuarios" className="img-opcion" />
          </div>
          <div className="opcion-admin">
            <button className="btn-opcion rojo-morado" onClick={() => navigate('/notificaciones-alertas')}>Notificaciones de Alertas</button>
            <img src={LogNotiAlerta} alt="Notificaciones de Alertas" className="img-opcion" />
          </div>
          <div className="opcion-admin">
            <button className="btn-opcion rojo-morado" onClick={() => navigate('/validar-alertas')}>Validar Alertas</button>
            <img src={LogValidarAlerta} alt="Validar Alertas" className="img-opcion" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MenuAdministracion;