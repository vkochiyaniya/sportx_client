import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../redux/AuthReducer/action.js';
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

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { loading, token, user } = useSelector(state => state.auth);

  useEffect(() => {
    if (token && user) {
      toast({
        title: "Registration Successful",
        description: "You've been logged in automatically!",
        status: "success",
        duration: 2000,
      });
      navigate('/account');
    }
  }, [token, user, navigate, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match!",
        status: "error",
        duration: 3000,
      });
      return;
    }

    try {
      await dispatch(registerUser(formData));
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error || 'An error occurred during registration',
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
            <FormLabel>Name</FormLabel>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              autoComplete="name"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              autoComplete="email"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              autoComplete="new-password"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              autoComplete="new-password"
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isLoading={loading}
            loadingText="Creating Account..."
          >
            Create Account
          </Button>

          <Text textAlign="center">
            Already have an account?{' '}
            <Link to="/login" color="blue.500">
              Login here
            </Link>
          </Text>
        </Stack>
      </form>
    </Box>
  );
};

export default SignUp;