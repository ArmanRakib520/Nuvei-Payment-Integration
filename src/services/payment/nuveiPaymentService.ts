import CryptoJS from 'crypto-js';

// Nuvei API configuration
const MERCHANT_ID = '149703960791104369';
const MERCHANT_SITE_ID = '244398';
const MERCHANT_SECRET_KEY = 'NRbKShMw82ZAcBXNH8rlHSxz2KDAAPQgGHQk9JN3qKMvo1kSOtTJeY7Q0pkMbMuy';
const API_BASE_URL = 'https://ppp-test.nuvei.com/ppp/api/v1';

interface PaymentRequestParams {
  amount: string;
  currency: string;
  userTokenId?: string;
  clientUniqueId?: string;
  cardHolderName?: string;
  billingAddress?: BillingAddress;
  items?: PaymentItem[];
}

interface BillingAddress {
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  country?: string;
  zip?: string;
  state?: string;
  phone?: string;
  email?: string;
}

interface PaymentItem {
  name: string;
  price: string;
  quantity: string;
}

/**
 * Generate a checksum for Nuvei API requests
 * According to Nuvei documentation: https://docs.nuvei.com/api/main/indexMain_v1_0.html
 */
const generateChecksum = (params: Record<string, any>): string => {
  // Step 1: Filter out null and undefined values and checksum parameter
  const filteredParams: Record<string, any> = {};
  Object.keys(params).forEach(key => {
    if (key.toLowerCase() !== 'checksum' && params[key] !== null && params[key] !== undefined) {
      filteredParams[key] = params[key];
    }
  });

  // Step 2: Create clear text string - concatenate in order:
  // - merchant_id + merchant_site_id + client_request_id + amount + currency + time_stamp
  // These are the mandatory fields for the checksum according to Nuvei docs
  let clearText = '';
  if (filteredParams.merchantId) clearText += filteredParams.merchantId;
  if (filteredParams.merchantSiteId) clearText += filteredParams.merchantSiteId;
  if (filteredParams.clientRequestId) clearText += filteredParams.clientRequestId;
  if (filteredParams.amount) clearText += filteredParams.amount;
  if (filteredParams.currency) clearText += filteredParams.currency;
  if (filteredParams.timeStamp) clearText += filteredParams.timeStamp;
  
  // Step 3: Append merchant secret key
  clearText += MERCHANT_SECRET_KEY;
  
  // Step 4: Generate SHA-256 hash
  return CryptoJS.SHA256(clearText).toString().toLowerCase();
};

/**
 * Generate a timestamp in the format required by Nuvei
 */
const generateTimestamp = (): string => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const seconds = String(now.getUTCSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

/**
 * Generate a random client request ID
 */
const generateClientRequestId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 9; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Get a session token for payment flow
 * This would typically be done on the server side for security,
 * but since we don't have a backend, we'll do it here for the example
 */
export const getOpenOrder = async (params: PaymentRequestParams) => {
  try {
    const timestamp = generateTimestamp();
    const clientRequestId = generateClientRequestId();
    
    // Ensure currency and amount are properly formatted
    // Nuvei requires amount as a string with 2 decimal places
    const formattedAmount = Number(params.amount).toFixed(2);
    const currency = params.currency.toUpperCase();
    
    // Create request data with mandatory fields in specific order
    // This is important for proper checksum generation
    const requestData = {
      merchantId: MERCHANT_ID,
      merchantSiteId: MERCHANT_SITE_ID,
      clientRequestId: clientRequestId,
      amount: formattedAmount,
      currency: currency,
      timeStamp: timestamp,
      // Optional parameters
      clientUniqueId: params.clientUniqueId || clientRequestId,
      userTokenId: params.userTokenId,
    };
    
    // Generate checksum
    const checksum = generateChecksum(requestData);
    
    // Add checksum to request data
    const finalRequestData = {
      ...requestData,
      checksum: checksum,
    };
    
    console.log('Open Order Request:', JSON.stringify(finalRequestData, null, 2));
    
    // Call the API
    const response = await fetch(`${API_BASE_URL}/openOrder.do`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finalRequestData),
    });
    
    const responseData = await response.json();
    console.log('Open Order Response:', JSON.stringify(responseData, null, 2));
    
    if (responseData.status === 'SUCCESS') {
      return responseData;
    } else {
      throw new Error(responseData.reason || 'Failed to get session token');
    }
  } catch (error) {
    console.error('Error getting session token:', error);
    throw error;
  }
};

/**
 * Initiate a payment with a token
 * This would typically be done on the server side for security,
 * but since we don't have a backend, we'll do it here for the example
 */
export const initiatePayment = async (ccTempToken: string, params: PaymentRequestParams) => {
  try {
    const timestamp = generateTimestamp();
    const clientRequestId = generateClientRequestId();
    
    // Ensure currency and amount are properly formatted
    const formattedAmount = Number(params.amount).toFixed(2);
    const currency = params.currency.toUpperCase();
    
    // Create request data with mandatory fields in specific order
    // This is important for proper checksum generation
    const requestData = {
      merchantId: MERCHANT_ID,
      merchantSiteId: MERCHANT_SITE_ID,
      clientRequestId: clientRequestId,
      amount: formattedAmount,
      currency: currency,
      timeStamp: timestamp,
      // Payment specific fields
      ccTempToken: ccTempToken,
      // Optional parameters
      clientUniqueId: params.clientUniqueId || clientRequestId,
      userTokenId: params.userTokenId,
    };
    
    // Add billing address if provided
    if (params.billingAddress) {
      Object.entries(params.billingAddress).forEach(([key, value]) => {
        if (value) {
          requestData[key] = value;
        }
      });
    }
    
    // Generate checksum
    const checksum = generateChecksum(requestData);
    
    // Add checksum to request data
    const finalRequestData = {
      ...requestData,
      checksum: checksum,
    };
    
    console.log('Payment Request:', JSON.stringify(finalRequestData, null, 2));
    
    // Call the API
    const response = await fetch(`${API_BASE_URL}/payment.do`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finalRequestData),
    });
    
    const responseData = await response.json();
    console.log('Payment Response:', JSON.stringify(responseData, null, 2));
    
    if (responseData.status === 'SUCCESS') {
      return responseData;
    } else {
      throw new Error(responseData.reason || 'Payment failed');
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
};

export const NuveiPaymentService = {
  getOpenOrder,
  initiatePayment,
};

export default NuveiPaymentService;
