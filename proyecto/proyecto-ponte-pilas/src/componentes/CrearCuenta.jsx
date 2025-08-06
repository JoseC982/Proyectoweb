/**
 * COMPONENTE CREAR CUENTA - REGISTRO DE USUARIOS
 * Formulario completo para el registro de nuevos usuarios en el sistema
 * 
 * Funcionalidades principales:
 * - Registro de usuarios con validación de campos
 * - Detección automática de primer usuario (se convierte en admin)
 * - Validación de email único y contraseñas seguras
 * - Interfaz responsive con toggle de visibilidad de contraseña
 * - Navegación automática después del registro exitoso
 * 
 * Campos del formulario:
 * - Información personal: nombre, email, fecha de nacimiento
 * - Credenciales: nombre de usuario, contraseña
 * - Biografía opcional del usuario
 */

// Importa React y hooks necesarios para estado y efectos
import React, { useState, useEffect } from "react";
// Importa herramientas de navegación de React Router
import { useNavigate, Link } from "react-router-dom";
// Importa estilos compartidos con el componente de login
import '../estilos/LoginAdmin.css';
// Importa recursos gráficos para la interfaz
import policia from '../recursos/policia-logo.png';    // Logo institucional de la policía
import user_logo from '../recursos/user-logo.png';     // Icono genérico de usuario
// Importa axios para comunicación con el backend
import axios from "axios";

/**
 * DEFINICIÓN DEL COMPONENTE CREAR CUENTA
 * Maneja todo el flujo de registro de nuevos usuarios
 */
