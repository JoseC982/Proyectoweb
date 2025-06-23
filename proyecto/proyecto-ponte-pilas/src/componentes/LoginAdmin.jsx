// Importa React y el hook useState para manejar estados locales
import React, { useState } from "react";
// Importa useNavigate para redireccionar y Link para navegación entre rutas
import { useNavigate, Link } from "react-router-dom";
// Importa los estilos CSS específicos para este componente
import '../estilos/LoginAdmin.css';
// Importa imágenes utilizadas en el formulario
import policia from '../recursos/policia-logo.png';
import user_logo from '../recursos/user-logo.png';

// Componente funcional que recibe la función login como prop desde App.js
const LoginAdmin = ({ login }) => {
    const navigate = useNavigate(); // Hook para redireccionar entre rutas

    // Estado para mostrar/ocultar la contraseña
    const [showPassword, setShowPassword] = useState(false);
    // Estado para el email ingresado por el usuario
    const [email, setEmail] = useState('');
    // Estado para la contraseña ingresada por el usuario
    const [password, setPassword] = useState('');

    // Función que se ejecuta al hacer clic en "Iniciar sesión"
    const handleLogin = () => {
        const user = login(email, password); // Llama a la función login de App.js con los datos ingresados
        if (user) { // Si el usuario existe y las credenciales son correctas
            if (user.name === "Admin") { // Si el usuario es administrador
                navigate("/menu-administracion"); // Redirige al menú de administración
            } else {
                alert(`¡Bienvenido ${user.name}!`); // Muestra un mensaje de bienvenida
                navigate("/menuUsuario"); // Redirige al menú de usuario
            }
        } else {
            alert("No existe el usuario o la contraseña es incorrecta"); // Muestra error si las credenciales no coinciden
        }
    };

    // Renderizado del formulario de login
    return (
        <div className="login-admin-container">
            <title>Sign in</title>
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
                    <div className="button-container">
                        <button className="button" onClick={handleLogin}>
                            Iniciar sesión
                        </button>
                        <Link to="/">
                            <button className="button">Volver a Inicio</button>
                        </Link>
                        <span>
                            <Link to="/recuperarCuenta">¿Olvidaste tu contraseña?</Link>
                        </span>
                        <span>
                            ¿No tienes una cuenta? <Link to="/crearCuenta">Crear cuenta</Link>
                        </span>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default LoginAdmin;