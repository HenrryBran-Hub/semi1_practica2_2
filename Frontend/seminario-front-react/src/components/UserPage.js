import React, { useState } from 'react';
import NavBar from './MyNavBar2';
import '../styles/UserPage.css';

const UserPage = ({ userData, userDescripcion }) => {
    // Verificar si userData está definido y obtener los valores correspondientes
    const usuario = userData ? userData.nombre_usuario : '';
    const nombreCompleto = userData ? userData.nombre_completo : '';
    const imagen = userData ? userData.foto_perfil : '';
    const descripcionuser = userDescripcion ? userDescripcion : '';
    const [showExtraer, setExtraer] = useState(false);
    const [imagenextrare, setImagenExtraer] = useState(null);
    const [imagenObject, setImagenObject] = useState(null);
    const halfLength = Math.ceil(Object.entries(descripcionuser).length / 2);
    const firstHalf = Object.entries(descripcionuser).slice(0, halfLength);
    const secondHalf = Object.entries(descripcionuser).slice(halfLength);
    const [thirdHalf, setThirdHalf] = useState([]);
    const [fourthHalf, setFourthHalf] = useState([]);

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

        if (!imagenObject) {
            alert('Por favor, seleccione una imagen');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result.split(',')[1]; // Get base64 string
            sendDataToServer(base64String);
        };
        reader.readAsDataURL(imagenObject);
    };

    const sendDataToServer = async (base64String) => {

        const formData = new FormData();
        formData.append('base64Image', base64String);

        try {
            const response = await fetch('http://localhost:5000/signup/descriptiongeneral', {
                method: 'POST',
                body: formData,
            });
            if (response.status === 200) {
                // Redirigir a la página de inicio

                const data = await response.json();
                const halfLength = Math.ceil(Object.entries(data).length / 2);
                const thirdHalfData = Object.entries(data).slice(0, halfLength);
                const fourthHalfData = Object.entries(data).slice(halfLength);
                setThirdHalf(thirdHalfData);
                setFourthHalf(fourthHalfData);
                alert("Escaneado con exito");

            } else {
                // Recargar la página
                alert("Lo siento no se puedo escanear la imagen.");
                window.location.reload();
            }
        } catch (error) {
            alert("Error en la solicitud");
            console.error('Error en la solicitud:', error);
            window.location.reload();
        }

    };

    return (
        <div>
            <NavBar />

            {!showExtraer && (
                <div className="containerUserPage">
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
                    <div className='contornoUserPage'>
                        <div >
                            <label className="labeluserpage">Descripcion:</label>
                        </div>
                        <div className="container-tables">
                            <table>
                                <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>Nombre</th>
                                        <th>Confianza</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {firstHalf.map(([key, value], index) => (
                                        <tr key={key}>
                                            <td>{index + 1}</td>
                                            <td>{value.nombre}</td>
                                            <td>{value.confianza}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <table>
                                <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>Nombre</th>
                                        <th>Confianza</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {secondHalf.map(([key, value], index) => (
                                        <tr key={key}>
                                            <td>{index + halfLength + 1}</td>
                                            <td>{value.nombre}</td>
                                            <td>{value.confianza}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
            {showExtraer && (
                <div className="containerUserPage">
                    <form className="contornoUserPage" onSubmit={handleSubmit}>
                        <h1 className='tituloUserPage'>Escaneando información</h1>
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
                        <div className="form-group">
                            <button type="button" className="butonsignupuserpage" onClick={handleSubmit}>Escanear</button>
                        </div>
                        <div className="form-group">
                            <button type="button" className="butonsignupuserpage" onClick={stopExtraer}>Cancelar</button>
                        </div>
                    </form>
                    <div className='contornoUserPage'>
                        <div >
                            <label className="labeluserpage">Descripcion:</label>
                        </div>
                        <div className="container-tables">
                            <table>
                                <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>Nombre</th>
                                        <th>Confianza</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {thirdHalf.map(([key, value], index) => (
                                        <tr key={key}>
                                            <td>{index + 1}</td>
                                            <td>{value.nombre}</td>
                                            <td>{value.confianza}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <table>
                                <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>Nombre</th>
                                        <th>Confianza</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fourthHalf.map(([key, value], index) => (
                                        <tr key={key}>
                                            <td>{index + halfLength + 1}</td>
                                            <td>{value.nombre}</td>
                                            <td>{value.confianza}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserPage;
