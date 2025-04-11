import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
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
  Container,
  FormErrorMessage,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { forgotPassword, clearError } from '../../redux/slices/authSlice';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { loading, error } = useSelector((state) => state.auth);
  const [emailSent, setEmailSent] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await dispatch(forgotPassword(data.email)).unwrap();
      setEmailSent(true);
      toast({
        title: 'Email sent',
        description: 'Please check your email for password reset instructions',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to send reset email',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  React.useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  if (emailSent) {
    return (
      <Container maxW="container.sm" py={10}>
        <Box
          p={8}
          borderWidth={1}
          borderRadius="lg"
          boxShadow="lg"
          bg="white"
        >
          <VStack spacing={4} align="stretch">
            <Alert status="success" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle>Email Sent!</AlertTitle>
                <AlertDescription>
                  We've sent password reset instructions to your email address.
                  Please check your inbox and follow the link to reset your password.
                </AlertDescription>
              </Box>
            </Alert>
            <Text textAlign="center">
              <Link as={RouterLink} to="/login" color="blue.500">
                Return to Login
              </Link>
            </Text>
          </VStack>
        </Box>
      </Container>
    );
  }

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
            Reset Password
          </Heading>

          <Text textAlign="center" color="gray.600">
            Enter your email address and we'll send you instructions to reset your password.
          </Text>

          <form onSubmit={handleSubmit(onSubmit)}>
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
            </VStack>
          </form>

          <Text textAlign="center">
            Remember your password?{' '}
            <Link as={RouterLink} to="/login" color="blue.500">
              Login here
            </Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default ForgotPassword; 