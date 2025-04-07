import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { loginUser } from '../redux/AuthReducer/action.js';
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  Stack, 
  Text, 
  useToast 
} from '@chakra-ui/react';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  
  // Get loading and error from Redux state
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser({ email, password }));
      if (result?.payload?.userId) {
        await dispatch(loadUser(result.payload.userId));
        navigate("/account");
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error || 'Invalid credentials',
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Box p={4} maxW="md" mx="auto">
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isLoading={loading}
          >
            Sign In
          </Button>

          {error && (
            <Text color="red.500" textAlign="center">
              {error}
            </Text>
          )}

          <Text textAlign="center">
            Don't have an account?{' '}
            <RouterLink to="/register" style={{ color: 'blue.500' }}>
              Register here
            </RouterLink>
          </Text>
        </Stack>
      </form>
    </Box>
  );
};

export default Login;