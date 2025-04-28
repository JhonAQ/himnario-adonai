import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { resetDatabase } from '../../db/setupDatabase';
import LoggerService from '../../services/LoggerService';

const DangerResetButton = ({ running, disabled, onReset }) => {
  const handleResetDatabase = async () => {
    Alert.alert(
      "Confirmar reseteo de base de datos",
      "Esto eliminará la base de datos actual y forzará una nueva instalación. ¿Estás seguro?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Resetear", 
          style: "destructive",
          onPress: async () => {
            try {
              await LoggerService.info('UI', 'Iniciando reseteo de base de datos');
              await resetDatabase();
              await LoggerService.success('UI', 'Base de datos reseteada, reinicia la aplicación');
              Alert.alert(
                "Base de datos reseteada",
                "Se ha eliminado la base de datos. La aplicación cargará una copia nueva al reiniciar.",
                [{ text: "OK" }]
              );
              if (onReset) onReset();
            } catch (error) {
              await LoggerService.error('UI', 'Error al resetear base de datos', error);
            }
          }
        }
      ]
    );
  };

  return (
    <TouchableOpacity 
      style={[styles.dangerButton, (running || disabled) && styles.buttonDisabled]} 
      onPress={handleResetDatabase}
      disabled={running || disabled}
    >
      <Text style={styles.clearButtonText}>Simular Primera Instalación</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dangerButton: {
    backgroundColor: '#a30000',
    padding: 12,
    borderRadius: 5,
    marginBottom: 16,
    alignItems: 'center'
  },
  buttonDisabled: {
    opacity: 0.5
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'JosefinSans-SemiBold'
  }
});

export default DangerResetButton;