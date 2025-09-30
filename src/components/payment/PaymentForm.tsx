import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NVInputError, NuveiCreditCardField } from 'nuvei-simply-connect';
import NuveiPaymentService from '../../services/payment/nuveiPaymentService';

interface PaymentFormProps {
  amount: string;
  currency: string;
  onPaymentSuccess: (transactionId: string, amount: string) => void;
  onPaymentError: (error: string) => void;
}

interface FormData {
  cardHolderName: string;
  amount: string;
  currency: string;
  email: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  currency,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const creditCardFieldRef = useRef(null);
  const [formData, setFormData] = useState<FormData>({
    cardHolderName: '',
    amount: amount,
    currency: currency,
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<NVInputError[]>([]);

  const handleInputChange = (key: keyof FormData, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.cardHolderName.trim()) {
      Alert.alert('Validation Error', 'Please enter card holder name');
      return false;
    }
    
    if (!formData.email.trim()) {
      Alert.alert('Validation Error', 'Please enter your email');
      return false;
    }
    
    if (validationErrors.length > 0) {
      Alert.alert('Card Validation Error', 'Please check your card details');
      return false;
    }
    
    return true;
  };

  const handlePayment = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      setIsLoading(true);
      
      // Format amount to have 2 decimal places
      const formattedAmount = Number(formData.amount).toFixed(2);
      const formattedCurrency = formData.currency.toUpperCase();
      
      console.log('Starting payment process with:', {
        amount: formattedAmount,
        currency: formattedCurrency
      });

      // Get open order
      const openOrderResponse = await NuveiPaymentService.getOpenOrder({
        amount: formattedAmount,
        currency: formattedCurrency,
        clientUniqueId: `order-${Date.now()}`,
      });

      // Check if we got a valid response with sessionToken
      if (!openOrderResponse || !openOrderResponse.sessionToken) {
        throw new Error('Failed to get valid session token from server');
      }
      
      console.log('Successfully received session token');

      // Tokenize card
      if (creditCardFieldRef.current) {
        // Create tokenize request with properly formatted values
        const tokenizeRequest = {
          sessionToken: openOrderResponse.sessionToken,
          merchantId: openOrderResponse.merchantId,
          merchantSiteId: openOrderResponse.merchantSiteId,
          clientRequestId: openOrderResponse.clientRequestId,
          amount: formattedAmount,
          currency: formattedCurrency,
        };
        
        console.log('Tokenizing card with request:', tokenizeRequest);
        
        const token = await creditCardFieldRef.current.tokenize(tokenizeRequest);
        
        if (!token) {
          throw new Error('Failed to get card token');
        }
        
        console.log('Successfully received card token');

        // Process payment with token
        const paymentResponse = await NuveiPaymentService.initiatePayment(token, {
          amount: formattedAmount,
          currency: formattedCurrency,
          billingAddress: {
            firstName: formData.cardHolderName.split(' ')[0] || '',
            lastName: formData.cardHolderName.split(' ').slice(1).join(' ') || '',
            email: formData.email,
          },
        });

        setIsLoading(false);
        
        if (paymentResponse.transactionId) {
          onPaymentSuccess(paymentResponse.transactionId, formattedAmount);
        } else {
          onPaymentError('Payment processed but no transaction ID received');
        }
      } else {
        throw new Error('Credit card field reference not available');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setIsLoading(false);
      onPaymentError(error.message || 'Payment failed');
    }
  };

  const handleInputValidated = (errors: NVInputError[]) => {
    setValidationErrors(errors);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Details</Text>
      
      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Amount: </Text>
        <Text style={styles.amountValue}>{formData.currency} {formData.amount}</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Card Holder Name</Text>
        <TextInput
          style={styles.input}
          placeholder="John Doe"
          value={formData.cardHolderName}
          onChangeText={(text) => handleInputChange('cardHolderName', text)}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="john@example.com"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={(text) => handleInputChange('email', text)}
        />
      </View>
      
      <View style={styles.cardFieldContainer}>
        <Text style={styles.label}>Card Details</Text>
        <NuveiCreditCardField
          ref={creditCardFieldRef}
          onInputUpdated={(hasFocus) => {}}
          onInputValidated={handleInputValidated}
          style={styles.cardField}
        />
      </View>
      
      <TouchableOpacity
        style={[styles.payButton, isLoading && styles.disabledButton]}
        onPress={handlePayment}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.payButtonText}>Pay Now</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  amountLabel: {
    fontSize: 18,
    fontWeight: '500',
  },
  amountValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 4,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  cardFieldContainer: {
    marginBottom: 24,
  },
  cardField: {
    height: 180,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 4,
  },
  payButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 4,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#a0a0a0',
  },
  payButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentForm;