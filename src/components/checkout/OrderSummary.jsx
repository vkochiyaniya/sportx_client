import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Divider,
  List,
  ListItem,
  HStack,
  Image,
  useColorModeValue,
  Button,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const OrderSummary = ({ cartItems, cartTotal }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  
  // Calculate subtotal, shipping, and total
  const subtotal = cartTotal;
  const shipping = cartTotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + shipping;
  
  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      shadow="sm"
      position="sticky"
      top="24px"
    >
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Order Summary</Heading>
        
        {/* Cart Items */}
        <List spacing={4}>
          {cartItems.map((item) => (
            <ListItem key={item.id}>
              <HStack spacing={4} justify="space-between">
                <HStack spacing={4}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    boxSize="50px"
                    objectFit="cover"
                    borderRadius="md"
                  />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="medium" noOfLines={1}>
                      {item.name}
                    </Text>
                    <Text fontSize="sm" color={textColor}>
                      Qty: {item.quantity}
                    </Text>
                  </VStack>
                </HStack>
                <Text fontWeight="medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </HStack>
            </ListItem>
          ))}
        </List>
        
        <Divider />
        
        {/* Price Breakdown */}
        <VStack spacing={2} align="stretch">
          <HStack justify="space-between">
            <Text color={textColor}>Subtotal</Text>
            <Text fontWeight="medium">${subtotal.toFixed(2)}</Text>
          </HStack>
          
          <HStack justify="space-between">
            <Text color={textColor}>Shipping</Text>
            <Text fontWeight="medium">
              {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
            </Text>
          </HStack>
          
          {shipping > 0 && (
            <Text fontSize="sm" color="blue.500">
              Free shipping on orders over $100
            </Text>
          )}
          
          <Divider />
          
          <HStack justify="space-between" fontSize="lg" fontWeight="bold">
            <Text>Total</Text>
            <Text>${total.toFixed(2)}</Text>
          </HStack>
        </VStack>
        
        {/* Back to Cart Button */}
        <Button
          as={RouterLink}
          to="/cart"
          variant="outline"
          colorScheme="blue"
          size="sm"
          width="full"
        >
          Edit Cart
        </Button>
      </VStack>
    </Box>
  );
};

export default OrderSummary; 