import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  useToast,
} from '@chakra-ui/react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { executePayment, cancelPayment } from '../../redux/slices/orderSlice';

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

const PaymentMethod = ({ orderId, amount }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  
  const { paymentLoading, paymentError } = useSelector((state) => state.orders);
  
  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // PayPal payment handlers
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount.toFixed(2),
            currency_code: 'USD'
          },
          reference_id: orderId
        }
      ]
    });
  };
  
  const onApprove = async (data, actions) => {
    try {
      // Capture the PayPal order
      const details = await actions.order.capture();
      
      // Execute payment on our backend
      await dispatch(executePayment({
        orderId,
        paymentId: details.id,
        paypalOrderId: data.orderID
      })).unwrap();
      
      // Show success message
      toast({
        title: 'Payment Successful',
        description: 'Your order has been confirmed.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Navigate to order confirmation
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      toast({
        title: 'Payment Failed',
        description: error.message || 'There was an error processing your payment.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  const onError = (err) => {
    toast({
      title: 'Payment Error',
      description: 'There was an error processing your payment. Please try again.',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
    console.error('PayPal Error:', err);
  };
  
  const onCancel = async () => {
    try {
      await dispatch(cancelPayment(orderId)).unwrap();
      toast({
        title: 'Payment Cancelled',
        description: 'You have cancelled the payment process.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Cancel payment error:', error);
    }
  };
  
  if (paymentLoading) {
    return (
      <Box
        p={6}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        bg={bgColor}
      >
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text>Processing payment...</Text>
        </VStack>
      </Box>
    );
  }
  
  return (
    <Box
      p={6}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      bg={bgColor}
    >
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Payment Method</Heading>
        
        {paymentError && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle>Payment Error</AlertTitle>
              <AlertDescription>{paymentError}</AlertDescription>
            </Box>
          </Alert>
        )}
        
        <Text>Total Amount: ${amount.toFixed(2)}</Text>
        
        <Box borderWidth="1px" borderRadius="md" p={4}>
          <PayPalScriptProvider options={{ 
            'client-id': PAYPAL_CLIENT_ID,
            currency: 'USD',
            intent: 'capture'
          }}>
            <PayPalButtons
              style={{
                layout: 'vertical',
                shape: 'rect',
                label: 'pay'
              }}
              createOrder={createOrder}
              onApprove={onApprove}
              onError={onError}
              onCancel={onCancel}
            />
          </PayPalScriptProvider>
        </Box>
        
        <Button
          variant="ghost"
          onClick={() => navigate('/cart')}
          size="sm"
        >
          Cancel and return to cart
        </Button>
      </VStack>
    </Box>
  );
};

export default PaymentMethod; 