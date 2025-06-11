import React from 'react';
import GenerarReporte from './componentes/GenerarReporte';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MenuUsuario from './componentes/MenuUsuario';
import InformacionUsuario from './componentes/InformacionUsuario';
import VisualizarReportes from './componentes/VisualizarReportes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MenuUsuario />} />
        <Route path="/informacion" element={<InformacionUsuario />} />
        <Route path="/generar-reporte" element={<GenerarReporte />} />
        <Route path="/visualizar-reportes" element={<VisualizarReportes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
