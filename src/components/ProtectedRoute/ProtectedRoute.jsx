import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../../redux/slices/authSlice';
import { Spinner, Center } from '@chakra-ui/react';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated && !loading) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, isAuthenticated, loading]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to home if admin access is required but user is not an admin
  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute; 