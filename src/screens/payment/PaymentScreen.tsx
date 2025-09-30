import React, { useState } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PaymentForm from '../../components/payment/PaymentForm';
import PaymentConfirmation from '../../components/payment/PaymentConfirmation';
import PaymentError from '../../components/payment/PaymentError';

type PaymentStatus = 'form' | 'success' | 'error';

interface PaymentScreenProps {
  navigation: any;
  route: {
    params: {
      amount: string;
      currency: string;
    };
  };
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ navigation, route }) => {
  const { amount = '100.00', currency = 'USD' } = route.params || {};
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('form');
  const [transactionId, setTransactionId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [paidAmount, setPaidAmount] = useState<string>(amount);

  const handlePaymentSuccess = (txId: string, amount: string) => {
    setTransactionId(txId);
    setPaidAmount(amount);
    setPaymentStatus('success');
  };

  const handlePaymentError = (error: string) => {
    setErrorMessage(error);
    setPaymentStatus('error');
  };

  const handleRetry = () => {
    setPaymentStatus('form');
  };

  const handleDone = () => {
    navigation.goBack();
  };

  const renderContent = () => {
    switch (paymentStatus) {
      case 'success':
        return (
          <PaymentConfirmation
            transactionId={transactionId}
            amount={paidAmount}
            currency={currency}
            onDone={handleDone}
          />
        );
      case 'error':
        return (
          <PaymentError
            errorMessage={errorMessage}
            onRetry={handleRetry}
            onCancel={handleDone}
          />
        );
      case 'form':
      default:
        return (
          <PaymentForm
            amount={amount}
            currency={currency}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.container}>{renderContent()}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
});

export default PaymentScreen;
