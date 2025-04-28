import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import LoggerService from '../services/LoggerService';
import DiagnosticsService from '../services/DiagnosticsService';
import { resetDatabase } from '../db/setupDatabase';
import { useDatabase } from '../db/databaseService';
import { HimnosContext } from '../context/HimnosContext';
import * as FileSystem from 'expo-file-system';

// Componentes de diagnóstico
import DiagnosticsHeader from '../components/diagnostics/DiagnosticsHeader';
import DiagnosticsControls from '../components/diagnostics/DiagnosticsControls';
import DiagnosticsCategoryFilter from '../components/diagnostics/DiagnosticsCategoryFilter';
import DiagnosticsLogsList from '../components/diagnostics/DiagnosticsLogsList';
import DiagnosticsSelectionModal from '../components/diagnostics/DiagnosticsSelectionModal';
import DiagnosticsRunningIndicator from '../components/diagnostics/DiagnosticsRunningIndicator';
import DangerResetButton from '../components/diagnostics/DangerResetButton';

const DiagnosticsScreen = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [running, setRunning] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [diagnosticType, setDiagnosticType] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const db = useDatabase();
  const { metaHimnos } = useContext(HimnosContext);
  
  // Obtener categorías de diagnóstico desde el servicio
  const diagnosticCategories = DiagnosticsService.getDiagnosticCategories();
  
  // Obtener tipos de diagnóstico con las funciones adaptadas
  const diagnosticTypes = DiagnosticsService.getDiagnosticTypes().map(type => {
    // Adaptamos las funciones para que usen nuestras dependencias locales
    let adaptedAction;
    
    // Adaptamos cada tipo de diagnóstico para manejar nuestro estado local
    switch (type.id) {
      case 'database':
        adaptedAction = async () => {
          await runDiagnosticWrapper(() => DiagnosticsService.runDbDiagnostics(), 'Setup');
        };
        break;
      case 'hymnData':
        adaptedAction = async () => {
          await runDiagnosticWrapper(() => DiagnosticsService.runHimnoDiagnostics(db, metaHimnos), 'HimnosData');
        };
        break;
      case 'cache':
        adaptedAction = async () => {
          await runDiagnosticWrapper(() => DiagnosticsService.runCacheDiagnostics(), 'Cache');
        };
        break;
      case 'search':
        adaptedAction = async () => {
          await runDiagnosticWrapper(() => DiagnosticsService.runSearchDiagnostics(db, metaHimnos), 'Search');
        };
        break;
      case 'filesystem':
        adaptedAction = async () => {
          await runDiagnosticWrapper(() => DiagnosticsService.runFileSystemDiagnostics(), 'FileSystem');
        };
        break;
      case 'all':
        adaptedAction = async () => {
          await runDiagnosticWrapper(() => DiagnosticsService.runFullDiagnostics(db, metaHimnos), 'all');
        };
        break;
      default:
        adaptedAction = async () => {
          await LoggerService.warning('UI', `Tipo de diagnóstico "${type.id}" no implementado`);
        };
    }
    
    return {
      ...type,
      action: adaptedAction
    };
  });

  // Función wrapper para ejecutar diagnósticos
  const runDiagnosticWrapper = async (diagnosticFn, categoryToShow) => {
    if (running) return;
    
    setRunning(true);
    try {
      await diagnosticFn();
      await loadLogs();
      setActiveCategory(categoryToShow);
    } catch (error) {
      console.error('Error en diagnóstico:', error);
      await LoggerService.error('UI', 'Error ejecutando diagnóstico', error);
    } finally {
      setRunning(false);
    }
  };

  // Cargar logs al iniciar
  useEffect(() => {
    loadLogs();
  }, []);
  
  // Filtrar logs cuando cambia la categoría seleccionada
  useEffect(() => {
    filterLogsByCategory(activeCategory);
  }, [logs, activeCategory]);

  // Filtrar logs por categoría
  const filterLogsByCategory = (category) => {
    if (category === 'all') {
      setFilteredLogs(logs);
    } else {
      setFilteredLogs(logs.filter(log => log.category === category));
    }
  };

  // Exportar logs a un archivo
  const exportLogs = async () => {
    try {
      await LoggerService.info('UI', 'Exportando logs');
      const content = await LoggerService.exportLogs();
      
      if (Platform.OS === 'web') {
        Alert.alert(
          "Logs Exportados",
          "Copia el contenido mostrado en la consola",
          [{ text: "OK" }]
        );
        console.log("=== LOGS EXPORTADOS ===");
        console.log(content);
      } else {
        try {
          const fileUri = FileSystem.documentDirectory + 'himnario-logs.txt';
          await FileSystem.writeAsStringAsync(fileUri, content);
          
          Alert.alert(
            "Logs Exportados",
            `Los logs se han exportado a: ${fileUri}`,
            [{ text: "OK" }]
          );
          
          await LoggerService.success('UI', `Logs exportados a ${fileUri}`);
        } catch (writeError) {
          await LoggerService.error('UI', 'Error al escribir archivo de logs', writeError);
          Alert.alert("Error", "No se pudieron exportar los logs");
        }
      }
    } catch (error) {
      await LoggerService.error('UI', 'Error al exportar logs', error);
      Alert.alert("Error", "Ocurrió un error al exportar los logs");
    }
  };

  // Cargar los logs desde el servicio
  const loadLogs = async () => {
    const currentLogs = await LoggerService.getLogs();
    setLogs([...currentLogs].reverse()); // Mostrar más recientes primero
  };

  // Refrescar la lista de logs
  const onRefresh = async () => {
    setRefreshing(true);
    await loadLogs();
    setRefreshing(false);
  };
  
  // Seleccionar un tipo de diagnóstico
  const selectDiagnosticType = (type) => {
    setDiagnosticType(type);
    setModalVisible(false);
    
    // Ejecutar el diagnóstico seleccionado
    if (type && type.action) {
      type.action();
    }
  };

  return (
    <View style={styles.container}>
      <DiagnosticsHeader />
      
      <DiagnosticsControls 
        running={running} 
        logs={logs} 
        setModalVisible={setModalVisible} 
        onLogsCleared={loadLogs} 
      />
      
      <DiagnosticsCategoryFilter 
        categories={diagnosticCategories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      
      <DangerResetButton 
        running={running}
        onReset={loadLogs}
      />
      
      <DiagnosticsRunningIndicator visible={running} />
      
      <DiagnosticsLogsList 
        logs={filteredLogs}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
      
      <DiagnosticsSelectionModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        diagnosticTypes={diagnosticTypes}
        onSelectDiagnostic={selectDiagnosticType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
    paddingHorizontal: 16
  }
});

export default DiagnosticsScreen;