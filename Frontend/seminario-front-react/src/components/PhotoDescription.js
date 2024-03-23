import React from 'react';
import { useParams } from 'react-router-dom';

function PhotoDescription({ userData }) {
    // Obtenemos los parámetros de la URL
    console.log(userData);
    let { id } = useParams();
  
    return (
      <div>
        <h1>Página Destino</h1>
        <p>ID: {id}</p>
      </div>
    );
  }
  
  export default PhotoDescription;