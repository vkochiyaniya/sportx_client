// src/pages/admin/CommentsPage.jsx
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
  Badge,
  IconButton,
  useToast,
  Flex,
  Spinner,
  Text,
  Button,
} from "@chakra-ui/react";
import { FiTrash2, FiCheck } from "react-icons/fi";
import AdminLayout from "../../components/admin/AdminLayout";
import DeleteConfirmationAlert from "../../components/admin/DeleteConfirmationAlert";
import { getComments, updateCommentStatus, deleteComment } from "../../api/adminApi";

const CommentsPage = () => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const toast = useToast();

  // Fetch comments
  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await getComments();
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast({
        title: "Error fetching comments",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Handle comment approval
  const handleApproveComment = async (id) => {
    setIsLoading(true);
    try {
      await updateCommentStatus(id);
      toast({
        title: "Comment status updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchComments();
    } catch (error) {
      console.error("Error updating comment status:", error);
      toast({
        title: "Error updating comment",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    try {
      await deleteComment(commentToDelete);
      toast({
        title: "Comment deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        title: "Error deleting comment",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      setDeleteAlertOpen(false);
      setCommentToDelete(null);
    }
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
          <Heading size="lg">Comments Management</Heading>
          <Button onClick={fetchComments} isLoading={isLoading}>
            Refresh
          </Button>
        </Flex>

        {isLoading && !comments.length ? (
          <Flex justify="center" my={8}>
            <Spinner size="xl" />
          </Flex>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>User</Th>
                <Th>Product</Th>
                <Th>Comment</Th>
                <Th>Date</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {comments.length === 0 ? (
                <Tr>
                  <Td colSpan={6}>
                    <Text textAlign="center">No comments found</Text>
                  </Td>
                </Tr>
              ) : (
                comments.map((comment) => (
                  <Tr key={comment.commentId}>
                    <Td>{comment.userName}</Td>
                    <Td>{comment.productName}</Td>
                    <Td maxW="300px" isTruncated>{comment.text}</Td>
                    <Td>{formatDate(comment.date)}</Td>
                    <Td>
                      <Badge colorScheme={comment.status ? "green" : "orange"}>
                        {comment.status ? "Approved" : "Pending"}
                      </Badge>
                    </Td>
                    <Td>
                      <Flex gap={2}>
                        {!comment.status && (
                          <IconButton
                            icon={<FiCheck />}
                            aria-label="Approve comment"
                            size="sm"
                            colorScheme="green"
                            onClick={() => handleApproveComment(comment.commentId)}
                          />
                        )}
                        <IconButton
                          icon={<FiTrash2 />}
                          aria-label="Delete comment"
                          size="sm"
                          colorScheme="red"
                          onClick={() => {
                            setCommentToDelete(comment.commentId);
                            setDeleteAlertOpen(true);
                          }}
                        />
                      </Flex>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        )}

        <DeleteConfirmationAlert
          isOpen={deleteAlertOpen}
          onClose={() => setDeleteAlertOpen(false)}
          onDelete={handleDeleteConfirm}
          title="Delete Comment"
          message="Are you sure you want to delete this comment? This action cannot be undone."
        />
      </Box>
    </AdminLayout>
  );
};

export default CommentsPage;