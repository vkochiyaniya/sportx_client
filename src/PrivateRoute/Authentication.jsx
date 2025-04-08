// src/PrivateRoute/Authentication.jsx
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const Authentication = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default Authentication;