import React, { useState } from 'react'
import NavBar from './MyNavBar2';
import '../styles/EditPerfil.css';
import md5 from 'md5';

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

        const hashedPassword = md5(contrasena);
        const formData = new FormData();
        const Token = localStorage.getItem("token")
        formData.append('nombre_usuario', usuario);
        formData.append('nombre_completo', nombreCompleto);
        formData.append('contrasena', hashedPassword);
        formData.append('token', Token);
        formData.append('foto_perfil', imagenObject);

        try {

            console.log("mande el put");

            const response = await fetch('http://localhost:5000/editperfil/editperfil', {
                method: 'PUT',
                body: formData,
            });
            
        

            const data = await response.json();
            if (response.status === 200) {
                // Redirigir a la página de inicio
                alert("Actualizacion exitosa ", data.message);
                window.location.reload();
            } else {
                // Recargar la página
                alert("Error al actualizar", data.message);
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
            <div className="containereditperfil">
                <div className="cuadradoeditperfil">
                    <div className="contornoeditperfil">
                        <h1 className='titulo'>Edicion de Perfil</h1>
                        <img className='container-imgeditperfil' src={imagenperfil} alt="Descripción de la imagen" />

                        <div className="form-group">
                            <label className="labelsignupedipperfil">Usuario: </label>
                            <label className="labelsignupedipperfil">{usuarioperfil}</label>
                        </div>
                        <div className="form-group">
                            <label className="labelsignupedipperfil">Nombre completo: </label>
                            <label className="labelsignupedipperfil">{nombreCompletoperfil}</label>
                        </div>
                    </div>
                </div>
                <div className="cuadradoeditperfil">
                <form onSubmit={handleSubmit}>
                    <div className="contornoeditperfildataimage">
                        <div>
                            <label className="labelsignupedipperfil">Imagen</label>

                        </div>
                        <input
                            type="file"
                            className="labelsignupedipperfil"
                            id="imagen"
                            accept="image/*"
                            onChange={handleImagenChange}
                        />
                        {imagen && (
                            <img src={imagen} alt="Imagen seleccionada" className="container-imgeditperfil" />
                        )}
                    </div>
                    </form>
                </div>
                <div className="cuadradoeditperfil">
                <form onSubmit={handleSubmit}>
                    <div className="contornoeditperfildata" >
                        <div className='mb-3'>
                            <label className="labelsignupedipperfil">Usuario:</label>
                        </div>
                        <div className='mb-3'>
                            <input className="inputsignupeditperfil" type="text" name="Usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
                        </div>
                        <div className='mb-3'>
                            <label className="labelsignupedipperfil">Nombre Completo:</label>
                        </div>
                        <div className='mb-3'>
                            <input className="inputsignupeditperfil" type="text" name="NombreCompleto" value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)} />
                        </div>
                        <div className='mb-3'>
                            <label className="labelsignupedipperfil">Confirmación</label>
                        </div>
                        <div className='mb-3'>
                            <input className="inputsignupeditperfil" type="password" name="contrasena" placeholder="Ingrese la confirmación de contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
                        </div>
                        <div className='mb-3'>
                        
                            <button type="submit" className="butonsignupeditperfil" onClick={handleSubmit}>
                                Editar
                            </button>
                        </div>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditPerfil;
