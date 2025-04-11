import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Image,
  Text,
  Heading,
  Button,
  VStack,
  HStack,
  Divider,
  Badge,
  useToast,
  Spinner,
  Center,
  Flex,
  Icon,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  List,
  ListItem,
  ListIcon,
  useColorModeValue,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Tooltip,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  TagCloseButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { 
  StarIcon, 
  CheckCircleIcon, 
  TimeIcon, 
  InfoIcon, 
  ChevronRightIcon,
  ChevronLeftIcon,
  MinusIcon,
  AddIcon,
  SmallAddIcon,
  ExternalLinkIcon,
  ArrowBackIcon,
} from '@chakra-ui/icons';
import { getIcon } from '../utils/iconMapping.jsx';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Get product from Redux store
  const { 
    currentProduct: product, 
    loading, 
    error 
  } = useSelector((state) => state.products);
  
  // Local state
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');
  
  // Fetch product data on component mount
  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);
  
  // Handle quantity change
  const handleQuantityChange = (value) => {
    setQuantity(parseInt(value));
  };
  
  // Handle add to cart
  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    
    try {
      await dispatch(addCartItem({
        productId: product.id,
        quantity
      })).unwrap();
      
      toast({
        title: 'Added to cart',
        description: `${quantity} ${quantity === 1 ? 'item' : 'items'} added to your cart`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Optionally navigate to cart
      // navigate('/cart');
    } catch (error) {
      toast({
        title: 'Error adding to cart',
        description: error.message || 'Failed to add item to cart',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  // Calculate discount percentage
  const calculateDiscount = (originalPrice, discountedPrice) => {
    if (!originalPrice || !discountedPrice) return 0;
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  };
  
  // Generate star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} color="gold" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half-star" color="gold" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-star-${i}`} color="gold" />);
    }
    
    return stars;
  };
  
  // Show loading state
  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={8}>
          <GridItem>
            <Skeleton height="400px" borderRadius="lg" />
            <HStack mt={4} spacing={2} overflowX="auto" py={2}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} height="80px" width="80px" borderRadius="md" />
              ))}
            </HStack>
          </GridItem>
          <GridItem>
            <SkeletonText mt="4" noOfLines={1} spacing="4" skeletonHeight="2" />
            <SkeletonText mt="4" noOfLines={1} spacing="4" skeletonHeight="2" />
            <SkeletonText mt="4" noOfLines={3} spacing="4" skeletonHeight="2" />
            <Skeleton height="40px" mt={6} width="200px" />
            <SkeletonText mt="4" noOfLines={2} spacing="4" skeletonHeight="2" />
            <Skeleton height="40px" mt={6} width="150px" />
            <Skeleton height="40px" mt={6} width="200px" />
          </GridItem>
        </Grid>
      </Container>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Center h="50vh">
          <VStack spacing={4}>
            <Text color="red.500">Error: {error}</Text>
            <Button 
              leftIcon={<ArrowBackIcon />} 
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </VStack>
        </Center>
      </Container>
    );
  }
  
  // Show not found state
  if (!product) {
    return (
      <Container maxW="container.xl" py={8}>
        <Center h="50vh">
          <VStack spacing={4}>
            <Heading size="lg">Product Not Found</Heading>
            <Text>The product you're looking for doesn't exist or has been removed.</Text>
            <Button 
              leftIcon={<ArrowBackIcon />} 
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </VStack>
        </Center>
      </Container>
    );
  }
  
  // Calculate discount
  const discount = product.discount 
    ? calculateDiscount(product.price, product.discount) 
    : 0;
  
  return (
    <Container maxW="container.xl" py={8}>
      {/* Breadcrumb */}
      <Breadcrumb 
        spacing="8px" 
        separator={<ChevronRightIcon color="gray.500" />} 
        mb={6}
      >
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to="/products">Products</BreadcrumbLink>
        </BreadcrumbItem>
        {product.category && (
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to={`/category/${product.category.id}`}>
              {product.category.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}
        <BreadcrumbItem isCurrentPage>
          <Text>{product.name}</Text>
        </BreadcrumbItem>
      </Breadcrumb>
      
      {/* Product Details */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={8}>
        {/* Product Images */}
        <GridItem>
          <Box 
            position="relative" 
            borderRadius="lg" 
            overflow="hidden"
            boxShadow="md"
          >
            <Image
              src={product.images && product.images[selectedImage] ? product.images[selectedImage] : product.image}
              alt={product.name}
              width="100%"
              height="400px"
              objectFit="cover"
              fallback={<Skeleton height="400px" />}
            />
            
            {/* Image Navigation */}
            {product.images && product.images.length > 1 && (
              <>
                <IconButton
                  icon={<ChevronLeftIcon />}
                  position="absolute"
                  left={2}
                  top="50%"
                  transform="translateY(-50%)"
                  onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : product.images.length - 1))}
                  aria-label="Previous image"
                  colorScheme="blackAlpha"
                  isRound
                />
                <IconButton
                  icon={<ChevronRightIcon />}
                  position="absolute"
                  right={2}
                  top="50%"
                  transform="translateY(-50%)"
                  onClick={() => setSelectedImage((prev) => (prev < product.images.length - 1 ? prev + 1 : 0))}
                  aria-label="Next image"
                  colorScheme="blackAlpha"
                  isRound
                />
              </>
            )}
          </Box>
          
          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <HStack mt={4} spacing={2} overflowX="auto" py={2}>
              {product.images.map((image, index) => (
                <Box
                  key={index}
                  borderWidth={selectedImage === index ? 2 : 1}
                  borderColor={selectedImage === index ? 'blue.500' : borderColor}
                  borderRadius="md"
                  overflow="hidden"
                  cursor="pointer"
                  onClick={() => setSelectedImage(index)}
                  transition="all 0.2s"
                  _hover={{ transform: 'scale(1.05)' }}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - ${index + 1}`}
                    width="80px"
                    height="80px"
                    objectFit="cover"
                  />
                </Box>
              ))}
            </HStack>
          )}
        </GridItem>
        
        {/* Product Info */}
        <GridItem>
          <VStack align="stretch" spacing={4}>
            {/* Product Name */}
            <Heading size="lg">{product.name}</Heading>
            
            {/* Brand */}
            {product.brand && (
              <Text color="gray.500" fontSize="md">
                Brand: <Text as="span" fontWeight="medium">{product.brand}</Text>
              </Text>
            )}
            
            {/* Rating */}
            <HStack>
              <HStack spacing={1}>
                {renderStars(product.rating || 0)}
              </HStack>
              <Text color="gray.500">
                ({product.reviews?.length || 0} reviews)
              </Text>
            </HStack>
            
            {/* Price */}
            <Box>
              {product.discount ? (
                <HStack spacing={2}>
                  <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                    {formatPrice(product.discount)}
                  </Text>
                  <Text fontSize="lg" textDecoration="line-through" color="gray.500">
                    {formatPrice(product.price)}
                  </Text>
                  <Badge colorScheme="red" fontSize="md" px={2} py={1} borderRadius="md">
                    {discount}% OFF
                  </Badge>
                </HStack>
              ) : (
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                  {formatPrice(product.price)}
                </Text>
              )}
            </Box>
            
            {/* Stock Status */}
            <HStack>
              {product.stock > 0 ? (
                <HStack>
                  <CheckCircleIcon color="green.500" />
                  <Text>In Stock ({product.stock} available)</Text>
                </HStack>
              ) : (
                <HStack>
                  <TimeIcon color="red.500" />
                  <Text color="red.500">Out of Stock</Text>
                </HStack>
              )}
            </HStack>
            
            {/* Description */}
            <Text>{product.description}</Text>
            
            {/* Features */}
            {product.features && product.features.length > 0 && (
              <Box>
                <Heading size="sm" mb={2}>Key Features</Heading>
                <List spacing={2}>
                  {product.features.map((feature, index) => (
                    <ListItem key={index}>
                      <ListIcon as={CheckCircleIcon} color="green.500" />
                      {feature}
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
            
            {/* Quantity Selector */}
            <Box>
              <Text mb={2}>Quantity</Text>
              <NumberInput
                min={1}
                max={product.stock}
                value={quantity}
                onChange={handleQuantityChange}
                size="md"
                maxW="150px"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Box>
            
            {/* Action Buttons */}
            <HStack spacing={4} mt={4}>
              <Button
                leftIcon={getIcon('shoppingCart', 'fa')}
                colorScheme="blue"
                size="lg"
                width="full"
                onClick={handleAddToCart}
                isLoading={loading}
              >
                Add to Cart
              </Button>
              <IconButton
                icon={getIcon('heart', 'fa')}
                aria-label="Add to wishlist"
                size="lg"
                variant="outline"
                colorScheme="red"
                onClick={() => toast({
                  title: "Added to wishlist",
                  description: "This product has been added to your wishlist",
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                })}
              />
              <IconButton
                icon={getIcon('share', 'fa')}
                aria-label="Share product"
                size="lg"
                variant="outline"
              />
            </HStack>
            
            {/* Additional Info */}
            <Box 
              p={4} 
              borderWidth="1px" 
              borderRadius="lg" 
              bg={hoverBgColor}
              mt={4}
            >
              <HStack spacing={4} justify="space-between">
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color="gray.500">Free Shipping</Text>
                  <Text fontWeight="medium">On orders over $50</Text>
                </VStack>
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color="gray.500">Returns</Text>
                  <Text fontWeight="medium">30-day return policy</Text>
                </VStack>
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color="gray.500">Support</Text>
                  <Text fontWeight="medium">24/7 customer support</Text>
                </VStack>
              </HStack>
            </Box>
          </VStack>
        </GridItem>
      </Grid>
      
      {/* Product Details Tabs */}
      <Box mt={12}>
        <Tabs variant="enclosed" colorScheme="blue">
          <TabList>
            <Tab>Description</Tab>
            <Tab>Specifications</Tab>
            <Tab>Reviews ({product.reviews?.length || 0})</Tab>
            <Tab>Shipping & Returns</Tab>
          </TabList>
          
          <TabPanels>
            {/* Description Tab */}
            <TabPanel>
              <Box p={4}>
                <Text whiteSpace="pre-line">{product.description}</Text>
                
                {product.longDescription && (
                  <Text mt={4} whiteSpace="pre-line">{product.longDescription}</Text>
                )}
              </Box>
            </TabPanel>
            
            {/* Specifications Tab */}
            <TabPanel>
              <Box p={4}>
                {product.specifications ? (
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                    {Object.entries(product.specifications).map(([key, value], index) => (
                      <GridItem key={index}>
                        <HStack>
                          <Text fontWeight="bold" width="150px">{key}:</Text>
                          <Text>{value}</Text>
                        </HStack>
                      </GridItem>
                    ))}
                  </Grid>
                ) : (
                  <Text>No specifications available for this product.</Text>
                )}
              </Box>
            </TabPanel>
            
            {/* Reviews Tab */}
            <TabPanel>
              <Box p={4}>
                {product.reviews && product.reviews.length > 0 ? (
                  <VStack align="stretch" spacing={6}>
                    {product.reviews.map((review, index) => (
                      <Box 
                        key={index} 
                        p={4} 
                        borderWidth="1px" 
                        borderRadius="lg"
                        borderColor={borderColor}
                      >
                        <HStack justify="space-between" mb={2}>
                          <Text fontWeight="bold">{review.user}</Text>
                          <HStack>
                            {renderStars(review.rating)}
                          </HStack>
                        </HStack>
                        <Text color="gray.500" fontSize="sm" mb={2}>
                          {new Date(review.date).toLocaleDateString()}
                        </Text>
                        <Text>{review.comment}</Text>
                      </Box>
                    ))}
                  </VStack>
                ) : (
                  <Text>No reviews available for this product.</Text>
                )}
              </Box>
            </TabPanel>
            
            {/* Shipping & Returns Tab */}
            <TabPanel>
              <Box p={4}>
                <VStack align="stretch" spacing={6}>
                  <Box>
                    <Heading size="md" mb={2}>Shipping Information</Heading>
                    <Text>
                      We offer free shipping on all orders over $50. Standard shipping takes 3-5 business days.
                      Express shipping (1-2 business days) is available for an additional fee.
                    </Text>
                  </Box>
                  
                  <Box>
                    <Heading size="md" mb={2}>Return Policy</Heading>
                    <Text>
                      We accept returns within 30 days of purchase. Items must be unused and in their original packaging.
                      Please contact our customer service team to initiate a return.
                    </Text>
                  </Box>
                  
                  <Box>
                    <Heading size="md" mb={2}>Warranty</Heading>
                    <Text>
                      All our products come with a 1-year warranty against manufacturing defects.
                      This warranty does not cover damage caused by misuse or normal wear and tear.
                    </Text>
                  </Box>
                </VStack>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      
      {/* Related Products */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <Box mt={12}>
          <Heading size="lg" mb={6}>Related Products</Heading>
          <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
            {product.relatedProducts.map((relatedProduct) => (
              <GridItem key={relatedProduct.id}>
                <Box 
                  borderWidth="1px" 
                  borderRadius="lg" 
                  overflow="hidden"
                  transition="all 0.2s"
                  _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
                >
                  <Image
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    height="200px"
                    width="100%"
                    objectFit="cover"
                  />
                  <Box p={4}>
                    <Text fontWeight="bold" noOfLines={1}>{relatedProduct.name}</Text>
                    <Text color="blue.600" fontWeight="bold" mt={1}>
                      {formatPrice(relatedProduct.price)}
                    </Text>
                    <Button 
                      size="sm" 
                      colorScheme="blue" 
                      width="full" 
                      mt={3}
                      onClick={() => navigate(`/product/${relatedProduct.id}`)}
                    >
                      View Details
                    </Button>
                  </Box>
                </Box>
              </GridItem>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default ProductDetail; 