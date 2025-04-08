import { Box, Flex, Heading, Text, useMediaQuery } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  return (
    <Box
      bg="gray.800"
      color="gray.100"
      pt="60px"
      mt="80px"
      position="relative"
      _before={{
        content: '""',
        position: "absolute",
        top: "-35px",
        left: 0,
        right: 0,
        height: "70px",
        bg: "inherit",
        clipPath: "polygon(0 70%, 100% 0, 100% 100%, 0% 100%)",
        transform: "rotate(180deg)"
      }}
    >
      <Box maxW="1200px" mx="auto" px={4} pb={8}>
        <Flex
          direction={isLargerThan768 ? "row" : "column"}
          gap={8}
          mb={12}
          flexWrap="wrap"
        >
          {/* Brand Section */}
          <Box flex={1} minW="300px">
            <Heading size="xl" mb={4} bgGradient="linear(to-r, red.400, red.600)" bgClip="text">
              SPORTSPRO
            </Heading>
            <Text color="gray.400" maxW="300px">
              Equipping athletes with premium performance gear since 2012
            </Text>
          </Box>

          {/* Sport Categories */}
          <Flex direction="column" gap={3} flex={1} minW="200px">
            <Heading size="md" color="red.400" mb={2}>Categories</Heading>
            <Link to="/allproducts?category=training">
              <Text _hover={{ color: "red.300", transform: "translateX(4px)" }} transition="0.2s">
                Training Gear
              </Text>
            </Link>
            <Link to="/allproducts?category=footwear">
              <Text _hover={{ color: "red.300", transform: "translateX(4px)" }} transition="0.2s">
                Performance Footwear
              </Text>
            </Link>
            <Link to="/allproducts?category=team">
              <Text _hover={{ color: "red.300", transform: "translateX(4px)" }} transition="0.2s">
                Team Equipment
              </Text>
            </Link>
            <Link to="/allproducts?category=recovery">
              <Text _hover={{ color: "red.300", transform: "translateX(4px)" }} transition="0.2s">
                Recovery Tools
              </Text>
            </Link>
          </Flex>

          {/* Support */}
          <Flex direction="column" gap={3} flex={1} minW="200px">
            <Heading size="md" color="red.400" mb={2}>Support</Heading>
            <Text _hover={{ color: "red.300", cursor: "pointer" }}>Order Tracking</Text>
            <Text _hover={{ color: "red.300", cursor: "pointer" }}>Bulk Orders</Text>
            <Text _hover={{ color: "red.300", cursor: "pointer" }}>Team Discounts</Text>
            <Text _hover={{ color: "red.300", cursor: "pointer" }}>Warranty Info</Text>
          </Flex>

          {/* Legal */}
          <Flex direction="column" gap={3} flex={1} minW="200px">
            <Heading size="md" color="red.400" mb={2}>Company</Heading>
            <Text _hover={{ color: "red.300", cursor: "pointer" }}>Athlete Partnerships</Text>
            <Text _hover={{ color: "red.300", cursor: "pointer" }}>Careers</Text>
            <Text _hover={{ color: "red.300", cursor: "pointer" }}>Sustainability</Text>
            <Text _hover={{ color: "red.300", cursor: "pointer" }}>Investor Relations</Text>
          </Flex>
        </Flex>

        {/* Copyright */}
        <Text textAlign="center" color="gray.500" pt={8} borderTop="1px solid" borderColor="gray.700">
          © {new Date().getFullYear()} SPORTSPRO. Fueling champions worldwide.
        </Text>
      </Box>
    </Box>
  );
};

export default Footer;