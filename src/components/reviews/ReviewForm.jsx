import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Textarea,
  VStack,
  HStack,
  Text,
  useToast,
  useColorModeValue,
  Flex,
  Spinner,
} from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import { addComment } from '../../redux/slices/commentsSlice';

/**
 * A form component for submitting new reviews with ratings
 * @param {Object} props - Component props
 * @param {string} props.productId - The ID of the product to review
 * @param {string} props.productName - The name of the product (optional)
 * @param {Function} props.onSuccess - Callback function to execute on successful submission
 * @returns {JSX.Element} - The ReviewForm component
 */
const ReviewForm = ({ productId, productName, onSuccess }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { user } = useSelector((state) => state.auth);
  const { addCommentLoading, addCommentError } = useSelector((state) => state.comments);
  
  // Local state for rating
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  
  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Form validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      content: '',
    },
  });
  
  // Handle form submission
  const onSubmit = async (data) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to submit a review.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    if (rating === 0) {
      toast({
        title: 'Rating Required',
        description: 'Please select a rating before submitting.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    const commentData = {
      productId,
      productName,
      content: data.content,
      rating,
      userId: user.id,
      userName: user.name || 'Anonymous',
      userAvatar: user.avatar,
      status: 'pending', // Default status
    };
    
    try {
      await dispatch(addComment(commentData)).unwrap();
      
      toast({
        title: 'Review Submitted',
        description: 'Your review has been submitted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Reset form
      reset();
      setRating(0);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error is handled by the Redux slice
    }
  };
  
  // Render star rating input
  const renderStars = () => {
    const stars = [];
    const displayRating = hoverRating || rating;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Box
          key={`star-${i}`}
          as="span"
          cursor="pointer"
          onClick={() => setRating(i)}
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(0)}
          color={i <= displayRating ? '#FFD700' : 'gray.300'}
          fontSize="xl"
          mr={1}
        >
          <FaStar />
        </Box>
      );
    }
    
    return stars;
  };
  
  return (
    <Box
      p={4}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      bg={bgColor}
      mb={6}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4} align="stretch">
          <Text fontWeight="bold">Write a Review</Text>
          
          {/* Rating selection */}
          <FormControl isInvalid={rating === 0}>
            <FormLabel>Rating</FormLabel>
            <Flex>
              {renderStars()}
              <Text ml={2} color={rating === 0 ? 'red.500' : 'gray.500'}>
                {rating === 0 ? 'Please select a rating' : `${rating} star${rating !== 1 ? 's' : ''}`}
              </Text>
            </Flex>
            {rating === 0 && (
              <FormErrorMessage>Rating is required</FormErrorMessage>
            )}
          </FormControl>
          
          {/* Review content */}
          <FormControl isInvalid={!!errors.content}>
            <FormLabel>Your Review</FormLabel>
            <Textarea
              placeholder="Share your thoughts about this product..."
              {...register('content', {
                required: 'Review content is required',
                minLength: {
                  value: 10,
                  message: 'Review must be at least 10 characters long',
                },
                maxLength: {
                  value: 500,
                  message: 'Review cannot exceed 500 characters',
                },
              })}
              rows={4}
            />
            <FormErrorMessage>
              {errors.content && errors.content.message}
            </FormErrorMessage>
          </FormControl>
          
          {/* Submit button */}
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={addCommentLoading}
            loadingText="Submitting..."
            isDisabled={!user}
          >
            {user ? 'Submit Review' : 'Login to Review'}
          </Button>
          
          {/* Error message */}
          {addCommentError && (
            <Text color="red.500" fontSize="sm">
              {addCommentError}
            </Text>
          )}
        </VStack>
      </form>
    </Box>
  );
};

export default ReviewForm; 