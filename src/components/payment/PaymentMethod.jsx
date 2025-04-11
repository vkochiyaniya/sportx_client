import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  VStack,
  HStack,
  Text,
  Radio,
  RadioGroup,
  Button,
  useToast,
  Image,
  Spinner,
  Flex,
  Icon,
  Tooltip,
} from '@chakra-ui/react';
import { FaCreditCard, FaPaypal, FaLock } from 'react-icons/fa';
import { initializePayment, executePayment } from '../../redux/slices/orderSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const PaymentMethod = ({ orderId, amount, onSuccess }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      // Initialize payment
      const paymentResult = await dispatch(initializePayment(orderId)).unwrap();
      
      if (paymentMethod === 'paypal') {
        // Redirect to PayPal
        window.location.href = paymentResult.approvalUrl;
      } else {
        // Handle credit card payment
        // This would typically involve a payment gateway integration
        toast({
          title: 'Credit card payment not implemented',
          description: 'Please use PayPal for now',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Payment failed',
        description: error.message || 'Failed to initialize payment',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={6} borderWidth={1} borderRadius="lg" boxShadow="md">
      <VStack spacing={6} align="stretch">
        <Text fontSize="xl" fontWeight="bold">
          Payment Method
        </Text>
        
        <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
          <VStack spacing={4} align="stretch">
            <Box
              p={4}
              borderWidth={1}
              borderRadius="md"
              cursor="pointer"
              onClick={() => setPaymentMethod('paypal')}
              bg={paymentMethod === 'paypal' ? 'blue.50' : 'white'}
              _hover={{ bg: 'blue.50' }}
            >
              <HStack>
                <Radio value="paypal" />
                <Image
                  src={`${API_URL}/images/paypal-logo.png`}
                  alt="PayPal"
                  height="20px"
                  fallbackSrc="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg"
                />
                <Text>Pay with PayPal</Text>
              </HStack>
            </Box>
            
            <Box
              p={4}
              borderWidth={1}
              borderRadius="md"
              cursor="pointer"
              onClick={() => setPaymentMethod('credit_card')}
              bg={paymentMethod === 'credit_card' ? 'blue.50' : 'white'}
              _hover={{ bg: 'blue.50' }}
            >
              <HStack>
                <Radio value="credit_card" />
                <Icon as={FaCreditCard} boxSize={5} />
                <Text>Credit Card</Text>
                <Tooltip label="Coming soon">
                  <Text fontSize="xs" color="gray.500">(Coming soon)</Text>
                </Tooltip>
              </HStack>
            </Box>
          </VStack>
        </RadioGroup>
        
        <Box>
          <Text fontSize="lg" fontWeight="bold">
            Order Summary
          </Text>
          <HStack justify="space-between" mt={2}>
            <Text>Total Amount:</Text>
            <Text fontWeight="bold">${amount.toFixed(2)}</Text>
          </HStack>
        </Box>
        
        <Button
          colorScheme="blue"
          size="lg"
          width="full"
          onClick={handlePayment}
          isLoading={isLoading}
          loadingText="Processing..."
          leftIcon={<FaLock />}
        >
          Pay Now
        </Button>
        
        <Text fontSize="xs" color="gray.500" textAlign="center">
          Your payment information is secure and encrypted
        </Text>
      </VStack>
    </Box>
  );
};

export default PaymentMethod; 