const CrearCuenta = () => {
    // Hook de navegación para redireccionar después del registro
    const navigate = useNavigate();
    
    /**
     * ESTADOS DEL FORMULARIO
     * Cada campo del formulario tiene su propio estado para un control granular
     */
    const [showPassword, setShowPassword] = useState(false);  // Mostrar/ocultar contraseña
    const [email, setEmail] = useState('');                   // Email del usuario
    const [password, setPassword] = useState('');             // Contraseña
    const [name, setName] = useState('');                     // Nombre completo
    const [fecha, setFecha] = useState('');                   // Fecha de nacimiento
    const [username, setUsername] = useState('');             // Nombre de usuario único
    const [bio, setBio] = useState('');                       // Biografía opcional
    const [bio, setBio] = useState('');

    // ✅ Estados para modal y manejo de errores
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // ✅ NUEVO: Estados para primer usuario
    const [isFirstUser, setIsFirstUser] = useState(false);
    const [checkingDatabase, setCheckingDatabase] = useState(true);

    // ✅ URL base del backend
    const baseURL = "http://localhost:8000/";

    // ✅ NUEVO: Verificar si la base de datos está vacía al cargar el componente
    useEffect(() => {
        const checkIfFirstUser = async () => {
            try {
                const response = await axios.get(`${baseURL}users`);
                const users = response.data;
                
                // Si no hay usuarios, este será el primero
                setIsFirstUser(users.length === 0);
                
            } catch (error) {
                console.error('Error verificando usuarios:', error);
                // Si hay error, asumir que es el primer usuario
                setIsFirstUser(true);
            } finally {
                setCheckingDatabase(false);
            }
        };

        checkIfFirstUser();
    }, []);

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

        // ✅ MODIFICADO: Asignar rol según si es el primer usuario
        const roleToAssign = isFirstUser ? "admin" : "user";

        // ✅ Petición POST directa al backend
        axios.post(`${baseURL}users`, {
            name: name.trim(),
            email: email.trim(),
            pass: password,
            role: roleToAssign,
            estado: "Activo",
            fechaNacimiento: fecha,
            username: username.trim(),
            bio: bio.trim() || "" // Biografía opcional
        })
        .then(response => {
            console.log('Usuario creado:', response.data);
            
            // ✅ NUEVO: Mensaje especial para el primer usuario (admin)
            let mensaje;
            if (isFirstUser) {
                mensaje = "🎉 ¡Bienvenido a Ponte Once!\n\n" +
                         "Felicidades, eres el primer usuario registrado en esta app.\n" +
                         "Se te asignará como administrador por defecto.\n\n" +
                         "Los siguientes usuarios registrados tendrán rol de usuario " +
                         "y solo accederán a las rutas habilitadas para su rol.\n\n" +
                         "¡Disfruta administrando la plataforma! 🚀";
            } else {
                mensaje = "¡Usuario creado exitosamente! Bienvenido";
            }
            
            setModalMessage(mensaje);
            setShowModal(true);
            
            // ✅ MODIFICADO: Redirigir según el rol asignado
            setTimeout(() => {
                setShowModal(false);
                if (isFirstUser) {
                    navigate("/loginAdmin"); // Admin va al login de admin
                } else {
                    navigate("/loginAdmin"); // Usuario normal va al login de usuarios
                }
            }, isFirstUser ? 4000 : 2000); // Más tiempo para leer el mensaje del primer usuario
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

    // ✅ NUEVO: Mostrar loading mientras verifica la base de datos
    if (checkingDatabase) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f5f5f5'
            }}>
                <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                    <h2>🔄 Preparando registro...</h2>
                    <p>Verificando estado de la aplicación</p>
                </div>
            </div>
        );
    }

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
                    
                    {/* ✅ NUEVO: Mensaje especial para el primer usuario */}
                    {isFirstUser && (
                        <div style={{
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                            border: "2px solid #4f46e5",
                            borderRadius: "10px",
                            padding: "15px",
                            margin: "15px 0",
                            textAlign: "center",
                            boxShadow: "0 4px 15px rgba(79, 70, 229, 0.3)"
                        }}>
                            <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>
                                🎉 ¡Primer Usuario Detectado!
                            </h3>
                            <p style={{ margin: "0", fontSize: "14px", lineHeight: "1.4" }}>
                                Serás registrado como <strong>Administrador</strong> de la plataforma.
                                Tendrás acceso completo a todas las funcionalidades.
                            </p>
                        </div>
                    )}
                    
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
                            style={{
                                background: isFirstUser ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "",
                                borderColor: isFirstUser ? "#4f46e5" : ""
                            }}
                        >
                            {isLoading 
                                ? (isFirstUser ? "Creando administrador..." : "Creando cuenta...") 
                                : (isFirstUser ? "Crear Administrador" : "Crear Cuenta")
                            }
                        </button>
                        <Link to="/loginAdmin">
                            <button className="button" disabled={isLoading}>
                                Volver a Inicio
                            </button>
                        </Link>
                    </div>
                </section>
            </div>

            {/* ✅ MODIFICADO: Modal de mensajes con estilo especial para primer usuario */}
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
                        background: isFirstUser && modalMessage.includes("Bienvenido a Ponte Once") 
                            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                            : "#fff",
                        color: isFirstUser && modalMessage.includes("Bienvenido a Ponte Once") 
                            ? "white" 
                            : "black",
                        padding: "2.5rem",
                        borderRadius: "15px",
                        minWidth: "400px",
                        maxWidth: "90vw",
                        boxShadow: isFirstUser && modalMessage.includes("Bienvenido a Ponte Once")
                            ? "0 10px 30px rgba(79, 70, 229, 0.4)"
                            : "0 2px 16px rgba(0,0,0,0.2)",
                        textAlign: "center",
                        border: isFirstUser && modalMessage.includes("Bienvenido a Ponte Once")
                            ? "2px solid #4f46e5"
                            : "none"
                    }}>
                        <div style={{ 
                            whiteSpace: "pre-line", 
                            lineHeight: "1.6",
                            fontSize: isFirstUser && modalMessage.includes("Bienvenido a Ponte Once") ? "16px" : "14px"
                        }}>
                            {modalMessage}
                        </div>
                        {!modalMessage.includes("exitosamente") && !modalMessage.includes("Bienvenido a Ponte Once") && (
                            <button 
                                onClick={() => setShowModal(false)}
                                style={{
                                    marginTop: "20px",
                                    padding: "12px 24px",
                                    background: "#007bff",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    fontWeight: "500"
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