import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import LoggerService from '../../services/LoggerService';

const DiagnosticsControls = ({ running, logs, setModalVisible, onLogsCleared }) => {
  const clearAllLogs = async () => {
    Alert.alert(
      "Confirmar acción",
      "¿Estás seguro que deseas borrar todos los logs?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Borrar", 
          style: "destructive",
          onPress: async () => {
            try {
              await LoggerService.clearLogs();
              await LoggerService.info('UI', 'Logs eliminados');
              if (onLogsCleared) onLogsCleared();
            } catch (error) {
              console.error("Error al limpiar logs:", error);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.controls}>
      <TouchableOpacity 
        style={[styles.button, running && styles.buttonDisabled]} 
        onPress={() => setModalVisible(true)}
        disabled={running}
      >
        <Text style={styles.buttonText}>Ejecutar Diagnóstico</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.clearButton, logs.length === 0 && styles.buttonDisabled]} 
        onPress={clearAllLogs}
        disabled={logs.length === 0}
      >
        <Text style={styles.clearButtonText}>Borrar Logs</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 8,
    alignItems: 'center'
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 5,
    width: 100,
    alignItems: 'center'
  },
  buttonDisabled: {
    opacity: 0.5
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'JosefinSans-SemiBold'
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'JosefinSans-SemiBold'
  }
});

export default DiagnosticsControls;