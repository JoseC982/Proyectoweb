import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import '../estilos/LoginAdmin.css';
import policia from '../recursos/policia-logo.png';
import user_logo from '../recursos/user-logo.png';

const RecuperarCuenta = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: email, 2: código y nueva contraseña
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const baseURL = "http://172.29.41.39:8000/";

    // Paso 1: Enviar código al email
    const handleEnviarCodigo = () => {
        if (!email.trim()) {
            setMessage("Por favor ingrese su email");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage("Por favor ingrese un email válido");
            return;
        }

        setIsLoading(true);
        setMessage('');
        
        axios.post(`${baseURL}users/enviar-codigo-recuperacion`, { 
            email: email.trim() 
        })
        .then(response => {
            setMessage("✅ Revisa tu email, te hemos enviado un código de 6 dígitos");
            setStep(2);
        })
        .catch(error => {
            console.error('Error:', error);
            const errorMsg = error.response?.data?.message || "Error al enviar el código";
            setMessage("❌ " + errorMsg);
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    // Paso 2: Verificar código y cambiar contraseña
    const handleCambiarPassword = () => {
        if (!code.trim() || !newPassword.trim()) {
            setMessage("Por favor complete todos los campos");
            return;
        }

        if (code.length !== 6) {
            setMessage("El código debe tener 6 dígitos");
            return;
        }

        if (newPassword.length < 6) {
            setMessage("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        setIsLoading(true);
        setMessage('');
        
        axios.post(`${baseURL}users/verificar-codigo-cambiar-password`, {
            email: email.trim(),
            code: code.trim(),
            newPassword
        })
        .then(response => {
            setMessage("✅ ¡Contraseña actualizada exitosamente!");
            setTimeout(() => {
                navigate("/loginAdmin");
            }, 2000);
        })
        .catch(error => {
            console.error('Error:', error);
            const errorMsg = error.response?.data?.message || "Error al cambiar contraseña";
            setMessage("❌ " + errorMsg);
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    return (
        <div className="login-admin-container">
            <title>Recuperar Cuenta</title>
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
                        <h1>¡Recupera tu cuenta!</h1>
                    </div>

                    {step === 1 && (
                        <div className="email-container">
                            <span>Escribe tu correo electrónico</span>
                            <input
                                type="email"
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="input-text"
                                disabled={isLoading}
                            />
                        </div>
                    )}

                    {step === 2 && (
                        <>
                            <div className="email-container">
                                <span>Código de verificación (6 dígitos)</span>
                                <input
                                    type="text"
                                    placeholder="123456"
                                    value={code}
                                    onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                                    className="input-text"
                                    disabled={isLoading}
                                    maxLength="6"
                                    style={{ textAlign: 'center', fontSize: '1.5em', letterSpacing: '0.5em' }}
                                />
                                <small style={{ color: '#666', fontSize: '0.9em' }}>
                                    Código enviado a: {email}
                                </small>
                            </div>
                            <div className="password-container">
                                <span>Nueva contraseña</span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Nueva contraseña (mín. 6 caracteres)"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    className="input-text"
                                    disabled={isLoading}
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
                        </>
                    )}

                    {message && (
                        <div style={{ 
                            color: message.includes("✅") ? "green" : "red", 
                            textAlign: "center", 
                            margin: "15px 0",
                            padding: "10px",
                            backgroundColor: message.includes("✅") ? "#d4edda" : "#f8d7da",
                            borderRadius: "5px"
                        }}>
                            {message}
                        </div>
                    )}

                    <div className="button-container">
                        <button 
                            className="button" 
                            onClick={step === 1 ? handleEnviarCodigo : handleCambiarPassword}
                            disabled={isLoading}
                        >
                            {isLoading ? "Procesando..." : (step === 1 ? "Recuperar Cuenta" : "Cambiar Contraseña")}
                        </button>
                        
                        <Link to="/loginAdmin">
                            <button className="button" disabled={isLoading}>
                                Volver a Inicio
                            </button>
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default RecuperarCuenta;