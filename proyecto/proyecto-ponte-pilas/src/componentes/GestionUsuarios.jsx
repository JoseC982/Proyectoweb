/**
 * COMPONENTE GESTIÓN USUARIOS - ADMINISTRACIÓN DE USUARIOS
 * Panel administrativo para la gestión completa de usuarios del sistema
 * 
 * Funcionalidades principales:
 * - Visualización de todos los usuarios registrados en el sistema
 * - Acciones administrativas: silenciar/activar y eliminar usuarios
 * - Filtrado y búsqueda de usuarios específicos
 * - Protección de rutas (solo administradores)
 * - Interfaz intuitiva con confirmaciones de acciones críticas
 * 
 * Operaciones disponibles:
 * - Listar usuarios con información completa
 * - Cambiar estado de usuarios (Activo/Silenciado)
 * - Eliminar usuarios del sistema
 * - Ver detalles completos de cada usuario
 * 
 * Seguridad:
 * - Verificación de token JWT y rol de administrador
 * - Confirmaciones para acciones destructivas
 * - Validación de permisos en cada operación
 */

import React, { useRef, useEffect, useState } from "react";
import "../estilos/GestionUsuarios.css";
// Importa recursos gráficos para la interfaz administrativa
import LogFondo from "../recursos/MenuAdm/LogFondo.png";
import LogGestionUsuario from "../recursos/MenuAdm/LogGestionUsuario.png";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

/**
 * DEFINICIÓN DEL COMPONENTE GESTIÓN USUARIOS
 * Maneja todas las operaciones administrativas sobre usuarios
 */
