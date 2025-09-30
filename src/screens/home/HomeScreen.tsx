import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TestSafeArea from '../../components/common/TestSafeArea';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [amount, setAmount] = useState('100.00');
  const [currency, setCurrency] = useState('USD');

  const handlePaymentPress = () => {
    navigation.navigate('Payment', {
      amount,
      currency,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.container}>
        <Text style={styles.title}>Mporeo Payment</Text>
        
        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Currency</Text>
            <TextInput
              style={styles.input}
              value={currency}
              onChangeText={setCurrency}
              autoCapitalize="characters"
              maxLength={3}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.paymentButton}
            onPress={handlePaymentPress}
          >
            <Text style={styles.paymentButtonText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Test Card Information</Text>
          <Text style={styles.infoText}>Card Number: 4111 1111 1111 1111</Text>
          <Text style={styles.infoText}>Expiry: Any future date</Text>
          <Text style={styles.infoText}>CVV: Any 3 digits</Text>
          <Text style={styles.infoText}>Name: Any name</Text>
        </View>
        
        <TestSafeArea />
      </View>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 24,
    textAlign: 'center',
    color: '#333333',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: '#333333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 4,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  paymentButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 4,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  paymentButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#fffde7',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#ffd54f',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333333',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 6,
    color: '#666666',
  },
});

export default HomeScreen;
