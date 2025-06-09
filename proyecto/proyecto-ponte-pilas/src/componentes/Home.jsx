import React from 'react';
import '../estilos/Home.css'; // Para los estilos de la página
import quitologo from '../recursos/quito-logo.png'; // Importa la imagen del logo
import playstorelogo from '../recursos/gplya-logo.png'; // Importa la imagen del logo
import App_Store_logo from '../recursos/appstore-logo.png'; // Importa la imagen del logo

const Home = () => {
  return (
    <div className="home-container">
      <header className="header">
        <div className="header-left">
          <img
            src={quitologo}	
            alt="Distrito Metropolitano de Quito"
            className="logo"
          />
          <h1 className="title">Ponte once</h1>
        </div>

        <div className="header-right">
          <a href="https://play.google.com" className="store-link">
            <img
              src={playstorelogo}
              alt="Google Play"
              className="store-icon"
            />
          </a>
          <a href="https://www.apple.com/app-store/" className="store-link">
            <img
              src={App_Store_logo}
              alt="App Store"
              className="store-icon"
            />
          </a>
        </div>
      </header>

      <section className="main-content">
        <section className="description">
        <h2>¿Qué es Ponte once?</h2>
        <p>
          Es una aplicación móvil y web que permite una interacción más
          cercana entre la ciudadanía y los elementos de seguridad de una
          zona, para dar atención a solicitudes de apoyo ante una emergencia.
        </p>
      </section>

      <section className="user-type">
        <h3>Bienvenido</h3>
        <p>Tú eres...</p>
        <button className="button-admin">Administrador</button>
        <button className="button-user">Usuario</button>
      </section>
      </section>

      
    </div>
  );
};

export default Home;
