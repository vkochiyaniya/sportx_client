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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { forgotPassword, clearError, clearSuccess } from '../../redux/slices/authSlice';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { loading, error, success } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (success) {
      toast({
        title: 'Email sent',
        description: 'Please check your email for password reset instructions',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      dispatch(clearSuccess());
    }
  }, [success, dispatch, toast]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      dispatch(clearError());
    }
  }, [error, dispatch, toast]);

  const onSubmit = async (data) => {
    dispatch(forgotPassword(data.email));
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
          <Heading size="xl">Forgot Password</Heading>
          <Text color="gray.600">
            Enter your email address and we'll send you instructions to reset your password.
          </Text>

          {success && (
            <Alert status="success" rounded="md">
              <AlertIcon />
              <Box>
                <AlertTitle>Email sent!</AlertTitle>
                <AlertDescription>
                  Please check your email for password reset instructions.
                </AlertDescription>
              </Box>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
            <VStack spacing={4}>
              <FormControl isInvalid={errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={loading}
                loadingText="Sending..."
              >
                Send Reset Instructions
              </Button>

              <Text>
                Remember your password?{' '}
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

export default ForgotPassword; 