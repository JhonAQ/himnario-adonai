import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  RefreshControl,
  Alert,
  Platform
} from 'react-native';
import LoggerService from '../services/LoggerService';
import { runDatabaseDiagnostics, resetDatabase } from '../db/setupDatabase';
import { useNavigation } from '@react-navigation/native';
import { useDatabase } from '../db/databaseService';
import * as FileSystem from 'expo-file-system';

const DiagnosticsScreen = () => {
  const [logs, setLogs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [running, setRunning] = useState(false);
  const navigation = useNavigation();
  const db = useDatabase();

  useEffect(() => {
    loadLogs();
  }, []);

const exportLogs = async () => {
  try {
    await LoggerService.info('UI', 'Exportando logs');
    const content = await LoggerService.exportLogs();
    
    if (Platform.OS === 'web') {
      // Para web, muestra los logs en un formato copiable
      Alert.alert(
        "Logs Exportados",
        "Copia el contenido mostrado en la consola",
        [{ text: "OK" }]
      );
      console.log("=== LOGS EXPORTADOS ===");
      console.log(content);
    } else {
      try {
        // Para dispositivos móviles, guarda en un archivo
        const fileUri = FileSystem.documentDirectory + `logs-${Date.now()}.txt`;
        await FileSystem.writeAsStringAsync(fileUri, content);
        
        await LoggerService.success('UI', `Logs guardados en: ${fileUri}`);
        Alert.alert(
          "Logs Exportados",
          `Logs guardados en: ${fileUri}`,
          [{ text: "OK" }]
        );
      } catch (writeError) {
        await LoggerService.error('UI', 'Error al escribir archivo de logs', writeError);
      }
    }
  } catch (error) {
    await LoggerService.error('UI', 'Error al exportar logs', error);
  }
};


  const loadLogs = async () => {
    const currentLogs = await LoggerService.getLogs();
    setLogs([...currentLogs].reverse()); // Mostrar más recientes primero
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLogs();
    setRefreshing(false);
  };

  const runDbDiagnostics = async () => {
    if (running) return;
    
    setRunning(true);
    try {
      await LoggerService.info('UI', 'Iniciando diagnóstico manual');
      await runDatabaseDiagnostics();
      await loadLogs();
    } catch (error) {
      console.error('Error en diagnóstico:', error);
      await LoggerService.error('UI', 'Error en diagnóstico', error);
    } finally {
      setRunning(false);
    }
  };

  const runDbTest = async () => {
    if (running) return;
    
    setRunning(true);
    try {
      await LoggerService.info('UI', 'Ejecutando prueba de conexión a base de datos');
      if (db) {
        try {
          const result = await db.getFirstAsync("SELECT COUNT(*) as count FROM songs");
          await LoggerService.success('UI', `La base de datos contiene ${result.count} canciones`);
        } catch (error) {
          await LoggerService.error('UI', 'Error al consultar la base de datos', error);
        }
      } else {
        await LoggerService.error('UI', 'La conexión a la base de datos no está disponible');
      }
      await loadLogs();
    } catch (error) {
      await LoggerService.error('UI', 'Error en prueba de base de datos', error);
    } finally {
      setRunning(false);
    }
  };

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
            setRunning(true);
            try {
              await LoggerService.info('UI', 'Iniciando reseteo de base de datos');
              await resetDatabase();
              await LoggerService.success('UI', 'Base de datos reseteada, reinicia la aplicación');
              Alert.alert(
                "Base de datos reseteada",
                "Ahora cierra y vuelve a abrir la aplicación para que se reinstale la base de datos.",
                [{ text: "OK" }]
              );
              await loadLogs();
            } catch (error) {
              await LoggerService.error('UI', 'Error en reseteo de base de datos', error);
            } finally {
              setRunning(false);
            }
          }
        }
      ]
    );
  };

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
            await LoggerService.clearLogs();
            setLogs([]);
          }
        }
      ]
    );
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Diagnóstico del Sistema</Text>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.button, running && styles.buttonDisabled]} 
          onPress={runDbDiagnostics}
          disabled={running}
        >
          <Text style={styles.buttonText}>Diagnóstico Completo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, running && styles.buttonDisabled]} 
          onPress={runDbTest}
          disabled={running}
        >
          <Text style={styles.buttonText}>Probar Base de Datos</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.clearButton, logs.length === 0 && styles.buttonDisabled]} 
          onPress={clearAllLogs}
          disabled={logs.length === 0}
        >
          <Text style={styles.clearButtonText}>Borrar Logs</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.dangerButton, running && styles.buttonDisabled]} 
        onPress={handleResetDatabase}
        disabled={running}
      >
        <Text style={styles.clearButtonText}>Simular Primera Instalación</Text>
      </TouchableOpacity>
      
      {running && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Ejecutando diagnóstico...</Text>
        </View>
      )}
      
      <Text style={styles.sectionTitle}>Registro de eventos ({logs.length})</Text>
      
      <TouchableOpacity 
  style={[styles.exportButton, running && styles.buttonDisabled]} 
  onPress={exportLogs}
  disabled={running || logs.length === 0}
