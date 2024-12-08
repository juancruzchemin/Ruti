// src/components/Sidebar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaHome, FaInfoCircle, FaUser, FaDumbbell } from 'react-icons/fa';
import '../styles/GeneralStyles/SideBar.css'; // Importa el archivo de estilos
import LogoutButton from './LogoutButton'; // Asegúrate de que la ruta sea correcta

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Ruti</h3>
        </div>
        <ul className="sidebar-menu">
          <li>
            <Link to="/" onClick={toggleSidebar}>
              <FaHome /> Inicio
            </Link>
          </li>
          <li>
            <Link to="/profile" onClick={toggleSidebar}>
              <FaUser /> Perfil
            </Link>
          </li>
          <li>
            <Link to="/exercises" onClick={toggleSidebar}>
              <FaDumbbell /> Rutinas
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={toggleSidebar}>
              <FaInfoCircle /> Acerca de
            </Link>
          </li>  
          <li>
              <LogoutButton />
          </li>  
        </ul>
      </div>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <FaBars />
      </button>
    </>
  );
};

export default Sidebar;
