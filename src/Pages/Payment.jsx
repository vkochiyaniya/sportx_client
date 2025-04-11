import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Grid,
  GridItem,
  VStack,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';
import PaymentMethod from '../components/checkout/PaymentMethod';
import OrderSummary from '../components/checkout/OrderSummary';
import { fetchOrderById } from '../redux/slices/orderSlice';

const Payment = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  
  // Get order and auth state from Redux
  const { currentOrder, loading, error } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);
  
  // Fetch order details when component mounts
  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId));
    }
  }, [dispatch, orderId]);
  
  // Redirect if no order or unauthorized
  useEffect(() => {
    if (!loading && !currentOrder) {
      toast({
        title: 'Error',
        description: 'Order not found.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      navigate('/cart');
    }
    
    if (currentOrder && currentOrder.userId !== user?.id) {
      toast({
        title: 'Unauthorized',
        description: 'You are not authorized to view this order.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      navigate('/cart');
    }
  }, [loading, currentOrder, user, navigate, toast]);
  
  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={4} align="center" justify="center" minH="60vh">
          <Spinner size="xl" color="blue.500" />
          <Text>Loading order details...</Text>
        </VStack>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Container>
    );
  }
  
  if (!currentOrder) {
    return null;
  }
  
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="xl">Complete Your Payment</Heading>
        <Text color="gray.600">
          Order #{currentOrder.id}
        </Text>
        
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
          {/* Payment Method */}
          <GridItem>
            <PaymentMethod
              orderId={currentOrder.id}
              amount={currentOrder.total}
            />
          </GridItem>
          
          {/* Order Summary */}
          <GridItem>
            <OrderSummary
              cartItems={currentOrder.items}
              cartTotal={currentOrder.total}
            />
          </GridItem>
        </Grid>
      </VStack>
    </Container>
  );
};

export default Payment; 