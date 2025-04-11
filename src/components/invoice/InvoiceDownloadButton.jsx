import React, { useState } from 'react';
import { Button, useToast } from '@chakra-ui/react';
import { FaDownload } from 'react-icons/fa';
import { downloadInvoice } from '../../utils/invoiceUtils';

/**
 * A reusable button component for downloading invoices
 * @param {Object} props - Component props
 * @param {string} props.orderId - The ID of the order to download invoice for
 * @param {string} props.fileName - Optional custom filename for the downloaded PDF
 * @param {string} props.variant - Chakra UI button variant (default: 'solid')
 * @param {string} props.colorScheme - Chakra UI color scheme (default: 'blue')
 * @param {string} props.size - Chakra UI button size (default: 'md')
 * @param {boolean} props.isFullWidth - Whether the button should take full width (default: false)
 * @param {string} props.children - Button text content (default: 'Download Invoice')
 * @param {Function} props.onSuccess - Callback function to execute on successful download
 * @param {Function} props.onError - Callback function to execute on download error
 * @returns {JSX.Element} - The InvoiceDownloadButton component
 */
const InvoiceDownloadButton = ({
  orderId,
  fileName,
  variant = 'solid',
  colorScheme = 'blue',
  size = 'md',
  isFullWidth = false,
  children = 'Download Invoice',
  onSuccess,
  onError,
  ...rest
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleDownload = async () => {
    if (!orderId) {
      toast({
        title: 'Error',
        description: 'Order ID is required to download invoice.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      const success = await downloadInvoice(orderId, fileName);
      
      if (success) {
        toast({
          title: 'Invoice Downloaded',
          description: 'Your invoice has been downloaded successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error('Failed to download invoice');
      }
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: error.message || 'Failed to download invoice.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      leftIcon={<FaDownload />}
      variant={variant}
      colorScheme={colorScheme}
      size={size}
      width={isFullWidth ? 'full' : 'auto'}
      onClick={handleDownload}
      isLoading={isLoading}
      loadingText="Downloading..."
      {...rest}
    >
      {children}
    </Button>
  );
};

export default InvoiceDownloadButton; 