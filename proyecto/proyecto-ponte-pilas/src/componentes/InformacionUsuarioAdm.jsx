// Importa React y el hook useState para manejar el estado local
import React, { useState } from "react";
// Importa los estilos CSS específicos para este componente
import "../estilos/InformacionUsuarioAdm.css";
// Importa los hooks de navegación y localización de rutas de React Router
import { useNavigate, useLocation } from "react-router-dom";
// Importa axios para hacer peticiones HTTP
import axios from "axios";

// Exporta el componente funcional InformacionUsuario, recibe el usuario y el setter global como props
export default function InformacionUsuario({ users, setUsers }) {
  // Muestra el usuario recibido en consola (para depuración)
  console.log(users);
  // Inicializa el hook de navegación
  const navigate = useNavigate();

  // Estado para controlar si los campos están en modo edición
  const [edit, setEdit] = useState(false);
  // Estado para mostrar mensajes temporales (ej: "Información Actualizada")
  const [mensaje, setMensaje] = useState("");
  // Estado para almacenar los datos del usuario (rellena con los datos actuales)
  const [datos, setDatos] = useState({
    nombre: users?.name || "",
    username: users?.username || "",
    email: users?.email || "",
    password: users?.pass || "",
    bio: users?.bio || "",
    fechaNacimiento: users?.fechaNacimiento || ""
  });

  // Función que maneja los cambios en los inputs y actualiza el estado 'datos'
  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  // Función que guarda los cambios y muestra un mensaje temporal
  const handleEditar = () => {
    // Busca el usuario por email y actualiza sus datos en la base de datos
    axios.get(`http://localhost:3000/users?email=${datos.email}`)
      .then(response => {
        // Muestra el email en consola (para depuración)
        console.log(datos.email);
        // Si encuentra el usuario
        if (response.data.length > 0) {
          const usuario = response.data[0];
          // Actualiza los datos del usuario en la base de datos
          axios.patch(`http://localhost:3000/users/${usuario.id}`, {
            name: datos.nombre,
            username: datos.username,
            email: datos.email,
            pass: datos.password,
            bio: datos.bio,
            fechaNacimiento: datos.fechaNacimiento
          })
            .then(() => {
              // Crea el objeto actualizado
              const usuarioActualizado = {
                ...usuario,
                name: datos.nombre,
                username: datos.username,
                email: datos.email,
                pass: datos.password,
                bio: datos.bio,
                fechaNacimiento: datos.fechaNacimiento
              };
              // Actualiza el estado global y el localStorage
              setUsers(usuarioActualizado);
              localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
              // Sale del modo edición y muestra mensaje de éxito
              setEdit(false);
              setMensaje("Información Actualizada");
              setTimeout(() => setMensaje(""), 2000);
            })
            .catch(() => {
              // Si hay error al actualizar, muestra mensaje de error
              setMensaje("Error al actualizar");
              setTimeout(() => setMensaje(""), 2000);
            });
        } else {
          // Si no encuentra el usuario, muestra mensaje de error
          setMensaje("Usuario no encontrado");
          setTimeout(() => setMensaje(""), 2000);
        }
      })
      .catch(() => {
        // Si hay error al buscar el usuario, muestra mensaje de error
        setMensaje("Error al buscar usuario");
        setTimeout(() => setMensaje(""), 2000);
      });
  };

  // Renderiza el formulario de información del usuario
  return (
    <div className="ad-info-usuario-container">
      {/* Título de la página */}
      <title>Mi cuenta</title>
      {/* Encabezado con logo y nombre de la app */}
      <header className="menu-usuario-header">
        <div className="logo-titulo">
          <img src={require("../recursos/menuUser/LogoAlertaContigo.png")} alt="Logo" className="logo-alerta" />
          <span className="titulo-app">
            ¡PONTE <span className="once">ONCE!</span>
          </span>
        </div>
        {/* Información del usuario en el header */}
        <div className="usuario-info">
          <span className="icono-campana" role="img" aria-label="campana">🔔</span>
          <span className="usuario-nombre">{datos.nombre}</span>
          <span className="icono-avatar" role="img" aria-label="avatar">👤</span>
        </div>
      </header>
      {/* Cuerpo principal con los datos del usuario */}
      <main className="ad-info-usuario-main">
        {/* Lado izquierdo con nombre, avatar y campos básicos */}
        <div className="ad-info-usuario-left">
          <h1>Bienvenido {datos.nombre}</h1>
          <div className="ad-icono-grande">
            <span role="img" aria-label="avatar" style={{ fontSize: "5rem" }}>👤</span>
          </div>
          <div className="ad-info-campos">
            <label>Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={datos.nombre}
              onChange={handleChange}
              disabled={!edit}
              className="ad-info-input"
            />
            <label>Nombre de usuario:</label>
            <input
              type="text"
              name="username"
              value={datos.username}
              onChange={handleChange}
              disabled={!edit}
              className="ad-info-input"
            />
            <label>Fecha de nacimiento:</label>
            <input
              type="date"
              name="fechaNacimiento"
              value={datos.fechaNacimiento}
              onChange={handleChange}
              disabled={!edit}
              className="info-input"
            />
          </div>
        </div>
        {/* Lado derecho con biografía, email y contraseña */}
        <div className="ad-info-usuario-right">
          <label className="ad-bio-label">Biografía:</label>
          <textarea
            name="bio"
            value={datos.bio}
            onChange={handleChange}
            disabled={!edit}
            className="ad-bio-area"
            placeholder="Agrega una breve biografía"
          />
          <div className="ad-info-campos">
            <label>Correo Electrónico:</label>
            <input
              type="email"
              name="email"
              value={datos.email}
              onChange={handleChange}
              disabled={!edit}
              className="ad-info-input"
            />
            <label>Contraseña:</label>
            <input
              type="password"
              name="password"
              value={datos.password}
              onChange={handleChange}
              disabled={!edit}
              className="ad-info-input"
              placeholder="********"
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
        <button className="ad-btn-regresar" onClick={() => navigate("/menu-administracion")}>
          REGRESAR
        </button>
      </div>
      {/* Muestra mensaje temporal si existe */}
      {mensaje && <div className="ad-mensaje-actualizado">{mensaje}</div>}
    </div>
  );
}