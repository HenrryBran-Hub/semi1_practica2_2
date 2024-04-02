import React, { useState } from 'react'
import NavBar from './MyNavBar2';
import '../styles/Signup.css';
import './LoadPhoto.css'

const LoadPhoto = ({ userData, albumData }) => {
    const usuarioperfil = userData ? userData.nombre_usuario : '';
    const nombreCompletoperfil = userData ? userData.nombre_completo : '';
    const imagenperfil = userData ? userData.foto_perfil : '';

    const [imagen, setImagen] = useState(null);
    // const [categoria, setCategoria] = useState('');
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [imagenobject, setImagenObject] = useState(null);

    const handleImagenChange = (event) => {
        const imagenSeleccionada = event.target.files[0];
        setImagenObject(event.target.files[0]);
        if (imagenSeleccionada) {
            setImagen(URL.createObjectURL(imagenSeleccionada));
        }
    };

    // const handleCategoriaChange = (event) => {
    //     setCategoria(event.target.value);
    // };

    const handleNombreChange = (event) => {
        setNombre(event.target.value);
    };

    const handleDescripcionChange = (event) => {
        setDescripcion(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Aquí puedes realizar acciones con los datos del formulario
        if (!imagenobject || !nombre) {
            alert('Por favor, llene todos los campos');
            return;
        }
        const formData = new FormData();
        const Token = localStorage.getItem("token")
        formData.append('nombre_foto', nombre);
        formData.append('descripcion_foto', descripcion);
        formData.append('Token', Token);
        formData.append('foto_album', imagenobject);


        try {

            const response = await fetch('http://localhost:5000/loadphoto/loadphoto', {
                method: 'POST',
                body: formData,
            });

            if (response.status === 200) {
                // Redirigir a la página de inicio
                alert("Registro exitoso");
                window.location.reload();
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

    // Extraer las categorías del albumData
    // const categorias = albumData ? albumData.map(album => album.nombre_album) : [];

    return (
        <div>
            <NavBar />
            <div className="cointainer mt-4">
                <form className="border p-3 rounded mr-3 row justify-content-center">
                    <h1 className='titulo'>Subir fotos</h1>
                    <div className="image-containerl">
                        <img className='container-imgl' src={imagenperfil} alt="Descripción de la imagen" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="text">Usuario</label>
                        <label htmlFor="text">{usuarioperfil}</label>
                    </div>
                    <div className="form-group">
                        <label htmlFor="text">Nombre completo</label>
                        <label htmlFor="text">{nombreCompletoperfil}</label>
                    </div>
                </form>
                <div className="image-containerS">
                    <form className="border p-3 rounded mr-3 row justify-content-center">
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
                <div>
                    <form className="border p-3 rounded mr-3 row justify-content-center" onSubmit={handleSubmit}>
                        <div className='col-6'>
                            <div className='mb-3'>
                                <label>Nombre de la Foto</label>
                                <input type="text" name="nombreFoto" value={nombre} onChange={handleNombreChange} placeholder="Ingrese nombre de la foto" />
                            </div>
                            <div className='mb-3'>
                                <label>Descripcion</label>
                                <input type="text" name="descripcionFoto" value={descripcion} onChange={handleDescripcionChange} placeholder="Ingrese descripcion de la foto" />
                            </div>
                            {/* <div className='mb-3'>
                            <label>Categoría</label>
                            <select value={categoria} onChange={handleCategoriaChange}>
                                <option value="">Seleccione una categoría</option>
                                {categorias.map((categoria, index) => (
                                    <option key={index} value={categoria}>{categoria}</option>
                                ))}
                            </select>
                        </div> */}
                            <div className='mb-3'>
                                <button type="submit" className="btn btn-primary">
                                    Cargar Foto
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoadPhoto;
