import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const DiagnosticsRunningIndicator = ({ visible }) => {
  if (!visible) return null;
  
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.loadingText}>Ejecutando diagnóstico...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    fontFamily: 'JosefinSans-Regular'
  }
});

export default DiagnosticsRunningIndicator;