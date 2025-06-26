import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BookingForm() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>نموذج الحجز</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
});
