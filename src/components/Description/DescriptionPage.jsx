// src/components/Description/DescriptionPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Box, Heading, Text, Image, Badge, Stack, Button } from '@chakra-ui/react';
import { getProductDetails } from '../../redux/DataReducer/action';
import Loading from '../Loading/Loading';
import Error from '../Loading/Error';

const DescriptionPage = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const { productDetails, loading, error } = useSelector((state) => state.data);

  useEffect(() => {
    dispatch(getProductDetails(productId));
  }, [dispatch, productId]);

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
              
              <Button colorScheme="blue" size="lg">
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