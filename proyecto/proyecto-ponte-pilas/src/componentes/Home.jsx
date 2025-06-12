// Importa React para poder usar JSX y componentes funcionales
import React from 'react';
// Importa los estilos CSS específicos para la página Home
import '../estilos/Home.css'; // Para los estilos de la página
// Importa la imagen del logo de Quito
import quitologo from '../recursos/quito-logo.png'; // Importa la imagen del logo
// Importa la imagen del logo de Google Play (nota: el nombre del archivo parece tener un error tipográfico)
import playstorelogo from '../recursos/gplya-logo.png'; // Importa la imagen del logo
// Importa la imagen del logo de App Store
import App_Store_logo from '../recursos/appstore-logo.png'; // Importa la imagen del logo
// Importa la imagen del logo de usuario
import user_logo from '../recursos/user-logo.png'; // Importa la imagen del logo
// Importa el componente Link de react-router-dom para navegación interna
import { Link } from 'react-router-dom';

// Define el componente funcional Home
const Home = () => {
  // Devuelve el JSX que representa la estructura de la página
  return (
    // Contenedor principal con clase para estilos
    <div className="home-container">
      {/* Título de la página (esto no tiene efecto aquí, debería ir en el <head>) */}
      <title>Ponte Once</title>
      {/* Encabezado de la página */}
      <header className="header">
        {/* Sección izquierda del encabezado */}
        <div className="header-left">
          {/* Logo de Quito */}
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