import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  useToast,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
  Container,
  HStack,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { login, clearError, clearSuccess } from '../../redux/slices/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { loading, error, success, isAuthenticated } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = React.useState(false);

  // Get the redirect path from location state or default to profile
  const from = location.state?.from || '/profile';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (success) {
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      dispatch(clearSuccess());
      navigate(from, { replace: true });
    }
  }, [success, navigate, dispatch, toast, from]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Login failed',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      dispatch(clearError());
    }
  }, [error, dispatch, toast]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const onSubmit = async (data) => {
    try {
      // Format data for the API with uppercase field names
      const formData = {
        Email: data.Email,
        Password: data.Password
      };
      
      console.log('Submitting login form with data:', {
        Email: formData.Email,
        Password: '********' // Don't log the actual password
      });
      
      await dispatch(login(formData)).unwrap();
    } catch (err) {
      console.error('Login error:', err);
      // Error handling is done in the error effect
    }
  };

  return (
    <Container maxW="container.sm" py={10}>
      <Box
        p={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
      >
        <VStack spacing={6} align="stretch">
          <Heading textAlign="center" mb={6}>
            Sign In
          </Heading>

          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4}>
              <FormControl isInvalid={errors.Email}>
                <FormLabel>Email</FormLabel>
                <Input
                  {...register('Email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  placeholder="Enter your email"
                />
                <FormErrorMessage>
                  {errors.Email && errors.Email.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.Password}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    {...register('Password', {
                      required: 'Password is required',
                    })}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                  />
                  <InputRightElement>
                    <IconButton
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {errors.Password && errors.Password.message}
                </FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={loading || isSubmitting}
                loadingText="Signing in..."
              >
                Sign In
              </Button>

              <HStack width="full" justify="space-between">
                <Link as={RouterLink} to="/forgot-password" color="blue.500">
                  Forgot password?
                </Link>
                <Link as={RouterLink} to="/register" color="blue.500">
                  Create account
                </Link>
              </HStack>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Container>
  );
};

export default Login; 