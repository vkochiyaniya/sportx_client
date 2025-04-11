import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

const Authentication = ({ children }) => {
  const location = useLocation();
  const toast = useToast();
  const { isAuthenticated, loading, token } = useSelector((state) => state.auth);

  useEffect(() => {
    // Optional: Show a toast if redirected from a protected route
    if (!isAuthenticated && location.state?.message) {
      toast({
        title: "Authentication Required",
        description: location.state.message,
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top"
      });
    }
  }, [isAuthenticated, location.state, toast]);

  // Show nothing during loading
  if (loading) {
    return null; // Or a loading spinner
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !token) {
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from: location.pathname, 
          message: "Please log in to access this page" 
        }} 
        replace 
      />
    );
  }

  // Render children if authenticated
  return children;
};

export default Authentication;
