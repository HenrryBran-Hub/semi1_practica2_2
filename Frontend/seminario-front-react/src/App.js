// En el App.js, supongamos que tienes una función para obtener los datos del usuario
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './components/Signup';
import Login from "./components/Login";
import UserPage from "./components/UserPage";
import EditPerfil from "./components/EditPerfil";
import LoadPhoto from "./components/LoadPhoto";
import WatchPhoto from "./components/WatchPhoto";
import EditAlbum from "./components/EditAlbum";
import PrivateRoute from './auth/PrivateRoute';
import PhotoDescription from './components/PhotoDescription';
import './App.css';
import ChatbotPopup from './components/Chatbot';

function App() {
  const [userData, setUserData] = useState(null);
  const [albumData, setAlbumData] = useState(null);
  const [albumDataFoto, setAlbumDataFoto] = useState(null);
  const [descripcionUser, setDescripcionUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch(`http://localhost:5000/editperfil/getperfil?id=${token}`);
          if (response.ok) {
            const userData = await response.json();
            setUserData(userData);
          } else {
            throw new Error('Error al obtener los datos del usuario');
          }
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    };

    const fetchAlbumData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch(`http://localhost:5000/editalbum/getalbum?id=${token}`);
          if (response.ok) {
            const albumData = await response.json();
            setAlbumData(albumData);
          } else {
            throw new Error('Error al obtener los datos del usuario');
          }
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    };

    const fetchAlbumFoto = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch(`http://localhost:5000/loadphoto/watchphoto?id=${token}`);
          if (response.ok) {
            const albumfoto = await response.json();
            setAlbumDataFoto(albumfoto);
          } else {
            throw new Error('Error al obtener los datos del usuario');
          }
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    };

    const fetchDescripcionUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch(`http://localhost:5000/signup/descriptionuser?id=${token}`);
          if (response.ok) {
            const data = await response.json();
            setDescripcionUser(data);
          } else {
            throw new Error('Error al obtener los datos del usuario');
          }
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    };


    fetchUserData();
    fetchAlbumData();
    fetchAlbumFoto();
    fetchDescripcionUser();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          {/* Rutas protegidas */}
          <Route path='/userpage' element={<PrivateRoute><UserPage userData={userData} userDescripcion={descripcionUser} /></PrivateRoute>} />
          <Route path='/editperfil' element={<PrivateRoute><EditPerfil userData={userData} /></PrivateRoute>} />
          <Route path='/loadphoto' element={<PrivateRoute><LoadPhoto userData={userData} albumData={albumData} /></PrivateRoute>} />
          <Route path='/watchphoto' element={<PrivateRoute><WatchPhoto userFoto={albumDataFoto} /></PrivateRoute>} />
          <Route path='/editalbum' element={<PrivateRoute><EditAlbum userData={userData} albumData={albumData} /></PrivateRoute>} />
          <Route path='/photo_descripcion/:id' element={<PrivateRoute><PhotoDescription userData={userData} /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
      <ChatbotPopup />
    </>
  );
}

export default App;
