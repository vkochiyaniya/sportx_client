import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, useToast } from '@chakra-ui/react';
import { addCartItem } from '../../redux/slices/cartSlice';

const AddToCartButton = ({ productId }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to add items to your cart',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(addCartItem({ 
        userId: user.id, 
        productId, 
        quantity: 1 
      })).unwrap();
      
      toast({
        title: 'Item added to cart',
        description: 'The item has been added to your cart successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add item to cart',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      colorScheme="blue"
      onClick={handleAddToCart}
      isLoading={isLoading}
      loadingText="Adding to cart..."
      width="full"
    >
      Add to Cart
    </Button>
  );
};

export default AddToCartButton; 