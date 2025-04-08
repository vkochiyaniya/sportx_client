// HomePage.jsx
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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const responsiveColumns = useBreakpointValue({ base: 1, md: 2, lg: 3 });

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

  const featuredProducts = [
    {
      name: "Pro Runner XT",
      price: "$149.99",
      image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
    },
    {
      name: "Training Gloves",
      price: "$39.99",
      image: "https://images.unsplash.com/photo-1583373834259-46cc92173cb7",
    },
    {
      name: "Sports Backpack",
      price: "$79.99",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        position="relative"
        h="100vh"
        bgImage={`url('${heroContent.bgImage}')`}
        bgSize="cover"
        bgPosition="center"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient="linear(to-r, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3))"
        >
          <Container centerContent h="full" maxW="container.xl">
            <Stack
              spacing={6}
              textAlign="center"
              color="white"
              mt={{ base: 20, md: 40 }}
            >
              <Heading fontSize={{ base: "4xl", md: "6xl" }}>
                {heroContent.heading}
              </Heading>
              <Text fontSize={{ base: "lg", md: "xl" }}>
                {heroContent.subheading}
              </Text>
              <Button
                colorScheme="red"
                size="lg"
                width="fit-content"
                mx="auto"
                onClick={() => navigate("/shop")}
              >
                Shop Now
              </Button>
            </Stack>
          </Container>
        </Box>
      </Box>

      {/* Categories Grid */}
      <Container maxW="container.xl" py={16}>
        <Heading textAlign="center" mb={12} fontSize="3xl">
          Shop By Category
        </Heading>
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap={8}
          px={{ base: 4, md: 0 }}
        >
          {categories.map((category, index) => (
            <Box
              key={index}
              position="relative"
              borderRadius="xl"
              overflow="hidden"
              _hover={{ transform: "scale(1.02)", transition: "0.3s ease" }}
            >
              <Image
                src={category.image}
                alt={category.title}
                h="400px"
                w="full"
                objectFit="cover"
              />
              <Box
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                p={6}
                bgGradient="linear(to-t, rgba(0,0,0,0.8), transparent)"
              >
                <Heading color="white" fontSize="2xl">
                  {category.title}
                </Heading>
                <Button
                  mt={4}
                  colorScheme="red"
                  onClick={() => navigate(category.link)}
                >
                  Explore
                </Button>
              </Box>
            </Box>
          ))}
        </Grid>
      </Container>

      {/* Featured Products */}
      <Box bg="gray.50" py={16}>
        <Container maxW="container.xl">
          <Heading textAlign="center" mb={12} fontSize="3xl">
            Best Sellers
          </Heading>
          <Flex
            overflowX="auto"
            pb={6}
            css={{
              "&::-webkit-scrollbar": { display: "none" },
              "-ms-overflow-style": "none",
              scrollbarWidth: "none",
            }}
          >
            {featuredProducts.map((product, index) => (
              <Box
                key={index}
                minW={{ base: "300px", md: "400px" }}
                mx={4}
                bg="white"
                borderRadius="xl"
                overflow="hidden"
                boxShadow="lg"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  h="300px"
                  w="full"
                  objectFit="cover"
                />
                <Box p={6}>
                  <Heading fontSize="xl">{product.name}</Heading>
                  <Text fontSize="lg" fontWeight="bold" color="red.500" mt={2}>
                    {product.price}
                  </Text>
                  <Button
                    colorScheme="blackAlpha"
                    mt={4}
                    width="full"
                    onClick={() => navigate("/product")}
                  >
                    Quick Add
                  </Button>
                </Box>
              </Box>
            ))}
          </Flex>
        </Container>
      </Box>

      {/* Promo Banner */}
      <Box bg="red.600" color="white" py={20}>
        <Container maxW="container.xl" textAlign="center">
          <Heading fontSize="4xl" mb={6}>
            Summer Sale: Up to 50% Off
          </Heading>
          <Text fontSize="xl" mb={8}>
            Limited time offer on selected items
          </Text>
          <Button
            colorScheme="whiteAlpha"
            size="lg"
            onClick={() => navigate("/sale")}
          >
            Shop Sale
          </Button>
        </Container>
      </Box>

      {/* Newsletter Section */}
      <Container maxW="container.md" py={20}>
        <Stack spacing={6} textAlign="center">
          <Heading fontSize="3xl">Get the Latest Updates</Heading>
          <Text fontSize="lg" color="gray.600">
            Subscribe to our newsletter for exclusive offers and product releases
          </Text>
          <Flex gap={4} justify="center">
            <Input
              placeholder="Enter your email"
              size="lg"
              maxW="400px"
              borderRadius="full"
            />
            <Button
              colorScheme="red"
              size="lg"
              borderRadius="full"
              px={8}
            >
              Subscribe
            </Button>
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
};

export default HomePage;