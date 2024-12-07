import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Eliminar el token del almacenamiento local
    localStorage.removeItem('token');
    // Redirigir a la página de inicio de sesión
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} className="button">
      Cerrar sesión
    </button>
  );
}

export default LogoutButton;
