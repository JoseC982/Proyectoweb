// Importa React para poder usar JSX y componentes funcionales
import React from "react";
// Importa el hook useNavigate para navegar entre rutas
import { useNavigate } from "react-router-dom";
// Importa Link para navegación declarativa entre rutas
import { Link } from "react-router-dom";
// Importa los estilos CSS específicos para la página de login
import '../estilos/LoginAdmin.css'; // Para los estilos de la página
// Importa el hook useState para manejar el estado local del componente
import { useState } from "react";
// Importa la imagen del logo de la policía
import policia from '../recursos/policia-logo.png'; // Importa la imagen del logo
// Importa la imagen del logo de usuario
import user_logo from '../recursos/user-logo.png'; // Importa la imagen del logo
// Importa axios para hacer peticiones HTTP
import axios from "axios";

// Define el componente funcional LoginAdmin, recibe setUsers como prop para actualizar el usuario global
const LoginAdmin = ({ setUsers }) => {
    // Inicializa el hook de navegación
    const navigate = useNavigate();
    // Estado para mostrar/ocultar la contraseña
    const [showPassword, setShowPassword] = useState(false);
    // Estado para el campo de email
    const [email, setEmail] = useState('');
    // Estado para el campo de contraseña
    const [password, setPassword] = useState('');

    // Función que maneja el inicio de sesión
    const handleLogin = () => {
        // Muestra en consola el email ingresado (solo para depuración)
        console.log(email);
        // Realiza una petición GET para buscar el usuario por email y contraseña
        axios.get(`http://localhost:3000/users?email=${email}&pass=${password}`)
            .then(response => {
                // Obtiene la respuesta (array de usuarios encontrados)
                const users = response.data;
                // Si existe al menos un usuario con esas credenciales
                if (users.length > 0) {
                    // Toma el primer usuario encontrado
                    const user = users[0];
                    // Actualiza el estado global del usuario en App.js
                    setUsers(user);
                    // Guarda el usuario en localStorage para persistencia
                    localStorage.setItem("usuario", JSON.stringify(user));
                    // Si el usuario es administrador, navega al menú de administración
                    if (user.role === "admin") {
                        navigate("/menu-administracion");
                        // Muestra en consola el usuario enviado
                        console.log("Este es el usuario que envio al hijo", user)
                    } else {
                        // Si es usuario normal, muestra mensaje y navega al menú de usuario
                        console.log(users);
                        alert("¡Bienvenido (user)!");
                        navigate("/menuUsuario");
                        // Muestra en consola el usuario enviado
                        console.log("Este es el usuario que envio al hijo", user)
                    }
                } else {
                    // Si no existe el usuario, muestra alerta
                    alert("No existe el usuario");
                }
            })
            .catch(error => {
                // Si hay error en la petición, muestra alerta y el error en consola
                alert("Error al conectar con el servidor");
                console.error(error);
            });
    };

    // Renderiza el formulario de inicio de sesión
    return (
        <div className="login-admin-container">
            {/* Título de la página */}
            <title>Sing in</title>
            {/* Lado izquierdo con el logo */}
            <div className="left-side">
                <img
                    src={policia}
                    alt="Distrito Metropolitano de Quito"
                    className="la-logo"
                />
            </div>
            {/* Lado derecho con el formulario */}
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
                    {/* Campo para el email */}
                    <div className="email-container">
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="input-text"
                        />
                    </div>
                    {/* Campo para la contraseña */}
                    <div className="password-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Contraseña"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="input-text"
                        />
                        {/* Botón para mostrar/ocultar la contraseña */}
                        <button
                            type="button"
                            className="eye-button"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                    {/* Botones de acción y enlaces */}
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

// Exporta el componente LoginAdmin como predeterminado
export default LoginAdmin;