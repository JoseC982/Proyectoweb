import React, { useState } from "react";
import "../estilos/InformacionUsuario.css";
import { useNavigate } from "react-router-dom";

export default function InformacionUsuario() {
  const navigate = useNavigate();

  // Estado de los campos
  const [edit, setEdit] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [datos, setDatos] = useState({
    nombre: "Cesar Morocho",
    username: "cesmorO2",
    email: "cesmor02@gmail.com",
    password: "************",
    bio: "Soy una persona que quiere ayudar a que las personas puedan movilizarse en nuestra linda ciudad de manera segura"
  });

  // Maneja cambios en los inputs
  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  // Guardar cambios
  const handleEditar = () => {
    setEdit(false);
    setMensaje("Información Actualizada");
    setTimeout(() => setMensaje(""), 2000);
  };

  return (
    <div className="info-usuario-container">
      <header className="menu-usuario-header">
        <div className="logo-titulo">
          <img src={require("../recursos/menuUser/LogoAlertaContigo.png")} alt="Logo" className="logo-alerta" />
          <span className="titulo-app">
            ¡PONTE <span className="once">ONCE!</span>
          </span>
        </div>
        <div className="usuario-info">
          <span className="icono-campana" role="img" aria-label="campana">🔔</span>
          <span className="usuario-nombre">César M</span>
          <span className="icono-avatar" role="img" aria-label="avatar">👤</span>
        </div>
      </header>
      <main className="info-usuario-main">
        <div className="info-usuario-left">
          <h1>Bienvenido {datos.nombre}</h1>
          <div className="icono-grande">
            <span role="img" aria-label="avatar" style={{fontSize: "5rem"}}>👤</span>
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
        <button className="btn-regresar" onClick={() => navigate("/")}>
          REGRESAR
        </button>
      </div>
      {mensaje && <div className="mensaje-actualizado">{mensaje}</div>}
    </div>
  );
}