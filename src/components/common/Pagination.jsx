import React from 'react';
import { HStack, Button, IconButton, Text } from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          size="sm"
          variant={currentPage === i ? 'solid' : 'outline'}
          colorScheme={currentPage === i ? 'blue' : 'gray'}
          onClick={() => onPageChange(i)}
        >
          {i}
        </Button>
      );
    }

    return pageNumbers;
  };

  return (
    <HStack spacing={2} justify="center">
      <IconButton
        icon={<FaChevronLeft />}
        onClick={handlePreviousPage}
        isDisabled={currentPage === 1}
        aria-label="Previous page"
        size="sm"
      />
      {renderPageNumbers()}
      <IconButton
        icon={<FaChevronRight />}
        onClick={handleNextPage}
        isDisabled={currentPage === totalPages}
        aria-label="Next page"
        size="sm"
      />
      <Text fontSize="sm" color="gray.500">
        Page {currentPage} of {totalPages}
      </Text>
    </HStack>
  );
};

export default Pagination; 