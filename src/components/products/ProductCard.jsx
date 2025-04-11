import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Image,
  Text,
  Badge,
  Flex,
  Heading,
  useColorModeValue,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
} from '@chakra-ui/react';
import AddToCartButton from '../cart/AddToCartButton';

const ProductCard = ({ product, isLoading = false }) => {
  // Color mode values for styling
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBorderColor = useColorModeValue('blue.500', 'blue.300');
  const priceColor = useColorModeValue('blue.600', 'blue.300');
  const badgeBgColor = useColorModeValue('green.100', 'green.900');
  const badgeTextColor = useColorModeValue('green.800', 'green.100');

  // Format price with currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        bg={bgColor}
        borderColor={borderColor}
        transition="all 0.3s"
        _hover={{
          transform: 'translateY(-5px)',
          boxShadow: 'lg',
          borderColor: hoverBorderColor,
        }}
        height="100%"
        display="flex"
        flexDirection="column"
      >
        <Skeleton height="200px" />
        <Box p={4} flex="1" display="flex" flexDirection="column">
          <SkeletonText mt="4" noOfLines={2} spacing="4" />
          <Skeleton height="20px" width="100px" mt="4" />
          <Skeleton height="40px" mt="4" />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={bgColor}
      borderColor={borderColor}
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'lg',
        borderColor: hoverBorderColor,
      }}
      height="100%"
      display="flex"
      flexDirection="column"
    >
      {/* Product Image */}
      <RouterLink to={`/product/${product.id}`}>
        <Box position="relative" height="200px" overflow="hidden">
          <Image
            src={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
            alt={product.name}
            objectFit="cover"
            width="100%"
            height="100%"
            transition="transform 0.3s"
            _hover={{ transform: 'scale(1.05)' }}
          />
          {product.isNew && (
            <Badge
              position="absolute"
              top="2"
              right="2"
              colorScheme="green"
              bg={badgeBgColor}
              color={badgeTextColor}
              px={2}
              py={1}
              borderRadius="full"
            >
              New
            </Badge>
          )}
          {product.discount > 0 && (
            <Badge
              position="absolute"
              top="2"
              left="2"
              colorScheme="red"
              px={2}
              py={1}
              borderRadius="full"
            >
              {product.discount}% OFF
            </Badge>
          )}
        </Box>
      </RouterLink>

      {/* Product Info */}
      <Box p={4} flex="1" display="flex" flexDirection="column">
        <RouterLink to={`/product/${product.id}`}>
          <Heading size="md" mb={2} noOfLines={2}>
            {product.name}
          </Heading>
        </RouterLink>

        <Text fontSize="sm" color="gray.500" mb={2} noOfLines={2}>
          {product.description}
        </Text>

        <Flex align="center" mb={2}>
          <Text fontWeight="bold" fontSize="xl" color={priceColor}>
            {formatPrice(product.price)}
          </Text>
          {product.originalPrice && product.originalPrice > product.price && (
            <Text
              as="span"
              textDecoration="line-through"
              color="gray.500"
              ml={2}
              fontSize="sm"
            >
              {formatPrice(product.originalPrice)}
            </Text>
          )}
        </Flex>

        <Flex mt="auto" pt={2}>
          <AddToCartButton 
            product={product} 
            variant="solid" 
            size="md" 
            fullWidth 
          />
        </Flex>
      </Box>
    </Box>
  );
};

export default ProductCard; 