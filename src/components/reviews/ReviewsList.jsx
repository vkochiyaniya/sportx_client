import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  useColorModeValue,
  Divider,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  GridItem,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
  Collapse,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { FaStar, FaSearch, FaFilter, FaSort } from 'react-icons/fa';
import { fetchProductComments, clearComments } from '../../redux/slices/commentsSlice';
import ReviewItem from './ReviewItem';
import ReviewForm from './ReviewForm';

/**
 * A component to display a list of product reviews
 * @param {Object} props - Component props
 * @param {string} props.productId - The ID of the product to display reviews for
 * @param {string} props.productName - The name of the product (optional)
 * @param {boolean} props.showReviewForm - Whether to show the review form (default: true)
 * @returns {JSX.Element} - The ReviewsList component
 */
const ReviewsList = ({ productId, productName, showReviewForm = true }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { productComments, loading, error } = useSelector((state) => state.comments);
  
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  
  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const filterBgColor = useColorModeValue('gray.50', 'gray.700');
  
  // Fetch comments when component mounts
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductComments(productId));
    }
    
    // Clean up when component unmounts
    return () => {
      dispatch(clearComments());
    };
  }, [dispatch, productId]);
  
  // Calculate average rating
  const calculateAverageRating = () => {
    if (!productComments.length) return 0;
    
    const totalRating = productComments.reduce((sum, comment) => sum + (comment.rating || 0), 0);
    return (totalRating / productComments.length).toFixed(1);
  };
  
  // Calculate rating distribution
  const calculateRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    productComments.forEach(comment => {
      if (comment.rating && distribution[comment.rating] !== undefined) {
        distribution[comment.rating]++;
      }
    });
    
    return distribution;
  };
  
  // Calculate percentage for rating bar
  const calculatePercentage = (count) => {
    if (!productComments.length) return 0;
    return (count / productComments.length) * 100;
  };
  
  // Filter and sort comments
  const getFilteredAndSortedComments = () => {
    let filtered = [...productComments];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(comment => 
        comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (comment.userName || 'Anonymous').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply rating filter
    if (filterRating !== 'all') {
      filtered = filtered.filter(comment => comment.rating === parseInt(filterRating));
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'highest':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'lowest':
        filtered.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        break;
      default:
        break;
    }
    
    return filtered;
  };
  
  const averageRating = calculateAverageRating();
  const ratingDistribution = calculateRatingDistribution();
  const filteredComments = getFilteredAndSortedComments();
  const totalPages = Math.ceil(filteredComments.length / itemsPerPage);
  const paginatedComments = filteredComments.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  
  // Render rating bar
  const renderRatingBar = (rating, count) => {
    const percentage = calculatePercentage(count);
    
    return (
      <HStack 
        key={`rating-${rating}`} 
        spacing={2} 
        width="100%"
        cursor="pointer"
        onClick={() => setFilterRating(filterRating === rating.toString() ? 'all' : rating.toString())}
        bg={filterRating === rating.toString() ? filterBgColor : 'transparent'}
        p={2}
        borderRadius="md"
        _hover={{ bg: filterBgColor }}
      >
        <Text width="20px">{rating}</Text>
        <Box
          height="8px"
          width="100%"
          bg="gray.200"
          borderRadius="full"
          overflow="hidden"
        >
          <Box
            height="100%"
            width={`${percentage}%`}
            bg="yellow.400"
            borderRadius="full"
          />
        </Box>
        <Text width="40px" textAlign="right">
          {count}
        </Text>
      </HStack>
    );
  };
  
  // Handle successful review submission
  const handleReviewSuccess = () => {
    dispatch(fetchProductComments(productId));
    toast({
      title: 'Review Submitted',
      description: 'Your review has been submitted successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <Spinner size="xl" color="blue.500" />
        <Text mt={4}>Loading reviews...</Text>
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <Box>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Box>
      </Alert>
    );
  }
  
  return (
    <Box>
      <VStack spacing={6} align="stretch">
        {/* Reviews summary */}
        <Box
          p={4}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          bg={bgColor}
        >
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <GridItem>
              <Flex direction="column" align="center" justify="center" height="100%">
                <HStack>
                  <FaStar size={24} color="#FFD700" />
                  <Heading size="xl">{averageRating}</Heading>
                </HStack>
                <Text color="gray.500">Based on {productComments.length} reviews</Text>
              </Flex>
            </GridItem>
            
            <GridItem>
              <VStack align="stretch" spacing={2}>
                {[5, 4, 3, 2, 1].map(rating => 
                  renderRatingBar(rating, ratingDistribution[rating])
                )}
              </VStack>
            </GridItem>
          </SimpleGrid>
        </Box>
        
        {/* Review form */}
        {showReviewForm && (
          <ReviewForm 
            productId={productId} 
            productName={productName} 
            onSuccess={handleReviewSuccess}
          />
        )}
        
        {/* Filters and search */}
        <Box>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="md">
              Customer Reviews ({filteredComments.length})
            </Heading>
            <HStack spacing={2}>
              <Tooltip label="Toggle Filters">
                <IconButton
                  icon={<FaFilter />}
                  onClick={() => setShowFilters(!showFilters)}
                  variant="ghost"
                  aria-label="Toggle filters"
                />
              </Tooltip>
            </HStack>
          </Flex>
          
          <Collapse in={showFilters}>
            <VStack spacing={4} mb={4}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <FaSearch color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              
              <HStack width="100%" spacing={4}>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  icon={<FaSort />}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                </Select>
                
                <Select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </Select>
              </HStack>
            </VStack>
          </Collapse>
          
          {/* Reviews list */}
          {filteredComments.length === 0 ? (
            <Alert status="info" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle>No Reviews Found</AlertTitle>
                <AlertDescription>
                  {searchTerm || filterRating !== 'all' 
                    ? 'Try adjusting your filters'
                    : 'Be the first to review this product!'}
                </AlertDescription>
              </Box>
            </Alert>
          ) : (
            <VStack spacing={4} align="stretch">
              {paginatedComments.map(review => (
                <ReviewItem key={review.id} review={review} />
              ))}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Flex justify="center" mt={4}>
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      isDisabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Text>
                      Page {page} of {totalPages}
                    </Text>
                    <Button
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      isDisabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </HStack>
                </Flex>
              )}
            </VStack>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default ReviewsList; 