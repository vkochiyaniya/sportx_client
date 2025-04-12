// HomePage.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Image,
  Input,
  Stack,
  Text,
  useBreakpointValue,
  VStack,
  useColorModeValue,
  keyframes,
  chakra,
  HStack,
  Icon,
  Badge,
  SimpleGrid,
} from "@chakra-ui/react";
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowForwardIcon, StarIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const MotionBox = chakra(motion.div);

const HomePage = () => {
  const responsiveColumns = useBreakpointValue({ base: 1, md: 2, lg: 3 });
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const controls = useAnimation();
  const [ref, inView] = useInView();
  const bgOverlay = useColorModeValue('rgba(255,255,255,0.9)', 'rgba(0,0,0,0.8)');

  const heroContent = {
    heading: "Elevate Your Game",
    subheading: "Premium Sports Gear & Athletic Wear",
    bgImage:
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
  };

  const categories = [
    {
      title: "Running Shoes",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      link: "/running",
    },
    {
      title: "Training Gear",
      image: "https://images.unsplash.com/photo-1581009137042-c552e485697a",
      link: "/training",
    },
    {
      title: "Team Sports",
      image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20",
      link: "/team-sports",
    },
  ];

  const testimonials = [
    {
      text: "Best sports gear I've ever bought. High quality and great customer service!",
      author: "Jane D."
    },
    {
      text: "Amazing products! My performance has improved thanks to this gear!",
      author: "Mark T."
    }
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "Pro Tennis Racket",
      image: "https://images.unsplash.com/photo-1617083277624-481a0b083f4f?w=800&auto=format&fit=crop",
      price: 199.99,
      category: "Tennis"
    },
    {
      id: 2,
      name: "Premium Football",
      image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop",
      price: 49.99,
      category: "Football"
    },
    {
      id: 3,
      name: "Basketball Pro",
      image: "https://images.unsplash.com/photo-1519861155730-0b5fbf0dd889?w=800&auto=format&fit=crop",
      price: 89.99,
      category: "Basketball"
    },
    {
      id: 4,
      name: "Elite Running Shoes",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop",
      price: 159.99,
      category: "Running"
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [controls, inView]);

  return (
    <Box>
      {/* Hero Section */}
      <Flex position="relative" h="500px" bg="orange.500">
        <Container maxW="container.xl" display="flex">
          <Flex flex="1" align="center">
            <Box flex="1">
              <Image 
                src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop"
                alt="Sports Equipment"
                position="absolute"
                right="0"
                top="0"
                h="100%"
                w="50%"
                objectFit="cover"
              />
            </Box>
            <VStack 
              align="flex-start" 
              spacing={6} 
              maxW="600px"
              p={8}
              color="white"
              position="relative"
              zIndex={1}
            >
              <Heading size="2xl" lineHeight="shorter">
                PREMIUM SPORTS EQUIPMENT
              </Heading>
              <Text fontSize="xl">
                Explore the latest high-quality gear for every sport. Whether you're a professional or just starting,
                we have the perfect equipment for you.
              </Text>
              <Button
                as={RouterLink}
                to="/allproducts"
                size="lg"
                colorScheme="blue"
                bg="white"
                color="orange.500"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
              >
                EXPLORE PRODUCTS
              </Button>
            </VStack>
          </Flex>
        </Container>
      </Flex>

      {/* What Our Customers Say */}
      <Box py={16} bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW="container.xl">
          <VStack spacing={8}>
            <Heading textAlign="center" size="xl">
              What Our Customers Say
            </Heading>
            <SimpleGrid columns={2} spacing={8} w="full">
              {testimonials.map((testimonial, index) => (
                <Box
                  key={index}
                  bg="white"
                  p={6}
                  rounded="lg"
                  shadow="sm"
                  _hover={{ shadow: 'md' }}
                >
                  <Text fontSize="lg" fontStyle="italic" mb={4}>
                    "{testimonial.text}"
                  </Text>
                  <Text fontWeight="bold">- {testimonial.author}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Products Grid */}
      <Box py={16}>
        <Container maxW="container.xl">
          <VStack spacing={8}>
            <Image
              src="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&auto=format&fit=crop"
              alt="Sports Equipment Collection"
              w="full"
              h="300px"
              objectFit="cover"
              rounded="lg"
            />
            <Heading textAlign="center" size="xl">
              EXPLORE OUR PRODUCTS
            </Heading>
            <Text textAlign="center" color="gray.600">
              Browse through our wide range of sports equipment for all your needs.
            </Text>
            <Button
              as={RouterLink}
              to="/allproducts"
              size="lg"
              colorScheme="orange"
              px={8}
            >
              EXPLORE PRODUCTS
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* CTA Banner */}
      <Box 
        bg="orange.500" 
        py={16}
        position="relative"
        overflow="hidden"
      >
        <Container maxW="container.xl">
          <Grid
            templateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }}
            gap={8}
            alignItems="center"
          >
            <Image
              src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&auto=format&fit=crop"
              alt="Cyclist"
              h="300px"
              objectFit="cover"
              rounded="lg"
            />
            <VStack spacing={4} color="white" textAlign="center">
              <Heading size="xl">YOUR ONE-STOP SHOP</Heading>
              <Heading size="xl">FOR PREMIUM SPORTS</Heading>
              <Heading size="xl">EQUIPMENT</Heading>
              <Text fontSize="lg">
                Explore the latest, high-quality gear for every sport.
                Whether you're a professional or just starting,
                we have the perfect equipment for you!
              </Text>
              <Button
                as={RouterLink}
                to="/allproducts"
                size="lg"
                colorScheme="blue"
                bg="white"
                color="orange.500"
              >
                EXPLORE PRODUCTS
              </Button>
            </VStack>
            <Image
              src="https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=400&auto=format&fit=crop"
              alt="Soccer Player"
              h="300px"
              objectFit="cover"
              rounded="lg"
            />
          </Grid>
        </Container>
      </Box>

      {/* Featured Sports Equipment */}
      <Box py={16}>
        <Container maxW="container.xl">
          <VStack spacing={8}>
            <Heading textAlign="center" size="xl">
              FEATURED SPORTS EQUIPMENT
            </Heading>
            <Text textAlign="center" color="gray.500">
              No featured products available.
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Get Your Gear Today */}
      <Box bg="blue.600" color="white" py={16}>
        <Container maxW="container.xl" textAlign="center">
          <VStack spacing={6}>
            <Heading size="xl">GET YOUR GEAR TODAY</Heading>
            <Text fontSize="lg">Don't miss out on our exclusive offers.</Text>
            <Text color="gray.300">Sports Gear</Text>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;