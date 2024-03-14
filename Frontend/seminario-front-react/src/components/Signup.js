import React, { useState } from 'react';
import NavBar from './MyNavBar';
import './Signup.css';
import bcrypt from 'bcryptjs'; // Importa bcryptjs

const Signup = () => {
    const [usuario, setUsuario] = useState('');
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmacion, setConfirmacion] = useState('');
    const [imagen, setImagen] = useState(null);
    const [imagenObject, setImagenObject] = useState(null);

    const handleImagenChange = (event) => {
        const imagenSeleccionada = event.target.files[0];
        setImagenObject(event.target.files[0]);
        if (imagenSeleccionada) {
            setImagen(URL.createObjectURL(imagenSeleccionada));

        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Verificar que todos los campos estén llenos
        if (!usuario || !nombreCompleto || !contrasena || !confirmacion || !imagenObject) {
            alert('Por favor, llene todos los campos');
            return;
        }

        // Verificar que la contraseña coincida con la confirmación
        if (contrasena !== confirmacion) {
            alert('La contraseña y su confirmación no coinciden');
            window.location.reload();
            return;
        }

        const hashedPassword = await bcrypt.hash(contrasena, 10);
        const formData = new FormData();
        formData.append('nombre_usuario', usuario);
        formData.append('nombre_completo', nombreCompleto);
        formData.append('contrasena', hashedPassword);
        formData.append('foto_perfil', imagenObject);

        try {

            const response = await fetch('http://localhost:5000/signup/signup', {
                method: 'POST',
                body: formData,
            });

            if (response.status === 200) {
                // Redirigir a la página de inicio
                alert("Registro exitoso");
                window.location.href = '/';
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
            <div className="containerS">
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
                        <div className='mb-3'>
                            <label>Usuario</label>
                        </div>
                        <div className='mb-3'>
                            <input type="text" name="Usuario" placeholder="Ingrese nombre de usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
                        </div>
                        <div className='mb-3'>
                            <label>Nombre Completo</label>
                        </div>
                        <div className='mb-3'>
                            <input type="text" name="NombreCompleto" placeholder="Ingrese su nombre completo" value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)} />
                        </div>
                        <div className='mb-3'>
                            <label>Contraseña</label>
                        </div>
                        <div className='mb-3'>
                            <input type="password" name="Contrasenia" placeholder="Ingrese su contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
                        </div>
                        <div className='mb-3'>
                            <label>Confirmación</label>
                        </div>
                        <div className='mb-3'>
                            <input type="password" name="Confirmacion" placeholder="Ingrese la confirmación de contraseña" value={confirmacion} onChange={(e) => setConfirmacion(e.target.value)} />
                        </div>
                        <div className='mb-3'>
                            <button type="submit" className="btn btn-primary">
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;
