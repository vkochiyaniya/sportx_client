import { Box, Flex, Heading, Text, Image } from "@chakra-ui/react";

const AboutUs = () => (
  <Box>
    <Flex 
      h="60vh" 
      bgImage="url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b')"
      bgPosition="center"
      bgSize="cover"
      alignItems="center"
      px={8}
      position="relative"
      _before={{
        content: '""',
        position: "absolute",
        inset: 0,
        bg: "rgba(0,0,0,0.4)",
      }}
    >
      <Heading 
        as="h1" 
        color="white" 
        fontSize="5xl" 
        zIndex="1"
        textShadow="2px 2px 4px rgba(0,0,0,0.5)"
      >
        Our Legacy in Sports
      </Heading>
    </Flex>

    <Flex maxW="1200px" mx="auto" p={8} direction="column" gap={8}>
      <Heading size="xl">Empowering Athletes Since 2012</Heading>
      <Text fontSize="lg" color="gray.600">
        At SPORTX, we combine cutting-edge technology with athlete insights to 
        deliver performance gear that makes the difference.
      </Text>
      
      <Flex gap={8} wrap="wrap" justify="center" mt={8}>
        <Box flex="1" minW="300px">
          <Image 
            src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b"
            borderRadius="lg"
          />
          <Heading size="md" mt={4}>Innovation Lab</Heading>
          <Text mt={2}>State-of-the-art research facility</Text>
        </Box>
        <Box flex="1" minW="300px">
          <Image 
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"
            borderRadius="lg"
          />
          <Heading size="md" mt={4}>Pro Partnerships</Heading>
          <Text mt={2}>Collaborating with elite athletes</Text>
        </Box>
      </Flex>
    </Flex>
  </Box>
);

export default AboutUs;