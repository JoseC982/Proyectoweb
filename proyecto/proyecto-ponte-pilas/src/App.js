import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

  // Estado para usuarios y usuario logueado
  const [users, setUsers] = useState([]);
  const [usuarioActual, setUsuarioActual] = useState(null);

  // CRUD: Obtener usuarios al iniciar
  useEffect(() => {
    axios.get('http://localhost:3000/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  // CRUD: Crear usuario
  const crearUsuario = (nuevoUsuario) => {
    return axios.post('http://localhost:3000/users', nuevoUsuario)
      .then(res => setUsers(prev => [...prev, res.data]));
  };

  // CRUD: Actualizar usuario
const actualizarUsuario = (id, datos) => {
  axios.put(`http://localhost:3000/users/${id}`, datos)
    .then(res => {
      setUsers(prev => prev.map(u => u.id === id ? res.data : u));
      // Si el usuario editado es el logueado, actualiza usuarioActual
      if (usuarioActual && usuarioActual.id === id) {
        setUsuarioActual(res.data);
      }
    })
    .catch(err => {
      console.error("Error actualizando usuario:", err);
    });
};

  // CRUD: Eliminar usuario
  const eliminarUsuario = (id) => {
    return axios.delete(`http://localhost:3000/users/${id}`)
      .then(() => setUsers(prev => prev.filter(u => u.id !== id)));
  };

  // Función para login y setear usuario actual
  const login = (email, pass) => {
  const user = users.find(u => u.email === email && u.pass === pass);
  if (user) setUsuarioActual(user);
  return user;
};

  // Función para logout
  const logout = () => setUsuarioActual(null);


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/menuUsuario" element={<MenuUsuario usuarioActual={usuarioActual} logout={logout} />} />
        <Route path="/informacion" element={<InformacionUsuario usuarioActual={usuarioActual} actualizarUsuario={actualizarUsuario} />} />
        <Route path="/generar-reporte" element={<GenerarReporte />} />
        <Route path="/visualizar-reportes" element={<VisualizarReportes/>}/>

        <Route path="/" element={<Home />} />
        <Route path="/loginAdmin" element={  <LoginAdmin login={login} />} />
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
