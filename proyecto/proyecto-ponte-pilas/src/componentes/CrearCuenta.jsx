import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import '../estilos/LoginAdmin.css';
import policia from '../recursos/policia-logo.png';
import user_logo from '../recursos/user-logo.png';
import axios from "axios";

const CrearCuenta = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [fecha, setFecha] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');

    const handleRegister = () => {
        if (!name.trim() || !email.trim() || !password.trim() || fecha === "" || !username.trim()) {
            alert("Campos incompletos");
            return;
        }

        // Verifica si el correo ya existe
        axios.get(`http://localhost:3000/users?email=${email}`)
            .then(response => {
                if (response.data.length > 0) {
                    alert("Este correo ya fue usado para crear una cuenta, ingrese otro correo");
                } else {
                    // Si no existe, crea el usuario
                    axios.post("http://localhost:3000/users", {
                        name,
                        email,
                        pass: password,
                        role: "user",
                        estado: "Activo",
                        fechaNacimiento: fecha,
                        username,
                        bio
                    })
                        .then(() => {
                            alert("Usuario Creado Bienvenido");
                            navigate("/loginAdmin");
                        })
                        .catch(() => {
                            alert("Error al crear usuario");
                        });
                }
            })
            .catch(() => {
                alert("Error al verificar el correo");
            });
    };

    return (
        <div className="login-admin-container">
            <title>Registrate</title>
            <div className="left-side">
                <img
                    src={policia}
                    alt="Distrito Metropolitano de Quito"
                    className="la-logo"
                />
            </div>
            <div className="right-side">
                <section className="la-user-type">
                    <div className="la-user-logo-container">
                        <h1>Usuario</h1>
                        <img
                            src={user_logo}
                            alt="App Store"
                            className="la-user-logo"
                        />
                        <h1>Registrate</h1>
                    </div>
                    <div className="email-container">
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="input-text"
                        />
                    </div>
                    <div className="email-container">
                        <input
                            type="text"
                            placeholder="Nombre de usuario"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="input-text"
                        />
                    </div>
                    <div className="email-container">
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="input-text"
                        />
                    </div>
                    <div className="password-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Contraseña"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="input-text"
                        />
                        <button
                            type="button"
                            className="eye-button"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                    <div className="date-born-container">
                        <input
                            type="date"
                            placeholder="Fecha Nacimiento"
                            value={fecha}
                            onChange={e => setFecha(e.target.value)}
                            className="input-text"
                        />
                    </div>
                    <div className="email-container">
                        <textarea
                            placeholder="Biografía"
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                            className="input-text"
                            style={{ resize: "none", minHeight: "60px" }}
                        />
                    </div>
                    <div className="cu-button-container">
                        <button className="button" onClick={handleRegister}>
                            Crear Cuenta
                        </button>
                        <Link to="/loginAdmin">
                            <button className="button">Volver a Inicio</button>
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CrearCuenta;