// src/Pages/AllProducts.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SimpleGrid, Box, Heading } from '@chakra-ui/react';
import { getProducts } from '../redux/DataReducer/action.js';
import ProductDis from '../components/ProductsDisplay/ProductDis';
import Loading from '../components/Loading/Loading';
import Error from '../components/Loading/Error';

const AllProducts = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.data);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <Box p={8}>
      <Heading mb={8}>All Products</Heading>
      <SimpleGrid columns={[1, 2, 3, 4]} spacing={8}>
        {products.map((product) => (
          <ProductDis key={product.productId} product={product} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default AllProducts;