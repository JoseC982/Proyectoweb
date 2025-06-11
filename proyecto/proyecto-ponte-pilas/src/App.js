import logo from './logo.svg';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './componentes/Home';
import './App.css';
import LoginAdmin from './componentes/LoginAdmin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/loginAdmin" element={<LoginAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
