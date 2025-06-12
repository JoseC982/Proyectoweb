import React, { useState, useRef, useEffect } from "react";
import "../estilos/GestionUsuarios.css";
import LogFondo from "../recursos/MenuAdm/LogFondo.png";
import LogGestionUsuario from "../recursos/MenuAdm/LogGestionUsuario.png";
import { useNavigate } from "react-router-dom";

const usuariosIniciales = [
  { nombre: "Daniel", email: "daniel1@gmail.com", estado: "Activo" },
  { nombre: "Cesar", email: "cesar1@gmail.com", estado: "Silenciado" },
  { nombre: "Jose", email: "jose1@gmail.com", estado: "Activo" },
];

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState(usuariosIniciales);
  const [mensaje, setMensaje] = useState("");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
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

  const silenciarUsuario = () => {
    if (usuarioSeleccionado === null) return;
    setUsuarios((prev) =>
      prev.map((u, i) =>
        i === usuarioSeleccionado && u.estado !== "Silenciado"
          ? { ...u, estado: "Silenciado" }
          : u
      )
    );
    setUsuarioSeleccionado(null);
  };

  const borrarUsuario = () => {
    if (usuarioSeleccionado === null) return;
    setUsuarios((prev) => prev.filter((_, i) => i !== usuarioSeleccionado));
    setMensaje("USUARIO ELIMINADO");
    setTimeout(() => setMensaje(""), 2000);
    setUsuarioSeleccionado(null);
  };

  const handleSeleccion = (idx) => {
    setUsuarioSeleccionado(idx);
  };

  const handleCerrarSesion = () => {
    setMenuAbierto(false);
    setMensaje("Sesión Cerrada");
    setTimeout(() => setMensaje(""), 2000);
  };

  return (
    <div className="gestion-usuarios-fondo" style={{ position: "relative", minHeight: "100vh" }}>
      <img src={LogFondo} alt="Fondo" className="gestion-usuarios-bg" />
      {mensaje && <div className="mensaje-usuario-eliminado">{mensaje}</div>}
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
      <main className="gestion-usuarios-main">
        <img src={LogGestionUsuario} alt="Gestion Usuario" className="gestion-usuarios-img" />
        <h1 className="gestion-usuarios-titulo">Gestión de Usuarios</h1>
        <button className="btn-regresar" onClick={() => navigate("/menu-administracion")}>REGRESAR</button>
        <div className="gestion-usuarios-tabla-container">
          <table className="gestion-usuarios-tabla">
            <thead>
              <tr>
                <th>Nombre de usuario</th>
                <th>E-mail</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u, idx) => (
                <tr
                  key={u.email}
                  className={usuarioSeleccionado === idx ? "seleccionado" : ""}
                  onClick={() => handleSeleccion(idx)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td>{u.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="gestion-usuarios-botones">
          <button className="btn-silenciar" onClick={silenciarUsuario}>Silenciar usuario</button>
          <button className="btn-borrar" onClick={borrarUsuario}>Borrar usuario</button>
        </div>
      </main>
    </div>
  );
};

export default GestionUsuarios;
