import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, Text, VStack, Code, useToast } from '@chakra-ui/react';
import axios from 'axios';

const AuthTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const toast = useToast();

  const testAuth = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userId = user?.id;
      
      console.log('Auth Test - User ID:', userId);
      console.log('Auth Test - Token:', token);
      
      if (!token || !userId) {
        throw new Error('Missing token or user ID');
      }

      const response = await axios.get(
        `https://localhost:7214/api/Cart/getUserCartItems/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setTestResult({
        success: true,
        data: response.data,
        headers: response.config.headers,
      });
      
      toast({
        title: 'Authentication Test Successful',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Auth Test Error:', error);
      setTestResult({
        success: false,
        error: error.message,
        response: error.response?.data,
      });
      
      toast({
        title: 'Authentication Test Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Text fontSize="xl" fontWeight="bold">Authentication Test</Text>
        
        <Box>
          <Text>Current User:</Text>
          <Code p={2} display="block" whiteSpace="pre-wrap">
            {JSON.stringify(user, null, 2)}
          </Code>
        </Box>

        <Box>
          <Text>Token from localStorage:</Text>
          <Code p={2} display="block" whiteSpace="pre-wrap">
            {localStorage.getItem('token')}
          </Code>
        </Box>

        <Button
          colorScheme="blue"
          onClick={testAuth}
          isLoading={loading}
        >
          Test Authentication
        </Button>

        {testResult && (
          <Box>
            <Text>Test Result:</Text>
            <Code p={2} display="block" whiteSpace="pre-wrap">
              {JSON.stringify(testResult, null, 2)}
            </Code>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default AuthTest; 