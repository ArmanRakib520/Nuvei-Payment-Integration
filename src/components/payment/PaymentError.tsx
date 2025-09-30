import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface PaymentErrorProps {
  errorMessage: string;
  onRetry: () => void;
  onCancel: () => void;
}

const PaymentError: React.FC<PaymentErrorProps> = ({
  errorMessage,
  onRetry,
  onCancel,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>!</Text>
      </View>
      
      <Text style={styles.title}>Payment Failed</Text>
      
      <View style={styles.errorContainer}>
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#f44336',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 40,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333333',
  },
  errorContainer: {
    width: '100%',
    marginBottom: 32,
    backgroundColor: '#ffebee',
    padding: 16,
    borderRadius: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#ffffff',
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 4,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '48%',
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 4,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '48%',
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentError;

