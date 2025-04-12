import React, { useEffect, useState } from 'react';
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
  Alert,
  AlertIcon,
  HStack,
  Badge,
  Center
} from '@chakra-ui/react';
import { setShippingInfo, createOrder, clearCurrentOrder } from '../redux/slices/orderSlice';
import { initializePayment, executePayment, clearPaymentState } from '../redux/slices/paymentSlice';
import { clearCart } from '../redux/slices/cartSlice';
import OrderSummary from '../components/checkout/OrderSummary';
import { PayPalButtons } from '@paypal/react-paypal-js';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  
  const { token, userId } = useSelector((state) => state.auth) || {};
  const { items: cartItems = [], loading: cartLoading } = useSelector((state) => state.cart) || {};
  const { currentOrder, loading: orderLoading } = useSelector((state) => state.order) || {};
  const { loading: paymentLoading, error: paymentError, paymentUrl, paymentStatus } = useSelector((state) => state.payment) || {};

  console.log('Cart State:', cartItems);
  console.log('Cart Loading:', cartLoading);

  const [paymentId, setPaymentId] = useState(null);
  const [payerId, setPayerId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
  
  useEffect(() => {
    console.log('Cart Items in useEffect:', cartItems);
    if (!token || !userId) {
      navigate('/login');
      return;
    }

    // Check for payment parameters in URL
    const urlParams = new URLSearchParams(window.location.search);
    const paymentId = urlParams.get('paymentId');
    const payerId = urlParams.get('PayerID');

    if (paymentId && payerId) {
      setPaymentId(paymentId);
      setPayerId(payerId);
      handleExecutePayment(paymentId, payerId);
    }
  }, [token, userId, navigate]);
  
  // Pre-fill form with user data if available
  useEffect(() => {
    if (token) {
      setValue('fullName', token.fullName || '');
      setValue('email', token.email || '');
      setValue('phone', token.phone || '');
    }
  }, [token, setValue]);
  
  useEffect(() => {
    console.log('Cart Items in useEffect:', cartItems);
    if (!cartItems || cartItems.length === 0) {
      console.log('Cart is empty, redirecting to cart page');
      toast({
        title: 'Cart is empty',
        description: 'Please add items to your cart before checkout',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      navigate('/cart');
    }
  }, [cartItems, navigate, toast]);

  const onSubmit = async (data) => {
    try {
      setIsProcessing(true);
      
      // Create order with cart items
      const orderData = {
        userId: userId,
        items: cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        shippingInfo: {
          fullName: data.fullName,
          email: data.email,
          address: data.address,
          city: data.city,
          postalCode: data.postalCode
        },
        total: calculateTotal(),
        status: 'pending'
      };
      
      console.log('Submitting order data:', orderData);
      const orderResult = await dispatch(createOrder(orderData)).unwrap();
      console.log('Order created:', orderResult);
      
      // Initialize payment
      const paymentResult = await dispatch(initializePayment(orderResult.id)).unwrap();
      console.log('Payment initialized:', paymentResult);
      
      // Redirect to PayPal
      window.location.href = paymentResult.approvalUrl;
    } catch (error) {
      console.error('Order submission error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to process order',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleExecutePayment = async (paymentId, payerId) => {
    try {
      await dispatch(executePayment({ paymentId, payerId })).unwrap();
      dispatch(clearCart());
      dispatch(clearCurrentOrder());
      dispatch(clearPaymentState());
      navigate('/orders');
    } catch (error) {
      console.error('Failed to execute payment:', error);
    }
  };

  if (orderLoading || paymentLoading) {
    return (
      <Container centerContent py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Processing your order...</Text>
      </Container>
    );
  }

  if (paymentError) {
    return (
      <Container py={10}>
        <Alert status="error" mb={4}>
          <AlertIcon />
          {paymentError}
        </Alert>
        <Button onClick={() => navigate('/cart')}>Back to Cart</Button>
      </Container>
    );
  }

  if (paymentUrl) {
    window.location.href = paymentUrl;
    return null;
  }

  return (
    <Box maxW="container.xl" mx="auto" p={4}>
      <Heading mb={6}>Checkout</Heading>
      
      <HStack align="start" spacing={8}>
        {/* Shipping Form */}
        <Box flex={1} as="form" onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4} align="stretch">
            <Heading size="md">Shipping Information</Heading>
            
            <FormControl isInvalid={errors.fullName}>
              <FormLabel>Full Name</FormLabel>
              <Input
                {...register('fullName', { required: 'Full name is required' })}
                placeholder="Enter your full name"
              />
            </FormControl>

            <FormControl isInvalid={errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                placeholder="Enter your email"
              />
            </FormControl>

            <FormControl isInvalid={errors.address}>
              <FormLabel>Address</FormLabel>
              <Input
                {...register('address', { required: 'Address is required' })}
                placeholder="Enter your address"
              />
            </FormControl>

            <FormControl isInvalid={errors.city}>
              <FormLabel>City</FormLabel>
              <Input
                {...register('city', { required: 'City is required' })}
                placeholder="Enter your city"
              />
            </FormControl>

            <FormControl isInvalid={errors.postalCode}>
              <FormLabel>Postal Code</FormLabel>
              <Input
                {...register('postalCode', { required: 'Postal code is required' })}
                placeholder="Enter your postal code"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isProcessing}
              loadingText="Processing..."
            >
              Proceed to Payment
            </Button>
          </VStack>
        </Box>

        {/* Order Summary */}
        <Box flex={1} p={4} borderWidth={1} borderRadius="lg">
          <Heading size="md" mb={4}>Order Summary</Heading>
          <VStack spacing={4} align="stretch">
            {cartItems.map((item) => (
              <HStack key={`${item.cartItemId}-${item.product.id}`} justify="space-between">
                <Text>{item.product.name} x {item.quantity}</Text>
                <Text>${(item.product.price * item.quantity).toFixed(2)}</Text>
              </HStack>
            ))}
            <Divider />
            <HStack key="total" justify="space-between">
              <Text fontWeight="bold">Total</Text>
              <Text fontWeight="bold">${calculateTotal().toFixed(2)}</Text>
            </HStack>
          </VStack>
        </Box>
      </HStack>
    </Box>
  );
};

export default Checkout;
