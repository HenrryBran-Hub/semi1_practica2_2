// PrivateRoute.js
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('token'); // Verifica si hay un token en el almacenamiento local
  return isLoggedIn ? children : <Navigate to="/" />;
};

export default PrivateRoute;
