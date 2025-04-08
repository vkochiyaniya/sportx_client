// src/pages/admin/UsersPage.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  IconButton,
  Text,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { FiTrash2, FiEdit, FiPlus } from "react-icons/fi";
import AdminLayout from "../../components/admin/AdminLayout";
import DeleteConfirmationAlert from "../../components/admin/DeleteConfirmationAlert";
import {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../../api/adminApi";
import ImageUpload from "../../components/admin/ImageUpload";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Password: "",
    PhoneNumber: "",
    Address: "",
    Role: "User",
    Image: null,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Fetch users
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error fetching users",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      Image: e.target.files[0],
    });
  };

  // Open modal for adding/editing user
  const openUserModal = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        Name: user.name,
        Email: user.email,
        Password: "",
        PhoneNumber: user.phoneNumber || "",
        Address: user.address || "",
        Role: user.role,
        Image: null,
      });
    } else {
      setSelectedUser(null);
      setFormData({
        Name: "",
        Email: "",
        Password: "",
        PhoneNumber: "",
        Address: "",
        Role: "User",
        Image: null,
      });
    }
    onOpen();
  };

  // Handle form submission (add/edit user)
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append("Name", formData.Name);
      formDataObj.append("Email", formData.Email);
      formDataObj.append("PhoneNumber", formData.PhoneNumber);
      formDataObj.append("Address", formData.Address);
      formDataObj.append("Role", formData.Role);
      if (formData.Password) {
        formDataObj.append("Password", formData.Password);
      }
      if (formData.Image) {
        formDataObj.append("Image", formData.Image);
      }

      if (selectedUser) {
        await updateUser(selectedUser.userId, formDataObj);
        toast({
          title: "User updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await addUser(formDataObj);
        toast({
          title: "User added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      toast({
        title: "Error saving user",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete confirmation
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteUser(userToDelete);
      toast({
        title: "User deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error deleting user",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      setDeleteAlertOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <AdminLayout>
      <Box p={4}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg">Users Management</Heading>
          <Button 
            leftIcon={<FiPlus />} 
            colorScheme="blue" 
            onClick={() => openUserModal()}
          >
            Add User
          </Button>
        </Flex>

        {isLoading && !users.length ? (
          <Flex justify="center" my={8}>
            <Spinner size="xl" />
          </Flex>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Avatar</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map(user => (
                <Tr key={user.userId}>
                  <Td>
                    <Image
                      src={user.image ? `https://localhost:7214/images/${user.image}` : "https://via.placeholder.com/50"}
                      alt={user.name}
                      boxSize="50px"
                      borderRadius="full"
                      objectFit="cover"
                    />
                  </Td>
                  <Td>{user.name}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.role}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        icon={<FiEdit />}
                        aria-label="Edit user"
                        size="sm"
                        onClick={() => openUserModal(user)}
                      />
                      <IconButton
                        icon={<FiTrash2 />}
                        aria-label="Delete user"
                        size="sm"
                        colorScheme="red"
                        onClick={() => {
                          setUserToDelete(user.userId);
                          setDeleteAlertOpen(true);
                        }}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}

        {/* Add/Edit User Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {selectedUser ? "Edit User" : "Add New User"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl mb={4} isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  name="Name"
                  value={formData.Name}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl mb={4} isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl mb={4} isRequired={!selectedUser}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="Password"
                  value={formData.Password}
                  onChange={handleInputChange}
                  placeholder={selectedUser ? "Leave blank to keep current" : ""}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  type="tel"
                  name="PhoneNumber"
                  value={formData.PhoneNumber}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Address</FormLabel>
                <Input
                  name="Address"
                  value={formData.Address}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl mb={4} isRequired>
                <FormLabel>Role</FormLabel>
                <Select
                  name="Role"
                  value={formData.Role}
                  onChange={handleInputChange}
                >
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </Select>
              </FormControl>

              <ImageUpload
                name="Image"
                label="Profile Picture"
                onChange={handleImageChange}
                currentImage={selectedUser?.image}
                helperText="Upload a profile picture (optional)"
              />
            </ModalBody>

            <ModalFooter>
              <Button 
                colorScheme="blue" 
                mr={3} 
                onClick={handleSubmit} 
                isLoading={isLoading}
              >
                {selectedUser ? "Update" : "Create"}
              </Button>
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <DeleteConfirmationAlert
          isOpen={deleteAlertOpen}
          onClose={() => setDeleteAlertOpen(false)}
          onDelete={handleDelete}
          title="Delete User"
          message="Are you sure you want to delete this user? This action cannot be undone."
        />
      </Box>
    </AdminLayout>
  );
};

export default UsersPage;