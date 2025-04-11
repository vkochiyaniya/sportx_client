import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCartItems, removeFromCart, updateCartQuantity, applyVoucher } from '../redux/slices/cartSlice';
import { Box, Button, Flex, Heading, Text, VStack, Input, useToast } from '@chakra-ui/react';

const CartPage = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { items, loading, error } = useSelector((state) => state.cart);
  const userId = useSelector((state) => state.auth.user?.id);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartItems(userId));
    }
  }, [dispatch, userId]);

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

  const handleApplyVoucher = async (code) => {
    try {
      await dispatch(applyVoucher(code)).unwrap();
      toast({
        title: 'Voucher applied',
        status: 'success',
        duration: 2000,
      });
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
    return <div>Loading cart items...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box p={4}>
      <Heading mb={4}>Your Cart</Heading>
      <VStack spacing={4} align="stretch">
        {items.map((item) => (
          <Flex key={item.cartItemId} justify="space-between" align="center" p={4} borderWidth={1} borderRadius="md">
            <Box>
              <Text fontWeight="bold">{item.product.name}</Text>
              <Text>Price: ${item.product.price}</Text>
              <Text>Quantity: {item.quantity}</Text>
            </Box>
            <Flex gap={2}>
              <Button
                size="sm"
                onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity - 1)}
                isDisabled={item.quantity <= 1}
              >
                -
              </Button>
              <Button
                size="sm"
                onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity + 1)}
              >
                +
              </Button>
              <Button
                colorScheme="red"
                size="sm"
                onClick={() => handleRemoveItem(item.cartItemId)}
              >
                Remove
              </Button>
            </Flex>
          </Flex>
        ))}
        <Box>
          <Input
            placeholder="Enter voucher code"
            mb={2}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleApplyVoucher(e.target.value);
              }
            }}
          />
          <Button onClick={() => handleApplyVoucher(document.querySelector('input').value)}>
            Apply Voucher
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default CartPage; 