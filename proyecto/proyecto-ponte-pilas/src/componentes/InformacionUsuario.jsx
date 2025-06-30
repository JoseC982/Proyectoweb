// Importa React y el hook useState para manejar el estado local
import React, { useState } from "react";
// Importa los estilos CSS específicos para este componente
import "../estilos/InformacionUsuario.css";
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


  // Maneja los cambios en los inputs del formulario
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
    <div className="info-usuario-container">
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
      <h1 className="info-usuario-bienvenida">Bienvenido {datos.nombre}</h1>
      <main className="info-usuario-main">


        {/* Lado izquierdo con nombre, avatar y campos básicos */}
        <div className="info-usuario-left">

          {/* Bienvenida con el nombre actualizado */}
          <div className="info-campos">

            <div className="icono-grande">
              <span role="img" aria-label="avatar" style={{ fontSize: "5rem" }}>👤</span>
            </div>
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
        <div className="info-usuario-right">
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
              placeholder="********"
            />
            <label className="bio-label">Biografía:</label>
            <textarea
              name="bio"
              value={datos.bio}
              onChange={handleChange}
              disabled={!edit}
              className="bio-area"
              placeholder="Agrega una breve biografía"
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
      {mensaje && <div className="mensaje-actualizado">{mensaje}</div>}
    </div>
  );
}