/**
 * COMPONENTE HOME - PÁGINA DE INICIO
 * Landing page principal del sistema "Ponte Pilas"
 * 
 * Esta es la primera página que ven los usuarios al acceder al sistema.
 * Presenta información sobre la aplicación, sus características principales
 * y opciones para registrarse o acceder como administrador.
 * 
 * Funcionalidades:
 * - Presentación de la aplicación y sus beneficios
 * - Navegación hacia registro de usuario
 * - Acceso directo a login de administrador
 * - Links a tiendas de aplicaciones móviles
 * - Información de contacto y características del sistema
 */

// Importa React para poder usar JSX y componentes funcionales
import React from 'react';
// Importa los estilos CSS específicos para la página Home
import '../estilos/Home.css';
// Importa recursos gráficos necesarios para la interfaz
import quitologo from '../recursos/quito-logo.png';        // Logo del Municipio de Quito
import playstorelogo from '../recursos/gplya-logo.png';    // Logo de Google Play Store
import App_Store_logo from '../recursos/appstore-logo.png'; // Logo de Apple App Store
import user_logo from '../recursos/user-logo.png';         // Icono genérico de usuario
// Importa el componente Link para navegación sin recarga de página
import { Link } from 'react-router-dom';

/**
 * DEFINICIÓN DEL COMPONENTE HOME
 * Componente funcional que renderiza la página de inicio
 */
const Home = () => {
  /**
   * ESTRUCTURA JSX DE LA PÁGINA DE INICIO
   * Incluye header, sección principal, características y footer
   */
  return (
    // Contenedor principal de toda la página
    <div className="home-container">
      {/* NOTA: El elemento <title> no funciona aquí, debería manejarse con React Helmet */}
      <title>Ponte Once</title>
      
      {/* ========== ENCABEZADO DE LA PÁGINA ========== */}
      <header className="header">
        {/* Sección izquierda: Logo institucional */}
        <div className="header-left">
          <img
            src={quitologo}
            alt="Distrito Metropolitano de Quito"
            className="logo"
          />
          {/* Título principal */}
          <h1 className="title">Ponte once</h1>
        </div>
        {/* Sección derecha del encabezado */}
        <div className="header-right">
          {/* Texto indicando disponibilidad */}
          <h1 className="title-disponible">Disponible en</h1>
          {/* Enlace a Google Play */}
          <a href="https://play.google.com" className="store-link">
            <img
              src={playstorelogo}
              alt="Google Play"
              className="store-icon"
            />
          </a>
          {/* Enlace a App Store */}
          <a href="https://www.apple.com/app-store/" className="store-link">
            <img
              src={App_Store_logo}
              alt="App Store"
              className="store-icon"
            />
          </a>
        </div>
      </header>
      {/* Sección principal del contenido */}
      <section className="main-content">
        {/* Descripción de la aplicación */}
        <section className="description">
          <h2>¿Qué es Ponte once?</h2>
          <p>
            Es una aplicación móvil y web que permite una interacción más
            cercana entre la ciudadanía y los elementos de seguridad de una
            zona, para dar atención a solicitudes de apoyo ante una emergencia.
          </p>
        </section>
        {/* Sección para el tipo de usuario */}
        <section className="user-type">
          {/* Imagen de usuario (no tiene enlace funcional) */}
          <a>
            <img
              src={user_logo}
              alt="App Store"
              className="user-logo"
            />
          </a>
          {/* Mensaje de bienvenida */}
          <h3>Bienvenido</h3>
          {/* Botón de login que navega a /loginAdmin */}
          <Link to="/loginAdmin">
            <button className="button-admin">Login</button>
          </Link>
        </section>
      </section>
    </div>
  );
};

// Exporta el componente Home para que pueda ser usado en otros archivos
export default Home;