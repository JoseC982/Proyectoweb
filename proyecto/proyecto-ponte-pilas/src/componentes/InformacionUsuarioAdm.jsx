/**
 * COMPONENTE DE INFORMACIÓN Y EDICIÓN DE USUARIO PARA ADMINISTRADORES
 * 
 * Este componente permite a los administradores visualizar y editar su propia información personal
 * con funcionalidades similares al componente de usuario regular pero con características administrativas.
 * Incluye autenticación específica para administradores y un formulario completo de edición.
 * 
 * Funcionalidades principales:
 * - Verificación de autenticación de administrador
 * - Carga automática de datos del administrador actual
 * - Formulario de edición con validaciones
 * - Cambio de contraseña con modal específico
 * - Actualización de información en base de datos
 * - Navegación de regreso al menú de administración
 * - Manejo de estados de carga y errores
 * 
 * @returns {JSX.Element} Componente de información y edición para administradores
 */

// Importa React y el hook useState para manejar el estado local
import React, { useState, useEffect } from "react";
// Importa los estilos CSS específicos para este componente de administrador
import "../estilos/InformacionUsuarioAdm.css";
// Importa los hooks de navegación y localización de rutas de React Router
import { useNavigate, useLocation } from "react-router-dom";
// Importa axios para hacer peticiones HTTP al backend
import axios from "axios";

