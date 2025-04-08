import { Box, Flex, Heading, Text, Grid, Input, Textarea, Button } from "@chakra-ui/react";

const Contact = () => (
  <Box>
    <Flex 
      h="60vh" 
      bgImage="url('https://images.unsplash.com/photo-1587560699334-cc4ff634909a')"
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
        Connect With Champions
      </Heading>
    </Flex>

    <Grid 
      templateColumns={{ base: "1fr", md: "1fr 1fr" }} 
      gap={8} 
      maxW="1200px" 
      mx="auto" 
      p={8}
    >
      <Box>
        <Heading size="xl" mb={6}>Get in Touch</Heading>
        <form>
          <Input placeholder="Name" mb={4} />
          <Input placeholder="Email" mb={4} />
          <Textarea placeholder="Message" h="200px" mb={4} />
          <Button colorScheme="blue" size="lg">Send Message</Button>
        </form>
      </Box>

      <Box bg="gray.50" p={8} borderRadius="lg">
        <Heading size="lg" mb={4}>Global Headquarters</Heading>
        <Text mb={4}>123 Performance Way</Text>
        <Text mb={4}>Sports City, SC 12345</Text>
        <Text mb={4}>☎️ (555) 123-4567</Text>
        <Text>⏰ Mon-Fri: 8AM - 6PM EST</Text>
      </Box>
    </Grid>
  </Box>
);

export default Contact;