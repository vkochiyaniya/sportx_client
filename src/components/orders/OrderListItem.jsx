import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Badge,
  Button,
  useColorModeValue,
  SimpleGrid,
  GridItem,
} from '@chakra-ui/react';
import { FaEye, FaShoppingBag } from 'react-icons/fa';
import { formatPrice, formatDate } from '../../utils/invoiceUtils';
import InvoiceDownloadButton from '../invoice/InvoiceDownloadButton';

/**
 * A component to display a single order in a list
 * @param {Object} props - Component props
 * @param {Object} props.order - The order object to display
 * @returns {JSX.Element} - The OrderListItem component
 */
const OrderListItem = ({ order }) => {
  const navigate = useNavigate();
  
  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'cancelled':
        return 'red';
      case 'shipped':
        return 'blue';
      case 'delivered':
        return 'purple';
      default:
        return 'gray';
    }
  };
  
  return (
    <Box
      p={4}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      bg={bgColor}
      _hover={{ bg: hoverBgColor }}
      transition="all 0.2s"
    >
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
        <GridItem>
          <Flex direction="column">
            <Text fontWeight="bold">Order #{order.id}</Text>
            <Text fontSize="sm" color="gray.500">
              {formatDate(order.createdAt)}
            </Text>
            <Badge 
              mt={2} 
              colorScheme={getStatusColor(order.status)}
              alignSelf="flex-start"
            >
              {order.status.toUpperCase()}
            </Badge>
          </Flex>
        </GridItem>
        
        <GridItem>
          <Text fontWeight="bold">{formatPrice(order.total)}</Text>
          <Text fontSize="sm" color="gray.500">
            {order.items?.length || 0} items
          </Text>
        </GridItem>
        
        <GridItem>
          <Text fontWeight="bold">
            {order.shippingInfo?.fullName || 'N/A'}
          </Text>
          <Text fontSize="sm" color="gray.500" noOfLines={1}>
            {order.shippingInfo?.address || 'No address provided'}
          </Text>
        </GridItem>
        
        <GridItem>
          <Flex direction="column" gap={2}>
            <Button
              leftIcon={<FaEye />}
              size="sm"
              variant="outline"
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              View Details
            </Button>
            <InvoiceDownloadButton
              orderId={order.id}
              size="sm"
              variant="outline"
              colorScheme="blue"
            />
          </Flex>
        </GridItem>
      </SimpleGrid>
    </Box>
  );
};

export default OrderListItem; 