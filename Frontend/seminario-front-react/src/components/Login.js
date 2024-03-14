import React, { useState } from 'react';
import NavBar from './MyNavBar';
import imagen from '../img/fauna.png'; // Importa la imagen
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Verificar que todos los campos estén llenos
        if (!username || !password) {
            alert('Por favor, llene todos los campos');
            return;
        }

        // Cifra la contraseña antes de enviarla
        const formData = new FormData();
        formData.append('nombre_usuario', username);
        formData.append('contrasena', password);

        try {
            const response = await fetch('http://localhost:5000/signup/login', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            const token = data.token;
            console.log(token);
            localStorage.setItem('token', token);
            window.location.href = `/userpage`;

        } catch (error) {
            console.error('Error en la solicitud:', error);
            // Recarga la página si hay un error en la solicitud
            window.location.reload();
        }
    };

    return (
        <div>
            <NavBar />
            <div className="containerl">
                <form onSubmit={handleSubmit} className="border p-3 rounded mr-3 form-containerl">
                    <div className="image-containerl">
                        <img className='container-imgl' src={imagen} alt="Descripción de la imagen" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="correo">Usuario:</label>
                        <input
                            className="form-control"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña:</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
