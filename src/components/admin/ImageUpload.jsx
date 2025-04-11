import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Image,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { getIcon } from "../../utils/iconMapping.jsx";

const ImageUpload = ({ 
  name, 
  label, 
  value, 
  onChange, 
  helperText,
  currentImage = null,
}) => {
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    onChange(e);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setPreview(null);
    // Create a new event with a cleared file input
    const event = {
      target: {
        name,
        value: '',
        files: [],
      },
    };
    onChange(event);
  };

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Input
        type="file"
        name={name}
        onChange={handleChange}
        accept="image/*"
        p={1}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      
      {(preview || currentImage) && (
        <Box mt={3} position="relative" display="inline-block">
          <Image 
            src={preview || `https://localhost:7214/images/${currentImage}`} 
            alt="Preview" 
            maxH="150px" 
            maxW="200px" 
            objectFit="contain"
          />
          <IconButton
            icon={getIcon('remove')}
            size="sm"
            colorScheme="red"
            position="absolute"
            top={0}
            right={0}
            onClick={clearImage}
            aria-label="Remove image"
          />
        </Box>
      )}
    </FormControl>
  );
};

export default ImageUpload;