>
  <Text style={styles.buttonText}>Exportar Logs</Text>
</TouchableOpacity>

      <ScrollView 
        style={styles.logsContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* AQUÍ ES DONDE SE SOLUCIONAN LAS KEYS DUPLICADAS */}
        {logs && logs.map((log) => (
          <View key={log.id.toString()} style={styles.logEntry}>
            <View style={styles.logHeader}>
              <Text style={[
                styles.logLevel,
                log.level.includes('ERROR') && styles.logLevelError,
                log.level.includes('WARN') && styles.logLevelWarning,
                log.level.includes('OK') && styles.logLevelSuccess,
              ]}>
                {log.level}
              </Text>
              <Text style={styles.logCategory}>[{log.category}]</Text>
              <Text style={styles.logTime}>
                {new Date(log.timestamp).toLocaleTimeString()}
              </Text>
            </View>
            <Text style={styles.logMessage}>{log.message}</Text>
            {log.details ? (
              <Text style={styles.logDetails}>{log.details}</Text>
            ) : null}
          </View>
        ))}
        
        {logs.length === 0 && (
          <Text style={styles.emptyText}>No hay registros disponibles</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
    paddingHorizontal: 16
  },
exportButton: {
  backgroundColor: '#34C759',
  padding: 12,
  borderRadius: 5,
  marginBottom: 16,
  alignItems: 'center'
},
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
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'JosefinSans-SemiBold'
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'JosefinSans-SemiBold'
  },
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
    fontSize: 16,
    fontFamily: 'JosefinSans-Regular'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'JosefinSans-SemiBold'
  },
  logsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8
  },
  logEntry: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 8,
    marginBottom: 8
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  logLevel: {
    fontWeight: 'bold',
    marginRight: 6,
    fontFamily: 'JosefinSans-SemiBold'
  },
  logLevelError: {
    color: '#FF3B30'
  },
  logLevelWarning: {
    color: '#FF9500'
  },
  logLevelSuccess: {
    color: '#34C759'
  },
  logCategory: {
    color: '#007AFF',
    marginRight: 6,
    fontFamily: 'JosefinSans-Regular'
  },
  logTime: {
    fontSize: 12,
    color: '#8e8e93',
    fontFamily: 'JosefinSans-Light'
  },
  logMessage: {
    fontSize: 14,
    fontFamily: 'JosefinSans-Regular'
  },
  logDetails: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
    backgroundColor: '#f8f8f8',
    padding: 4,
    borderRadius: 4,
    fontFamily: 'JosefinSans-Light'
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: '#8e8e93',
    fontFamily: 'JosefinSans-Regular'
  }
});

export default DiagnosticsScreen;