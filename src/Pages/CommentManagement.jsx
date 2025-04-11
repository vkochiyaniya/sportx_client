import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
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
  SimpleGrid,
  GridItem,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  IconButton,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { FaSearch, FaFilter, FaSort, FaEllipsisV, FaTrash, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { fetchAllComments, updateCommentStatus, deleteComment, clearComments } from '../redux/slices/commentsSlice';
import ReviewItem from '../components/reviews/ReviewItem';

/**
 * Admin page for managing product reviews and comments
 * @returns {JSX.Element} - The CommentManagement page
 */
const CommentManagement = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedComment, setSelectedComment] = useState(null);
  
  // Get comments from Redux store
  const { allComments, loading, error } = useSelector((state) => state.comments);
  
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  
  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const filterBgColor = useColorModeValue('gray.50', 'gray.700');
  
  // Fetch all comments when component mounts
  useEffect(() => {
    dispatch(fetchAllComments());
    
    // Clean up when component unmounts
    return () => {
      dispatch(clearComments());
    };
  }, [dispatch]);
  
  // Calculate statistics
  const calculateStats = () => {
    const total = allComments.length;
    const approved = allComments.filter(comment => comment.status === 'approved').length;
    const pending = allComments.filter(comment => comment.status === 'pending').length;
    const rejected = allComments.filter(comment => comment.status === 'rejected').length;
    const averageRating = allComments.reduce((sum, comment) => sum + (comment.rating || 0), 0) / total || 0;
    
    return {
      total,
      approved,
      pending,
      rejected,
      averageRating: averageRating.toFixed(1)
    };
  };
  
  // Filter and sort comments
  const getFilteredAndSortedComments = () => {
    let filtered = [...allComments];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(comment => 
        comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (comment.userName || 'Anonymous').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (comment.productName || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(comment => comment.status === filterStatus);
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
  
  // Handle status update
  const handleStatusUpdate = async (commentId, newStatus) => {
    try {
      await dispatch(updateCommentStatus({ id: commentId, status: newStatus })).unwrap();
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
  
  // Handle delete confirmation
  const handleDeleteClick = (comment) => {
    setSelectedComment(comment);
    onOpen();
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!selectedComment) return;
    
    try {
      await dispatch(deleteComment(selectedComment.id)).unwrap();
      toast({
        title: 'Review Deleted',
        description: 'The review has been deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
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
  
  const stats = calculateStats();
  const filteredComments = getFilteredAndSortedComments();
  const totalPages = Math.ceil(filteredComments.length / itemsPerPage);
  const paginatedComments = filteredComments.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  
  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box p={4} textAlign="center">
          <Spinner size="xl" color="blue.500" />
          <Text mt={4}>Loading reviews...</Text>
        </Box>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Box>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Box>
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading>Review Management</Heading>
        
        {/* Statistics */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={4}>
          <GridItem>
            <Stat p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor} bg={bgColor}>
              <StatLabel>Total Reviews</StatLabel>
              <StatNumber>{stats.total}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                23.36%
              </StatHelpText>
            </Stat>
          </GridItem>
          <GridItem>
            <Stat p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor} bg={bgColor}>
              <StatLabel>Approved</StatLabel>
              <StatNumber>{stats.approved}</StatNumber>
              <StatHelpText>
                {((stats.approved / stats.total) * 100).toFixed(1)}% of total
              </StatHelpText>
            </Stat>
          </GridItem>
          <GridItem>
            <Stat p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor} bg={bgColor}>
              <StatLabel>Pending</StatLabel>
              <StatNumber>{stats.pending}</StatNumber>
              <StatHelpText>
                {((stats.pending / stats.total) * 100).toFixed(1)}% of total
              </StatHelpText>
            </Stat>
          </GridItem>
          <GridItem>
            <Stat p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor} bg={bgColor}>
              <StatLabel>Rejected</StatLabel>
              <StatNumber>{stats.rejected}</StatNumber>
              <StatHelpText>
                {((stats.rejected / stats.total) * 100).toFixed(1)}% of total
              </StatHelpText>
            </Stat>
          </GridItem>
          <GridItem>
            <Stat p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor} bg={bgColor}>
              <StatLabel>Average Rating</StatLabel>
              <StatNumber>{stats.averageRating}</StatNumber>
              <StatHelpText>
                Out of 5 stars
              </StatHelpText>
            </Stat>
          </GridItem>
        </SimpleGrid>
        
        {/* Filters and search */}
        <Box p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor} bg={bgColor}>
          <VStack spacing={4}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaSearch color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Search reviews by content, username, or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} width="100%">
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
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
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
            </SimpleGrid>
          </VStack>
        </Box>
        
        {/* Tabs for different views */}
        <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed">
          <TabList>
            <Tab>All Reviews ({filteredComments.length})</Tab>
            <Tab>Pending Reviews ({allComments.filter(c => c.status === 'pending').length})</Tab>
            <Tab>Approved Reviews ({allComments.filter(c => c.status === 'approved').length})</Tab>
            <Tab>Rejected Reviews ({allComments.filter(c => c.status === 'rejected').length})</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel>
              <VStack spacing={4} align="stretch">
                {filteredComments.length === 0 ? (
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>No Reviews Found</AlertTitle>
                      <AlertDescription>
                        {searchTerm || filterStatus !== 'all' || filterRating !== 'all'
                          ? 'Try adjusting your filters'
                          : 'There are no reviews in the system yet.'}
                      </AlertDescription>
                    </Box>
                  </Alert>
                ) : (
                  <>
                    {paginatedComments.map(review => (
                      <Box key={review.id} position="relative">
                        <ReviewItem review={review} isAdmin={true} />
                        <Box position="absolute" top={4} right={4} zIndex={1}>
                          <HStack spacing={2}>
                            <Tooltip label="Approve">
                              <IconButton
                                icon={<FaCheck />}
                                colorScheme="green"
                                size="sm"
                                onClick={() => handleStatusUpdate(review.id, 'approved')}
                                isDisabled={review.status === 'approved'}
                              />
                            </Tooltip>
                            <Tooltip label="Reject">
                              <IconButton
                                icon={<FaTimes />}
                                colorScheme="red"
                                size="sm"
                                onClick={() => handleStatusUpdate(review.id, 'rejected')}
                                isDisabled={review.status === 'rejected'}
                              />
                            </Tooltip>
                            <Tooltip label="Delete">
                              <IconButton
                                icon={<FaTrash />}
                                colorScheme="gray"
                                size="sm"
                                onClick={() => handleDeleteClick(review)}
                              />
                            </Tooltip>
                          </HStack>
                        </Box>
                      </Box>
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
                  </>
                )}
              </VStack>
            </TabPanel>
            
            <TabPanel>
              <VStack spacing={4} align="stretch">
                {allComments.filter(c => c.status === 'pending').length === 0 ? (
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>No Pending Reviews</AlertTitle>
                      <AlertDescription>
                        There are no reviews pending approval.
                      </AlertDescription>
                    </Box>
                  </Alert>
                ) : (
                  allComments
                    .filter(c => c.status === 'pending')
                    .map(review => (
                      <Box key={review.id} position="relative">
                        <ReviewItem review={review} isAdmin={true} />
                        <Box position="absolute" top={4} right={4} zIndex={1}>
                          <HStack spacing={2}>
                            <Tooltip label="Approve">
                              <IconButton
                                icon={<FaCheck />}
                                colorScheme="green"
                                size="sm"
                                onClick={() => handleStatusUpdate(review.id, 'approved')}
                              />
                            </Tooltip>
                            <Tooltip label="Reject">
                              <IconButton
                                icon={<FaTimes />}
                                colorScheme="red"
                                size="sm"
                                onClick={() => handleStatusUpdate(review.id, 'rejected')}
                              />
                            </Tooltip>
                            <Tooltip label="Delete">
                              <IconButton
                                icon={<FaTrash />}
                                colorScheme="gray"
                                size="sm"
                                onClick={() => handleDeleteClick(review)}
                              />
                            </Tooltip>
                          </HStack>
                        </Box>
                      </Box>
                    ))
                )}
              </VStack>
            </TabPanel>
            
            <TabPanel>
              <VStack spacing={4} align="stretch">
                {allComments.filter(c => c.status === 'approved').length === 0 ? (
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>No Approved Reviews</AlertTitle>
                      <AlertDescription>
                        There are no approved reviews.
                      </AlertDescription>
                    </Box>
                  </Alert>
                ) : (
                  allComments
                    .filter(c => c.status === 'approved')
                    .map(review => (
                      <Box key={review.id} position="relative">
                        <ReviewItem review={review} isAdmin={true} />
                        <Box position="absolute" top={4} right={4} zIndex={1}>
                          <HStack spacing={2}>
                            <Tooltip label="Reject">
                              <IconButton
                                icon={<FaTimes />}
                                colorScheme="red"
                                size="sm"
                                onClick={() => handleStatusUpdate(review.id, 'rejected')}
                              />
                            </Tooltip>
                            <Tooltip label="Delete">
                              <IconButton
                                icon={<FaTrash />}
                                colorScheme="gray"
                                size="sm"
                                onClick={() => handleDeleteClick(review)}
                              />
                            </Tooltip>
                          </HStack>
                        </Box>
                      </Box>
                    ))
                )}
              </VStack>
            </TabPanel>
            
            <TabPanel>
              <VStack spacing={4} align="stretch">
                {allComments.filter(c => c.status === 'rejected').length === 0 ? (
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>No Rejected Reviews</AlertTitle>
                      <AlertDescription>
                        There are no rejected reviews.
                      </AlertDescription>
                    </Box>
                  </Alert>
                ) : (
                  allComments
                    .filter(c => c.status === 'rejected')
                    .map(review => (
                      <Box key={review.id} position="relative">
                        <ReviewItem review={review} isAdmin={true} />
                        <Box position="absolute" top={4} right={4} zIndex={1}>
                          <HStack spacing={2}>
                            <Tooltip label="Approve">
                              <IconButton
                                icon={<FaCheck />}
                                colorScheme="green"
                                size="sm"
                                onClick={() => handleStatusUpdate(review.id, 'approved')}
                              />
                            </Tooltip>
                            <Tooltip label="Delete">
                              <IconButton
                                icon={<FaTrash />}
                                colorScheme="gray"
                                size="sm"
                                onClick={() => handleDeleteClick(review)}
                              />
                            </Tooltip>
                          </HStack>
                        </Box>
                      </Box>
                    ))
                )}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
      
      {/* Delete confirmation modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Review</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="stretch" spacing={4}>
              <Alert status="warning">
                <AlertIcon />
                <Box>
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    This action cannot be undone. The review will be permanently deleted.
                  </AlertDescription>
                </Box>
              </Alert>
              
              {selectedComment && (
                <Box p={4} borderRadius="md" borderWidth="1px" borderColor={borderColor}>
                  <Text fontWeight="bold">{selectedComment.userName || 'Anonymous'}</Text>
                  <Text mt={2}>{selectedComment.content}</Text>
                  {selectedComment.productName && (
                    <Text mt={2} fontSize="sm" color="gray.500">
                      Product: {selectedComment.productName}
                    </Text>
                  )}
                </Box>
              )}
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default CommentManagement; 