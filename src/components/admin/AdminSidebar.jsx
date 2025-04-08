import React from 'react';
import {
  Box,
  Flex,
  VStack,
  Icon,
  Text,
  Link,
  Divider,
} from '@chakra-ui/react';
import { NavLink as RouterLink } from 'react-router-dom';
import {
  FiHome,
  FiBox,
  FiTag,
  FiUsers,
  FiMessageSquare,
  FiMail,
} from 'react-icons/fi';

const SidebarItem = ({ icon, children, to }) => {
  return (
    <Link
      as={RouterLink}
      to={to}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      {({ isActive }) => (
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          bg={isActive ? 'blue.400' : 'transparent'}
          color={isActive ? 'white' : 'gray.600'}
          _hover={{
            bg: 'blue.400',
            color: 'white',
          }}
        >
          {icon && (
            <Icon
              mr="4"
              fontSize="16"
              as={icon}
            />
          )}
          {children}
        </Flex>
      )}
    </Link>
  );
};

const AdminSidebar = () => {
  return (
    <Box
      bg="white"
      w="240px"
      h="100vh"
      pos="sticky"
      top="0"
      borderRight="1px"
      borderColor="gray.200"
      boxShadow="sm"
    >
      <Flex h="20" alignItems="center" justifyContent="center">
        <Text fontSize="2xl" fontWeight="bold" color="blue.500">
          Admin Panel
        </Text>
      </Flex>
      <Divider />
      <VStack spacing={0} align="stretch">
        <SidebarItem icon={FiHome} to="/admin">
          Dashboard
        </SidebarItem>
        <SidebarItem icon={FiBox} to="/admin/products">
          Products
        </SidebarItem>
        <SidebarItem icon={FiTag} to="/admin/categories">
          Categories
        </SidebarItem>
        <SidebarItem icon={FiUsers} to="/admin/users">
          Users
        </SidebarItem>
        <SidebarItem icon={FiMessageSquare} to="/admin/comments">
          Comments
        </SidebarItem>
        <SidebarItem icon={FiMail} to="/admin/contacts">
          Contacts
        </SidebarItem>
      </VStack>
    </Box>
  );
};

export default AdminSidebar;