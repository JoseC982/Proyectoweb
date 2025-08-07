import React, { useState, useEffect } from "react";
// Importa los estilos CSS para este componente
import "../estilos/GenerarReporte.css";
// Importa los hooks de React Router para navegación y para obtener el estado enviado por la ruta
import { useLocation, useNavigate } from "react-router-dom";
// Importa axios para hacer peticiones HTTP
import axios from "axios";

// Componente principal para generar un reporte
export default function GenerarReporte() {
  // Obtiene la información pasada por navegación (el reporte seleccionado)
  const location = useLocation();
  // Hook para navegar entre páginas
  const navigate = useNavigate();
  // Extrae el reporte seleccionado del estado de navegación
  const reporte = location.state?.reporte;

  // ✅ NUEVO: Estados para verificación de autenticación
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Estado para la descripción del incidente (input controlado)
  const [descripcion, setDescripcion] = useState("");
  // Estado para la ubicación registrada (input controlado)
  const [ubicacion, setUbicacion] = useState("");
  // Estado para la hora del incidente (input controlado)
  const [hora, setHora] = useState("");
  // Estado para mostrar mensajes temporales (ej: "Reporte Generado")
  const [mensaje, setMensaje] = useState("");

  // ✅ NUEVO: Estados para integración con backend
  const [enviandoReporte, setEnviandoReporte] = useState(false);

  // ✅ URL base del backend
  const baseURL = "http://172.29.41.39:8000/";

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

  // ✅ Función de logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('userBasicInfo');
    setMensaje("✅ Sesión cerrada");
    setTimeout(() => navigate('/login'), 1000);
  };

  // ✅ Verificar autenticación usando localStorage
  const verifyUserAuth = () => {
    const token = getToken();
    const userData = localStorage.getItem('usuario');
    
    if (!token) {
      setMensaje("⚠️ Sesión expirada - Debe iniciar sesión");
      setTimeout(() => navigate('/login'), 2000);
      return false;
    }

    if (!userData) {
      setMensaje("⚠️ No hay información de usuario");
      setTimeout(() => navigate('/login'), 2000);
      return false;
    }

    try {
      const user = JSON.parse(userData);

      // Verificar que sea un usuario normal (no admin)
      if (user.role === 'admin') {
        setMensaje("⚠️ Los administradores deben usar el panel de administración");
        setTimeout(() => navigate('/loginAdmin'), 2000);
        return false;
      }

      if (user.estado !== 'Activo') {
        setMensaje("⚠️ Cuenta inactiva o suspendida");
        setTimeout(() => logout(), 2000);
        return false;
      }

      setCurrentUser(user);
      return true;
    } catch (error) {
      console.error('Error parseando datos de usuario:', error);
      setMensaje("⚠️ Error en datos de usuario");
      setTimeout(() => logout(), 2000);
      return false;
    }
  };

  // ✅ Verificar autenticación al cargar componente
  useEffect(() => {
    const checkAuth = () => {
      setLoading(true);
      
      const isAuthenticated = verifyUserAuth();
      setAuthenticated(isAuthenticated);
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  // ✅ Verificar si hay reporte seleccionado después de autenticación
  useEffect(() => {
    if (authenticated && !reporte) {
      setMensaje("⚠️ No hay tipo de reporte seleccionado");
      setTimeout(() => navigate("/menuUsuario"), 2000);
    }
  }, [authenticated, reporte, navigate]);

  // ✅ Función que maneja el envío del formulario (MEJORADA para backend)
  const handleGenerar = async () => {
    if (!currentUser || !reporte) {
      setMensaje("❌ Error: Faltan datos necesarios");
      setTimeout(() => setMensaje(""), 3000);
      return;
    }

    setEnviandoReporte(true);

    try {
      // Obtener fecha actual
      const fechaActual = new Date().toISOString().split('T')[0];

      // Preparar datos del reporte
      const datosReporte = {
        userId: currentUser.id,
        incidentTypeId: reporte.id, // ID del tipo de incidente seleccionado
        description: descripcion.trim(),
        location: ubicacion.trim(),
        date: fechaActual,
        time: hora,
        status: 'nuevo'
      };

      console.log('Enviando reporte:', datosReporte);

      // ✅ Enviar reporte al backend
      const response = await authenticatedRequest('POST', 'reports/create', datosReporte);
      
      console.log('Reporte creado:', response.data);

      setMensaje("✅ Reporte Generado Exitosamente");
      
      // Limpiar formulario
      setDescripcion("");
      setUbicacion("");
      setHora("");
      
      // Regresar al menú después de 2 segundos
      setTimeout(() => {
        setMensaje("");
        navigate("/menuUsuario");
      }, 2000);

    } catch (error) {
      console.error('Error al generar reporte:', error);
      
      let mensajeError = "❌ Error al generar reporte";
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error;
        
        if (status === 401) {
          mensajeError = "⚠️ Sesión expirada";
          setTimeout(() => logout(), 2000);
        } else if (status === 400) {
          mensajeError = message || "❌ Datos inválidos";
        } else if (status === 404) {
          mensajeError = "❌ Tipo de incidente no encontrado";
        } else {
          mensajeError = message || "❌ Error del servidor";
        }
      } else if (error.request) {
        mensajeError = "❌ Error de conexión con el servidor";
      }
      
      setMensaje(mensajeError);
      setTimeout(() => setMensaje(""), 3000);
    } finally {
      setEnviandoReporte(false);
    }
  };

  // Función que maneja el botón "Cancelar"
  const handleCancelar = () => {
    // Regresa al menú principal sin guardar nada
    navigate("/menuUsuario");
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
          <h2>🔄 Verificando sesión...</h2>
          <p>Comprobando credenciales de usuario</p>
        </div>
      </div>
    );
  }

  // ✅ Si no está autenticado, no renderizar nada (ya se redirigió)
  if (!authenticated || !currentUser) {
    return null;
  }

  // ✅ Si no hay reporte seleccionado, no renderizar (ya se redirigió)
  if (!reporte) {
    return null;
  }

  // ✅ Validación del formulario
  const formularioValido = descripcion.trim() && ubicacion.trim() && hora;

  // Renderizado del componente
  return (
    <div className="generar-reporte-container">
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

      <title>Generar Reporte</title>
      {/* Header superior con logo y usuario */}
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
          <span className="usuario-nombre">{currentUser.name}</span>
          <span className="icono-avatar" role="img" aria-label="avatar">👤</span>
        </div>
      </header>
      {/* Cuerpo principal dividido en dos columnas */}
      <main className="generar-reporte-main">
        {/* Columna izquierda: cuadro para el mapa (placeholder) */}
        <section className="mapa-section">
          <div className="mapa-placeholder">
            {/* Aquí se integrará la API de Google Maps en el futuro */}
            Aquí va la API de google maps
          </div>
        </section>
        {/* Columna derecha: formulario para ingresar los datos del reporte */}
        <section className="form-section">
          <div className="reporte-info">
            {/* Muestra el tipo de reporte seleccionado con su icono y texto */}
            <div className="reporte-tipo">
              <img src={reporte.icon} alt={reporte.type || reporte.texto} className="icono-reporte" />
              <span className="texto-reporte">{reporte.type || reporte.texto}</span>
            </div>
          </div>
          {/* Formulario para ingresar los datos del reporte */}
          <form
            className="formulario-reporte"
            onSubmit={e => {
              e.preventDefault(); // Evita recargar la página
              handleGenerar();    // Llama a la función para generar el reporte
            }}
          >
            {/* Campo para la descripción del incidente */}
            <label>Descripción del incidente</label>
            <textarea
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              required
              className="input-descripcion"
              placeholder="Describe el incidente..."
              disabled={enviandoReporte}
            />
            {/* Campo para la ubicación registrada */}
            <label>Ubicación Registrada</label>
            <input
              type="text"
              value={ubicacion}
              onChange={e => setUbicacion(e.target.value)}
              required
              className="input-ubicacion"
              placeholder="Ej: Avenida 12 de octubre y Ejido"
              disabled={enviandoReporte}
            />
            {/* Campo para la hora del incidente */}
            <label>Hora del incidente</label>
            <input
              type="time"
              value={hora}
              onChange={e => setHora(e.target.value)}
              required
              className="input-hora"
              disabled={enviandoReporte}
            />
            {/* Botones para generar o cancelar el reporte */}
            <div className="botones-reporte">
              <button 
                type="submit" 
                className="btn-generar"
                disabled={!formularioValido || enviandoReporte}
              >
                {enviandoReporte ? "ENVIANDO..." : "GENERAR"}
              </button>
              <button 
                type="button" 
                className="btn-cancelar" 
                onClick={handleCancelar}
                disabled={enviandoReporte}
              >
                CANCELAR
              </button>
            </div>
          </form>
          
          {/* ✅ Validación visual */}
          {!formularioValido && (
            <div style={{ color: "red", textAlign: "center", marginTop: "10px", fontSize: "0.9em" }}>
              Todos los campos son obligatorios
            </div>
          )}
        </section>
      </main>
    </div>
  );
}