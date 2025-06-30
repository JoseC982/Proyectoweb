import React, { useRef, useEffect, useState } from "react";
import "../estilos/GestionUsuarios.css";
import LogFondo from "../recursos/MenuAdm/LogFondo.png";
import LogGestionUsuario from "../recursos/MenuAdm/LogGestionUsuario.png";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

// Componente principal de gestión de usuarios
const GestionUsuarios = ({ silenciarUsuario, borrarUsuario }) => {
  // Estado para mostrar mensajes temporales (ej: usuario silenciado/eliminado)
  const [mensaje, setMensaje] = useState("");
  // Estado para guardar el índice del usuario seleccionado en la tabla
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  // Estado para controlar si el menú de usuario (desplegable) está abierto o cerrado
  const [menuAbierto, setMenuAbierto] = useState(false);
  // Estado para guardar la lista de usuarios
  const [users, setUsers] = useState([]);
  // Referencia al contenedor del menú de usuario, para detectar clics fuera de él
  const menuRef = useRef(null);
  // Hook de navegación para cambiar de ruta programáticamente
  const navigate = useNavigate();
  const location = useLocation();

  // Efecto secundario: Detecta clics fuera del menú para cerrarlo automáticamente
  useEffect(() => {
    // Función que se ejecuta en cada clic del documento
    function handleClickOutside(event) {
      // Si el menú está abierto y el clic NO fue dentro del menú, se cierra
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAbierto(false);
      }
    }
    // Se agrega el event listener al montar el componente
    document.addEventListener("mousedown", handleClickOutside);
    // Limpieza: se elimina el event listener al desmontar el componente
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Solo se ejecuta una vez al montar

  // Efecto secundario: Recarga usuarios cada vez que se monta o cambia la ruta
  useEffect(() => {
    axios.get("http://localhost:3000/users")
      .then(res => setUsers(res.data));
  }, [location]);

  // Función para silenciar al usuario seleccionado
  const handleSilenciar = async () => {
    if (usuarioSeleccionado === null) return;
    const user = users[usuarioSeleccionado];
    const nuevoEstado = user.estado === "Silenciado" ? "Activo" : "Silenciado";
    // Llama a la función recibida por props para actualizar el usuario
    await silenciarUsuario(user, nuevoEstado);
    // Actualiza el estado local de users
    setUsers(prevUsers =>
      prevUsers.map((u, idx) =>
        idx === usuarioSeleccionado ? { ...u, estado: nuevoEstado } : u
      )
    );
    setMensaje(
      nuevoEstado === "Silenciado" ? "USUARIO SILENCIADO" : "USUARIO ACTIVADO"
    );
    setTimeout(() => setMensaje(""), 2000);
    setUsuarioSeleccionado(null);
  };

  // Función para borrar al usuario seleccionado
  const handleBorrar = async () => {
    // Si no hay usuario seleccionado, no hace nada
    if (usuarioSeleccionado === null) return;
    // Obtiene el usuario seleccionado usando el índice
    const user = users[usuarioSeleccionado];
    // Llama a la función recibida por props para borrar (DELETE a la base de datos)
    await borrarUsuario(user);
    // Elimina el usuario del estado local
    setUsers(prevUsers => prevUsers.filter((_, idx) => idx !== usuarioSeleccionado));
    // Muestra mensaje temporal de confirmación
    setMensaje("USUARIO ELIMINADO");
    // Borra el mensaje después de 2 segundos
    setTimeout(() => setMensaje(""), 2000);
    // Deselecciona el usuario
    setUsuarioSeleccionado(null);
  };

  // Función para seleccionar un usuario al hacer clic en la fila de la tabla
  const handleSeleccion = (idx) => {
    setUsuarioSeleccionado(idx);
  };

  // Renderizado del componente
  return (
    <div className="gestion-usuarios-fondo" style={{ position: "relative", minHeight: "100vh" }}>
      {/* Imagen de fondo */}
      <img src={LogFondo} alt="Fondo" className="gestion-usuarios-bg" />
      {/* Mensaje temporal de acción (silenciado/eliminado/cerrado sesión) */}
      {mensaje && <div className="mensaje-usuario-eliminado">{mensaje}</div>}
      {/* Encabezado con logo y menú de usuario */}
      <header className="menu-admin-header">
        <div className="menu-admin-logo">
          {/* Logo de la ciudad */}
          <img src={LogFondo} alt="Logo Quito" className="logo-quito" />
          {/* Título de la app */}
          <span className="ponte-once">
            <span className="ponte">¡PONTE</span> <span className="once">ONCE!</span>
          </span>
        </div>
        {/* Menú de usuario (icono engranaje, nombre, menú desplegable) */}
        <div className="menu-admin-user" ref={menuRef}>
          <span className="icono-engranaje">⚙️</span>
          <span className="nombre-usuario">{users?.name}</span>
          {/* Botón para abrir/cerrar menú desplegable */}
          <button
            className="icono-desplegar-btn"
            onClick={() => setMenuAbierto((v) => !v)}
            aria-label="Abrir menú de usuario"
          >
            <span className="icono-desplegar">▼</span>
          </button>
          {/* Menú desplegable de usuario */}
          {menuAbierto && (
            <div className="menu-desplegable-usuario">
              <button className="menu-item" onClick={() => { setMenuAbierto(false); navigate('/informacion-usuarioAdm'); }}>Mi cuenta</button>
              <button className="menu-item" onClick={() => { localStorage.removeItem("usuario"); navigate("/") }}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>
      {/* Cuerpo principal de la gestión de usuarios */}
      <main className="gestion-usuarios-main">
        {/* Imagen decorativa de gestión de usuarios */}
        <img src={LogGestionUsuario} alt="Gestion Usuario" className="gestion-usuarios-img" />
        {/* Título */}
        <h1 className="gestion-usuarios-titulo">Gestión de Usuarios</h1>
        {/* Botón para regresar al menú de administración */}
        <button className="btn-regresar" onClick={() => navigate("/menu-administracion")}>REGRESAR</button>
        {/* Contenedor de la tabla de usuarios */}
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
              {/* Renderiza cada usuario como una fila de la tabla */}
              {users.map((u, idx) => (
                <tr
                  key={u.id} // Clave única para React
                  className={usuarioSeleccionado === idx ? "seleccionado" : ""} // Resalta si está seleccionado
                  onClick={() => handleSeleccion(idx)} // Selecciona usuario al hacer clic
                  style={{ cursor: "pointer" }} // Cambia el cursor al pasar por encima
                >
                  <td>{u.name}</td> {/* Nombre del usuario */}
                  <td>{u.email}</td> {/* Email del usuario */}
                  <td>{u.estado}</td> {/* Estado actual (ej: Activo, Silenciado) */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Botones de acción para silenciar o borrar usuario */}
        <div className="gestion-usuarios-botones">
          <button
            className="btn-silenciar"
            onClick={handleSilenciar}
            disabled={usuarioSeleccionado === null}
          >
            {usuarioSeleccionado !== null && users[usuarioSeleccionado]?.estado === "Silenciado"
              ? "Activar usuario"
              : "Silenciar usuario"}
          </button>
          <button className="btn-borrar" onClick={handleBorrar} disabled={usuarioSeleccionado === null}>
            Borrar usuario
          </button>
        </div>
      </main>
    </div>
  );
};

// Exporta el componente para ser usado en otros archivos
export default GestionUsuarios;
