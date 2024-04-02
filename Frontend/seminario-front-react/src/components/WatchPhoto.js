import React, { Fragment } from 'react';
import NavBar from './MyNavBar2';
import { Link } from 'react-router-dom';
import '../styles/Login.css';
import './WatchPhoto.css';

function groupByAlbum(array) {
    return array.reduce((acc, current) => {
        acc[current.Album] = [...(acc[current.Album] || []), current];
        return acc;
    }, {});
}

const WatchPhoto = ({ userFoto }) => {
    // Filtrar las fotos por álbumes
    console.log(userFoto);
    const groupedPhotos = {};
    const albumes = groupByAlbum(userFoto.photos);
    userFoto.photos.forEach((photo) => {
        if (!groupedPhotos[photo.Album]) {
            groupedPhotos[photo.Album] = [];
        }
        groupedPhotos[photo.Album].push(photo);
    });

    // Generar los elementos de los álbumes con espaciado
    const albumElements = [];
    for (const album in groupedPhotos) {
        albumElements.push(

            <div key={album} className="album-container">
                <div>
                    <h2>{album}</h2>
                </div>
                <div className="photos-container">
                    {groupedPhotos[album].map((photo, index) => (
                        <div key={index} className="photo-item">
                            <img src={photo.URL} alt={photo.Foto} className="photo-image" />
                            <p>{photo.Foto}</p>
                            <Link to={`/photo_descripcion/${photo.Id_foto}`}>Ver foto</Link>
                        </div>
                    ))}
                </div>
            </div>
        );
        // Agregar un espacio entre álbumes
        albumElements.push(<div className="album-space" key={`space_${album}`} />);
    }

    // Retornar los álbumes generados
    return (
        <Fragment>
            <NavBar />
            <div className="containerl">
                <div className='container mt-8'>
                    <div className='row justify-content-center'>
                        <div>
                            {Object.keys(albumes).map((album, index) => (
                                <div className='col-10'>
                                    <div key={index}>
                                        <h2 className='Albumtitle'>{album}</h2>
                                        <div className="imagenes">
                                            {albumes[album].map((foto, fotoIndex) => (
                                                <><img key={fotoIndex} src={foto.URL} alt={foto.Foto} /><br/><Link className='custom-link' to={`/photo_descripcion/${foto.Id_foto}`}>Ver foto</Link></>
                                            ))}
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>

                </div>
            </div>


        </Fragment>
    );
};

export default WatchPhoto;
