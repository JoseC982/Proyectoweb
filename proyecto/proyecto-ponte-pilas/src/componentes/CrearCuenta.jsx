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