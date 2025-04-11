import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  SimpleGrid,
  Heading,
  Text,
  Center,
  Spinner,
  VStack,
  HStack,
  Button,
  useColorModeValue,
  Flex,
  IconButton,
  Tooltip,
  Badge,
  Divider,
  useToast,
  Grid,
  GridItem,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  Select,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FaFilter, FaSearch, FaSort, FaTimes } from 'react-icons/fa';
import { fetchAllProducts, fetchProductsByCategory, fetchProductsByBrand, filterProductsByPrice, sortProductsByPriceHighToLow, sortProductsByPriceLowToHigh, sortProductsByName, fetchProductById } from '../../redux/slices/productSlice';
import { selectFilteredProducts } from '../../redux/slices/productSlice';
import ProductCard from './ProductCard';
import FilterPanel from './FilterPanel';
import FilterByPrice from './FilterByPrice';
import FilterByBrand from './FilterByBrand';
import SortProducts from './SortProducts';
import Pagination from '../common/Pagination';

const ProductList = ({ 
  title = 'All Products', 
  categoryId = null, 
  brandName = null,
  showFilters = true,
  columns = { base: 1, sm: 2, md: 3, lg: 4 }
}) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Get products from Redux store
  const { 
    products, 
    loading, 
    error,
    priceFilter,
    brandFilter,
    searchQuery
  } = useSelector((state) => state.products);
  
  // Get filtered products using our selector
  const filteredProducts = useSelector(selectFilteredProducts);
  
  // Local state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [activeFilters, setActiveFilters] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortBy, setSortBy] = useState('');
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Fetch products on component mount
  useEffect(() => {
    if (categoryId) {
      dispatch(fetchProductsByCategory(categoryId));
    } else if (brandName) {
      dispatch(fetchProductsByBrand(brandName));
    } else {
      dispatch(fetchAllProducts());
    }
  }, [dispatch, categoryId, brandName]);
  
  // Update active filters when filters change
  useEffect(() => {
    const filters = [];
    
    if (priceFilter) {
      filters.push(`Price: $${priceFilter.min} - $${priceFilter.max}`);
    }
    
    if (brandFilter && brandFilter.length > 0) {
      brandFilter.forEach(brand => {
        filters.push(`Brand: ${brand}`);
      });
    }
    
    if (searchQuery) {
      filters.push(`Search: ${searchQuery}`);
    }
    
    setActiveFilters(filters);
  }, [priceFilter, brandFilter, searchQuery]);
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  
  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Get unique brands from products
  const getUniqueBrands = () => {
    if (!products) return [];
    return [...new Set(products.map(product => product.brand).filter(Boolean))];
  };
  
  // Get min and max prices from products
  const getPriceRange = () => {
    if (!products || products.length === 0) return { min: 0, max: 1000 };
    
    const prices = products.map(product => product.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    };
  };
  
  // Show loading state
  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Center h="50vh">
          <Spinner size="xl" color="blue.500" />
        </Center>
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
              leftIcon={<FaTimes />} 
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </VStack>
        </Center>
      </Container>
    );
  }
  
  // Get price range
  const { min: minPrice, max: maxPrice } = getPriceRange();
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePriceFilter = (min, max) => {
    setPriceRange({ min, max });
    setCurrentPage(1);
    dispatch(filterProductsByPrice({ min, max }));
  };

  const handleBrandFilter = (brand) => {
    setSelectedBrand(brand);
    setCurrentPage(1);
    // Implement brand filtering logic
  };

  const handleSort = (sortType) => {
    setSortBy(sortType);
    switch (sortType) {
      case 'price-high-low':
        dispatch(sortProductsByPriceHighToLow());
        break;
      case 'price-low-high':
        dispatch(sortProductsByPriceLowToHigh());
        break;
      case 'name':
        dispatch(sortProductsByName());
        break;
      default:
        break;
    }
  };

  const updateActiveFilters = () => {
    const filters = [];
    if (searchQuery) filters.push({ type: 'search', value: searchQuery });
    if (priceRange.min || priceRange.max) filters.push({ type: 'price', value: `${priceRange.min}-${priceRange.max}` });
    if (selectedBrand) filters.push({ type: 'brand', value: selectedBrand });
    setActiveFilters(filters);
  };

  useEffect(() => {
    updateActiveFilters();
  }, [searchQuery, priceRange, selectedBrand]);

  const removeFilter = (filterType) => {
    switch (filterType) {
      case 'search':
        setSearchQuery('');
        break;
      case 'price':
        setPriceRange({ min: '', max: '' });
        break;
      case 'brand':
        setSelectedBrand('');
        break;
      default:
        break;
    }
  };
  
  return (
    <Container maxW="container.xl" py={8}>
      {/* Header */}
      <Flex 
        direction={{ base: 'column', md: 'row' }} 
        justify="space-between" 
        align={{ base: 'flex-start', md: 'center' }}
        mb={6}
      >
        <Heading size="lg" mb={{ base: 4, md: 0 }}>{title}</Heading>
        
        {/* Mobile filter button */}
        {showFilters && (
          <Button
            leftIcon={<FaFilter />}
            colorScheme="blue"
            variant="outline"
            onClick={onOpen}
            display={{ base: 'flex', md: 'none' }}
          >
            Filters
          </Button>
        )}
      </Flex>
      
      {/* Active filters */}
      {activeFilters.length > 0 && (
        <Box mb={6} p={4} borderWidth="1px" borderRadius="lg" bg={bgColor} borderColor={borderColor}>
          <Text fontSize="sm" fontWeight="medium" mb={2}>Active Filters:</Text>
          <Wrap spacing={2}>
            {activeFilters.map((filter, index) => (
              <WrapItem key={index}>
                <Tag size="md" borderRadius="full" variant="solid" colorScheme="blue">
                  <TagLabel>{filter.type}: {filter.value}</TagLabel>
                  <TagCloseButton onClick={() => removeFilter(filter.type)} />
                </Tag>
              </WrapItem>
            ))}
          </Wrap>
        </Box>
      )}
      
      {/* Main content */}
      <Grid 
        templateColumns={{ base: '1fr', md: '250px 1fr' }} 
        gap={8}
      >
        {/* Desktop filter panel */}
        {showFilters && (
          <GridItem display={{ base: 'none', md: 'block' }}>
            <FilterPanel 
              brands={getUniqueBrands()}
              minPrice={minPrice}
              maxPrice={maxPrice}
            />
          </GridItem>
        )}
        
        {/* Product grid */}
        <GridItem>
          {/* Empty state */}
          {filteredProducts.length === 0 ? (
            <Center h="50vh">
              <VStack spacing={4}>
                <Text fontSize="lg">No products found</Text>
                <Text color="gray.500">Try adjusting your filters or search criteria</Text>
              </VStack>
            </Center>
          ) : (
            <>
              {/* Product grid */}
              <SimpleGrid columns={columns} spacing={6} mb={8}>
                {currentItems.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </SimpleGrid>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Flex justify="center" mt={8}>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </Flex>
              )}
            </>
          )}
        </GridItem>
      </Grid>
      
      {/* Mobile filter drawer */}
      {showFilters && (
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          size="full"
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Filters</DrawerHeader>
            
            <DrawerBody>
              <VStack spacing={4} align="stretch">
                <SortProducts />
                <FilterByPrice minPrice={minPrice} maxPrice={maxPrice} />
                <FilterByBrand brands={getUniqueBrands()} />
              </VStack>
            </DrawerBody>
            
            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button colorScheme="blue" onClick={onClose}>
                Apply Filters
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </Container>
  );
};

export default ProductList; 