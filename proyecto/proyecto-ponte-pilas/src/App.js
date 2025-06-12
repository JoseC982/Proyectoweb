import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MenuUsuario from './componentes/MenuUsuario';
import InformacionUsuario from './componentes/InformacionUsuario';
import VisualizarReportes from './componentes/VisualizarReportes';
import GenerarReporte from './componentes/GenerarReporte';
import './App.css';
import LoginAdmin from './componentes/LoginAdmin';
import CrearCuenta from "./componentes/CrearCuenta";
import RecuperarCuenta from "./componentes/RecuperarCuenta";
import Home from "./componentes/Home";
import MenuAdministracion from './componentes/MenuAdministracion';
import GestionUsuarios from './componentes/GestionUsuarios';
import NotificacionesAlertas from './componentes/NotificacionesAlertas';
import ValidarAlertas from './componentes/ValidarAlertas';
import InformacionUsuarioAdm from './componentes/InformacionUsuarioAdm';

function App() {

  const [users, setUsers] = useState([
    { id: 1, name: "Admin", email: "admin@admin.com", pass: "admin" },
    { id: 2, name: "Usuario", email: "user@user.com", pass: "user" }
  ])


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/menuUsuario" element={<MenuUsuario />} />
        <Route path="/informacion" element={<InformacionUsuario />} />
        <Route path="/generar-reporte" element={<GenerarReporte />} />
        <Route path="/visualizar-reportes" element={<VisualizarReportes/>}/>

        <Route path="/" element={<Home />} />
        <Route path="/loginAdmin" element={<LoginAdmin 
        users={users}
        />} 
        />
        <Route path="/crearCuenta" element={<CrearCuenta />} />
        <Route path="/recuperarCuenta" element={<RecuperarCuenta />} />
        <Route path="/menu-administracion" element={<MenuAdministracion />} />
        <Route path="/gestion-usuarios" element={<GestionUsuarios />} />
        <Route path="/notificaciones-alertas" element={<NotificacionesAlertas />} />
        <Route path="/validar-alertas" element={<ValidarAlertas />} />
        <Route path="/informacion-usuarioAdm" element={<InformacionUsuarioAdm />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
