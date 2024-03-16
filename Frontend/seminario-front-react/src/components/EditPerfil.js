import React, { useState } from 'react'
import NavBar from './MyNavBar2';
import '../styles/Signup.css';

const EditPerfil = ({ userData }) => {
    const [usuario, setUsuario] = useState('');
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [imagen, setImagen] = useState(null);
    const [imagenObject, setImagenObject] = useState(null);

    // Verificar si userData está definido y obtener los valores correspondientes
    const usuarioperfil = userData ? userData.nombre_usuario : '';
    const nombreCompletoperfil = userData ? userData.nombre_completo : '';
    const imagenperfil = userData ? userData.foto_perfil : '';

    const handleImagenChange = (event) => {
        const imagenSeleccionada = event.target.files[0];
        setImagenObject(event.target.files[0]);
        if (imagenSeleccionada) {
            setImagen(URL.createObjectURL(imagenSeleccionada));

        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        const Token = localStorage.getItem("token")
        formData.append('nombre_usuario', usuario);
        formData.append('nombre_completo', nombreCompleto);
        formData.append('contrasena', contrasena);
        formData.append('token', Token);
        formData.append('foto_perfil', imagenObject);

        try {

            const response = await fetch('http://localhost:5000/editperfil/editperfil', {
                method: 'PUT',
                body: formData,
            });
            
            const data = await response.json();            
            if (response.status === 200) {
                // Redirigir a la página de inicio
                alert("Registro exitoso:", data.message);
                window.location.reload();
            } else {
                // Recargar la página
                alert("Error en el registro :", data.message);
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
            <div className="containerS">
                <form className="border p-3 rounded mr-3 form-containerl">
                    <h1 className='titulo'>Edicion de Perfil</h1>
                    <div className="image-containerl">
                        <img className='container-imgl' src={imagenperfil} alt="Descripción de la imagen" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="text">Usuario: </label>
                        <label htmlFor="text">{usuarioperfil}</label>
                    </div>
                    <div className="form-group">
                        <label htmlFor="text">Nombre completo: </label>
                        <label htmlFor="text">{nombreCompletoperfil}</label>
                    </div>
                </form>
                <div className="image-containerS">
                    <form className="border p-3 rounded mr-3 form-containerS" onSubmit={handleSubmit}>
                        <label htmlFor="imagen">Imagen</label>
                        <input
                            type="file"
                            id="imagen"
                            accept="image/*"
                            onChange={handleImagenChange}
                        />
                        {imagen && (
                            <img src={imagen} alt="Imagen seleccionada" className="container-imgS" />
                        )}
                    </form>
                </div>
                <div >
                    <form className="border p-3 rounded form-containerS" onSubmit={handleSubmit}>
                        <div className='mb-3'>
                            <label>Usuario:</label>
                        </div>
                        <div className='mb-3'>
                            <input type="text" name="Usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
                        </div>
                        <div className='mb-3'>
                            <label>Nombre Completo:</label>
                        </div>
                        <div className='mb-3'>
                            <input type="text" name="NombreCompleto" value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)} />
                        </div>
                        <div className='mb-3'>
                            <label>Confirmación</label>
                        </div>
                        <div className='mb-3'>
                            <input type="password" name="contrasena" placeholder="Ingrese la confirmación de contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
                        </div>
                        <div className='mb-3'>
                            <button type="submit" className="btn btn-primary">
                                Editar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditPerfil;
