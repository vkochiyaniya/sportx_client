// src/pages/admin/ContactsPage.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useToast,
  Flex,
  Spinner,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { FiEye } from "react-icons/fi";
import AdminLayout from "../../components/admin/AdminLayout";
import { getContacts } from "../../api/adminApi";

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Fetch contacts
  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const response = await getContacts();
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast({
        title: "Error fetching contacts",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Open contact details modal
  const openContactDetails = (contact) => {
    setSelectedContact(contact);
    onOpen();
  };

  // Format date string for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <Box p={4}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg">Contact Messages</Heading>
          <Button onClick={fetchContacts} isLoading={isLoading}>
            Refresh
          </Button>
        </Flex>

        {isLoading && !contacts.length ? (
          <Flex justify="center" my={8}>
            <Spinner size="xl" />
          </Flex>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Subject</Th>
                <Th>Date</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {contacts.length === 0 ? (
                <Tr>
                  <Td colSpan={5}>
                    <Text textAlign="center">No contact messages found</Text>
                  </Td>
                </Tr>
              ) : (
                contacts.map((contact) => (
                  <Tr key={contact.contactId}>
                    <Td>{contact.name}</Td>
                    <Td>{contact.email}</Td>
                    <Td maxW="300px" isTruncated>{contact.subject}</Td>
                    <Td>{formatDate(contact.date)}</Td>
                    <Td>
                      <Button
                        leftIcon={<FiEye />}
                        size="sm"
                        colorScheme="blue"
                        onClick={() => openContactDetails(contact)}
                      >
                        View
                      </Button>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        )}

        {/* Contact Details Modal */}
        {selectedContact && (
          <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Contact Message Details</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box mb={4}>
                  <Heading size="sm">From:</Heading>
                  <Text>{selectedContact.name} ({selectedContact.email})</Text>
                </Box>
                <Box mb={4}>
                  <Heading size="sm">Subject:</Heading>
                  <Text>{selectedContact.subject}</Text>
                </Box>
                <Box mb={4}>
                  <Heading size="sm">Date:</Heading>
                  <Text>{formatDate(selectedContact.date)}</Text>
                </Box>
                <Box mb={4}>
                  <Heading size="sm">Message:</Heading>
                  <Text whiteSpace="pre-wrap">{selectedContact.message}</Text>
                </Box>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </Box>
    </AdminLayout>
  );
};

export default ContactsPage;