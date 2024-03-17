import React, { useState } from 'react';
import NavBar from './MyNavBar2';
import '../styles/UserPage.css';

const UserPage = ({ userData }) => {
    // Verificar si userData está definido y obtener los valores correspondientes
    const usuario = userData ? userData.nombre_usuario : '';
    const nombreCompleto = userData ? userData.nombre_completo : '';
    const imagen = userData ? userData.foto_perfil : '';
    const [showExtraer, setExtraer] = useState(false);
    const [imagenextrare, setImagenExtraer] = useState(null);
    const [imagenObject, setImagenObject] = useState(null);
    const [descripcion, setDescripcion] = useState('');

    const handleImagenChange = (event) => {
        const imagenSeleccionada = event.target.files[0];
        setImagenObject(event.target.files[0]);
        if (imagenSeleccionada) {
            setImagenExtraer(URL.createObjectURL(imagenSeleccionada));
        }
    };

    const startExtraer = () => {
        setExtraer(true);
    };

    const stopExtraer = () => {
        setExtraer(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Verificar que todos los campos estén llenos
        if (!imagenObject) {
            alert('Por favor, llene todos los campos');
            return;
        }

        const formData = new FormData();
        formData.append('foto_perfil', imagenObject);

        try {

            const response = await fetch('http://localhost:5000/signup/signup', {
                method: 'POST',
                body: formData,
            });

            if (response.status === 200) {
                // Redirigir a la página de inicio
                alert("Escaneo completo");
            } else {
                // Recargar la página
                alert("Error en el registro");
                window.location.reload();
            }
        } catch (error) {
            console.error('Error al enviar solicitud:', error);
            // Recargar la página
            window.location.reload();
        }
    };


    return (
        <div>
            <NavBar />
            <div className="containerUserPage">
            {!showExtraer && (
                <div className="contornoUserPage">
                    <h1 className='tituloUserPage'>Bienvenido</h1>
                    <div className="container-imgl-userpage">
                        <img className='image-container-userpage' src={imagen} alt="Descripción de la imagen" />
                    </div>
                    <div >
                        <label className="labeluserpage">Usuario: </label>
                        <label className="labeluserpage">{usuario}</label>
                    </div>
                    <div >
                        <label className="labeluserpage">Nombre completo:</label>
                        <label className="labeluserpage">{nombreCompleto}</label>
                    </div>
                    <div className="form-group">
                            <button type="button" className="butonsignupuserpage" onClick={startExtraer}>Extraer</button>
                        </div>
                </div>
            )}
            {showExtraer && (
                <form className="contornoUserPage" onSubmit={handleSubmit}>
                    <h1 className='tituloUserPage'>Extayendo información</h1>
                    <div className="container-imgl-userpage">
                    <div className='labelsignup'>
                            <label htmlFor="imagen">Imagen</label>
                        </div>
                        <input
                            type="file"
                            id="imagen"
                            accept="image/*"
                            onChange={handleImagenChange}
                            className='labelsignup'
                        />
                        {imagenextrare && (
                            <img src={imagenextrare} alt="Imagen seleccionada" className="container-imgS" />
                        )}
                    </div>
                    <div >
                        <label className="labeluserpage">Descripcion: </label>
                    </div>
                    <div >
                        <label className="labeluserpage">{descripcion}</label>
                    </div>
                    <div className="form-group">
                            <button type="button" className="butonsignupuserpage" onClick={startExtraer}>Escanear</button>
                        </div>
                    <div className="form-group">
                            <button type="button" className="butonsignupuserpage" onClick={startExtraer}>Cancelar</button>
                        </div>
                </form>
                )}
            </div>            
        </div>
    );
};

export default UserPage;
