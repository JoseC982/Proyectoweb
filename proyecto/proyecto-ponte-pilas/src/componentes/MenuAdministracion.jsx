// Importa los hooks de React y otros módulos necesarios
import React, { useState, useRef, useEffect } from "react";
// Importa los estilos CSS específicos para este componente
import "../estilos/MenuAdministracion.css";
// Importa la imagen de fondo del header
import LogFondo from "../recursos/MenuAdm/LogFondo.png";
// Importa la imagen para la opción de gestión de usuarios
import LogGestionUsuario from "../recursos/MenuAdm/LogGestionUsuario.png";
// Importa la imagen para la opción de notificaciones de alertas
import LogNotiAlerta from "../recursos/MenuAdm/LogNotiAlerta.png";
// Importa la imagen para la opción de validar alertas
import LogValidarAlerta from "../recursos/MenuAdm/LogValidarAlerta.png";
// Importa el hook para navegación entre rutas
import { useNavigate } from "react-router-dom";

// Componente funcional del menú de administración
const MenuAdministracion = ({users}) => {
  console.log(users); // Muestra el usuario actual en la consola
  // Hook para navegar entre rutas
  const navigate = useNavigate();
  // Estado para controlar si el menú de usuario está abierto o cerrado
  const [menuAbierto, setMenuAbierto] = useState(false);
  // Estado para mostrar mensajes temporales (ej: "Sesión Cerrada")
  const [mensaje, setMensaje] = useState("");
  // Referencia al contenedor del menú de usuario para detectar clics fuera
  const menuRef = useRef(null);

  // Función para manejar el cierre de sesión
  const handleCerrarSesion = () => {
    setMenuAbierto(false); // Cierra el menú
    setMensaje("Sesión Cerrada"); // Muestra mensaje temporal
    setTimeout(() => setMensaje(""), 2000); // Oculta mensaje después de 2 segundos
    navigate("/"); // Redirige a la página principal
  }

  // Efecto para cerrar el menú si se hace clic fuera de él
  useEffect(() => {
    // Función que detecta clics fuera del menú
    function handleClickOutside(event) {
      // Si el menú está abierto y el clic no fue dentro del menú, lo cierra
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAbierto(false);
      }
    }
    // Agrega el event listener al montar el componente
    document.addEventListener("mousedown", handleClickOutside);
    // Limpia el event listener al desmontar el componente
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Renderizado del componente
  return (
    // Contenedor principal del menú de administración
    <div className="menu-admin-fondo">
      {/* Si hay mensaje, lo muestra como mensaje flotante */}
      {mensaje && (
        <div className="mensaje-sesion-cerrada">{mensaje}</div>
      )}
      {/* Header superior con logo y menú de usuario */}
      <header className="menu-admin-header">
        <div className="menu-admin-logo">
          {/* Logo de la ciudad */}
          <img src={LogFondo} alt="Logo Quito" className="logo-quito" />
          {/* Título de la app */}
          <span className="ponte-once">
            <span className="ponte">¡PONTE</span> <span className="once">ONCE!</span>
          </span>
        </div>
        {/* Menú de usuario con nombre y opciones */}
        <div className="menu-admin-user" ref={menuRef}>
          <span className="icono-engranaje">⚙️</span>
          <span className="nombre-usuario">{users?.name}</span>
          {/* Botón para desplegar el menú de usuario */}
          <button
            className="icono-desplegar-btn"
            onClick={() => setMenuAbierto((v) => !v)}
            aria-label="Abrir menú de usuario"
          >
            <span className="icono-desplegar">▼</span>
          </button>
          {/* Menú desplegable de usuario */}
          {menuAbierto && (
            <div className="menu-desplegable-usuario">
              <button className="menu-item" onClick={() => { setMenuAbierto(false); navigate('/informacion-usuarioAdm'); }}>Mi cuenta</button>
              <button className="menu-item" onClick={() => {localStorage.removeItem("usuario"); navigate("/")}}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>
      {/* Cuerpo principal del menú de administración */}
      <main className="menu-admin-main">
        {/* Título principal */}
        <h1 className="menu-admin-titulo">Menú de Administrador</h1>
        {/* Opciones principales del menú de administración */}
        <div className="menu-admin-opciones">
          {/* Opción: Gestión de Usuarios */}
          <div className="opcion-admin">
            <button className="btn-opcion rojo-morado" onClick={() => navigate('/gestion-usuarios')}>Gestión de Usuarios</button>
            <img src={LogGestionUsuario} alt="Gestión de Usuarios" className="img-opcion" />
          </div>
          {/* Opción: Notificaciones de Alertas */}
          <div className="opcion-admin">
            <button className="btn-opcion rojo-morado" onClick={() => navigate('/notificaciones-alertas')}>Notificaciones de Alertas</button>
            <img src={LogNotiAlerta} alt="Notificaciones de Alertas" className="img-opcion" />
          </div>
          {/* Opción: Validar Alertas */}
          <div className="opcion-admin">
            <button className="btn-opcion rojo-morado" onClick={() => navigate('/validar-alertas')}>Validar Alertas</button>
            <img src={LogValidarAlerta} alt="Validar Alertas" className="img-opcion" />
          </div>
        </div>
      </main>
    </div>
  );
};

// Exporta el componente para su uso en otras partes de la app
export default MenuAdministracion;