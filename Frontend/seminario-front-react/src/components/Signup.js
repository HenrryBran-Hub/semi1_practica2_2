import React, { useState } from 'react';
import NavBar from './MyNavBar';
import '../styles/Signup.css';
import md5 from 'md5';

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

        const hashedPassword = md5(contrasena);
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
            <form className='containerS' onSubmit={handleSubmit}>
                <div className='cuadrado'>
                    <div className='contorno'>
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
                        {imagen && (
                            <img src={imagen} alt="Imagen seleccionada" className="container-imgS" />
                        )}
                    </div>
                </div>
                <div className='cuadrado'>
                    <div className='contorno'>
                        <div className='mb-3'>
                            <label className='labelsignup'>Usuario</label>
                        </div>
                        <div className='mb-3'>
                            <input className='inputsignup' type="text" name="Usuario" placeholder="Ingrese nombre de usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
                        </div>
                        <div className='mb-3'>
                            <label className='labelsignup'>Nombre Completo</label>
                        </div>
                        <div className='mb-3'>
                            <input className='inputsignup' type="text" name="NombreCompleto" placeholder="Ingrese su nombre completo" value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)} />
                        </div>
                        <div className='mb-3'>
                            <label className='labelsignup'>Contraseña</label>
                        </div>
                        <div className='mb-3'>
                            <input className='inputsignup' type="password" name="Contrasenia" placeholder="Ingrese su contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
                        </div>
                        <div className='mb-3'>
                            <label className='labelsignup'>Confirmación</label>
                        </div>
                        <div className='mb-3'>
                            <input className='inputsignup' type="password" name="Confirmacion" placeholder="Ingrese la confirmación de contraseña" value={confirmacion} onChange={(e) => setConfirmacion(e.target.value)} />
                        </div>
                        <div className='mb-3'>
                            <button type="submit" className="butonsignup">
                                Registrarse
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Signup;
