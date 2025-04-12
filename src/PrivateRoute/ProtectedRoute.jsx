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
  const { isAuthenticated, loading, token, userId } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log('ProtectedRoute auth state:', {
      isAuthenticated,
      loading,
      token: token ? 'present' : 'missing',
      userId: userId ? 'present' : 'missing'
    });

    if (!loading && !isAuthenticated) {
      console.log('Redirecting to login - auth check failed');
      toast({
        title: 'Authentication required',
        description: 'Please login to access this page',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    } 
  }, [isAuthenticated, loading, token, userId, toast]);

  // Show loading spinner while checking authentication
  if (loading) {
    console.log('Showing loading spinner');
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
    console.log('Not authenticated, redirecting to login');
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  console.log('Auth check passed, rendering protected content');
  // Render the protected component
  return children;
};

export default ProtectedRoute; 