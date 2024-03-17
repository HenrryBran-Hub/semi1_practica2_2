import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from 'react-router-dom';
import '../styles/MyNavBar.css';
const MyNavbar = () => {

  return (

    <div className="navbar">
        <NavLink to="/" className="nav-button">Inicio</NavLink>
        <NavLink to="/signup" className="nav-button">Registrarse</NavLink>
        <NavLink to="/login" className="nav-button">Inicio de Sesión</NavLink>
    </div>

  );
};

export default MyNavbar;
