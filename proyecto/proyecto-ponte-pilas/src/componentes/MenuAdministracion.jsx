import React, { useState, useRef, useEffect } from "react";
import "../estilos/MenuAdministracion.css";
import LogFondo from "../recursos/MenuAdm/LogFondo.png";
import LogGestionUsuario from "../recursos/MenuAdm/LogGestionUsuario.png";
import LogNotiAlerta from "../recursos/MenuAdm/LogNotiAlerta.png";
import LogValidarAlerta from "../recursos/MenuAdm/LogValidarAlerta.png";
import { useNavigate } from "react-router-dom";

const MenuAdministracion = ({users}) => {
  console.log(users);
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const menuRef = useRef(null);

  // ✅ Validar que el usuario sea admin y esté autenticado
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Verificar que hay token
    if (!token) {
      setMensaje("⚠️ Sesión expirada");
      setTimeout(() => {
        navigate('/loginAdmin');
      }, 2000);
      return;
    }

    // Verificar que hay usuario
    if (!users) {
      setMensaje("⚠️ Error: No hay información de usuario");
      setTimeout(() => {
        navigate('/loginAdmin');
      }, 2000);
      return;
    }

    // Verificar que es admin
    if (users.role !== 'admin') {
      setMensaje("⚠️ Acceso denegado: Solo administradores");
      setTimeout(() => {
        logout();
      }, 2000);
      return;
    }

    // Verificar que está activo
    if (users.estado !== 'Activo') {
      setMensaje("⚠️ Cuenta inactiva");
      setTimeout(() => {
        logout();
      }, 2000);
      return;
    }

  }, [users, navigate]);

  // ✅ Función de logout mejorada
  const logout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    setMensaje("✅ Sesión cerrada");
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  // ✅ Función para navegar con verificación de token
  const navigateWithAuth = (route) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMensaje("⚠️ Sesión expirada");
      setTimeout(() => logout(), 1000);
      return;
    }
    navigate(route);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAbierto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Si no hay usuario válido, no renderizar
  if (!users || users.role !== 'admin') {
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
          <h2>🔄 Verificando permisos...</h2>
          {mensaje && <p style={{color: 'red'}}>{mensaje}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="menu-admin-fondo">
      {/* Mensaje flotante */}
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

      <header className="menu-admin-header">
        <div className="menu-admin-logo">
          <img src={LogFondo} alt="Logo Quito" className="logo-quito" />
          <span className="ponte-once">
            <span className="ponte">¡PONTE</span> <span className="once">ONCE!</span>
          </span>
        </div>
        
        <div className="menu-admin-user" ref={menuRef}>
          <span className="icono-engranaje">⚙️</span>
          <span className="nombre-usuario">
            {users?.name}
            <span style={{ fontSize: '0.8em', color: '#666', marginLeft: '5px' }}>
              (Admin)
            </span>
          </span>
          
          <button
            className="icono-desplegar-btn"
            onClick={() => setMenuAbierto((v) => !v)}
            aria-label="Abrir menú de usuario"
          >
            <span className="icono-desplegar">▼</span>
          </button>

          {menuAbierto && (
            <div className="menu-desplegable-usuario">
              <button 
                className="menu-item" 
                onClick={() => { 
                  setMenuAbierto(false); 
                  navigateWithAuth('/informacion-usuarioAdm'); 
                }}
              >
                Mi cuenta
              </button>
              <button 
                className="menu-item" 
                onClick={() => {
                  setMenuAbierto(false);
                  logout();
                }}
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="menu-admin-main">
        <h1 className="menu-admin-titulo">
          Menú de Administrador
          <span style={{ 
            fontSize: '0.6em', 
            color: '#666', 
            display: 'block', 
            fontWeight: 'normal' 
          }}>
            Bienvenido, {users.name}
          </span>
        </h1>

        <div className="menu-admin-opciones">
          <div className="opcion-admin">
            <button 
              className="btn-opcion rojo-morado" 
              onClick={() => navigateWithAuth('/gestion-usuarios')}
            >
              Gestión de Usuarios
            </button>
            <img src={LogGestionUsuario} alt="Gestión de Usuarios" className="img-opcion" />
          </div>

          <div className="opcion-admin">
            <button 
              className="btn-opcion rojo-morado" 
              onClick={() => navigateWithAuth('/notificaciones-alertas')}
            >
              Notificaciones de Alertas
            </button>
            <img src={LogNotiAlerta} alt="Notificaciones de Alertas" className="img-opcion" />
          </div>

          <div className="opcion-admin">
            <button 
              className="btn-opcion rojo-morado" 
              onClick={() => navigateWithAuth('/validar-alertas')}
            >
              Validar Alertas
            </button>
            <img src={LogValidarAlerta} alt="Validar Alertas" className="img-opcion" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MenuAdministracion;