// src/pages/admin/ProductsPage.jsx
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
  NumberInput,
  NumberInputField,
  Select,
  useToast,
  IconButton,
  Text,
  Flex,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { getIcon } from "../../utils/iconMapping.jsx";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getProductByName,
} from "../../api/adminApi";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    Name: "",
    Description: "",
    Image: null,
    Price: 0,
    Brand: "",
    PriceWithDiscount: 0,
    CategoryId: 1,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Fetch products and categories
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error fetching products",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
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

  const handleNumberChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: parseFloat(value),
    });
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchProducts();
      return;
    }

    setIsLoading(true);
    try {
      const response = await getProductByName(searchTerm);
      setProducts(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (error) {
      console.error("Error searching products:", error);
      toast({
        title: "Error searching products",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search on enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Open modal for adding/editing product
  const openProductModal = (product = null) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        Name: product.name,
        Description: product.description,
        Image: null, // Can't pre-fill file input
        Price: product.price,
        Brand: product.brand,
        PriceWithDiscount: product.priceWithDiscount,
        CategoryId: product.categoryId,
      });
    } else {
      setSelectedProduct(null);
      setFormData({
        Name: "",
        Description: "",
        Image: null,
        Price: 0,
        Brand: "",
        PriceWithDiscount: 0,
        CategoryId: 1,
      });
    }
    onOpen();
  };

  // Handle form submission (add/edit product)
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
      formDataObj.append("Price", formData.Price);
      formDataObj.append("Brand", formData.Brand);
      formDataObj.append("PriceWithDiscount", formData.PriceWithDiscount);
      formDataObj.append("CategoryId", formData.CategoryId);

      if (selectedProduct) {
        // Update existing product
        await updateProduct(selectedProduct.productId, formDataObj);
        toast({
          title: "Product updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Add new product
        await addProduct(formDataObj);
        toast({
          title: "Product added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error saving product",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setIsLoading(true);
      try {
        await deleteProduct(id);
        toast({
          title: "Product deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        toast({
          title: "Error deleting product",
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
      <Box mb={5}>
        <Flex justify="space-between" align="center" mb={5}>
          <Heading size="lg">Products</Heading>
          <Button
            leftIcon={getIcon("plus")}
            colorScheme="blue"
            onClick={() => openProductModal()}
          >
            Add Product
          </Button>
        </Flex>

        {/* Search bar */}
        <Flex mb={5}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              {getIcon("searchIcon")}
            </InputLeftElement>
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </InputGroup>
          <Button ml={2} onClick={handleSearch} isLoading={isLoading}>
            Search
          </Button>
        </Flex>

        {/* Products table */}
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Image</Th>
                <Th>Name</Th>
                <Th>Brand</Th>
                <Th>Price</Th>
                <Th>Discount Price</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {products.length === 0 ? (
                <Tr>
                  <Td colSpan={6}>
                    <Text textAlign="center">No products found</Text>
                  </Td>
                </Tr>
              ) : (
                products.map((product) => (
                  <Tr key={product.productId}>
                    <Td>
                      <Image
                        src={`https://localhost:7214/images/${product.image}`}
                        fallbackSrc="https://via.placeholder.com/50"
                        alt={product.name}
                        boxSize="50px"
                        objectFit="cover"
                      />
                    </Td>
                    <Td>{product.name}</Td>
                    <Td>{product.brand}</Td>
                    <Td>${product.price}</Td>
                    <Td>${product.priceWithDiscount}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          icon={getIcon("edit")}
                          aria-label="Edit product"
                          size="sm"
                          onClick={() => openProductModal(product)}
                        />
                        <IconButton
                          icon={getIcon("trash")}
                          aria-label="Delete product"
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDeleteProduct(product.productId)}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </Box>
      </Box>

      {/* Add/Edit Product Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedProduct ? "Edit Product" : "Add New Product"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3} isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                name="Name"
                value={formData.Name}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>Description</FormLabel>
              <Input
                name="Description"
                value={formData.Description}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl mb={3} isRequired={!selectedProduct}>
              <FormLabel>Image</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                p={1}
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>Brand</FormLabel>
              <Input
                name="Brand"
                value={formData.Brand}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>Price</FormLabel>
              <NumberInput
                min={0}
                value={formData.Price}
                onChange={(value) => handleNumberChange("Price", value)}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>Price With Discount</FormLabel>
              <NumberInput
                min={0}
                value={formData.PriceWithDiscount}
                onChange={(value) =>
                  handleNumberChange("PriceWithDiscount", value)
                }
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>Category</FormLabel>
              <Select
                name="CategoryId"
                value={formData.CategoryId}
                onChange={handleInputChange}
              >
                {categories.map((category) => (
                  <option
                    key={category.categoryId}
                    value={category.categoryId}
                  >
                    {category.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={isLoading}
            >
              {selectedProduct ? "Update" : "Add"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AdminLayout>
  );
};

export default ProductsPage;