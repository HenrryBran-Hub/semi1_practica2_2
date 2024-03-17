import React, { useState } from 'react';
import NavBar from './MyNavBar2';
import '../styles/Signup.css';

const EditPhoto = ({ userData, albumData }) => {
    const usuarioperfil = userData ? userData.nombre_usuario : '';
    const nombreCompletoperfil = userData ? userData.nombre_completo : '';
    const imagenperfil = userData ? userData.foto_perfil : '';

    const [categoriaeliminar, setCategoriaEliminar] = useState('');
    const [categoriaeditar, setCategoriaEditar] = useState('');
    const [nombreNuevoAlbum, setNombreNuevoAlbum] = useState('');
    const [nombreEditarAlbuM, setEditarNuevoAlbum] = useState('');

    const handleCategoriaeliminarChange = (event) => {
        setCategoriaEliminar(event.target.value);
    };

    const handleCategoriaeditarChange = (event) => {
        setCategoriaEditar(event.target.value);
    };

    const handleNombreNuevoAlbumChange = (event) => {
        setNombreNuevoAlbum(event.target.value);
    };

    const handleNombreEditarAlbumChange = (event) => {
        setEditarNuevoAlbum(event.target.value);
    };

    const handleSubmitEditar = async (event) => {
        event.preventDefault();
        if (categoriaeditar !== '' && nombreEditarAlbuM !== '') {
            // Realizar petición al endpoint para editar el álbum
            const formData = new FormData();
            const Token = localStorage.getItem("token")
            formData.append('nombre_album', categoriaeditar);
            formData.append('nombre_album_nuevo',nombreEditarAlbuM);
            formData.append('Token', Token);

            console.log("CATEGORIA EDITAR:",categoriaeditar);
            console.log("CATEGORIA ALBUM:",nombreEditarAlbuM);
            try {

                const response = await fetch('http://localhost:5000/editalbum/editalbum', {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();
                if (data.status === 200) {
                    // Redirigir a la página de inicio
                    alert("Edicion correcta");
                    window.location.reload();
                } else {
                    // Recargar la página
                    alert("Error en la editar");
                    window.location.reload();
                }
            } catch (error) {
                console.error('Error al enviar solicitud:', error);
                // Recargar la página
                window.location.reload();
            }
        } else {
            alert("Por favor selecciona una categoría y proporciona un nombre para el nuevo álbum.");
        }
    };

    const handleSubmitEliminar = async (event) => {
        event.preventDefault();
        if (categoriaeliminar !== '') {
            // Realizar petición al endpoint para eliminar el álbum
            const formData = new FormData();
            const Token = localStorage.getItem("token")
            formData.append('nombre_album', categoriaeliminar);
            formData.append('Token', Token);

            try {

                const response = await fetch('http://localhost:5000/editalbum/deletealbum', {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();
                if (data.status === 200) {
                    // Redirigir a la página de inicio
                    alert("Eliminacion correcta");
                    window.location.reload();
                } else {
                    // Recargar la página
                    alert("Error en la eliminacion");
                    window.location.reload();
                }
            } catch (error) {
                console.error('Error al enviar solicitud:', error);
                // Recargar la página
                window.location.reload();
            }
        } else {
            alert("Por favor selecciona una categoría para eliminar el álbum.");
        }
    };

    const handleSubmitCrear = async (event) => {
        event.preventDefault();
        if (nombreNuevoAlbum !== '') {
            // Realizar petición al endpoint para crear un nuevo álbum
            const formData = new FormData();
            const Token = localStorage.getItem("token")
            formData.append('nombre_album', nombreNuevoAlbum);
            formData.append('Token', Token);

            try {

                const response = await fetch('http://localhost:5000/editalbum/recordalbum', {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();
                if (data.status === 200) {
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
        } else {
            alert("Por favor proporciona un nombre para el nuevo álbum.");
        }
    };

    const categoriaseliminar = albumData ? albumData.map(album => album.nombre_album) : [];
    const categoriaseditar = albumData ? albumData.map(album => album.nombre_album) : [];

    return (
        <div>
            <NavBar />
            <div className="containerS">
                <form className="border p-3 rounded mr-3 form-containerl">
                    <h1 className='titulo'>Edicion de Album</h1>
                    <div className="image-containerl">
                        <img className='container-imgl' src={imagenperfil} alt="Descripción de la imagen" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="text">Usuario: {usuarioperfil}</label>
                    </div>
                    <div className="form-group">
                        <label htmlFor="text">Nombre completo: {nombreCompletoperfil}</label>
                    </div>
                </form>
                <div>
                    <form className="border p-3 rounded form-containerS" onSubmit={handleSubmitEliminar}>
                        <div className='mb-3'>
                            <label>Eliminar album</label>
                        </div>
                        <div className='mb-3'>
                            <select value={categoriaeliminar} onChange={handleCategoriaeliminarChange}>
                                <option value="">Seleccione una categoría</option>
                                {categoriaseliminar.map((categoria, index) => (
                                    <option key={index} value={categoria}>{categoria}</option>
                                ))}
                            </select>
                        </div>
                        <div className='mb-3'>
                            <button type="submit" className="btn btn-primary">
                                Eliminar
                            </button>
                        </div>
                    </form>
                </div>
                <div>
                    <form className="border p-3 rounded form-containerS" onSubmit={handleSubmitCrear}>
                        <div className='mb-3'>
                            <label>Crear Album</label>
                        </div>
                        <div className='mb-3'>
                            <input type="text" name="NuevoAlbum" value={nombreNuevoAlbum} onChange={handleNombreNuevoAlbumChange} placeholder="Ingrese Nombre de Nuevo album" />
                        </div>
                        <div className='mb-3'>
                            <button type="submit" className="btn btn-primary">
                                Crear
                            </button>
                        </div>
                    </form>
                </div>
                <div>
                    <form className="border p-3 rounded form-containerS" onSubmit={handleSubmitEditar}>
                        <div className='mb-3'>
                            <label>Editar album</label>
                        </div>
                        <div className='mb-3'>
                            <select value={categoriaeditar} onChange={handleCategoriaeditarChange}>
                                <option value="">Seleccione una categoría</option>
                                {categoriaseditar.map((categoria, index) => (
                                    <option key={index} value={categoria}>{categoria}</option>
                                ))}
                            </select>
                        </div>
                        <div className='mb-3'>
                            <label>Nombre Nuevo</label>
                        </div>
                        <div className='mb-3'>
                            <input type="text" name="EditarAlbum" value={nombreEditarAlbuM} onChange={handleNombreEditarAlbumChange} placeholder="Ingrese nuevo nombre de album" />
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

export default EditPhoto;