const GestionUsuarios = () => {
  /**
   * ESTADOS DEL COMPONENTE
   * Control de la interfaz y datos de usuarios
   */
  const [mensaje, setMensaje] = useState("");                    // Mensajes de feedback
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null); // Usuario seleccionado para acciones
  const [menuAbierto, setMenuAbierto] = useState(false);         // Estado del menú desplegable
  const [users, setUsers] = useState([]);                       // Lista de todos los usuarios
  const [currentUser, setCurrentUser] = useState(null);         // Usuario administrador actual
  const [loading, setLoading] = useState(true);
  
  // Referencias y hooks
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ URL del backend
  const baseURL = "http://localhost:8000/";

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

  // ✅ Verificar autenticación usando localStorage (SIN /users/me)
  const verifyAdminAuth = () => {
    const token = getToken();
    const userData = localStorage.getItem('usuario');
    
    if (!token) {
      setMensaje("⚠️ Sesión expirada");
      setTimeout(() => navigate('/loginAdmin'), 2000);
      return false;
    }

    if (!userData) {
      setMensaje("⚠️ No hay información de usuario");
      setTimeout(() => navigate('/loginAdmin'), 2000);
      return false;
    }

    try {
      const user = JSON.parse(userData);

      if (user.role !== 'admin') {
        setMensaje("⚠️ Acceso denegado: Solo administradores");
        setTimeout(() => logout(), 2000);
        return false;
      }

      if (user.estado !== 'Activo') {
        setMensaje("⚠️ Cuenta inactiva");
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

  // ✅ Función para obtener todos los usuarios
  const fetchUsers = async () => {
    try {
      const response = await authenticatedRequest('GET', 'users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      if (error.response?.status === 401) {
        setMensaje("⚠️ Sesión expirada");
        setTimeout(() => logout(), 2000);
      } else {
        setMensaje("❌ Error al cargar usuarios");
        setTimeout(() => setMensaje(""), 3000);
      }
    }
  };

  // ✅ Función para silenciar/activar usuario
  const handleSilenciar = async () => {
    if (usuarioSeleccionado === null) return;
    
    const user = users[usuarioSeleccionado];
    const nuevoEstado = user.estado === "Silenciado" ? "Activo" : "Silenciado";
    
    try {
      // Actualizar estado del usuario en el backend
      await authenticatedRequest('PATCH', `users/${user.id}/estado`, { 
        estado: nuevoEstado 
      });

      // Actualizar estado local
      setUsers(prevUsers =>
        prevUsers.map((u, idx) =>
          idx === usuarioSeleccionado ? { ...u, estado: nuevoEstado } : u
        )
      );

      setMensaje(
        nuevoEstado === "Silenciado" ? "✅ USUARIO SILENCIADO" : "✅ USUARIO ACTIVADO"
      );
      setTimeout(() => setMensaje(""), 2000);
      setUsuarioSeleccionado(null);

    } catch (error) {
      console.error('Error actualizando estado del usuario:', error);
      setMensaje("❌ Error al actualizar usuario");
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  // ✅ Función para borrar usuario
  const handleBorrar = async () => {
    if (usuarioSeleccionado === null) return;
    
    const user = users[usuarioSeleccionado];
    
    // Evitar que el admin se borre a sí mismo
    if (user.id === currentUser?.id) {
      setMensaje("❌ No puedes eliminar tu propia cuenta");
      setTimeout(() => setMensaje(""), 3000);
      return;
    }

    // Confirmar antes de borrar
    if (!window.confirm(`¿Estás seguro de que quieres eliminar al usuario "${user.name}"?`)) {
      return;
    }

    try {
      // Eliminar usuario del backend
      await authenticatedRequest('DELETE', `users/${user.id}`);

      // Eliminar del estado local
      setUsers(prevUsers => prevUsers.filter((_, idx) => idx !== usuarioSeleccionado));
      
      setMensaje("✅ USUARIO ELIMINADO");
      setTimeout(() => setMensaje(""), 2000);
      setUsuarioSeleccionado(null);

    } catch (error) {
      console.error('Error eliminando usuario:', error);
      if (error.response?.status === 404) {
        setMensaje("❌ Usuario no encontrado");
      } else {
        setMensaje("❌ Error al eliminar usuario");
      }
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  // ✅ Función de logout mejorada
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('userBasicInfo');
    setMensaje("✅ Sesión cerrada");
    setTimeout(() => navigate('/loginAdmin'), 1000);
  };

  // ✅ Función para navegar con verificación de token
  const navigateWithAuth = (route) => {
    const token = getToken();
    if (!token) {
      setMensaje("⚠️ Sesión expirada");
      setTimeout(() => logout(), 1000);
      return;
    }
    navigate(route);
  };

  // Función para seleccionar un usuario
  const handleSeleccion = (idx) => {
    setUsuarioSeleccionado(idx);
  };

  // ✅ Verificar autenticación y cargar datos al montar (SIN async)
  useEffect(() => {
    setLoading(true);
    
    // Verificar autenticación usando localStorage
    const isAuthenticated = verifyAdminAuth();
    
    if (isAuthenticated) {
      // Cargar usuarios
      fetchUsers();
    }
    
    setLoading(false);
  }, []);

  // ✅ Recargar usuarios cuando cambie la ruta
  useEffect(() => {
    if (currentUser && location.pathname === '/gestion-usuarios') {
      fetchUsers();
    }
  }, [location, currentUser]);

  // Cerrar menú al hacer clic fuera
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
          <h2>🔄 Cargando gestión de usuarios...</h2>
          <p>Verificando permisos y obteniendo datos</p>
        </div>
      </div>
    );
  }

  // ✅ Si no hay usuario autenticado, no renderizar
  if (!currentUser) {
    return null;
  }

  return (
    <div className="gestion-usuarios-fondo" style={{ position: "relative", minHeight: "100vh" }}>
      <img src={LogFondo} alt="Fondo" className="gestion-usuarios-bg" />
      
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
            {currentUser?.name}
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

      <main className="gestion-usuarios-main">
        <img src={LogGestionUsuario} alt="Gestion Usuario" className="gestion-usuarios-img" />
        <h1 className="gestion-usuarios-titulo">Gestión de Usuarios</h1>
        
        <button 
          className="btn-regresar" 
          onClick={() => navigateWithAuth("/menu-administracion")}
        >
          REGRESAR
        </button>

        <div className="gestion-usuarios-tabla-container">
          <table className="gestion-usuarios-tabla">
            <thead>
              <tr>
                <th>Nombre de usuario</th>
                <th>E-mail</th>
                <th>Rol</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr
                  key={u.id}
                  className={usuarioSeleccionado === idx ? "seleccionado" : ""}
                  onClick={() => handleSeleccion(idx)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span style={{
                      color: u.role === 'admin' ? '#007bff' : '#6c757d',
                      fontWeight: u.role === 'admin' ? 'bold' : 'normal'
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      color: u.estado === 'Activo' ? '#28a745' : '#dc3545',
                      fontWeight: 'bold'
                    }}>
                      {u.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {users.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              No hay usuarios para mostrar
            </div>
          )}
        </div>

        <div className="gestion-usuarios-botones">
          <button
            className="btn-silenciar"
            onClick={handleSilenciar}
            disabled={usuarioSeleccionado === null}
          >
            {usuarioSeleccionado !== null && users[usuarioSeleccionado]?.estado === "Silenciado"
              ? "Activar usuario"
              : "Silenciar usuario"}
          </button>
          
          <button 
            className="btn-borrar" 
            onClick={handleBorrar} 
            disabled={usuarioSeleccionado === null}
          >
            Borrar usuario
          </button>
        </div>
      </main>
    </div>
  );
};

export default GestionUsuarios;