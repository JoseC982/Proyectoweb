// Importa React y los hooks useState y useEffect para manejar estado y efectos secundarios
import React, { useState, useEffect } from "react";
// Importa los estilos CSS específicos para este componente
import "../estilos/InformacionUsuarioAdm.css";
// Importa el hook useNavigate para navegación programática entre rutas
import { useNavigate } from "react-router-dom";

// Componente principal que muestra y permite editar la información del usuario administrador
export default function InformacionUsuarioAdm({ admin }) {
  // Hook para navegar entre rutas (por ejemplo, regresar al menú de administración)
  const navigate = useNavigate();

  // Estado local para los datos del formulario (nombre, usuario, email, contraseña, bio)
  // Inicialmente en blanco, se llenan cuando se recibe el admin
  const [datos, setDatos] = useState({
    nombre: "",
    username: "",
    email: "",
    password: "",
    bio: ""
  });

  // Efecto secundario: cuando cambia el prop admin, actualiza los datos del formulario
  useEffect(() => {
    // Si existe el objeto admin (ya fue cargado desde la base de datos)
    if (admin) {
      // Actualiza los campos con los datos del admin, dejando username, password y bio en blanco
      setDatos({
        nombre: admin.name || "",
        username: "",
        email: admin.email || "",
        password: "",
        bio: ""
      });
    }
  }, [admin]); // Solo se ejecuta cuando cambia admin

  // Estado para controlar si el formulario está en modo edición o solo lectura
  const [edit, setEdit] = useState(false);
  // Estado para mostrar mensajes temporales (ej: información actualizada)
  const [mensaje, setMensaje] = useState("");

  // Maneja los cambios en los inputs del formulario
  const handleChange = (e) => {
    // Actualiza el campo correspondiente en el estado datos
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  // Maneja el guardado de la información editada
  const handleEditar = () => {
    // Sale del modo edición
    setEdit(false);
    // Muestra mensaje de confirmación
    setMensaje("Información Actualizada");
    // Borra el mensaje después de 2 segundos
    setTimeout(() => setMensaje(""), 2000);
  };

  // Renderizado del componente
  return (
    <div className="ad-info-usuario-container">
      {/* Título de la pestaña (no visible en la UI, pero útil para SEO) */}
      <title>Mi cuenta</title>
      {/* Encabezado con logo y nombre de usuario */}
      <header className="menu-usuario-header">
        <div className="logo-titulo">
          {/* Logo de la app */}
          <img src={require("../recursos/menuUser/LogoAlertaContigo.png")} alt="Logo" className="logo-alerta" />
          {/* Título de la app */}
          <span className="titulo-app">
            ¡PONTE <span className="once">ONCE!</span>
          </span>
        </div>
        {/* Información del usuario en la cabecera */}
        <div className="usuario-info">
          <span className="icono-campana" role="img" aria-label="campana">🔔</span>
          <span className="usuario-nombre">{admin ? admin.name : ""}</span>
          <span className="icono-avatar" role="img" aria-label="avatar">👤</span>
        </div>
      </header>
      {/* Cuerpo principal dividido en dos columnas */}
      <main className="ad-info-usuario-main">
        {/* Columna izquierda: nombre, usuario, avatar */}
        <div className="ad-info-usuario-left">
          {/* Título de bienvenida, muestra el nombre del admin si está disponible */}
          <h1>Bienvenido {admin ? admin.name : ""}</h1>
          <div className="ad-icono-grande">
            {/* Icono de avatar grande, solo decorativo */}
            <span role="img" aria-label="avatar" style={{fontSize: "5rem"}}>👤</span>
          </div>
          <div className="ad-info-campos">
            {/* Etiqueta para el campo de nombre */}
            <label>Nombre:</label>
            {/* Input para el nombre, controlado por el estado 'datos.nombre'.
                Solo editable si 'edit' es true. */}
            <input
              type="text"
              name="nombre"
              value={datos.nombre}
              onChange={handleChange} // Actualiza el estado al escribir
              disabled={!edit} // Deshabilitado si no está en modo edición
              className="ad-info-input"
            />
            {/* Etiqueta para el campo de nombre de usuario */}
            <label>Nombre de usuario:</label>
            {/* Input para el nombre de usuario, controlado por el estado 'datos.username'.
                Solo editable si 'edit' es true. */}
            <input
              type="text"
              name="username"
              value={datos.username}
              onChange={handleChange} // Actualiza el estado al escribir
              disabled={!edit} // Deshabilitado si no está en modo edición
              className="ad-info-input"
            />
          </div>
        </div>
        {/* Columna derecha: biografía, email, contraseña */}
        <div className="ad-info-usuario-right">
          {/* Etiqueta para el campo de biografía */}
          <label className="ad-bio-label">Biografía:</label>
          {/* Área de texto para la biografía, controlada por el estado 'datos.bio'.
              Solo editable si 'edit' es true. */}
          <textarea
            name="bio"
            value={datos.bio}
            onChange={handleChange} // Actualiza el estado al escribir
            disabled={!edit} // Deshabilitado si no está en modo edición
            className="ad-bio-area"
          />
          <div className="ad-info-campos">
            {/* Etiqueta para el campo de correo electrónico */}
            <label>Correo Electrónico:</label>
            {/* Input para el email, controlado por el estado 'datos.email'.
                Solo editable si 'edit' es true. */}
            <input
              type="email"
              name="email"
              value={datos.email}
              onChange={handleChange} // Actualiza el estado al escribir
              disabled={!edit} // Deshabilitado si no está en modo edición
              className="ad-info-input"
            />
            {/* Etiqueta para el campo de contraseña */}
            <label>Contraseña:</label>
            {/* Input para la contraseña, controlado por el estado 'datos.password'.
                Solo editable si 'edit' es true. */}
            <input
              type="password"
              name="password"
              value={datos.password}
              onChange={handleChange} // Actualiza el estado al escribir
              disabled={!edit} // Deshabilitado si no está en modo edición
              className="ad-info-input"
            />
          </div>
        </div>
      </main>
      {/* Botones de acción: editar/guardar y regresar */}
      <div className="info-botones">
        <button
          className="btn-editar"
          onClick={() => {
            // Si está en modo edición, guarda los cambios
            if (edit) {
              handleEditar();
            } else {
              // Si no, entra en modo edición
              setEdit(true);
            }
          }}
        >
          {edit ? "Guardar" : "Editar información"}
        </button>
        <button className="ad-btn-regresar" onClick={() => navigate("/menu-administracion")}> {/* Regresa al menú */}
          REGRESAR
        </button>
      </div>
      {/* Mensaje temporal de confirmación de guardado */}
      {mensaje && <div className="ad-mensaje-actualizado">{mensaje}</div>}
    </div>
  );
}