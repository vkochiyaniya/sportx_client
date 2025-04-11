import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  VStack,
  Checkbox,
  CheckboxGroup,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  useColorModeValue,
  Collapse,
  IconButton,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { SearchIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setBrandFilter } from '../../redux/slices/productSlice';

const FilterByBrand = ({ brands = [] }) => {
  const dispatch = useDispatch();
  const { brandFilter } = useSelector((state) => state.products);
  
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Initialize from Redux state if available
  useEffect(() => {
    if (brandFilter && brandFilter.length > 0) {
      setSelectedBrands(brandFilter);
    }
  }, [brandFilter]);
  
  // Filter brands based on search term
  const filteredBrands = brands.filter(brand => 
    brand.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle brand selection
  const handleBrandChange = (brands) => {
    setSelectedBrands(brands);
  };
  
  // Apply filter
  const applyFilter = () => {
    dispatch(setBrandFilter(selectedBrands));
  };
  
  // Reset filter
  const resetFilter = () => {
    setSelectedBrands([]);
    dispatch(setBrandFilter([]));
  };
  
  // Toggle expanded state
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Remove a brand from selection
  const removeBrand = (brandToRemove) => {
    const updatedBrands = selectedBrands.filter(brand => brand !== brandToRemove);
    setSelectedBrands(updatedBrands);
    dispatch(setBrandFilter(updatedBrands));
  };
  
  return (
    <Box 
      p={4} 
      borderWidth="1px" 
      borderRadius="lg" 
      bg={bgColor}
      borderColor={borderColor}
    >
      <HStack justify="space-between" mb={4}>
        <Text fontWeight="bold">Filter by Brand</Text>
        <IconButton
          icon={isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          size="sm"
          variant="ghost"
          onClick={toggleExpanded}
          aria-label={isExpanded ? "Collapse" : "Expand"}
        />
      </HStack>
      
      <Collapse in={isExpanded}>
        {/* Search input */}
        <InputGroup size="sm" mb={4}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        
        {/* Selected brands tags */}
        {selectedBrands.length > 0 && (
          <Wrap mb={4}>
            {selectedBrands.map((brand) => (
              <WrapItem key={brand}>
                <Tag size="md" borderRadius="full" variant="solid" colorScheme="blue">
                  <TagLabel>{brand}</TagLabel>
                  <TagCloseButton onClick={() => removeBrand(brand)} />
                </Tag>
              </WrapItem>
            ))}
          </Wrap>
        )}
        
        {/* Brand checkboxes */}
        <Box 
          maxH="200px" 
          overflowY="auto" 
          mb={4}
          css={{
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: useColorModeValue('gray.300', 'gray.600'),
              borderRadius: '24px',
            },
          }}
        >
          <CheckboxGroup 
            colorScheme="blue" 
            value={selectedBrands}
            onChange={handleBrandChange}
          >
            <VStack align="start" spacing={2}>
              {filteredBrands.length > 0 ? (
                filteredBrands.map((brand) => (
                  <Checkbox key={brand} value={brand}>
                    {brand}
                  </Checkbox>
                ))
              ) : (
                <Text color="gray.500" fontSize="sm">No brands found</Text>
              )}
            </VStack>
          </CheckboxGroup>
        </Box>
        
        {/* Action buttons */}
        <HStack spacing={2}>
          <Button 
            size="sm" 
            colorScheme="blue" 
            onClick={applyFilter}
            flex={1}
          >
            Apply
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={resetFilter}
            flex={1}
          >
            Reset
          </Button>
        </HStack>
      </Collapse>
    </Box>
  );
};

export default FilterByBrand; 