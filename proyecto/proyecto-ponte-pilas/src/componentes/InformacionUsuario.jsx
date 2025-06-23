import React, { useState } from "react";
import "../estilos/InformacionUsuario.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function InformacionUsuario({users}) {
  console.log(users);
  const navigate = useNavigate();

  // Estado para controlar si los campos están en modo edición
  const [edit, setEdit] = useState(false);
  // Estado para mostrar mensajes temporales (ej: "Información Actualizada")
  const [mensaje, setMensaje] = useState("");
  // Estado para almacenar los datos del usuario
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
    // Busca el usuario por email y actualiza sus datos
    axios.get(`http://localhost:3000/users?email=${datos.email}`)
      .then(response => {
        console.log(datos.email);
        if (response.data.length > 0) {
          const usuario = response.data[0];
          axios.patch(`http://localhost:3000/users/${usuario.id}`, {
            name: datos.nombre,
            username: datos.username,
            email: datos.email,
            pass: datos.password,
            bio: datos.bio,
            fechaNacimiento: datos.fechaNacimiento
          })
          .then(() => {
            setEdit(false);
            setMensaje("Información Actualizada");
            setTimeout(() => setMensaje(""), 2000);
          })
          .catch(() => {
            setMensaje("Error al actualizar");
            setTimeout(() => setMensaje(""), 2000);
          });
        } else {
          setMensaje("Usuario no encontrado");
          setTimeout(() => setMensaje(""), 2000);
        }
      })
      .catch(() => {
        setMensaje("Error al buscar usuario");
        setTimeout(() => setMensaje(""), 2000);
      });
  };

  return (
    <div className="info-usuario-container">
      <title>Mi cuenta</title>
      <header className="menu-usuario-header">
        <div className="logo-titulo">
          <img src={require("../recursos/menuUser/LogoAlertaContigo.png")} alt="Logo" className="logo-alerta" />
          <span className="titulo-app">
            ¡PONTE <span className="once">ONCE!</span>
          </span>
        </div>
        <div className="usuario-info">
          <span className="icono-campana" role="img" aria-label="campana">🔔</span>
          <span className="usuario-nombre">{datos.nombre}</span>
          <span className="icono-avatar" role="img" aria-label="avatar">👤</span>
        </div>
      </header>
      <main className="info-usuario-main">
        <div className="info-usuario-left">
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
          <label className="bio-label">Biografía:</label>
          <textarea
            name="bio"
            value={datos.bio}
            onChange={handleChange}
            disabled={!edit}
            className="bio-area"
            placeholder="Agrega una breve biografía"
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
              placeholder="********"
            />
          </div>
        </div>
      </main>
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