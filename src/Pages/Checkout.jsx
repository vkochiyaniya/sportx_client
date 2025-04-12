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
} from '@chakra-ui/react';
import { setShippingInfo, createOrder, clearCurrentOrder } from '../redux/slices/orderSlice';
import { initializePayment, executePayment, clearPaymentState } from '../redux/slices/paymentSlice';
import { clearCart } from '../redux/slices/cartSlice';
import OrderSummary from '../components/checkout/OrderSummary';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  
  const { token, userId } = useSelector((state) => state.auth);
  const { items, total } = useSelector((state) => state.cart);
  const { loading: orderLoading, error: orderError, currentOrder } = useSelector((state) => state.order);
  const { loading: paymentLoading, error: paymentError, paymentUrl, paymentStatus } = useSelector((state) => state.payment);

  const [paymentId, setPaymentId] = useState(null);
  const [payerId, setPayerId] = useState(null);

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
  
  const handleCreateOrder = async () => {
    try {
      await dispatch(createOrder(userId)).unwrap();
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  const handleInitializePayment = async () => {
    if (!currentOrder) {
      toast({
        title: 'Error',
        description: 'Please create an order first',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      const paymentDetails = {
        orderId: currentOrder.id,
        amount: total,
        currency: 'USD',
        description: 'Sports Equipment Purchase'
      };

      await dispatch(initializePayment(paymentDetails)).unwrap();
    } catch (error) {
      console.error('Failed to initialize payment:', error);
    }
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

  if (orderError || paymentError) {
    return (
      <Container py={10}>
        <Alert status="error" mb={4}>
          <AlertIcon />
          {orderError || paymentError}
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
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="xl">Checkout</Heading>
        
        {/* Order Summary */}
        <Box p={6} borderWidth={1} borderRadius="lg">
          <Heading size="md" mb={4}>Order Summary</Heading>
          {items.map((item) => (
            <Box key={item.id} mb={4}>
              <HStack justify="space-between">
                <Text>{item.name}</Text>
                <Text>${item.price * item.quantity}</Text>
              </HStack>
              <Text fontSize="sm" color="gray.500">Quantity: {item.quantity}</Text>
            </Box>
          ))}
          <Divider my={4} />
          <HStack justify="space-between">
            <Text fontWeight="bold">Total</Text>
            <Text fontWeight="bold">${total}</Text>
          </HStack>
        </Box>

        {/* Order Status */}
        {currentOrder && (
          <Box p={6} borderWidth={1} borderRadius="lg">
            <Heading size="md" mb={4}>Order Status</Heading>
            <Badge colorScheme="green" p={2} borderRadius="md">
              Order Created
            </Badge>
          </Box>
        )}

        {/* Payment Status */}
        {paymentStatus && (
          <Box p={6} borderWidth={1} borderRadius="lg">
            <Heading size="md" mb={4}>Payment Status</Heading>
            <Badge 
              colorScheme={paymentStatus === 'completed' ? 'green' : 'red'} 
              p={2} 
              borderRadius="md"
            >
              {paymentStatus === 'completed' ? 'Payment Completed' : 'Payment Cancelled'}
            </Badge>
          </Box>
        )}

        {/* Action Buttons */}
        <Flex justify="space-between">
          <Button onClick={() => navigate('/cart')}>Back to Cart</Button>
          {!currentOrder && (
            <Button colorScheme="blue" onClick={handleCreateOrder}>
              Create Order
            </Button>
          )}
          {currentOrder && !paymentStatus && (
            <Button colorScheme="green" onClick={handleInitializePayment}>
              Proceed to Payment
            </Button>
          )}
        </Flex>
      </VStack>
    </Container>
  );
};

export default Checkout;
