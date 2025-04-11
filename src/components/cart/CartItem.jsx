import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Image,
  Text,
  Flex,
  IconButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { deleteCartItem, changeQuantity } from '../../redux/slices/cartSlice';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { userId } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(item?.quantity || 1);
  const [isUpdating, setIsUpdating] = useState(false);

  // Debug log for item props
  useEffect(() => {
    console.log('CartItem received props:', {
      item,
      cartItemId: item?.cartItemId,
      product: item?.product,
      quantity: item?.quantity,
      price: item?.product?.price
    });
  }, [item]);

  // Handle quantity change
  const handleQuantityChange = async (value) => {
    const newQuantity = parseInt(value);
    if (isNaN(newQuantity) || newQuantity < 1) return;
    
    setIsUpdating(true);
    try {
      await dispatch(changeQuantity({
        cartItemId: item.cartItemId,
        quantity: newQuantity,
        userId: userId
      })).unwrap();
      setQuantity(newQuantity);
      toast({
        title: 'Quantity updated',
        description: 'Item quantity has been updated',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error updating quantity',
        description: error.message || 'Failed to update quantity',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle remove item
  const handleRemoveItem = async () => {
    try {
      await dispatch(deleteCartItem({
        cartItemId: item.cartItemId,
        userId: userId
      })).unwrap();
      toast({
        title: 'Item removed',
        description: 'Item has been removed from your cart',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error removing item',
        description: error.message || 'Failed to remove item',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Format price with currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // If item is missing required data, show a placeholder
  if (!item || !item.cartItemId) {
    console.log('CartItem missing required data:', item);
    return null;
  }

  // If product is missing, show a placeholder
  if (!item.product) {
    console.log('CartItem missing product data:', item);
    return (
      <Box p={4} borderWidth="1px" borderRadius="lg" mb={4}>
        <Text>Product data is missing</Text>
      </Box>
    );
  }

  // Calculate item total
  const itemTotal = item.product?.price * item.quantity || 0;

  return (
    <Flex
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      alignItems="center"
      position="relative"
      mb={4}
    >
      {/* Loading overlay */}
      {isUpdating && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(255, 255, 255, 0.7)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={1}
          borderRadius="lg"
        >
          <Spinner size="md" color="blue.500" />
        </Box>
      )}

      {/* Product Image */}
      <Box w="100px" h="100px" mr={4} flexShrink={0}>
        <Image
          src={item.product?.image}
          alt={item.product?.name}
          objectFit="cover"
          w="100%"
          h="100%"
          borderRadius="md"
        />
      </Box>

      {/* Product Details */}
      <Box flex="1">
        <Text fontWeight="bold" fontSize="lg" mb={1}>
          {item.product?.name || 'Product Name'}
        </Text>
        <Text color="gray.600" fontSize="sm" mb={2}>
          {item.product?.description || 'No description available'}
        </Text>
        <Text fontWeight="semibold" color="blue.600">
          {formatPrice(item.product?.price)}
        </Text>
      </Box>

      {/* Quantity Controls */}
      <Box w="120px" mx={4}>
        <NumberInput
          min={1}
          value={quantity}
          onChange={handleQuantityChange}
          isDisabled={isUpdating}
          size="sm"
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Box>

      {/* Item Total */}
      <Box w="100px" textAlign="right" mr={4}>
        <Text fontWeight="bold">
          {formatPrice(itemTotal)}
        </Text>
      </Box>

      {/* Remove Button */}
      <IconButton
        icon={<DeleteIcon />}
        aria-label="Remove item"
        colorScheme="red"
        variant="ghost"
        onClick={handleRemoveItem}
        isDisabled={isUpdating}
      />
    </Flex>
  );
};

CartItem.propTypes = {
  item: PropTypes.shape({
    cartItemId: PropTypes.number.isRequired,
    product: PropTypes.shape({
      productId: PropTypes.number,
      name: PropTypes.string,
      description: PropTypes.string,
      image: PropTypes.string,
      price: PropTypes.number,
      priceWithDiscount: PropTypes.number,
    }),
    quantity: PropTypes.number.isRequired,
  }).isRequired,
};

export default CartItem; 