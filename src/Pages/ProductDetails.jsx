import { Box, Button, Image, Text, Flex } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductDetails } from '../redux/DataReducer/action';
import { addToCart } from '../redux/CartReducer/action';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { productDetails } = useSelector(state => state.data);
  const { isAuthenticated, userId } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(getProductDetails(id));
  }, [id, dispatch]);

  const handleAddToCart = () => {
    if (!isAuthenticated || !userId) {
      navigate('/login');
      return;
    }
    dispatch(addToCart(productDetails.productId, 1));
  };

  if (!productDetails) return <Text>Loading...</Text>;

  return (
    <Box p={8}>
      <Flex gap={10}>
        <Image src={`src/img/shoe.jpg/${productDetails.image}`} alt={productDetails.name} height="300px" />
        <Box>
          <Text fontSize="2xl" fontWeight="bold">{productDetails.name}</Text>
          <Text mt={2} color="gray.500">{productDetails.brand}</Text>
          <Flex mt={4} align="center">
            <Text fontSize="xl" fontWeight="bold">${productDetails.priceWithDiscount}</Text>
            {productDetails.priceWithDiscount < productDetails.price && (
              <Text as="del" ml={2} color="gray.400">${productDetails.price}</Text>
            )}
          </Flex>
          <Button mt={6} onClick={handleAddToCart}>Add to Cart</Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default ProductDetails;
