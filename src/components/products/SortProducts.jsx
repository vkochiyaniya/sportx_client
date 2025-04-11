import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Select,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Button,
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react';
import { ChevronDownIcon, ArrowUpIcon, ArrowDownIcon, RepeatIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setSortOption } from '../../redux/slices/productSlice';

const SortProducts = () => {
  const dispatch = useDispatch();
  const { sortOption } = useSelector((state) => state.products);
  
  // Local state
  const [sortBy, setSortBy] = useState('featured');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Initialize from Redux state if available
  useEffect(() => {
    if (sortOption) {
      setSortBy(sortOption.by);
      setSortOrder(sortOption.order);
    }
  }, [sortOption]);
  
  // Handle sort change
  const handleSortChange = (value) => {
    setSortBy(value);
    applySort(value, sortOrder);
  };
  
  // Handle order change
  const handleOrderChange = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    applySort(sortBy, newOrder);
  };
  
  // Apply sort
  const applySort = (by, order) => {
    dispatch(setSortOption({ by, order }));
  };
  
  // Reset sort
  const resetSort = () => {
    setSortBy('featured');
    setSortOrder('asc');
    dispatch(setSortOption({ by: 'featured', order: 'asc' }));
  };
  
  // Get sort label
  const getSortLabel = (value) => {
    switch (value) {
      case 'price':
        return 'Price';
      case 'name':
        return 'Name';
      case 'rating':
        return 'Rating';
      case 'newest':
        return 'Newest';
      case 'featured':
      default:
        return 'Featured';
    }
  };
  
  return (
    <Box 
      p={4} 
      borderWidth="1px" 
      borderRadius="lg" 
      bg={bgColor}
      borderColor={borderColor}
    >
      <Text fontWeight="bold" mb={4}>Sort Products</Text>
      
      <HStack spacing={2}>
        <Select
          size="md"
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          flex={1}
        >
          <option value="featured">Featured</option>
          <option value="price">Price</option>
          <option value="name">Name</option>
          <option value="rating">Rating</option>
          <option value="newest">Newest</option>
        </Select>
        
        <Tooltip label={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}>
          <IconButton
            icon={sortOrder === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />}
            onClick={handleOrderChange}
            aria-label="Change sort order"
            colorScheme="blue"
            variant="outline"
          />
        </Tooltip>
        
        <Tooltip label="Reset sorting">
          <IconButton
            icon={<RepeatIcon />}
            onClick={resetSort}
            aria-label="Reset sorting"
            variant="outline"
          />
        </Tooltip>
      </HStack>
      
      <Text fontSize="sm" color="gray.500" mt={2}>
        Currently sorting by: <Text as="span" fontWeight="medium">{getSortLabel(sortBy)}</Text> 
        {sortBy !== 'featured' && (
          <> in <Text as="span" fontWeight="medium">{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</Text> order</>
        )}
      </Text>
    </Box>
  );
};

export default SortProducts; 