import React, { useState } from 'react';
import Webcam from 'react-webcam';
import NavBar from './MyNavBar';
import imagen from '../img/fauna.png'; // Importa la imagen
import '../styles/Login.css';
import md5 from 'md5';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showCamera, setShowCamera] = useState(false);

    const webcamRef = React.useRef(null); // Referencia a la webcam

    const startCamera = () => {
        setShowCamera(true);
    };

    const stopCamera = () => {
        setShowCamera(false);
    };

    const capturePhoto = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        return imageSrc;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!username || !password) {
            alert('Por favor, llene todos los campos');
            return;
        }

        const hashedPassword = md5(password);
        const formData = new FormData();
        formData.append('nombre_usuario', username);
        formData.append('contrasena', hashedPassword);

        try {
            const response = await fetch('http://localhost:5000/signup/login', {
                method: 'POST',
                body: formData,
            });

            if (response.status === 200) {
                // Redirigir a la página de inicio
                alert("Bienvenido");
                const data = await response.json();
                const token = data.token;
                console.log(token);
                localStorage.setItem('token', token);
                window.location.href = `/userpage`;
            } else {
                // Recargar la página
                alert("Lo siento, ingreso mal  usuario o contraseña.");
                window.location.reload();
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            window.location.reload();
        }
    };

    const handleSubmitCamera = async () => {

        const photoData = capturePhoto();

        const formData = new FormData();
        formData.append('imagen_base64', photoData);

        try {
            const response = await fetch('http://localhost:5000/signup/loginfoto', {
                method: 'POST',
                body: formData,
            });
            if (response.status === 200) {
                // Redirigir a la página de inicio
                alert("Bienvenido");
                const data = await response.json();
                const token = data.token;
                console.log(token);
                localStorage.setItem('token', token);
                window.location.href = `/userpage`;
            } else {
                // Recargar la página
                alert("Lo siento, ingreso mal  usuario o contraseña.");
                window.location.reload();
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            window.location.reload();
        }
    };

    return (
        <div>
            <NavBar />
            <div className="containerL" >
                {!showCamera && (
                    <form onSubmit={handleSubmit} className="contornoL">
                        <div className="image-containerl">
                            <img className='container-imgl' src={imagen} alt="Descripción de la imagen" />
                        </div>
                        <label htmlFor="correo" className='labellogin'>Usuario:</label>
                        <div>
                            <input
                                className="inputlogin"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <label htmlFor="password" className='labellogin'>Contraseña:</label>
                        <div>
                            <input
                                type="password"
                                className='inputlogin'
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}

                            />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="butonlogin">Iniciar Sesión</button>
                        </div>
                        <div className="form-group">
                            <button type="button" className="butonlogin" onClick={startCamera}>Inicio de sesión por cámara</button>
                        </div>
                    </form>
                )}
                {showCamera && (
                    <form className="contornoL" onSubmit={handleSubmitCamera}>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            className='webcamstyle'
                        />

                        <button type="button" className="butonlogin" onClick={handleSubmitCamera}>Iniciar Sesión con Foto</button>
                        <button type="button" className="butonlogin" onClick={stopCamera}>Cancelar</button>

                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
