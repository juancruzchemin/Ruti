import React, { useState } from 'react';
import "../components/styles/SignupStyles/SignupStyles.css"
import { useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook para la navegación

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (response.status === 201) {
      setMessage('Usuario registrado exitosamente');
      // Redirigir a la página de inicio de sesión después de 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else if (response.status === 404) {
      setMessage(data.msg || 'Usuario ya registrado');
    } else {
      setMessage(data.msg || 'Error al crear el usuario');
    }
  };

  return (
    <div className="auth-container">
      <header className="auth-header">
        <h1>Registro</h1>
        <form onSubmit={handleSubmit} className="form">
          <div className="formGroup">
            <label className="label"></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input"
              placeholder='Nombre'
            />
          </div>
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
          <button type="submit" className="button">Registrarse</button>
        </form>
        {message && <p className="message">{message}</p>}
      </header>
    </div>
  );
}

export default Register;

