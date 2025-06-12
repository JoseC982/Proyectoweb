import React, { useState } from "react";
// Importa los estilos CSS para este componente
import "../estilos/InformacionUsuario.css";
// Importa el hook useNavigate para navegar entre rutas
import { useNavigate } from "react-router-dom";

// Componente principal de información del usuario
export default function InformacionUsuario() {
  // Hook para navegar entre páginas
  const navigate = useNavigate();

  // Estado para controlar si los campos están en modo edición
  const [edit, setEdit] = useState(false);
  // Estado para mostrar mensajes temporales (ej: "Información Actualizada")
  const [mensaje, setMensaje] = useState("");
  // Estado para almacenar los datos del usuario
  const [datos, setDatos] = useState({
    nombre: "Cesar Morocho",
    username: "cesmorO2",
    email: "cesmor02@gmail.com",
    password: "",
    bio: "Soy una persona que quiere ayudar a que las personas puedan movilizarse en nuestra linda ciudad de manera segura"
  });

  // Función que maneja los cambios en los inputs y actualiza el estado 'datos'
  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  // Función que guarda los cambios y muestra un mensaje temporal
  const handleEditar = () => {
    setEdit(false); // Sale del modo edición
    setMensaje("Información Actualizada"); // Muestra mensaje
    setTimeout(() => setMensaje(""), 2000); // Oculta mensaje después de 2 segundos
  };

  return (
    <div className="info-usuario-container">
      {/* Header superior con logo y usuario */}
      <title>Mi cuenta</title>
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
      <main className="info-usuario-main">
        {/* Columna izquierda: saludo, avatar y campos de nombre y usuario */}
        <div className="info-usuario-left">
          <h1>Bienvenido {datos.nombre}</h1>
          <div className="icono-grande">
            {/* Icono grande de usuario */}
            <span role="img" aria-label="avatar" style={{fontSize: "5rem"}}>👤</span>
          </div>
          <div className="info-campos">
            {/* Campo de nombre */}
            <label>Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={datos.nombre}
              onChange={handleChange}
              disabled={!edit} // Solo editable si está en modo edición
              className="info-input"
            />
            {/* Campo de nombre de usuario */}
            <label>Nombre de usuario:</label>
            <input
              type="text"
              name="username"
              value={datos.username}
              onChange={handleChange}
              disabled={!edit}
              className="info-input"
            />
          </div>
        </div>
        {/* Columna derecha: biografía, email y contraseña */}
        <div className="info-usuario-right">
          {/* Campo de biografía */}
          <label className="bio-label">Biografía:</label>
          <textarea
            name="bio"
            value={datos.bio}
            onChange={handleChange}
            disabled={!edit}
            className="bio-area"
          />
          <div className="info-campos">
            {/* Campo de correo electrónico */}
            <label>Correo Electrónico:</label>
            <input
              type="email"
              name="email"
              value={datos.email}
              onChange={handleChange}
              disabled={!edit}
              className="info-input"
            />
            {/* Campo de contraseña */}
            <label>Contraseña:</label>
            <input
              type="password"
              name="password"
              value={datos.password}
              onChange={handleChange}
              disabled={!edit}
              className="info-input"
            />
          </div>
        </div>
      </main>
      {/* Botones de acción */}
      <div className="info-botones">
        {/* Botón para editar o guardar información */}
        <button
          className="btn-editar"
          onClick={() => {
            if (edit) {
              handleEditar(); // Si está en edición, guarda cambios
            } else {
              setEdit(true); // Si no, activa modo edición
            }
          }}
        >
          {edit ? "Guardar" : "Editar información"}
        </button>
        {/* Botón para regresar al menú principal */}
        <button className="us-btn-regresar" onClick={() => navigate("/menuUsuario")}>
          REGRESAR
        </button>
      </div>
      {/* Mensaje temporal de confirmación */}
      {mensaje && <div className="mensaje-actualizado">{mensaje}</div>}
</div>
);
}