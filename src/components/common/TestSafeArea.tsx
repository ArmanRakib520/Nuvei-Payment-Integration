import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Minimal Safe Area spacer used by HomeScreen.
 * Kept intentionally simple to avoid altering existing UI.
 */
const TestSafeArea: React.FC = () => {
  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'transparent',
  },
});

export default TestSafeArea;


