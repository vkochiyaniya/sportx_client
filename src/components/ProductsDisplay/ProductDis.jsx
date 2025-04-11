import { Box, Button, Image, Text, Flex, useToast, VStack } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../redux/CartReducer/action.js';

const ProductDis = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated, userId } = useSelector((state) => state.auth);

  const handleProductClick = () => {
    navigate(`/product/${product.productId}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking add to cart

    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to cart",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top"
      });
      navigate('/login', { 
        state: { 
          from: `/product/${product.productId}`,
          message: "Login to add items to cart" 
        } 
      });
      return;
    }
    
    dispatch(addToCart(product.productId, 1))
      .then(() => {
        toast({
          title: "Added to Cart",
          description: `${product.name} added successfully`,
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top-right"
        });
      })
      .catch((error) => {
        toast({
          title: "Cart Error",
          description: error.message || "Failed to add item to cart",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top"
        });
      });
  };

  return (
    <VStack 
      borderWidth="1px" 
      borderRadius="lg" 
      overflow="hidden" 
      p={4} 
      spacing={3}
      onClick={handleProductClick}
      cursor="pointer"
      transition="all 0.3s"
      _hover={{ 
        transform: 'scale(1.05)', 
        boxShadow: 'lg' 
      }}
    >
      <Image 
        src={`src/img/shoe.jpg/${product.image}`}
        alt={product.name}
        height="200px"
        objectFit="contain"
      />
      <VStack align="start" width="full" spacing={2}>
        <Text fontWeight="semibold" noOfLines={2}>
          {product.name}
        </Text>
        <Text fontSize="sm" color="gray.600">
          {product.brand}
        </Text>
        <Flex align="center" width="full" justifyContent="space-between">
          <Text fontSize="lg" fontWeight="bold">
            ${product.priceWithDiscount}
          </Text>
          {product.priceWithDiscount < product.price && (
            <Text as="del" fontSize="sm" color="gray.500">
              ${product.price}
            </Text>
          )}
        </Flex>
        <Button 
          onClick={handleAddToCart} 
          width="full" 
          colorScheme="blue"
          size="sm"
        >
          Add to Cart
        </Button>
      </VStack>
    </VStack>
  );
};

export default ProductDis;
