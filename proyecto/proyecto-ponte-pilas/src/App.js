import logo from './logo.svg';
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MenuUsuario from './componentes/MenuUsuario';
import InformacionUsuario from './componentes/InformacionUsuario';
import VisualizarReportes from './componentes/VisualizarReportes';
import './App.css';
import LoginAdmin from './componentes/LoginAdmin';
import CrearCuenta from "./componentes/CrearCuenta";
import RecuperarCuenta from "./componentes/RecuperarCuenta"

function App() {
  const [users, setUsers] = useState([
    { id: 1, name: "Admin", email: "admin@admin.com", pass: "admin" },
    { id: 2, name: "Usuario", email: "user@user.com", pass: "user" }
  ])
  const [state, setState] = useState({
    id: 0,
    nombre: "",
    email: "",
    pass: ""
  });
  const addUser = (newUser) => {
    setUsers((prev) => [...prev, newUser]);
  };

  const delUser = (index) => {
    console.log("Usuario seleccionado", index);
    setUsers((prev) =>
      prev.filter((users, i) => i !== index)
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/loginAdmin" element={<LoginAdmin 
        users={users}
        />} 
        />
        <Route path="/crearCuenta" element={<CrearCuenta />} />
        <Route path="/recuperarCuenta" element={<RecuperarCuenta />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
