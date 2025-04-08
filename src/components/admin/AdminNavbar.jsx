import React from 'react';
import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Text,
  IconButton,
  useColorMode,
} from '@chakra-ui/react';
import { ChevronDownIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();

  const logoutHandler = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <Box bg="blue.600" px={4} py={2} color="white">
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontSize="xl" fontWeight="bold">
          Admin Dashboard
        </Text>
        <Flex alignItems="center">
          <IconButton
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            color="white"
            mr={4}
            aria-label="Toggle theme"
          />
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="blue">
              Admin User
            </MenuButton>
            <MenuList>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
};

export default AdminNavbar;