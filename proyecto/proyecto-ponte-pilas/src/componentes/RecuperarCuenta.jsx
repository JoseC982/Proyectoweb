import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import '../estilos/LoginAdmin.css'; // Para los estilos de la página
import { useState } from "react";
import policia from '../recursos/policia-logo.png'; // Importa la imagen del logo
import user_logo from '../recursos/user-logo.png'; // Importa la imagen del logo

const RecuperarCuenta = ({ users }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const handleLogin = () => {
        if (!email.trim()) {
            alert("Campos incompletos");
            return;
        }

        alert("Revisa Tu Correo");
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
                        <span>Escribe tu correo electronico</span>
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="input-text"
                        />
                    </div>
                    <div className="button-container">
                        <button className="button" onClick={handleLogin}>
                            Recuperar Cuenta
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
export default RecuperarCuenta;