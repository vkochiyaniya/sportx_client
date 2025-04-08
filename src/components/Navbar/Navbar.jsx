import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
  Text,
  useColorMode,
  useMediaQuery,
} from "@chakra-ui/react";
import { BsSuitHeart, BsBag, BsSearch } from "react-icons/bs";
import { DarkModeBtn } from "../DarkMode/DarkModeBtn";
import { useSelector } from "react-redux";
import SideMenu from "../Sidebar/Sidebar";
import Profile from "../Profile/Profile";

const Navbar = () => {
  const [isLargerThan] = useMediaQuery("(min-width: 768px)");
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  // Fixed selector with proper memoization
  const { token, user } = useSelector((state) => state.auth);
  const cart = useSelector((store) => store.cart?.cart ?? []);
  const wishlist = useSelector((store) => store.wishReducer?.wishlist ?? []);

  const navStyle = {
    base: { color: "black", textDecoration: "none" },
    active: {
      color: "#027bff",
      textDecoration: "none",
      borderBottom: "2px solid #027bff"
    },
  };

  return (
    <Box position="sticky" top="0" zIndex="sticky" bg={colorMode === "dark" ? "gray.800" : "white"} boxShadow="md">
      {/* Top Bar */}
      <Flex justifyContent="flex-end" alignItems="center" p={2} borderBottom="1px solid" borderColor="gray.100">
        {token ? (
          <Profile colorMode={colorMode} />
        ) : (
          <Button
            variant="ghost"
            colorScheme="blue"
            onClick={() => navigate('/register')}
          >
            Sign up
          </Button>
        )}
        <DarkModeBtn mx={4} />
      </Flex>

      {/* Main Navigation */}
      <Flex alignItems="center" p={4}>
        {/* Brand Logo */}
        <Heading 
          as="h1" 
          fontSize="2xl" 
          fontWeight="bold" 
          bgGradient="linear(to-r, blue.600, blue.400)"
          bgClip="text"
          ml={4}
          cursor="pointer"
          onClick={() => navigate('/')}
        >
          SPORTX
        </Heading>

        <Spacer />

        {/* Navigation Links */}
        {isLargerThan && (
          <HStack spacing={8} mx={8}>
            <InputGroup maxW="400px">
              <InputLeftElement pointerEvents="none">
                <BsSearch color="gray.300" />
              </InputLeftElement>
              <Input placeholder="Search performance gear..." />
            </InputGroup>

            <NavLink to="/" style={({ isActive }) => isActive ? navStyle.active : navStyle.base}>
              <Text fontWeight="medium">Home</Text>
            </NavLink>
            <NavLink to="/allproducts" style={({ isActive }) => isActive ? navStyle.active : navStyle.base}>
              <Text fontWeight="medium">Shop</Text>
            </NavLink>
            <NavLink to="/about-us" style={({ isActive }) => isActive ? navStyle.active : navStyle.base}>
              <Text fontWeight="medium">About</Text>
            </NavLink>
            <NavLink to="/contact" style={({ isActive }) => isActive ? navStyle.active : navStyle.base}>
              <Text fontWeight="medium">Contact</Text>
            </NavLink>
          </HStack>
        )}

        {/* Icons */}
        <HStack spacing={4} mr={4}>
          <IconButton
            icon={<BsSuitHeart />}
            aria-label="Wishlist"
            variant="ghost"
            onClick={() => navigate('/wishlist')}
          />
          <IconButton
            icon={<BsBag />}
            aria-label="Cart"
            variant="ghost"
            onClick={() => navigate('/cart')}
          />
          {!isLargerThan && <SideMenu colorMode={colorMode} />}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;