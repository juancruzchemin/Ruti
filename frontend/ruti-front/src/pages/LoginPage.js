import React, { useState } from 'react';
import "../components/styles/LoginStyles/LoginStyles.css"

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.status === 200) {
      setMessage('Inicio de sesión exitoso');
      // Guardar el token en localStorage
      localStorage.setItem('token', data.token);
      // Redirigir a la página principal
      window.location.href = '/';
    } else {
      setMessage(data.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="login">
      <header className="login-header">
        <h1>Iniciar sesión</h1>
        <form onSubmit={handleSubmit} className="form">
          <div className="formGroup">
            <label className="label"></label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
              placeholder='Email'
            />
          </div>
          <div className="formGroup">
            <label className="label"></label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
              placeholder='Contraseña'
            />
          </div>
          <button type="submit" className="button">Iniciar sesión</button>
        </form>
        {message && <p className="message">{message}</p>}
        <a href="http://localhost:3000/auth/google" className="button">Iniciar sesión con Google</a>
        <a href="/signup" className="button">Registrarse</a>
      </header>
    </div>
  );
}

export default LoginPage;
