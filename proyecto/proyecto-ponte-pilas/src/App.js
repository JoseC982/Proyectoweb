import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MenuUsuario from './componentes/MenuUsuario';
import InformacionUsuario from './componentes/InformacionUsuario';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MenuUsuario />} />
        <Route path="/informacion" element={<InformacionUsuario />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
