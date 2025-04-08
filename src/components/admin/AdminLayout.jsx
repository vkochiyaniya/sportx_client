import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
  return (
    <Flex>
      <AdminSidebar />
      <Box flex="1">
        <AdminNavbar />
        <Box p={4} overflowY="auto" h="calc(100vh - 64px)">
          {children}
        </Box>
      </Box>
    </Flex>
  );
};

export default AdminLayout;