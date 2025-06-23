import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import '../estilos/LoginAdmin.css'; // Para los estilos de la página
import { useState } from "react";
import policia from '../recursos/policia-logo.png'; // Importa la imagen del logo
import user_logo from '../recursos/user-logo.png'; // Importa la imagen del logo
import axios from "axios";

const LoginAdmin = ({ setUsers }) => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        console.log(email);
        axios.get(`http://localhost:3000/users?email=${email}&pass=${password}`)
            .then(response => {
                const users = response.data;
                if (users.length > 0) {
                    const user = users[0];
                    setUsers(user);
                    localStorage.setItem("usuario", JSON.stringify(user));
                    if (user.role === "admin") {
                        navigate("/menu-administracion");
                        console.log("Este es el usuario que envio al hijo", user)
                    } else {
                        console.log(users);
                        alert("¡Bienvenido (user)!");
                        navigate("/menuUsuario");
                        console.log("Este es el usuario que envio al hijo", user)

                    }
                } else {
                    alert("No existe el usuario");
                }
            })
            .catch(error => {
                alert("Error al conectar con el servidor");
                console.error(error);
            });
    };


    return (
        <div className="login-admin-container">
            <title>Sing in</title>
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
}
export default LoginAdmin;