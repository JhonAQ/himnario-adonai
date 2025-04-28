import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, Platform, View } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import LoggerService from '../../services/LoggerService';
import { Ionicons } from '@expo/vector-icons';

const ExportLogsButton = ({ running, logs }) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportAndShare = async (format = 'txt') => {
    if (running || isExporting) return;
    
    if (logs.length === 0) {
      Alert.alert(
        "No hay logs",
        "No hay registros de diagnóstico para exportar.",
        [{ text: "Entendido" }]
      );
      return;
    }
    
    try {
      setIsExporting(true);
      
      // Exportar logs a un archivo
      const { fileUri, filename } = await LoggerService.exportLogsToFile(format);
      
      // Compartir archivo
      if (Platform.OS === 'web') {
        Alert.alert(
          "Exportación no soportada",
          "La exportación y compartir no está disponible en la web.",
          [{ text: "OK" }]
        );
      } else {
        // Verificar si podemos compartir
        const canShare = await Sharing.isAvailableAsync();
        
        if (canShare) {
          // Compartir con el selector de apps
          await Sharing.shareAsync(fileUri, {
            mimeType: format === 'json' ? 'application/json' : 'text/plain',
            dialogTitle: 'Compartir logs de diagnóstico',
            UTI: format === 'json' ? 'public.json' : 'public.plain-text' // para iOS
          });
        } else {
          Alert.alert(
            "Compartir no disponible",
            `Los logs han sido guardados en: ${fileUri}`,
            [{ text: "OK" }]
          );
        }
      }
    } catch (error) {
      await LoggerService.error('UI', 'Error al exportar o compartir logs', error);
      Alert.alert(
        "Error",
        "No se pudieron exportar los logs: " + error.message,
        [{ text: "OK" }]
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleExport = () => {
    Alert.alert(
      "Exportar Logs",
      "Selecciona el formato de exportación:",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Texto plano (.txt)", onPress: () => exportAndShare('txt') },
        { text: "JSON (.json)", onPress: () => exportAndShare('json') }
      ]
    );
  };

    // Dentro del componente ExportLogsButton, añade esta función
  
  const shareDirectlyToWhatsApp = async (fileUri) => {
    try {
      const whatsappUrl = `whatsapp://send?text=Logs de diagnóstico&app_id=${encodeURIComponent(fileUri)}`;
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        // Si no se puede abrir WhatsApp directamente, usar el compartir general
        await Sharing.shareAsync(fileUri);
      }
    } catch (error) {
      console.error("Error al compartir en WhatsApp:", error);
      // Fallback al método de compartir general
      await Sharing.shareAsync(fileUri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.exportButton, (running || isExporting || logs.length === 0) && styles.buttonDisabled]}
        onPress={handleExport}
        disabled={running || isExporting || logs.length === 0}
      >
        <Ionicons name="share-outline" size={16} color="white" />
        <Text style={styles.buttonText}>
          {isExporting ? "Exportando..." : "Compartir Logs"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 16
  },
  exportButton: {
    backgroundColor: '#5856D6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  buttonDisabled: {
    opacity: 0.5
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'JosefinSans-SemiBold',
    marginLeft: 8
  }
});

export default ExportLogsButton;