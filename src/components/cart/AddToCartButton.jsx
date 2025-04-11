import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  IconButton,
  useToast,
  Tooltip,
  Spinner,
  HStack,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Icon,
} from '@chakra-ui/react';
import { FaShoppingCart, FaPlus } from 'react-icons/fa';
import { addCartItem } from '../../redux/slices/cartSlice';

const AddToCartButton = ({ 
  product, 
  variant = 'solid', 
  size = 'md', 
  showQuantity = false,
  fullWidth = false,
  iconOnly = false,
  tooltipText = 'Add to cart'
}) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.cart);
  
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Handle add to cart
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

    setIsAdding(true);
    try {
      await dispatch(addCartItem({
        productId: product.id,
        quantity: quantity
      })).unwrap();
      
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      
      // Reset quantity and close popover if it was open
      setQuantity(1);
      setIsPopoverOpen(false);
    } catch (error) {
      toast({
        title: 'Error adding to cart',
        description: error.message || 'Failed to add item to cart',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsAdding(false);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (value) => {
    const newQuantity = parseInt(value);
    if (isNaN(newQuantity) || newQuantity < 1) return;
    setQuantity(newQuantity);
  };

  // Render button based on variant
  const renderButton = () => {
    if (iconOnly) {
      return (
        <Tooltip label={tooltipText} placement="top">
          <Button
            leftIcon={<Icon as={FaShoppingCart} />}
            colorScheme="blue"
            variant={variant}
            size={size}
            width={fullWidth ? '100%' : 'auto'}
            isLoading={isAdding}
            onClick={showQuantity ? () => setIsPopoverOpen(true) : handleAddToCart}
            isDisabled={loading}
          >
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </Button>
        </Tooltip>
      );
    }

    if (showQuantity) {
      return (
        <Popover
          isOpen={isPopoverOpen}
          onClose={() => setIsPopoverOpen(false)}
          placement="bottom"
        >
          <PopoverTrigger>
            <Button
              leftIcon={<Icon as={FaShoppingCart} />}
              colorScheme="blue"
              variant={variant}
              size={size}
              width={fullWidth ? '100%' : 'auto'}
              isLoading={isAdding}
              isDisabled={loading}
            >
              Add to Cart
            </Button>
          </PopoverTrigger>
          <PopoverContent width="300px">
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader fontWeight="semibold">Add to Cart</PopoverHeader>
            <PopoverBody>
              <Text mb={2}>Quantity:</Text>
              <NumberInput
                min={1}
                max={10}
                value={quantity}
                onChange={handleQuantityChange}
                size="md"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </PopoverBody>
            <PopoverFooter>
              <Button
                colorScheme="blue"
                width="100%"
                onClick={handleAddToCart}
                isLoading={isAdding}
              >
                Add to Cart
              </Button>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      );
    }

    return (
      <Button
        leftIcon={<Icon as={FaShoppingCart} />}
        colorScheme="blue"
        variant={variant}
        size={size}
        width={fullWidth ? '100%' : 'auto'}
        isLoading={isAdding}
        onClick={handleAddToCart}
        isDisabled={loading}
      >
        Add to Cart
      </Button>
    );
  };

  return renderButton();
};

export default AddToCartButton; 