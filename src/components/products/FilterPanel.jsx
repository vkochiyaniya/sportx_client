import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  useDisclosure,
  Collapse,
  useColorModeValue,
  Divider,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { SearchIcon, ChevronDownIcon, ChevronUpIcon, CloseIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setPriceFilter, 
  setBrandFilter, 
  setSortOption,
  setSearchQuery,
  clearAllFilters
} from '../../redux/slices/productSlice';
import FilterByPrice from './FilterByPrice';
import FilterByBrand from './FilterByBrand';
import SortProducts from './SortProducts';

const FilterPanel = ({ 
  brands = [], 
  minPrice = 0, 
  maxPrice = 1000,
  showSearch = true,
  showPriceFilter = true,
  showBrandFilter = true,
  showSort = true,
}) => {
  const dispatch = useDispatch();
  const { 
    priceFilter, 
    brandFilter, 
    sortOption,
    searchQuery
  } = useSelector((state) => state.products);
  
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Initialize search term from Redux
  useEffect(() => {
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [searchQuery]);
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(searchTerm));
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    dispatch(setSearchQuery(''));
  };
  
  // Toggle expanded state
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Clear all filters
  const handleClearAllFilters = () => {
    dispatch(clearAllFilters());
    setSearchTerm('');
  };
  
  // Check if any filters are active
  const hasActiveFilters = priceFilter || (brandFilter && brandFilter.length > 0) || searchQuery;
  
  return (
    <Box 
      borderWidth="1px" 
      borderRadius="lg" 
      bg={bgColor}
      borderColor={borderColor}
      overflow="hidden"
    >
      {/* Header */}
      <HStack 
        p={4} 
        justify="space-between" 
        borderBottomWidth={hasActiveFilters ? "1px" : "0"}
        borderColor={borderColor}
      >
        <Text fontWeight="bold">Filters</Text>
        <HStack>
          {hasActiveFilters && (
            <Button 
              size="sm" 
              variant="ghost" 
              colorScheme="blue" 
              leftIcon={<CloseIcon />}
              onClick={handleClearAllFilters}
            >
              Clear All
            </Button>
          )}
          <IconButton
            icon={isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
            size="sm"
            variant="ghost"
            onClick={toggleExpanded}
            aria-label={isExpanded ? "Collapse" : "Expand"}
          />
        </HStack>
      </HStack>
      
      {/* Active filters */}
      {hasActiveFilters && (
        <Box p={4} borderBottomWidth="1px" borderColor={borderColor}>
          <Text fontSize="sm" fontWeight="medium" mb={2}>Active Filters:</Text>
          <Wrap spacing={2}>
            {priceFilter && (
              <WrapItem>
                <Tag size="md" borderRadius="full" variant="solid" colorScheme="blue">
                  <TagLabel>Price: ${priceFilter.min} - ${priceFilter.max}</TagLabel>
                  <TagCloseButton onClick={() => dispatch(setPriceFilter(null))} />
                </Tag>
              </WrapItem>
            )}
            
            {brandFilter && brandFilter.map((brand) => (
              <WrapItem key={brand}>
                <Tag size="md" borderRadius="full" variant="solid" colorScheme="blue">
                  <TagLabel>Brand: {brand}</TagLabel>
                  <TagCloseButton onClick={() => {
                    const updatedBrands = brandFilter.filter(b => b !== brand);
                    dispatch(setBrandFilter(updatedBrands.length > 0 ? updatedBrands : []));
                  }} />
                </Tag>
              </WrapItem>
            ))}
            
            {searchQuery && (
              <WrapItem>
                <Tag size="md" borderRadius="full" variant="solid" colorScheme="blue">
                  <TagLabel>Search: {searchQuery}</TagLabel>
                  <TagCloseButton onClick={clearSearch} />
                </Tag>
              </WrapItem>
            )}
          </Wrap>
        </Box>
      )}
      
      {/* Search bar */}
      {showSearch && (
        <Box p={4} borderBottomWidth="1px" borderColor={borderColor}>
          <form onSubmit={handleSearch}>
            <InputGroup size="md">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </form>
        </Box>
      )}
      
      {/* Filter content */}
      <Collapse in={isExpanded}>
        <VStack spacing={4} p={4} align="stretch">
          {/* Sort products */}
          {showSort && <SortProducts />}
          
          {/* Price filter */}
          {showPriceFilter && (
            <FilterByPrice minPrice={minPrice} maxPrice={maxPrice} />
          )}
          
          {/* Brand filter */}
          {showBrandFilter && (
            <FilterByBrand brands={brands} />
          )}
        </VStack>
      </Collapse>
    </Box>
  );
};

export default FilterPanel; 