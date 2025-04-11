import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Spinner,
  Center,
  VStack,
  Text,
  useToast,
} from '@chakra-ui/react';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const location = useLocation();
  const toast = useToast();
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast({
        title: 'Authentication required',
        description: 'Please login to access this page',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [isAuthenticated, loading, toast]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Center minH="100vh" bg="gray.50">
        <VStack spacing={4}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
          <Text color="gray.600">Checking authentication...</Text>
        </VStack>
      </Center>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the attempted URL for redirect after login
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Check for admin access if required
  if (requireAdmin && user?.role !== 'admin') {
    toast({
      title: 'Access Denied',
      description: 'You do not have permission to access this page',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
    return <Navigate to="/" replace />;
  }

  // Render the protected component
  return (
    <Box>
      {children}
    </Box>
  );
};

export default ProtectedRoute; 