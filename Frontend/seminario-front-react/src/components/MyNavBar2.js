import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from 'react-router-dom';
import './MyNavBar2.css';

const MyNavbar2 = () => {

  const handleLogout = () => {
    // Eliminar el token del almacenamiento local al cerrar sesión
    localStorage.removeItem('token');
    // Redireccionar al usuario a la página de inicio de sesión
    window.location.href = "/";
  };

  return (
    <div>
      <div className="navbar2">
        <NavLink to="/userpage" className="nav-button2">Inicio</NavLink>
      </div>
      <div className="navbar2">
        <NavLink to="/editperfil" className="nav-button2">Editar Perfil</NavLink>
      </div>
      <div className="navbar2">
        <NavLink to="/watchphoto" className="nav-button2">Ver fotos</NavLink>
      </div>
      <div className="navbar2">
        <NavLink to="/loadphoto" className="nav-button2">Subir fotos</NavLink>
      </div>
      <div className="navbar2">
        <NavLink to="/editalbum" className="nav-button2">Editar album</NavLink>
      </div>
      <div className="navbar2">
        {/* Agrega el manejador de eventos para cerrar sesión */}
        <NavLink to="/" className="nav-button2" onClick={handleLogout}>Cerrar sesión</NavLink>
      </div>
    </div>
  );
};

export default MyNavbar2;
