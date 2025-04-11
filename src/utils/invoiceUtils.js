import { store } from '../redux/store';
import { generateInvoice, getInvoiceByOrderId } from '../redux/slices/orderSlice';

/**
 * Generates and downloads an invoice PDF for a specific order
 * @param {string} orderId - The ID of the order to generate invoice for
 * @param {string} fileName - Optional custom filename for the downloaded PDF
 * @returns {Promise<boolean>} - Returns true if successful, false otherwise
 */
export const downloadInvoice = async (orderId, fileName = null) => {
  try {
    // Generate the invoice
    await store.dispatch(generateInvoice(orderId)).unwrap();
    
    // Get the invoice URL from the store
    const invoiceUrl = store.getState().orders.invoiceUrl;
    
    if (!invoiceUrl) {
      throw new Error('Invoice URL not found');
    }
    
    // Create a temporary link to download the invoice
    const link = document.createElement('a');
    link.href = invoiceUrl;
    link.download = fileName || `invoice-${orderId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Error downloading invoice:', error);
    return false;
  }
};

/**
 * Gets the invoice URL for a specific order without downloading
 * @param {string} orderId - The ID of the order to get invoice for
 * @returns {Promise<string|null>} - Returns the invoice URL if successful, null otherwise
 */
export const getInvoiceUrl = async (orderId) => {
  try {
    // Check if we already have the invoice URL
    const currentInvoiceUrl = store.getState().orders.invoiceUrl;
    
    if (currentInvoiceUrl) {
      return currentInvoiceUrl;
    }
    
    // Try to get the invoice
    await store.dispatch(getInvoiceByOrderId(orderId)).unwrap();
    
    // Get the invoice URL from the store
    const invoiceUrl = store.getState().orders.invoiceUrl;
    
    return invoiceUrl || null;
  } catch (error) {
    console.error('Error getting invoice URL:', error);
    return null;
  }
};

/**
 * Formats a price value as currency
 * @param {number} price - The price to format
 * @param {string} currency - The currency code (default: USD)
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(price);
};

/**
 * Formats a date string to a readable format
 * @param {string} dateString - The date string to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}; 