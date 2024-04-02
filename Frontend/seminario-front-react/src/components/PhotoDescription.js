import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import '../styles/PhotoDescription.css';

function PhotoDescription({ userData }) {
  let { id } = useParams();

  const [foto, setFoto] = useState({
    "id": 0,
    "nombre_foto": "",
    "descripcion": "",
    "url_foto": "",
    "id_album": 0,
    "estado": 0
  });
  const [selectedValue, setSelectedValue] = useState(1);

  const [translateDesc, setTranslateDesc] = useState('');

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/watchphoto/getphotobyid?id=${id}`)
        .then(response => response.json())
        .then(data => {
          setFoto(data[0])
        }).catch(err => { console.log(err) })
    }

  }, [id]);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const btnTraducir = () => {
    if(!foto.descripcion){
      alert("La foto no tiene descripción");
      return;
    }
    fetch(`http://localhost:5000/watchphoto/translate?id=${selectedValue}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({descripcion: foto.descripcion})
    })
      .then(response => response.json())
      .then(data => {
        setTranslateDesc(data)
      }).catch(err => { console.log(err) })
  }

  return (
    <div>
      <div className='container mt-4'>
        <div className='row justify-content-center'>
          <div className='col-6'>
            <img src={foto.url_foto} alt='foto' className='rounded mb-5' />
          </div>
          <div className='col-6'>
            <NavLink to="/watchphoto" className="btn btn-success"> Regresar a ver fotos </NavLink>
          </div>
        </div>
        <div className='col-6'>
          <div>
            <h4>Descripción</h4>
            <p> {foto.descripcion} </p>
          </div>
          <div className='row'>
            <div className='col-4'>
              <select className='form-select' value={selectedValue} onChange={handleChange}>
                <option value={1}> Inglés </option>
                <option value={2}> Frances </option>
                <option value={3}> Portugues </option>
              </select>
            </div>
            <div className='col-4'>
              <button className='btn btn-primary' onClick={btnTraducir}> Traducir </button>
            </div>
          </div>
          <div className='mt-5'>
            <h4>{translateDesc ? 'Traducción' : ''}</h4>
            <p> {translateDesc} </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhotoDescription;