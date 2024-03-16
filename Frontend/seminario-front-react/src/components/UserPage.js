import React from 'react';
import NavBar from './MyNavBar2';
import '../styles/Login.css';

const UserPage = ({ userData }) => {
    // Verificar si userData está definido y obtener los valores correspondientes
    const usuario = userData ? userData.nombre_usuario : '';
    const nombreCompleto = userData ? userData.nombre_completo : '';
    const imagen = userData ? userData.foto_perfil : '';

    return (
        <div>
            <NavBar />
            <div className="containerl">
                <form className="border p-3 rounded mr-3 form-containerl">
                    <h1 className='titulo'>Bienvenido</h1>
                    <div className="image-containerl">
                        <img className='container-imgl' src={imagen} alt="Descripción de la imagen" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="text">Usuario: </label>
                        <label htmlFor="text">{usuario}</label>
                    </div>
                    <div className="form-group">
                        <label htmlFor="text">Nombre completo:</label>
                        <label htmlFor="text">{nombreCompleto}</label>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserPage;
