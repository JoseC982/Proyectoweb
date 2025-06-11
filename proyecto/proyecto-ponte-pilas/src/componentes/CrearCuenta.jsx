import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import '../estilos/LoginAdmin.css'; // Para los estilos de la página
import { useState } from "react";
import policia from '../recursos/policia-logo.png'; // Importa la imagen del logo
import user_logo from '../recursos/user-logo.png'; // Importa la imagen del logo

const CrearCuenta = ({ users }) => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [fecha, setFecha] = useState('');

    const handleLogin = () => {
        if (!name.trim() || !email.trim() || !password.trim() || fecha === "") {
            alert("Campos incompletos");
            return;
        }

        alert("Usuario Creado Bienvenido");
        navigate("/loginAdmin");
    };



    const handleLogout = () => {
        // Aquí puedes agregar la lógica de cierre de sesión
        // Por ahora, simplemente redirigimos al usuario a la página de inicio
        navigate("/home");
    }

    return (
        <div className="login-admin-container">
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
                        <h1>¡Bienvenido de nuevo!</h1>
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

                    <div className="button-container">
                        <button className="button" onClick={handleLogin}>
                            Crear Cuenta
                        </button>
                        <Link to="/home">
                            <button className="button">Volver a Inicio</button>
                        </Link>

                    </div>
                </section>
            </div>
        </div>
    );
}
export default CrearCuenta;