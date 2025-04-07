import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Image,
  Spacer,
  Text,
  useColorMode,
  useMediaQuery,
} from "@chakra-ui/react";
import logo from "../../img/favicon.ico";
import { BsSuitHeart, BsBag } from "react-icons/bs";
import { DarkModeBtn } from "../DarkMode/DarkModeBtn";
import { useSelector } from "react-redux";
import SideMenu from "../Sidebar/Sidebar";
import Profile from "../Profile/Profile";

const Navbar = () => {
  const [isLargerThan] = useMediaQuery("(min-width: 768px)");
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  // Corrected Redux state access
  const { token, user } = useSelector((state) => state.auth);
  const cart = useSelector((store) => store.cart?.cart || []);
  const wishlist = useSelector((store) => store.wishReducer?.wishlist || []);

  // Style configurations
  const baseStyle = {
    color: "black",
    textDecoration: "none",
  };

  const activeStyle = {
    color: "#027bff",
    textDecoration: "none",
    transition: "0.5s",
    borderBottom: "2px solid black",
  };

  // Navigation handlers
  const handleHome = () => navigate("/");
  const handleCart = () => navigate("/cart");
  const handleHeart = () => navigate("/wishlist");
  const handleSignup = () => navigate("/register");

  return (
    <div className="Navbar">
      <Flex
        h="9vh"
        display="flex"
        justifyContent="right"
        gap="10px"
        alignItems="center"
        bg={colorMode === "dark" ? "none" : "#ebecec"}
      >
        {token ? (
          <Box>
            <Profile colorMode={colorMode} />
          </Box>
        ) : (
          <Button
            bg="black"
            color="whitesmoke"
            border="1px solid beige"
            _hover={{
              bg: "none",
              color: "teal",
            }}
            onClick={() => navigate('/register')}
          >
            Sign up
          </Button>
        )}
        <Box mr={["5", "6", "7", "9"]}>
          <DarkModeBtn />
        </Box>
      </Flex>

      <Flex fontWeight="bold">
        <HStack onClick={handleHome} cursor="pointer">
          <Image width="25px" m={5} src={logo} alt="logo" />
        </HStack>
        <Spacer />
        
        {isLargerThan && (
          <HStack>
            <NavLink
              style={({ isActive }) => (isActive ? activeStyle : baseStyle)}
              to="/"
            >
              <Text color={colorMode === "dark" ? "white" : "black"} my="4" mx="2">
                Home
              </Text>
            </NavLink>
            <NavLink
              style={({ isActive }) => (isActive ? activeStyle : baseStyle)}
              to="/allproducts"
            >
              <Text color={colorMode === "dark" ? "white" : "black"} my="4" mx="2">
                All Products
              </Text>
            </NavLink>
            <NavLink
              style={({ isActive }) => (isActive ? activeStyle : baseStyle)}
              to="/men"
            >
              <Text color={colorMode === "dark" ? "white" : "black"} my="4" mx="2">
                Men
              </Text>
            </NavLink>
            <NavLink
              style={({ isActive }) => (isActive ? activeStyle : baseStyle)}
              to="/women"
            >
              <Text color={colorMode === "dark" ? "white" : "black"} my="4" mx="2">
                Women
              </Text>
            </NavLink>
            <NavLink
              style={({ isActive }) => (isActive ? activeStyle : baseStyle)}
              to="/shoes"
            >
              <Text color={colorMode === "dark" ? "white" : "black"} my="4" mx="2">
                Shoes
              </Text>
            </NavLink>
          </HStack>
        )}

        <Spacer />

        <HStack>
          <Box onClick={handleHeart}>
            <Flex
              onClick={handleCart}
              alignItems="center"
              alignContent="center"
              justifyContent="center"
            >
              <Icon
                w={6}
                h={6}
                my="4"
                mx="3"
                as={BsSuitHeart}
                cursor="pointer"
              />
              <Text
                position="relative"
                top="-15px"
                left="-25px"
                borderRadius="50%"
                p="0rem 0.3rem"
                bg="blue.500"
                color="white"
              >
                {wishlist.length}
              </Text>
            </Flex>
          </Box>
          <Box>
            <Flex
              onClick={handleCart}
              alignItems="center"
              alignContent="center"
              justifyContent="center"
            >
              <Icon w={6} h={6} my="4" mx="3" as={BsBag} cursor="pointer" />
              <Text
                position="relative"
                top="-15px"
                left="-25px"
                borderRadius="50%"
                p="0rem 0.3rem"
                bg="blue.500"
                color="white"
              >
                {cart.length}
              </Text>
            </Flex>
          </Box>
          {!isLargerThan && (
            <Box>
              <SideMenu colorMode={colorMode} />
            </Box>
          )}
        </HStack>
      </Flex>
    </div>
  );
};

export default Navbar;