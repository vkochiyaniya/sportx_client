import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
  Grid,
  GridItem,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { register, clearError, clearSuccess } from '../../redux/slices/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { loading, error, success } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  // Watch password field for confirmation validation
  const password = watch('Password');

  useEffect(() => {
    if (success) {
      toast({
        title: 'Registration successful',
        description: 'Please login with your credentials',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      dispatch(clearSuccess());
      navigate('/login');
    }
  }, [success, navigate, dispatch, toast]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Registration failed',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      dispatch(clearError());
    }
  }, [error, dispatch, toast]);

  const onSubmit = async (data) => {
    try {
      // Log the raw form data to see what's being submitted
      console.log('Raw form data:', data);
      
      // Create a FormData object with the correct field names
      const formData = new FormData();
      formData.append('name', data.Name);
      formData.append('email', data.Email);
      formData.append('password', data.Password);
      formData.append('confirmPassword', data.ConfirmPassword);
      
      // Log the FormData entries
      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${key === 'password' || key === 'confirmPassword' ? '********' : value}`);
      }
      
      // Check if the form fields are actually present
      if (!data.Name || !data.Email || !data.Password || !data.ConfirmPassword) {
        console.error('Missing form fields:', {
          Name: !!data.Name,
          Email: !!data.Email,
          Password: !!data.Password,
          ConfirmPassword: !!data.ConfirmPassword
        });
        
        toast({
          title: 'Registration failed',
          description: 'Please fill in all required fields',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      
      // Validate passwords match before sending to API
      if (data.Password !== data.ConfirmPassword) {
        toast({
          title: 'Registration failed',
          description: 'Passwords do not match',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      
      await dispatch(register(formData)).unwrap();
    } catch (err) {
      // Error is already handled by the error effect
      console.error('Registration error:', err);
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      py={12}
      px={4}
    >
      <Box
        maxW="md"
        w="full"
        bg="white"
        rounded="xl"
        boxShadow="lg"
        p={8}
      >
        <VStack spacing={6}>
          <Heading size="xl">Create Account</Heading>
          <Text color="gray.600">Join SportX today</Text>

          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle>Registration Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Box>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
            <VStack spacing={4}>
              <FormControl isInvalid={errors.Name}>
                <FormLabel>Name</FormLabel>
                <Input
                  {...register('Name', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                  })}
                  placeholder="Enter your name"
                />
                <FormErrorMessage>
                  {errors.Name && errors.Name.message}
                </FormErrorMessage>
              </FormControl>

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
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
                      },
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

              <FormControl isInvalid={errors.ConfirmPassword}>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <Input
                    {...register('ConfirmPassword', {
                      required: 'Please confirm your password',
                      validate: value =>
                        value === password || 'Passwords do not match',
                    })}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                  />
                  <InputRightElement>
                    <IconButton
                      icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      variant="ghost"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {errors.ConfirmPassword && errors.ConfirmPassword.message}
                </FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={loading || isSubmitting}
                loadingText="Creating account..."
              >
                Sign Up
              </Button>

              <Text>
                Already have an account?{' '}
                <Link as={RouterLink} to="/login" color="blue.500">
                  Sign in
                </Link>
              </Text>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Box>
  );
};

export default Register; 