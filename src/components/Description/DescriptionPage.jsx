// src/components/Description/DescriptionPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Heading, 
  Text, 
  Image, 
  Badge, 
  Stack, 
  Button, 
  useToast 
} from '@chakra-ui/react';
import { getProductDetails } from '../../redux/DataReducer/action';
import { addToCart } from '../../redux/CartReducer/action';
import Loading from '../Loading/Loading';
import Error from '../Loading/Error';

const DescriptionPage = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const [quantity, setQuantity] = useState(1);

  const { productDetails, loading, error } = useSelector((state) => state.data);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getProductDetails(productId));
  }, [dispatch, productId]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: "Please Login",
        description: "You need to log in to add items to cart",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
      return;
    }
    
    dispatch(addToCart(productId, quantity))
      .then(() => {
        toast({
          title: "Added to Cart",
          description: `${productDetails.name} added to your cart`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Failed to add item to cart",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const handleQuantityChange = (change) => {
    setQuantity(prev => {
      const newQuantity = prev + change;
      return newQuantity > 0 && newQuantity <= 10 ? newQuantity : prev;
    });
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <Box p={8} maxWidth="1200px" mx="auto">
      {productDetails && (
        <Stack direction={['column', 'row']} spacing={8}>
          <Box flex={1}>
            <Image 
              src={`src/img/shoe.jpg/${productDetails.image}`}
              alt={productDetails.name}
              maxHeight="500px"
              objectFit="contain"
            />
          </Box>
          <Box flex={1}>
            <Heading mb={4}>{productDetails.name}</Heading>
            <Text fontSize="xl" mb={4}>{productDetails.description}</Text>
            <Badge colorScheme="green" fontSize="lg" mb={4}>
              Brand: {productDetails.brand}
            </Badge>
            
            <Stack spacing={4}>
              <Text fontSize="2xl">
                Price: ${productDetails.priceWithDiscount}
                {productDetails.priceWithDiscount < productDetails.price && (
                  <Text as="del" ml={2} fontSize="lg" color="gray.500">
                    ${productDetails.price}
                  </Text>
                )}
              </Text>
              
              <Box display="flex" alignItems="center">
                <Button 
                  onClick={() => handleQuantityChange(-1)} 
                  mr={2}
                  isDisabled={quantity <= 1}
                >
                  -
                </Button>
                <Text mx={4}>{quantity}</Text>
                <Button 
                  onClick={() => handleQuantityChange(1)}
                  isDisabled={quantity >= 10}
                >
                  +
                </Button>
              </Box>
              
              <Button 
                colorScheme="blue" 
                size="lg" 
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <Button variant="outline" size="lg">
                Add to Wishlist
              </Button>
            </Stack>
          </Box>
        </Stack>
      )}
    </Box>
  );
};

export default DescriptionPage;
