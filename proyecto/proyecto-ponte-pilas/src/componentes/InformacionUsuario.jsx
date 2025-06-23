// Importa React y los hooks necesarios
import React, { useState, useEffect } from "react";
// Importa los estilos CSS para este componente
import "../estilos/InformacionUsuario.css";
// Importa el hook para navegar entre rutas
import { useNavigate } from "react-router-dom";

// Componente principal
export default function InformacionUsuario({ usuarioActual, actualizarUsuario }) {
  const navigate = useNavigate(); // Hook para cambiar de ruta
  const [edit, setEdit] = useState(false); // Estado para saber si está en modo edición
  const [mensaje, setMensaje] = useState(""); // Estado para mostrar mensajes de éxito

  // Función para mapear los datos del usuario actual a los campos del formulario
  const mapUserToForm = (user) => ({
    id: user?.id || "",
    nombre: user?.name || "",
    username: user?.username || "",
    bio: user?.bio || "",
    email: user?.email || "",
    password: user?.pass || "", // Mapea pass a password
  });

  // Estado para los datos del formulario, inicializado con los datos del usuario actual
  const [datos, setDatos] = useState(mapUserToForm(usuarioActual));

  // Sincroniza los datos del formulario cuando cambia el usuario actual
  useEffect(() => {
    setDatos(mapUserToForm(usuarioActual));
  }, [usuarioActual]);

  // Maneja los cambios en los inputs del formulario
  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  // Guarda los cambios y actualiza el usuario en la base de datos
  const handleEditar = async () => {
    // Mapea los datos del formulario a los campos del usuario en la base de datos
    const datosParaActualizar = {
      ...usuarioActual,
      name: datos.nombre,
      username: datos.username,
      bio: datos.bio,
      email: datos.email,
      pass: datos.password, // Mapea password a pass
    };
    await actualizarUsuario(datos.id, datosParaActualizar); // Llama a la función para actualizar el usuario
    setEdit(false); // Sale del modo edición
    setMensaje("Información Actualizada"); // Muestra mensaje de éxito
    setTimeout(() => setMensaje(""), 2000); // Oculta el mensaje después de 2 segundos
  };

  // Renderizado del componente
  return (
    <div className="info-usuario-container">
      <title>Mi cuenta</title>
      {/* Header con logo y nombre del usuario */}
      <header className="menu-usuario-header">
        <div className="logo-titulo">
          <img src={require("../recursos/menuUser/LogoAlertaContigo.png")} alt="Logo" className="logo-alerta" />
          <span className="titulo-app">
            ¡PONTE <span className="once">ONCE!</span>
          </span>
        </div>
        <div className="usuario-info">
          <span className="icono-campana" role="img" aria-label="campana">🔔</span>
          {/* Muestra el nombre actualizado */}
          <span className="usuario-nombre">{datos.nombre}</span>
          <span className="icono-avatar" role="img" aria-label="avatar">👤</span>
        </div>
      </header>
      {/* Cuerpo principal con los campos de información */}
      <main className="info-usuario-main">
        <div className="info-usuario-left">
          {/* Bienvenida con el nombre actualizado */}
          <h1>Bienvenido {datos.nombre}</h1>
          <div className="icono-grande">
            <span role="img" aria-label="avatar" style={{ fontSize: "5rem" }}>👤</span>
          </div>
          <div className="info-campos">
            <label>Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={datos.nombre}
              onChange={handleChange}
              disabled={!edit}
              className="info-input"
            />
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
        <div className="info-usuario-right">
          <label className="bio-label">Biografía:</label>
          <textarea
            name="bio"
            value={datos.bio}
            onChange={handleChange}
            disabled={!edit}
            className="bio-area"
          />
          <div className="info-campos">
            <label>Correo Electrónico:</label>
            <input
              type="email"
              name="email"
              value={datos.email}
              onChange={handleChange}
              disabled={!edit}
              className="info-input"
            />
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
      {/* Botones para editar/guardar y regresar */}
      <div className="info-botones">
        <button
          className="btn-editar"
          onClick={() => {
            if (edit) {
              handleEditar();
            } else {
              setEdit(true);
            }
          }}
        >
          {edit ? "Guardar" : "Editar información"}
        </button>
        <button className="us-btn-regresar" onClick={() => navigate("/menuUsuario")}>
          REGRESAR
        </button>
      </div>
      {/* Mensaje de éxito */}
      {mensaje && <div className="mensaje-actualizado">{mensaje}</div>}
    </div>
  );
}