// Importa React y el hook useState para manejar el estado local
import React, { useState } from 'react';
// Importa los componentes necesarios de react-router-dom para el enrutamiento
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Importa los componentes de la aplicación
import MenuUsuario from './componentes/MenuUsuario';
import InformacionUsuario from './componentes/InformacionUsuario';
import VisualizarReportes from './componentes/VisualizarReportes';
import GenerarReporte from './componentes/GenerarReporte';
import './App.css'; // Importa los estilos globales de la app
import LoginAdmin from './componentes/LoginAdmin';
import CrearCuenta from "./componentes/CrearCuenta";
import RecuperarCuenta from "./componentes/RecuperarCuenta";
import Home from "./componentes/Home";
import MenuAdministracion from './componentes/MenuAdministracion';
import GestionUsuarios from './componentes/GestionUsuarios';
import NotificacionesAlertas from './componentes/NotificacionesAlertas';
import ValidarAlertas from './componentes/ValidarAlertas';
import InformacionUsuarioAdm from './componentes/InformacionUsuarioAdm';

// Define el componente principal App
function App() {

  // Estado global para el usuario autenticado.
  // Se inicializa leyendo el usuario guardado en localStorage (si existe).
  const [users, setUsers] = useState(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });

  // Renderiza el enrutador principal de la aplicación
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta para el menú de usuario, pasa el usuario autenticado como prop */}
        <Route path="/menuUsuario" element={<MenuUsuario users={users} />} />
        {/* Ruta para la información del usuario, pasa el usuario y el setter como props */}
        <Route path="/informacion" element={<InformacionUsuario users={users} setUsers={setUsers} />} />
        {/* Ruta para generar un reporte */}
        <Route path="/generar-reporte" element={<GenerarReporte />} />
        {/* Ruta para visualizar reportes */}
        <Route path="/visualizar-reportes" element={<VisualizarReportes />} />

        {/* Ruta para la página de inicio */}
        <Route path="/" element={<Home />} />
        {/* Ruta para el login de administrador, pasa el setter de usuario como prop */}
        <Route path="/loginAdmin" element={<LoginAdmin setUsers={setUsers} />} />
        {/* Ruta para crear una cuenta */}
        <Route path="/crearCuenta" element={<CrearCuenta />} />
        {/* Ruta para recuperar cuenta */}
        <Route path="/recuperarCuenta" element={<RecuperarCuenta />} />
        {/* Ruta para el menú de administración */}
        <Route path="/menu-administracion" element={<MenuAdministracion />} />
        {/* Ruta para la gestión de usuarios */}
        <Route path="/gestion-usuarios" element={<GestionUsuarios />} />
        {/* Ruta para notificaciones y alertas */}
        <Route path="/notificaciones-alertas" element={<NotificacionesAlertas />} />
        {/* Ruta para validar alertas */}
        <Route path="/validar-alertas" element={<ValidarAlertas />} />
        {/* Ruta para la información del usuario administrador */}
        <Route path="/informacion-usuarioAdm" element={<InformacionUsuarioAdm />} />
      </Routes>
    </BrowserRouter>
  );
}

// Exporta el componente App como predeterminado
export default App;