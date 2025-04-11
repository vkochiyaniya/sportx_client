import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  useToast,
  Divider,
  Text,
  useColorModeValue,
  SimpleGrid,
  Select,
  Flex,
  Spinner,
} from '@chakra-ui/react';
import { setShippingInfo, createOrder } from '../redux/slices/orderSlice';
import OrderSummary from '../components/checkout/OrderSummary';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  
  // Get user and cart state from Redux
  const { user } = useSelector((state) => state.auth);
  const { items: cartItems, total: cartTotal } = useSelector((state) => state.cart);
  const { loading, error, currentOrder } = useSelector((state) => state.orders);
  
  // Form validation with react-hook-form
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue
  } = useForm();
  
  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Please add items to your cart before checkout.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      navigate('/cart');
    }
  }, [cartItems, navigate, toast]);
  
  // Pre-fill form with user data if available
  useEffect(() => {
    if (user) {
      setValue('fullName', user.fullName || '');
      setValue('email', user.email || '');
      setValue('phone', user.phone || '');
    }
  }, [user, setValue]);
  
  // Handle form submission
  const onSubmit = async (data) => {
    try {
      // Save shipping info to Redux
      dispatch(setShippingInfo(data));
      
      // Create order
      const result = await dispatch(createOrder(user.id)).unwrap();
      
      // Navigate to payment page with order ID
      navigate(`/payment/${result.id}`);
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to create order. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Flex justify="center" align="center" minH="60vh">
          <Spinner size="xl" color="blue.500" />
        </Flex>
      </Container>
    );
  }
  
  return (
    <Container maxW="container.xl" py={8}>
      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
        {/* Shipping Information Form */}
        <GridItem>
          <Box
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            bg={bgColor}
            p={6}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            shadow="sm"
          >
            <VStack spacing={6} align="stretch">
              <Heading size="lg">Shipping Information</Heading>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl isInvalid={errors.fullName}>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    {...register('fullName', {
                      required: 'Full name is required',
                      minLength: { value: 3, message: 'Minimum length should be 3' }
                    })}
                  />
                  <FormErrorMessage>
                    {errors.fullName && errors.fullName.message}
                  </FormErrorMessage>
                </FormControl>
                
                <FormControl isInvalid={errors.email}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                  <FormErrorMessage>
                    {errors.email && errors.email.message}
                  </FormErrorMessage>
                </FormControl>
              </SimpleGrid>
              
              <FormControl isInvalid={errors.phone}>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  type="tel"
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^\+?[1-9]\d{1,14}$/,
                      message: 'Invalid phone number'
                    }
                  })}
                />
                <FormErrorMessage>
                  {errors.phone && errors.phone.message}
                </FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={errors.address}>
                <FormLabel>Street Address</FormLabel>
                <Input
                  {...register('address', {
                    required: 'Address is required'
                  })}
                />
                <FormErrorMessage>
                  {errors.address && errors.address.message}
                </FormErrorMessage>
              </FormControl>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl isInvalid={errors.city}>
                  <FormLabel>City</FormLabel>
                  <Input
                    {...register('city', {
                      required: 'City is required'
                    })}
                  />
                  <FormErrorMessage>
                    {errors.city && errors.city.message}
                  </FormErrorMessage>
                </FormControl>
                
                <FormControl isInvalid={errors.state}>
                  <FormLabel>State/Province</FormLabel>
                  <Input
                    {...register('state', {
                      required: 'State is required'
                    })}
                  />
                  <FormErrorMessage>
                    {errors.state && errors.state.message}
                  </FormErrorMessage>
                </FormControl>
              </SimpleGrid>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl isInvalid={errors.zipCode}>
                  <FormLabel>ZIP / Postal Code</FormLabel>
                  <Input
                    {...register('zipCode', {
                      required: 'ZIP code is required'
                    })}
                  />
                  <FormErrorMessage>
                    {errors.zipCode && errors.zipCode.message}
                  </FormErrorMessage>
                </FormControl>
                
                <FormControl isInvalid={errors.country}>
                  <FormLabel>Country</FormLabel>
                  <Select
                    {...register('country', {
                      required: 'Country is required'
                    })}
                    placeholder="Select country"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    {/* Add more countries as needed */}
                  </Select>
                  <FormErrorMessage>
                    {errors.country && errors.country.message}
                  </FormErrorMessage>
                </FormControl>
              </SimpleGrid>
              
              {error && (
                <Text color="red.500" fontSize="sm">
                  {error}
                </Text>
              )}
              
              <Divider />
              
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                isLoading={loading}
                loadingText="Creating Order..."
              >
                Continue to Payment
              </Button>
            </VStack>
        </Box>
        </GridItem>
        
        {/* Order Summary */}
        <GridItem>
          <OrderSummary cartItems={cartItems} cartTotal={cartTotal} />
        </GridItem>
      </Grid>
    </Container>
  );
};

export default Checkout;
