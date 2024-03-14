import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from 'react-router-dom';
import './MyNavBar.css';
const MyNavbar = () => {

  return (

    <div>
      <div className="navbar">
        <NavLink to="/" className="nav-button">Inicio</NavLink>
      </div>
      <div className="navbar">
        <NavLink to="/signup" className="nav-button">Registrarse</NavLink>
      </div>
      <div className="navbar">
        <NavLink to="/login" className="nav-button">Inicio de Sesión</NavLink>
      </div>
    </div>

  );
};

export default MyNavbar;
