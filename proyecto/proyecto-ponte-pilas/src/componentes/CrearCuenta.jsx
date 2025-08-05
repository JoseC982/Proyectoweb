// Importa React y el hook useState para manejar el estado local
import React, { useState } from "react";
// Importa useNavigate y Link de react-router-dom para navegación
import { useNavigate, Link } from "react-router-dom";
// Importa los estilos CSS para el formulario de registro
import '../estilos/LoginAdmin.css';
// Importa la imagen del logo de la policía
import policia from '../recursos/policia-logo.png';
// Importa la imagen del logo de usuario
import user_logo from '../recursos/user-logo.png';
// Importa axios para hacer peticiones HTTP
import axios from "axios";

// Define el componente funcional CrearCuenta
const CrearCuenta = () => {
    // Hook para navegar entre rutas
    const navigate = useNavigate();
    // Estado para mostrar/ocultar la contraseña
    const [showPassword, setShowPassword] = useState(false);
    // Estado para el campo de email
    const [email, setEmail] = useState('');
    // Estado para el campo de contraseña
    const [password, setPassword] = useState('');
    // Estado para el campo de nombre
    const [name, setName] = useState('');
    // Estado para el campo de fecha de nacimiento
    const [fecha, setFecha] = useState('');
    // Estado para el campo de nombre de usuario
    const [username, setUsername] = useState('');
    // Estado para el campo de biografía
    const [bio, setBio] = useState('');

    // ✅ Estados para modal y manejo de errores
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // ✅ URL base del backend
    const baseURL = "http://localhost:8000/";

    const handleRegister = () => {
        // ✅ Validación mejorada
        if (!name.trim() || !email.trim() || !password.trim() || !fecha || !username.trim()) {
            setModalMessage("Por favor complete todos los campos obligatorios");
            setShowModal(true);
            return;
        }

        // ✅ Validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setModalMessage("Por favor ingrese un email válido");
            setShowModal(true);
            return;
        }

        // ✅ Validación de contraseña
        if (password.length < 6) {
            setModalMessage("La contraseña debe tener al menos 6 caracteres");
            setShowModal(true);
            return;
        }

        setIsLoading(true);

        // ✅ Petición POST directa al backend (el backend ya valida emails duplicados)
        axios.post(`${baseURL}users`, {
            name: name.trim(),
            email: email.trim(),
            pass: password,
            role: "user",
            estado: "Activo",
            fechaNacimiento: fecha,
            username: username.trim(),
            bio: bio.trim() || "" // Biografía opcional
        })
        .then(response => {
            console.log('Usuario creado:', response.data);
            setModalMessage("¡Usuario creado exitosamente! Bienvenido");
            setShowModal(true);
            
            // Redirigir al login después de 2 segundos
            setTimeout(() => {
                setShowModal(false);
                navigate("/loginAdmin");
            }, 2000);
        })
        .catch(error => {
            console.error('Error al crear usuario:', error);
            
            // ✅ Manejo específico de errores del backend
            let mensajeError = "Error al crear usuario";
            
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.error || error.response.data?.message;
                
                if (status === 400) {
                    if (message === "Correo ya registrado") {
                        mensajeError = "Este correo ya fue usado para crear una cuenta, ingrese otro correo";
                    } else if (message === "Datos incompletos") {
                        mensajeError = "Por favor complete todos los campos obligatorios";
                    } else {
                        mensajeError = message || "Datos inválidos";
                    }
                } else if (status === 500) {
                    mensajeError = "Error interno del servidor";
                } else {
                    mensajeError = message || "Error inesperado";
                }
            } else if (error.request) {
                mensajeError = "Error de conexión con el servidor";
            }
            
            setModalMessage(mensajeError);
            setShowModal(true);
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    // ✅ Función para manejar el Enter en los inputs
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleRegister();
        }
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
                    
                    {/* Campo de nombre */}
                    <div className="email-container">
                        <input
                            type="text"
                            placeholder="Nombre *"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="input-text"
                            disabled={isLoading}
                            required
                        />
                    </div>
                    
                    {/* Campo de nombre de usuario */}
                    <div className="email-container">
                        <input
                            type="text"
                            placeholder="Nombre de usuario *"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="input-text"
                            disabled={isLoading}
                            required
                        />
                    </div>
                    
                    {/* Campo de email */}
                    <div className="email-container">
                        <input
                            type="email"
                            placeholder="Correo electrónico *"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="input-text"
                            disabled={isLoading}
                            required
                        />
                    </div>
                    
                    {/* Campo de contraseña */}
                    <div className="password-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Contraseña (mín. 6 caracteres) *"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="input-text"
                            disabled={isLoading}
                            required
                        />
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
                    
                    {/* Campo de fecha de nacimiento */}
                    <div className="date-born-container">
                        <input
                            type="date"
                            placeholder="Fecha Nacimiento *"
                            value={fecha}
                            onChange={e => setFecha(e.target.value)}
                            className="input-text"
                            disabled={isLoading}
                            required
                        />
                    </div>
                    
                    {/* Campo de biografía */}
                    <div className="email-container">
                        <textarea
                            placeholder="Biografía (opcional)"
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                            className="input-text"
                            style={{ resize: "none", minHeight: "60px" }}
                            disabled={isLoading}
                        />
                    </div>
                    
                    {/* Texto informativo */}
                    <div style={{ textAlign: "center", margin: "10px 0", fontSize: "14px", color: "#666" }}>
                        Los campos marcados con (*) son obligatorios
                    </div>
                    
                    {/* Botones */}
                    <div className="cu-button-container">
                        <button 
                            className="button" 
                            onClick={handleRegister}
                            disabled={isLoading}
                        >
                            {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                        </button>
                        <Link to="/loginAdmin">
                            <button className="button" disabled={isLoading}>
                                Volver a Inicio
                            </button>
                        </Link>
                    </div>
                </section>
            </div>

            {/* ✅ Modal de mensajes */}
            {showModal && (
                <div style={{
                    position: "fixed",
                    top: 0, 
                    left: 0, 
                    width: "100vw", 
                    height: "100vh",
                    background: "rgba(0,0,0,0.4)",
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
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
                        {!modalMessage.includes("exitosamente") && (
                            <button 
                                onClick={() => setShowModal(false)}
                                style={{
                                    marginTop: "15px",
                                    padding: "10px 20px",
                                    background: "#007bff",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer"
                                }}
                            >
                                Cerrar
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CrearCuenta;