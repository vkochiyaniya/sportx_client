import React from 'react';
import {
  Box,
  Flex,
  Text,
  Avatar,
  Badge,
  useColorModeValue,
  Divider,
  Tooltip,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from '@chakra-ui/react';
import { FaStar, FaStarHalfAlt, FaRegStar, FaEllipsisV } from 'react-icons/fa';
import { formatDate } from '../../utils/invoiceUtils';
import { useDispatch, useSelector } from 'react-redux';
import { updateCommentStatus, deleteComment } from '../../redux/slices/commentsSlice';

/**
 * A component to display a single review/comment
 * @param {Object} props - Component props
 * @param {Object} props.review - The review object to display
 * @param {boolean} props.isAdmin - Whether this component is being used in admin context
 * @returns {JSX.Element} - The ReviewItem component
 */
const ReviewItem = ({ review, isAdmin = false }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { user } = useSelector((state) => state.auth);
  
  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'rejected':
        return 'red';
      default:
        return 'gray';
    }
  };
  
  // Handle status update
  const handleStatusUpdate = async (newStatus) => {
    try {
      await dispatch(updateCommentStatus({ id: review.id, status: newStatus })).unwrap();
      toast({
        title: 'Status Updated',
        description: `Review status has been updated to ${newStatus}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update review status',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // Handle delete
  const handleDelete = async () => {
    try {
      await dispatch(deleteComment(review.id)).unwrap();
      toast({
        title: 'Review Deleted',
        description: 'The review has been deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete the review',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FaStar key={`star-${i}`} color="#FFD700" />
      );
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <FaStarHalfAlt key="half-star" color="#FFD700" />
      );
    }
    
    // Add empty stars to complete 5 stars
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FaRegStar key={`empty-star-${i}`} color="#FFD700" />
      );
    }
    
    return stars;
  };
  
  return (
    <Box
      p={4}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      bg={bgColor}
      mb={4}
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
    >
      <Flex direction="column" gap={3}>
        {/* User info and rating */}
        <Flex justify="space-between" align="center">
          <Flex align="center" gap={3}>
            <Tooltip label={review.userName || 'Anonymous'}>
              <Avatar 
                size="sm" 
                name={review.userName || 'Anonymous'} 
                src={review.userAvatar}
              />
            </Tooltip>
            <Box>
              <Text fontWeight="bold">{review.userName || 'Anonymous'}</Text>
              <Text fontSize="sm" color={textColor}>
                {formatDate(review.createdAt)}
              </Text>
            </Box>
          </Flex>
          
          <Flex align="center" gap={2}>
            {review.rating && (
              <Tooltip label={`${review.rating} out of 5 stars`}>
                <Flex>
                  {renderStars(review.rating)}
                </Flex>
              </Tooltip>
            )}
            {isAdmin && (
              <>
                <Badge colorScheme={getStatusColor(review.status)}>
                  {review.status || 'Pending'}
                </Badge>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<FaEllipsisV />}
                    variant="ghost"
                    size="sm"
                  />
                  <MenuList>
                    <MenuItem onClick={() => handleStatusUpdate('approved')}>
                      Approve
                    </MenuItem>
                    <MenuItem onClick={() => handleStatusUpdate('rejected')}>
                      Reject
                    </MenuItem>
                    <MenuItem onClick={() => handleStatusUpdate('pending')}>
                      Mark as Pending
                    </MenuItem>
                    <MenuItem onClick={handleDelete} color="red.500">
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
              </>
            )}
          </Flex>
        </Flex>
        
        <Divider />
        
        {/* Review content */}
        <Text whiteSpace="pre-wrap">{review.content}</Text>
        
        {/* Product info (if available) */}
        {review.productName && (
          <Box mt={2}>
            <Text fontSize="sm" color={textColor}>
              Product: {review.productName}
            </Text>
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default ReviewItem; 