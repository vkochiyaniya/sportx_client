// src/PrivateRoute/Authentication.jsx
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const Authentication = ({ children }) => {
  const location = useLocation();
  const { token } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default Authentication;