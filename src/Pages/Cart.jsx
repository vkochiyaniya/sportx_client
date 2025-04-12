import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Image,
  Input,
  Stack,
  Text,
  useToast,
  IconButton,
  Spinner,
  VStack,
  HStack,
  Divider,
  Badge,
  InputGroup,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { DeleteIcon, AddIcon, MinusIcon } from '@chakra-ui/icons';
import { fetchCartItems, removeFromCart, updateCartQuantity, applyVoucher } from '../redux/slices/cartSlice';
import { useForm } from 'react-hook-form';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { token, userId, isAuthenticated } = useSelector((state) => state.auth);
  const { items, loading, error, subtotal, discount, total, voucher } = useSelector((state) => state.cart);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const [voucherCode, setVoucherCode] = useState('');

  useEffect(() => {
    const checkAuthAndFetchCart = async () => {
      // Check authentication
      if (!token || !userId) {
        console.log('No auth state - Redirecting to login');
        toast({
          title: 'Please log in',
          description: 'You need to be logged in to view your cart',
          status: 'warning',
          duration: 3000,
        });
        navigate('/login');
        return;
      }

      // If authenticated, fetch cart
      try {
        console.log('Fetching cart items for user:', userId);
        await dispatch(fetchCartItems(userId)).unwrap();
      } catch (error) {
        console.error('Error fetching cart items:', error);
        toast({
          title: 'Error',
          description: 'Failed to load cart items',
          status: 'error',
          duration: 3000,
        });
      }
    };

    checkAuthAndFetchCart();
  }, [dispatch, navigate, toast, token, userId]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  // Add logging for cart state changes
  useEffect(() => {
    console.log('Cart state updated:', {
      items,
      loading,
      error,
      auth: { token, userId, isAuthenticated }
    });
  }, [items, loading, error, token, userId, isAuthenticated]);

  const handleRemoveItem = async (cartItemId) => {
    try {
      await dispatch(removeFromCart(cartItemId)).unwrap();
      toast({
        title: 'Item removed',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Error removing item',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleUpdateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return;
    try {
      await dispatch(updateCartQuantity({ cartItemId, quantity })).unwrap();
    } catch (error) {
      toast({
        title: 'Error updating quantity',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      toast({
        title: 'Invalid voucher',
        description: 'Please enter a voucher code',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    try {
      await dispatch(applyVoucher(voucherCode)).unwrap();
      toast({
        title: 'Voucher applied',
        status: 'success',
        duration: 2000,
      });
      setVoucherCode('');
    } catch (error) {
      toast({
        title: 'Error applying voucher',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  if (loading) {
    return (
      <Container centerContent py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading your cart...</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Alert status="error" mb={4}>
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Container centerContent py={10}>
        <VStack spacing={4}>
          <Heading size="lg">Your cart is empty</Heading>
          <Text>Add some items to your cart to see them here</Text>
          <Button colorScheme="blue" onClick={() => navigate('/allproducts')}>
            Continue Shopping
          </Button>
        </VStack>
      </Container>
    );
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Grid templateColumns={{ base: '1fr', lg: '3fr 1fr' }} gap={8}>
        <Box>
          <Heading size="lg" mb={6}>Shopping Cart</Heading>
          <VStack spacing={4} align="stretch">
            {items.map((item) => (
              <Box
                key={item.cartItemId}
                p={4}
                borderWidth={1}
                borderRadius="lg"
                shadow="sm"
                _hover={{ shadow: 'md' }}
                transition="all 0.2s"
              >
                <Grid templateColumns={{ base: '1fr', md: 'auto 1fr auto' }} gap={4}>
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    boxSize="100px"
                    objectFit="cover"
                    borderRadius="md"
                  />
                  <Stack spacing={2}>
                    <Heading size="md">{item.product.name}</Heading>
                    <Text color="gray.600">${item.product.price.toFixed(2)}</Text>
                    <HStack>
                      <IconButton
                        icon={<MinusIcon />}
                        onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity - 1)}
                        size="sm"
                        isDisabled={item.quantity <= 1}
                      />
                      <Text fontWeight="bold">{item.quantity}</Text>
                      <IconButton
                        icon={<AddIcon />}
                        onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity + 1)}
                        size="sm"
                      />
                    </HStack>
                  </Stack>
                  <IconButton
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => handleRemoveItem(item.cartItemId)}
                  />
                </Grid>
              </Box>
            ))}
          </VStack>
        </Box>
        <Box>
          <Box p={6} borderWidth={1} borderRadius="lg" shadow="sm">
            <Heading size="md" mb={4}>Order Summary</Heading>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Text>Subtotal</Text>
                <Text>${calculateTotal().toFixed(2)}</Text>
              </HStack>
              {discount > 0 && (
                <HStack justify="space-between">
                  <Text>Discount</Text>
                  <Text color="green.500">-${discount.toFixed(2)}</Text>
                </HStack>
              )}
              <Divider />
              <HStack justify="space-between">
                <Text fontWeight="bold">Total</Text>
                <Text fontWeight="bold">${(calculateTotal() - discount).toFixed(2)}</Text>
              </HStack>
              <InputGroup>
                <Input
                  placeholder="Enter voucher code"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                />
                <Button
                  colorScheme="blue"
                  onClick={handleApplyVoucher}
                  isDisabled={!voucherCode.trim()}
                >
                  Apply
                </Button>
              </InputGroup>
              <Button
                colorScheme="green"
                size="lg"
                onClick={() => navigate('/Checkout')}
                isDisabled={items.length === 0}
              >
                Proceed to Checkout
              </Button>
            </VStack>
          </Box>
        </Box>
      </Grid>
    </Container>
  );
};

export default Cart;