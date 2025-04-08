// src/pages/admin/CategoriesPage.jsx
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
  Textarea,
  useToast,
  IconButton,
  Text,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { FiTrash2, FiEdit, FiPlus } from "react-icons/fi";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../api/adminApi";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    Name: "",
    Description: "",
    Image: null,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Fetch categories
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error fetching categories",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      Image: e.target.files[0],
    });
  };

  // Open modal for adding/editing category
  const openCategoryModal = (category = null) => {
    if (category) {
      setSelectedCategory(category);
      setFormData({
        Name: category.name,
        Description: category.description,
        Image: null, // Can't pre-fill file input
      });
    } else {
      setSelectedCategory(null);
      setFormData({
        Name: "",
        Description: "",
        Image: null,
      });
    }
    onOpen();
  };

  // Handle form submission (add/edit category)
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Create form data for multipart/form-data request
      const formDataObj = new FormData();
      formDataObj.append("Name", formData.Name);
      formDataObj.append("Description", formData.Description);
      if (formData.Image) {
        formDataObj.append("Image", formData.Image);
      }

      if (selectedCategory) {
        // Update existing category
        await updateCategory(selectedCategory.categoryId, formDataObj);
        toast({
          title: "Category updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Add new category
        await addCategory(formDataObj);
        toast({
          title: "Category added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      toast({
        title: "Error saving category",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle category deletion
  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setIsLoading(true);
      try {
        await deleteCategory(id);
        toast({
          title: "Category deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
        toast({
          title: "Error deleting category",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <AdminLayout>
      <Box p={4}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg">Categories Management</Heading>
          <Button 
            leftIcon={<FiPlus />} 
            colorScheme="blue" 
            onClick={() => openCategoryModal()}
          >
            Add Category
          </Button>
        </Flex>

        {isLoading && !categories.length ? (
          <Flex justify="center" my={8}>
            <Spinner size="xl" />
          </Flex>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Image</Th>
                <Th>Name</Th>
                <Th>Description</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {categories.map(category => (
                <Tr key={category.categoryId}>
                  <Td>
                    {category.image && (
                      <Image 
                        src={`https://localhost:7214/images/${category.image}`} 
                        alt={category.name} 
                        boxSize="50px" 
                        objectFit="cover"
                        fallbackSrc="https://via.placeholder.com/50"
                      />
                    )}
                  </Td>
                  <Td>{category.name}</Td>
                  <Td>{category.description}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        icon={<FiEdit />}
                        aria-label="Edit category"
                        size="sm"
                        onClick={() => openCategoryModal(category)}
                      />
                      <IconButton
                        icon={<FiTrash2 />}
                        aria-label="Delete category"
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDeleteCategory(category.categoryId)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}

        {/* Add/Edit Category Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {selectedCategory ? "Edit Category" : "Add New Category"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl mb={4} isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  name="Name"
                  value={formData.Name}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="Description"
                  value={formData.Description}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Image</FormLabel>
                <Input
                  type="file"
                  name="Image"
                  onChange={handleFileChange}
                  accept="image/*"
                  p={1}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleSubmit} isLoading={isLoading}>
                Save
              </Button>
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </AdminLayout>
  );
};

export default CategoriesPage;