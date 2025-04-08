// src/Filter/Filters/FilterData.jsx
import React, { useState } from 'react';
import { 
  Box, 
  RangeSlider, 
  RangeSliderTrack, 
  RangeSliderFilledTrack, 
  RangeSliderThumb,
  VStack,
  Heading
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { productApi } from '../../../Api/productApi';

const FilterData = () => {
  const dispatch = useDispatch();
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const handlePriceChange = (values) => {
    setPriceRange(values);
    dispatch(productApi.filterByPrice(values[0], values[1]));
  };

  return (
    <Box p={4} bg="gray.50" borderRadius="md">
      <Heading size="md" mb={4}>Price Filter</Heading>
      <VStack spacing={4}>
        <RangeSlider
          aria-label={['min', 'max']}
          defaultValue={[0, 1000]}
          min={0}
          max={1000}
          step={50}
          onChangeEnd={handlePriceChange}
        >
          <RangeSliderTrack bg="blue.100">
            <RangeSliderFilledTrack bg="blue.500" />
          </RangeSliderTrack>
          <RangeSliderThumb boxSize={6} index={0} />
          <RangeSliderThumb boxSize={6} index={1} />
        </RangeSlider>
        <Text>Price Range: ${priceRange[0]} - ${priceRange[1]}</Text>
      </VStack>
    </Box>
  );
};

export default FilterData;