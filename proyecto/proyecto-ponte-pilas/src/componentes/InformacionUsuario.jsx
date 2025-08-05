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

  // ✅ URL base del backend
  const baseURL = "http://localhost:8000/";

  // Estado para controlar si los campos están en modo edición
  const [edit, setEdit] = useState(false);
  // Estado para mostrar mensajes temporales (ej: "Información Actualizada")
  const [mensaje, setMensaje] = useState("");

  // ✅ NUEVO: Estados para el modal de cambio de contraseña
  const [modalPasswordOpen, setModalPasswordOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");

  // Estado para almacenar los datos del usuario (rellena con los datos actuales)
  const [datos, setDatos] = useState({
    name: users?.name || "",
    username: users?.username || "",
    email: users?.email || "",
    bio: users?.bio || "",
    fechaNacimiento: users?.fechaNacimiento ? users.fechaNacimiento.split('T')[0] : ""
  });

  // ✅ Verificar autenticación
  if (!users) {
    navigate("/loginAdmin");
    return null;
  }

  // Maneja los cambios en los inputs del formulario
  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  // ✅ NUEVO: Maneja los cambios en los inputs del modal de contraseña
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setPasswordError(""); // Limpiar errores al escribir
  };

  // ✅ Función que guarda los cambios de información personal
  const handleEditar = () => {
    // Preparar datos para enviar
    const datosActualizados = {};
    
    if (datos.name.trim()) datosActualizados.name = datos.name.trim();
    if (datos.username.trim()) datosActualizados.username = datos.username.trim();
    if (datos.email.trim()) datosActualizados.email = datos.email.trim();
    if (datos.bio.trim()) datosActualizados.bio = datos.bio.trim();
    if (datos.fechaNacimiento) datosActualizados.fechaNacimiento = datos.fechaNacimiento;

    // ✅ Petición PATCH al endpoint correcto del backend
    axios.patch(`${baseURL}users/${users.id}/infoPerfil`, datosActualizados)
      .then(response => {
        console.log('Usuario actualizado:', response.data);
        
        // Actualizar estado global con los datos devueltos por el backend
        const usuarioActualizado = {
          ...users,
          ...response.data.user,
          pass: users.pass
        };
        
        setUsers(usuarioActualizado);
        localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
        
        setEdit(false);
        setMensaje("Información Actualizada");
        setTimeout(() => setMensaje(""), 3000);
      })
      .catch(error => {
        console.error('Error al actualizar usuario:', error);
        
        let mensajeError = "Error al actualizar";
        
        if (error.response) {
          const status = error.response.status;
          const message = error.response.data?.message || error.response.data?.error;
          
          if (status === 401) {
            mensajeError = "No autorizado";
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            navigate("/loginAdmin");
            return;
          } else if (status === 403) {
            mensajeError = "No tienes permisos para realizar esta acción";
          } else if (status === 404) {
            mensajeError = "Usuario no encontrado";
          } else if (status === 400) {
            mensajeError = message || "Datos inválidos";
          } else {
            mensajeError = message || "Error del servidor";
          }
        } else if (error.request) {
          mensajeError = "Error de conexión con el servidor";
        }
        
        setMensaje(mensajeError);
        setTimeout(() => setMensaje(""), 3000);
      });
  };

  // ✅ NUEVO: Función para abrir modal de cambio de contraseña
  const abrirModalPassword = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setPasswordError("");
    setModalPasswordOpen(true);
  };

  // ✅ NUEVO: Función para cancelar cambio de contraseña
  const cancelarCambioPassword = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setPasswordError("");
    setModalPasswordOpen(false);
  };

  // ✅ NUEVO: Función para guardar cambio de contraseña
  const guardarCambioPassword = () => {
    // Validaciones del frontend
    if (!passwordData.currentPassword.trim()) {
      setPasswordError("Debe ingresar su contraseña actual");
      return;
    }
    
    if (!passwordData.newPassword.trim()) {
      setPasswordError("Debe ingresar una nueva contraseña");
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Las nuevas contraseñas no coinciden");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }

    // ✅ Crear endpoint específico para cambio de contraseña
    axios.patch(`${baseURL}users/${users.id}/cambiarPassword`, {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    })
      .then(response => {
        console.log('Contraseña actualizada:', response.data);
        
        setModalPasswordOpen(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        setPasswordError("");
        
        setMensaje("Contraseña actualizada exitosamente");
        setTimeout(() => setMensaje(""), 3000);
      })
      .catch(error => {
        console.error('Error al cambiar contraseña:', error);
        
        if (error.response) {
          const status = error.response.status;
          const message = error.response.data?.message || error.response.data?.error;
          
          if (status === 400 && message.includes("actual")) {
            setPasswordError("Contraseña actual incorrecta");
          } else if (status === 401) {
            setPasswordError("No autorizado");
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            navigate("/loginAdmin");
            return;
          } else {
            setPasswordError(message || "Error al cambiar contraseña");
          }
        } else {
          setPasswordError("Error de conexión con el servidor");
        }
      });
  };

  // ✅ Validación de formulario
  const formularioValido = datos.name.trim() && datos.username.trim() && datos.email.trim();
  const passwordFormValido = passwordData.currentPassword.trim() && 
                             passwordData.newPassword.trim() && 
                             passwordData.confirmPassword.trim() &&
                             passwordData.newPassword === passwordData.confirmPassword;

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
          <span className="usuario-nombre">{datos.name}</span>
          <span className="icono-avatar" role="img" aria-label="avatar">👤</span>
        </div>
      </header>
      {/* Cuerpo principal con los datos del usuario */}
      <h1 className="info-usuario-bienvenida">Bienvenido {datos.name}</h1>
      <main className="info-usuario-main">

        {/* Lado izquierdo con nombre, avatar y campos básicos */}
        <div className="info-usuario-left">
          <div className="info-campos">
            <div className="icono-grande">
              <span role="img" aria-label="avatar" style={{ fontSize: "5rem" }}>👤</span>
            </div>
            <label>Nombre:</label>
            <input
              type="text"
              name="name"
              value={datos.name}
              onChange={handleChange}
              disabled={!edit}
              className="info-input"
              required
            />
            <label>Nombre de usuario:</label>
            <input
              type="text"
              name="username"
              value={datos.username}
              onChange={handleChange}
              disabled={!edit}
              className="info-input"
              required
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
              required
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
            
            {/* ✅ NUEVO: Botón para cambiar contraseña */}
            <div style={{ marginTop: "20px" }}>
              <button 
                className="btn-editar"
                onClick={abrirModalPassword}
                style={{ width: "100%" }}
              >
                Actualizar contraseña
              </button>
            </div>
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
          disabled={edit && !formularioValido}
        >
          {edit ? "Guardar" : "Editar información"}
        </button>
        <button className="us-btn-regresar" onClick={() => navigate("/menuUsuario")}>
          REGRESAR
        </button>
      </div>
      
      {/* ✅ Validación visual */}
      {edit && !formularioValido && (
        <div style={{ color: "red", textAlign: "center", marginTop: "10px" }}>
          Los campos Nombre, Username y Email son obligatorios
        </div>
      )}
      
      {/* ✅ NUEVO: Modal para cambiar contraseña */}
      {modalPasswordOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Cambiar Contraseña</h2>
            
            <label>Ingrese su contraseña actual:</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="info-input"
              placeholder="Contraseña actual"
              style={{ marginBottom: "15px", width: "100%" }}
            />
            
            <label>Ingrese su contraseña nueva:</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="info-input"
              placeholder="Nueva contraseña"
              style={{ marginBottom: "15px", width: "100%" }}
            />
            
            <label>Repita su contraseña nueva:</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="info-input"
              placeholder="Confirmar nueva contraseña"
              style={{ marginBottom: "15px", width: "100%" }}
            />
            
            {/* Mensaje de error */}
            {passwordError && (
              <div style={{ color: "red", marginBottom: "15px", textAlign: "center" }}>
                {passwordError}
              </div>
            )}
            
            {/* Botones del modal */}
            <div className="info-botones">
              <button
                className="btn-editar"
                onClick={guardarCambioPassword}
                disabled={!passwordFormValido}
              >
                Guardar cambios
              </button>
              <button 
                className="us-btn-regresar" 
                onClick={cancelarCambioPassword}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {mensaje && <div className="mensaje-actualizado">{mensaje}</div>}
    </div>
  );
}