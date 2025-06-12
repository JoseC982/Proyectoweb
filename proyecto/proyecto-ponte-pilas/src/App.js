import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './componentes/Home';
import MenuAdministracion from './componentes/MenuAdministracion';
import GestionUsuarios from './componentes/GestionUsuarios';
import NotificacionesAlertas from './componentes/NotificacionesAlertas';
import ValidarAlertas from './componentes/ValidarAlertas';
import InformacionUsuarioAdm from './componentes/InformacionUsuarioAdm';
import './App.css';

function App() {
    
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
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
