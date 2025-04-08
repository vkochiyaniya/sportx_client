// src/components/ProductsDisplay/ProductDis.jsx
import { Box, Button, Image, Text, Flex } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../redux/CartReducer/action.js';

const ProductDis = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(addToCart(product.productId, 1));
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
      <Image 
        src={`src/img/shoe.jpg/${product.image}`}
        alt={product.name}
        height="200px"
        objectFit="contain"
      />
      <Box mt="2">
        <Text fontWeight="semibold">{product.name}</Text>
        <Text fontSize="sm" color="gray.600">{product.brand}</Text>
        <Flex align="center" mt={2}>
          <Text fontSize="lg" fontWeight="bold">
            ${product.priceWithDiscount}
          </Text>
          {product.priceWithDiscount < product.price && (
            <Text as="del" ml={2} color="gray.500">
              ${product.price}
            </Text>
          )}
        </Flex>
        <Button onClick={handleAddToCart} mt={2} width="full">
          Add to Cart
        </Button>
      </Box>
    </Box>
  );
};

// Add this default export
export default ProductDis;