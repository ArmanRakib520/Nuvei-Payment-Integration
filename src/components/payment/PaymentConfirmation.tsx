import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface PaymentConfirmationProps {
  transactionId: string;
  amount: string;
  currency: string;
  onDone: () => void;
}

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({
  transactionId,
  amount,
  currency,
  onDone,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>✓</Text>
      </View>
      
      <Text style={styles.title}>Payment Successful!</Text>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Amount Paid:</Text>
          <Text style={styles.detailValue}>{currency} {amount}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Transaction ID:</Text>
          <Text style={styles.detailValue}>{transactionId}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>{new Date().toLocaleString()}</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.doneButton} onPress={onDone}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 40,
    color: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333333',
  },
  detailsContainer: {
    width: '100%',
    marginBottom: 32,
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  doneButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 4,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  doneButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentConfirmation;

