import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Divider,
  SimpleGrid,
  GridItem,
  Badge,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaShoppingBag, FaHome } from 'react-icons/fa';
import { fetchOrderById } from '../redux/slices/orderSlice';
import { formatPrice, formatDate } from '../utils/invoiceUtils';
import InvoiceDownloadButton from '../components/invoice/InvoiceDownloadButton';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  
  // Get order state from Redux
  const { currentOrder, loading, error } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);
  
  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
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
      navigate('/');
    }
    
    if (currentOrder && currentOrder.userId !== user?.id) {
      toast({
        title: 'Unauthorized',
        description: 'You are not authorized to view this order.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
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
          <Box>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Box>
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
        <Box
          p={6}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          bg={bgColor}
        >
          <VStack spacing={4} align="stretch">
            <Heading size="xl" textAlign="center">Order Confirmed!</Heading>
            <Text textAlign="center" color="green.500">
              Thank you for your purchase. Your order has been successfully placed.
            </Text>
            
            <Divider />
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <GridItem>
                <VStack align="stretch" spacing={3}>
                  <Heading size="md">Order Details</Heading>
                  <Text><strong>Order ID:</strong> #{currentOrder.id}</Text>
                  <Text><strong>Order Date:</strong> {formatDate(currentOrder.createdAt)}</Text>
                  <Text><strong>Status:</strong> 
                    <Badge ml={2} colorScheme={currentOrder.status === 'paid' ? 'green' : 'yellow'}>
                      {currentOrder.status.toUpperCase()}
                    </Badge>
                  </Text>
                </VStack>
              </GridItem>
              
              <GridItem>
                <VStack align="stretch" spacing={3}>
                  <Heading size="md">Shipping Information</Heading>
                  <Text><strong>Name:</strong> {currentOrder.shippingInfo?.fullName}</Text>
                  <Text><strong>Address:</strong> {currentOrder.shippingInfo?.address}</Text>
                  <Text><strong>City:</strong> {currentOrder.shippingInfo?.city}</Text>
                  <Text><strong>State:</strong> {currentOrder.shippingInfo?.state}</Text>
                  <Text><strong>Zip Code:</strong> {currentOrder.shippingInfo?.zipCode}</Text>
                  <Text><strong>Country:</strong> {currentOrder.shippingInfo?.country}</Text>
                </VStack>
              </GridItem>
            </SimpleGrid>
            
            <Divider />
            
            <VStack align="stretch" spacing={4}>
              <Heading size="md">Order Items</Heading>
              {currentOrder.items?.map((item) => (
                <Box
                  key={item.id}
                  p={4}
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <GridItem>
                      <Text fontWeight="bold">{item.name}</Text>
                      <Text color="gray.600">Quantity: {item.quantity}</Text>
                    </GridItem>
                    <GridItem>
                      <Text>Price: {formatPrice(item.price)}</Text>
                    </GridItem>
                    <GridItem>
                      <Text fontWeight="bold">
                        Total: {formatPrice(item.price * item.quantity)}
                      </Text>
                    </GridItem>
                  </SimpleGrid>
                </Box>
              ))}
            </VStack>
            
            <Divider />
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <GridItem>
                <VStack align="stretch" spacing={3}>
                  <Text><strong>Subtotal:</strong> {formatPrice(currentOrder.subtotal)}</Text>
                  {currentOrder.discount > 0 && (
                    <Text><strong>Discount:</strong> {formatPrice(currentOrder.discount)}</Text>
                  )}
                  <Text fontSize="xl" fontWeight="bold">
                    Total: {formatPrice(currentOrder.total)}
                  </Text>
                </VStack>
              </GridItem>
              
              <GridItem>
                <VStack spacing={4}>
                  <InvoiceDownloadButton 
                    orderId={orderId}
                    colorScheme="blue"
                    isFullWidth
                  />
                  <Button
                    leftIcon={<FaShoppingBag />}
                    variant="outline"
                    onClick={() => navigate('/orders')}
                    width="full"
                  >
                    View All Orders
                  </Button>
                  <Button
                    leftIcon={<FaHome />}
                    variant="ghost"
                    onClick={() => navigate('/')}
                    width="full"
                  >
                    Continue Shopping
                  </Button>
                </VStack>
              </GridItem>
            </SimpleGrid>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default OrderConfirmation; 