// Exporta el componente funcional InformacionUsuarioAdm para administradores
export default function InformacionUsuarioAdm() {
  // Inicializa el hook de navegación para redirigir entre componentes
  const navigate = useNavigate();

  // ✅ Estados para el usuario administrador actual
  const [currentUser, setCurrentUser] = useState(null); // Datos del administrador logueado
  const [loading, setLoading] = useState(true); // Estado de carga inicial

  // ✅ URL base del backend para las peticiones HTTP
  const baseURL = "http://localhost:8000/";

  // Estado para controlar si los campos del formulario están en modo edición o solo lectura
  const [edit, setEdit] = useState(false);
  // Estado para mostrar mensajes temporales de éxito o error
  const [mensaje, setMensaje] = useState("");

  // ✅ NUEVO: Estados para el modal de cambio de contraseña
  const [modalPasswordOpen, setModalPasswordOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");

  // Estado para almacenar los datos del usuario
  const [datos, setDatos] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    fechaNacimiento: ""
  });

  // ✅ Función para obtener el token
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // ✅ Función para hacer peticiones autenticadas
  const authenticatedRequest = async (method, url, data = null) => {
    const token = getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const config = {
      method,
      url: `${baseURL}${url}`,
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    if (data) config.data = data;

    return axios(config);
  };

  // ✅ Verificar autenticación y cargar usuario actual
  const loadCurrentUser = () => {
    const token = getToken();
    const userData = localStorage.getItem('usuario');
    
    if (!token || !userData) {
      setMensaje("⚠️ Sesión expirada");
      setTimeout(() => navigate('/loginAdmin'), 2000);
      return;
    }

    try {
      const user = JSON.parse(userData);

      if (user.role !== 'admin') {
        setMensaje("⚠️ Acceso denegado: Solo administradores");
        setTimeout(() => logout(), 2000);
        return;
      }

      if (user.estado !== 'Activo') {
        setMensaje("⚠️ Cuenta inactiva");
        setTimeout(() => logout(), 2000);
        return;
      }

      setCurrentUser(user);
      setDatos({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        fechaNacimiento: user.fechaNacimiento ? user.fechaNacimiento.split('T')[0] : ""
      });

    } catch (error) {
      console.error('Error parseando datos de usuario:', error);
      setMensaje("⚠️ Error en datos de usuario");
      setTimeout(() => logout(), 2000);
    }
  };

  // ✅ Función de logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('userBasicInfo');
    setMensaje("✅ Sesión cerrada");
    setTimeout(() => navigate('/loginAdmin'), 1000);
  };

  // ✅ Cargar usuario al montar componente
  useEffect(() => {
    setLoading(true);
    loadCurrentUser();
    setLoading(false);
  }, []);

  // Maneja los cambios en los inputs del formulario
  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  // ✅ NUEVO: Maneja los cambios en los inputs del modal de contraseña
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setPasswordError(""); // Limpiar errores al escribir
  };

  // ✅ Función que guarda los cambios de información personal (MODIFICADA)
  const handleEditar = async () => {
    if (!currentUser) return;

    // Preparar datos para enviar
    const datosActualizados = {};
    
    if (datos.name.trim()) datosActualizados.name = datos.name.trim();
    if (datos.username.trim()) datosActualizados.username = datos.username.trim();
    if (datos.email.trim()) datosActualizados.email = datos.email.trim();
    if (datos.bio.trim()) datosActualizados.bio = datos.bio.trim();
    if (datos.fechaNacimiento) datosActualizados.fechaNacimiento = datos.fechaNacimiento;

    try {
      // ✅ Petición PATCH al endpoint correcto del backend
      const response = await authenticatedRequest('PATCH', `users/${currentUser.id}/infoPerfil`, datosActualizados);
      
      console.log('Usuario actualizado:', response.data);
      
      // Actualizar estado local con los datos devueltos por el backend
      const usuarioActualizado = {
        ...currentUser,
        ...response.data.user
      };
      
      setCurrentUser(usuarioActualizado);
      localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
      
      setEdit(false);
      setMensaje("✅ Información Actualizada");
      setTimeout(() => setMensaje(""), 3000);

    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      
      let mensajeError = "❌ Error al actualizar";
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error;
        
        if (status === 401) {
          mensajeError = "⚠️ No autorizado";
          setTimeout(() => logout(), 2000);
          return;
        } else if (status === 403) {
          mensajeError = "❌ No tienes permisos para realizar esta acción";
        } else if (status === 404) {
          mensajeError = "❌ Usuario no encontrado";
        } else if (status === 400) {
          mensajeError = message || "❌ Datos inválidos";
        } else {
          mensajeError = message || "❌ Error del servidor";
        }
      } else if (error.request) {
        mensajeError = "❌ Error de conexión con el servidor";
      }
      
      setMensaje(mensajeError);
      setTimeout(() => setMensaje(""), 3000);
    }
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
  const guardarCambioPassword = async () => {
    if (!currentUser) return;

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

    try {
      // ✅ Petición al endpoint de cambio de contraseña
      const response = await authenticatedRequest('PATCH', `users/${currentUser.id}/cambiarPassword`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      console.log('Contraseña actualizada:', response.data);
      
      setModalPasswordOpen(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setPasswordError("");
      
      setMensaje("✅ Contraseña actualizada exitosamente");
      setTimeout(() => setMensaje(""), 3000);

    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error;
        
        if (status === 400 && message.includes("actual")) {
          setPasswordError("Contraseña actual incorrecta");
        } else if (status === 401) {
          setPasswordError("No autorizado");
          setTimeout(() => logout(), 2000);
          return;
        } else {
          setPasswordError(message || "Error al cambiar contraseña");
        }
      } else {
        setPasswordError("Error de conexión con el servidor");
      }
    }
  };

  // ✅ Mostrar loading mientras verifica
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h2>🔄 Cargando información del administrador...</h2>
        </div>
      </div>
    );
  }

  // ✅ Si no hay usuario autenticado, no renderizar
  if (!currentUser) {
    return null;
  }

  // ✅ Validación de formulario
  const formularioValido = datos.name.trim() && datos.username.trim() && datos.email.trim();
  const passwordFormValido = passwordData.currentPassword.trim() && 
                             passwordData.newPassword.trim() && 
                             passwordData.confirmPassword.trim() &&
                             passwordData.newPassword === passwordData.confirmPassword;

  // Renderiza el formulario de información del usuario
  return (
    <div className="ad-info-usuario-container">
      {/* ✅ Mensaje temporal mejorado */}
      {mensaje && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: mensaje.includes('✅') ? '#d4edda' : '#f8d7da',
          color: mensaje.includes('✅') ? '#155724' : '#721c24',
          padding: '15px 20px',
          borderRadius: '5px',
          border: `1px solid ${mensaje.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
          zIndex: 1000,
          fontWeight: 'bold'
        }}>
          {mensaje}
        </div>
      )}

      {/* Título de la página */}
      <title>Mi cuenta - Administrador</title>
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
          <span className="usuario-nombre">
            {datos.name}
            <span style={{ fontSize: '0.8em', color: '#666', marginLeft: '5px' }}>
              (Admin)
            </span>
          </span>
          <span className="icono-avatar" role="img" aria-label="avatar">👤</span>
        </div>
      </header>
      {/* Cuerpo principal con los datos del usuario */}
      <main className="ad-info-usuario-main">
        {/* Lado izquierdo con nombre, avatar y campos básicos */}
        <div className="ad-info-usuario-left">
          <h1>Bienvenido {datos.name}</h1>
          <div className="ad-icono-grande">
            <span role="img" aria-label="avatar" style={{ fontSize: "5rem" }}>👤</span>
          </div>
          <div className="ad-info-campos">
            <label>Nombre:</label>
            <input
              type="text"
              name="name"
              value={datos.name}
              onChange={handleChange}
              disabled={!edit}
              className="ad-info-input"
              required
            />
            <label>Nombre de usuario:</label>
            <input
              type="text"
              name="username"
              value={datos.username}
              onChange={handleChange}
              disabled={!edit}
              className="ad-info-input"
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
              required
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
        <button className="ad-btn-regresar" onClick={() => navigate("/menu-administracion")}>
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
        <div className="modal-overlay" style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div className="modal" style={{
            background: "#fff", padding: "2rem", borderRadius: "10px", minWidth: "400px", maxWidth: "90vw", boxShadow: "0 2px 16px rgba(0,0,0,0.2)"
          }}>
            <h2>Cambiar Contraseña</h2>
            
            <label>Ingrese su contraseña actual:</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="ad-info-input"
              placeholder="Contraseña actual"
              style={{ marginBottom: "15px", width: "100%" }}
            />
            
            <label>Ingrese su contraseña nueva:</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="ad-info-input"
              placeholder="Nueva contraseña"
              style={{ marginBottom: "15px", width: "100%" }}
            />
            
            <label>Repita su contraseña nueva:</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="ad-info-input"
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
                className="ad-btn-regresar" 
                onClick={cancelarCambioPassword}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}