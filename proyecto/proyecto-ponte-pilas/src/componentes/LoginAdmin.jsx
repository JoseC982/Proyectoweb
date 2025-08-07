/**
 * COMPONENTE LOGIN ADMIN - AUTENTICACIÓN DE USUARIOS
 * Formulario de login para administradores y usuarios regulares
 * 
 * Funcionalidades principales:
 * - Autenticación con email y contraseña
 * - Manejo de tokens JWT para sesiones seguras
 * - Redirección automática según rol (admin/usuario)
 * - Persistencia de sesión en localStorage
 * - Validación de credenciales con feedback visual
 * - Enlaces a registro y recuperación de contraseña
 * 
 * Flujo de autenticación:
 * 1. Usuario ingresa credenciales
 * 2. Se valida contra el backend
 * 3. Se guarda token y datos de usuario
 * 4. Redirección según rol del usuario
 */

// Importa React para componentes funcionales
import React from "react";
// Importa herramientas de navegación de React Router
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
// Importa estilos específicos del componente
import '../estilos/LoginAdmin.css';
// Importa hooks para manejo de estado y efectos
import { useState, useEffect } from "react";
// Importa recursos gráficos para la interfaz
import policia from '../recursos/policia-logo.png';    // Logo institucional
import user_logo from '../recursos/user-logo.png';     // Icono de usuario
// Importa axios para comunicación con el backend
import axios from "axios";

/**
 * DEFINICIÓN DEL COMPONENTE LOGIN ADMIN
 * @param {Function} setUsers - Función para actualizar el estado global del usuario autenticado
 */
const LoginAdmin = ({ setUsers }) => {
    // Hook de navegación para redireccionar después del login
    const navigate = useNavigate();
    // Estado para mostrar/ocultar la contraseña
    const [showPassword, setShowPassword] = useState(false);
    // Estado para el campo de email
    const [email, setEmail] = useState('');
    // Estado para el campo de contraseña
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // ✅ URL base del backend
    const baseURL = "http://172.29.41.39:8000/";

    // Función que maneja el inicio de sesión
    const handleLogin = () => {
        // Validar que los campos no estén vacíos
        if (!email || !password) {
            setModalMessage("Por favor completa todos los campos");
            setShowModal(true);
            return;
        }

        setIsLoading(true);
        
        // ✅ Petición POST al endpoint de login del backend
        axios.post(`${baseURL}users/login`, {
            email: email,
            pass: password
        })
            .then(response => {
                // ✅ El backend devuelve { user, token }
                const { user, token } = response.data;
                
                // ✅ Guardar el token en localStorage
                localStorage.setItem("token", token);
                
                // ✅ Guardar el usuario en localStorage
                localStorage.setItem("usuario", JSON.stringify(user));
                
                // Actualizar el estado global del usuario en App.js
                setUsers(user);
                
                // ✅ Configurar axios para usar el token en futuras peticiones
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                // Navegación según el rol del usuario
                if (user.role === "admin") {
                    setModalMessage("Bienvenido Administrador");
                    setShowModal(true);
                    setTimeout(() => {
                        setShowModal(false);
                        navigate("/menu-administracion");
                    }, 1500);
                    console.log("Usuario admin logueado:", user);
                } else {
                    setModalMessage("Bienvenido a Ponte Pilas");
                    setShowModal(true);
                    setTimeout(() => {
                        setShowModal(false);
                        navigate("/menuUsuario");
                    }, 1500);
                    console.log("Usuario normal logueado:", user);
                }
            })
            .catch(error => {
                console.error('Error en login:', error);
                
                // ✅ Manejo específico de errores del backend
                if (error.response) {
                    // El servidor respondió con un código de error
                    const status = error.response.status;
                    const message = error.response.data?.message || error.response.data?.error;
                    
                    if (status === 401) {
                        setModalMessage("Credenciales incorrectas");
                    } else if (status === 404) {
                        setModalMessage("Usuario no encontrado");
                    } else {
                        setModalMessage(message || "Error al iniciar sesión");
                    }
                } else if (error.request) {
                    // El servidor no respondió
                    setModalMessage("Error de conexión con el servidor");
                } else {
                    // Error en la configuración de la petición
                    setModalMessage("Error inesperado");
                }
                
                setShowModal(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    // ✅ Función para verificar si ya hay una sesión activa al cargar la página
    useEffect(() => {
        const token = localStorage.getItem("token");
        const usuario = localStorage.getItem("usuario");
        
        if (token && usuario) {
            try {
                const parsedUser = JSON.parse(usuario);
                setUsers(parsedUser);
                
                // Configurar axios para usar el token
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                // Redirigir según el rol
                if (parsedUser.role === "admin") {
                    navigate("/menu-administracion");
                } else {
                    navigate("/menuUsuario");
                }
            } catch (error) {
                // Si hay error al parsear, limpiar localStorage
                localStorage.removeItem("token");
                localStorage.removeItem("usuario");
            }
        }
    }, [setUsers, navigate]);

    // Cierra el modal automáticamente después de 2 segundos
    useEffect(() => {
        if (showModal) {
            const timer = setTimeout(() => setShowModal(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [showModal]);

    // ✅ Función para manejar el Enter en los inputs
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
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
                            onKeyPress={handleKeyPress}
                            className="input-text"
                            disabled={isLoading}
                        />
                    </div>
                    {/* Campo para la contraseña */}
                    <div className="password-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Contraseña"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="input-text"
                            disabled={isLoading}
                        />
                        {/* Botón para mostrar/ocultar la contraseña */}
                        <button
                            type="button"
                            className="eye-button"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                            disabled={isLoading}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                    {/* Botones de acción y enlaces */}
                    <div className="button-container">
                        <button 
                            className="button" 
                            onClick={handleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                        </button>
                        <Link to="/">
                            <button className="button" disabled={isLoading}>
                                Volver a Inicio
                            </button>
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
            {showModal && (
                <div style={{
                    position: "fixed",
                    top: 0, left: 0, width: "100vw", height: "100vh",
                    background: "rgba(0,0,0,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        background: "#fff",
                        padding: "2rem",
                        borderRadius: "10px",
                        minWidth: "320px",
                        maxWidth: "90vw",
                        boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
                        textAlign: "center"
                    }}>
                        <h2>{modalMessage}</h2>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoginAdmin;