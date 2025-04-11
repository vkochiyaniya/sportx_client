import React, { useState, useEffect } from 'react';
import {
  Box,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Text,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { setPriceFilter } from '../../redux/slices/productSlice';

const FilterByPrice = ({ minPrice = 0, maxPrice = 1000 }) => {
  const dispatch = useDispatch();
  const { priceFilter } = useSelector((state) => state.products);
  
  // Local state for the range slider
  const [range, setRange] = useState([minPrice, maxPrice]);
  const [minInput, setMinInput] = useState(minPrice);
  const [maxInput, setMaxInput] = useState(maxPrice);
  
  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Initialize from Redux state if available
  useEffect(() => {
    if (priceFilter) {
      setRange([priceFilter.min, priceFilter.max]);
      setMinInput(priceFilter.min);
      setMaxInput(priceFilter.max);
    }
  }, [priceFilter]);
  
  // Handle range slider change
  const handleRangeChange = (newRange) => {
    setRange(newRange);
    setMinInput(newRange[0]);
    setMaxInput(newRange[1]);
  };
  
  // Handle min input change
  const handleMinChange = (value) => {
    const newMin = Math.min(parseInt(value) || 0, maxInput);
    setMinInput(newMin);
    setRange([newMin, maxInput]);
  };
  
  // Handle max input change
  const handleMaxChange = (value) => {
    const newMax = Math.max(parseInt(value) || 0, minInput);
    setMaxInput(newMax);
    setRange([minInput, newMax]);
  };
  
  // Apply filter
  const applyFilter = () => {
    dispatch(setPriceFilter({ min: minInput, max: maxInput }));
  };
  
  // Reset filter
  const resetFilter = () => {
    setRange([minPrice, maxPrice]);
    setMinInput(minPrice);
    setMaxInput(maxPrice);
    dispatch(setPriceFilter(null));
  };
  
  return (
    <Box 
      p={4} 
      borderWidth="1px" 
      borderRadius="lg" 
      bg={bgColor}
      borderColor={borderColor}
    >
      <Text fontWeight="bold" mb={4}>Filter by Price</Text>
      
      <Box mb={6}>
        <RangeSlider
          aria-label={['min', 'max']}
          defaultValue={[minPrice, maxPrice]}
          min={minPrice}
          max={maxPrice}
          step={10}
          value={range}
          onChange={handleRangeChange}
          colorScheme="blue"
        >
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <Tooltip label={`$${range[0]}`}>
            <RangeSliderThumb index={0} />
          </Tooltip>
          <Tooltip label={`$${range[1]}`}>
            <RangeSliderThumb index={1} />
          </Tooltip>
        </RangeSlider>
      </Box>
      
      <HStack spacing={4} mb={4}>
        <Box flex={1}>
          <Text fontSize="sm" mb={1}>Min</Text>
          <NumberInput
            min={minPrice}
            max={maxInput}
            value={minInput}
            onChange={handleMinChange}
            size="sm"
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Box>
        
        <Box flex={1}>
          <Text fontSize="sm" mb={1}>Max</Text>
          <NumberInput
            min={minInput}
            max={maxPrice}
            value={maxInput}
            onChange={handleMaxChange}
            size="sm"
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Box>
      </HStack>
      
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
    </Box>
  );
};

export default FilterByPrice; 