import React, { useState, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiShoppingBag, FiTag, FiUsers, FiMessageCircle } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';

// Import APIs
import { getProducts } from '../../api/adminApi';
import { getCategories } from '../../api/adminApi';
import { getUsers } from '../../api/adminApi';
import { getComments } from '../../api/adminApi';

const StatsCard = ({ title, stat, icon, helpText }) => {
  const bg = useColorModeValue('white', 'gray.700');
  const IconComponent = icon;
  
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={5}
      shadow="md"
      border="1px"
      borderColor="gray.200"
      rounded="lg"
      bg={bg}
    >
      <Box display="flex" justifyContent="space-between">
        <Box>
          <StatLabel fontWeight="medium" isTruncated>
            {title}
          </StatLabel>
          <StatNumber fontSize="2xl" fontWeight="medium">
            {stat}
          </StatNumber>
          {helpText && (
            <StatHelpText mb={0}>{helpText}</StatHelpText>
          )}
        </Box>
        <Box
          my="auto"
          color="blue.500"
          alignContent="center"
        >
          <IconComponent size={24} />
        </Box>
      </Box>
    </Stat>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    users: 0,
    comments: 0,
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const [productsRes, categoriesRes, usersRes, commentsRes] = await Promise.all([
          getProducts(),
          getCategories(),
          getUsers(),
          getComments(),
        ]);
        
        setStats({
          products: productsRes.data.length,
          categories: categoriesRes.data.length,
          users: usersRes.data.length,
          comments: commentsRes.data.length,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <Box p={5}>
        <Heading mb={6}>Dashboard Overview</Heading>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <StatsCard
            title="Total Products"
            stat={isLoading ? 'Loading...' : stats.products}
            icon={FiShoppingBag}
          />
          <StatsCard
            title="Categories"
            stat={isLoading ? 'Loading...' : stats.categories}
            icon={FiTag}
          />
          <StatsCard
            title="Registered Users"
            stat={isLoading ? 'Loading...' : stats.users}
            icon={FiUsers}
          />
          <StatsCard
            title="Comments"
            stat={isLoading ? 'Loading...' : stats.comments}
            icon={FiMessageCircle}
          />
        </SimpleGrid>

        <Box mt={10}>
          <Heading size="md" mb={4}>Quick Actions</Heading>
          <Text>
            Use the sidebar to navigate to different sections of the admin dashboard.
            Manage products, categories, users, and more from their respective pages.
          </Text>
        </Box>
      </Box>
    </AdminLayout>
  );
};

export default AdminDashboard;