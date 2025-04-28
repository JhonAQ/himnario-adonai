import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DiagnosticsHeader = () => {
  const navigation = useNavigation();

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.header}>
      <Text style={styles.title}>Diagnóstico del Sistema</Text>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'JosefinSans-Bold'
  },
  backButton: {
    padding: 8,
    backgroundColor: '#333',
    borderRadius: 4
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'JosefinSans-SemiBold'
  }
});

export default DiagnosticsHeader;