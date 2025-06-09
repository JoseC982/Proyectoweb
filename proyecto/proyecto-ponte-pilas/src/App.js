import logo from './logo.svg';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './componentes/Home';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        {/* <Route path="/listausuarios" element={<Listausuarios usuarios={usuarios} />} />
        <Route path="/usuario" element={<Usuario />} />
        <Route path="/crearUsuario" element={
          <CrearUsuario 
          state={state} 
          setState={setState}
          agregarUsuario={agregarUsuario}
          />
          } /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
