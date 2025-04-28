import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Linking,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTabBar } from '../context/TabBarContext';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoggerService from '../services/LoggerService';
import { HimnosContext } from '../context/HimnosContext';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { setHideBar } = useTabBar();
  const { reloadHimnos } = useContext(HimnosContext);
  
  useEffect(() => {
    setHideBar(false);
  }, []);

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  const handleOpenLink = (url) => {
    Linking.openURL(url).catch(err => console.error("Error al abrir el enlace:", err));
  };

  const resetCache = async () => {
    Alert.alert(
      "Limpiar caché de datos",
      "¿Estás seguro que deseas resetear la caché? La aplicación volverá a cargar los datos desde la base de datos.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Limpiar", 
          style: "destructive",
          onPress: async () => {
            try {
              await LoggerService.info('Settings', 'Iniciando limpieza de caché de himnos');
              await AsyncStorage.removeItem('@HimnosMetadata');
              await LoggerService.success('Settings', 'Caché de himnos eliminada');
              
              if (reloadHimnos) {
                await reloadHimnos();
                await LoggerService.success('Settings', 'Datos de himnos recargados exitosamente');
              }
              
              Alert.alert(
                "Caché limpiada",
                "Se ha limpiado la caché correctamente. Los datos se han recargado desde la base de datos.",
                [{ text: "OK" }]
              );
            } catch (error) {
              await LoggerService.error('Settings', 'Error al limpiar caché', error);
              Alert.alert(
                "Error",
                "Ocurrió un error al limpiar la caché.",
                [{ text: "OK" }]
              );
            }
          }
        }
      ]
    );
  };

  const renderSettingItem = (icon, title, onPress, description = null, rightIcon = "chevron-forward") => (
    <TouchableOpacity 
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingIconContainer}>
        <Ionicons name={icon} size={22} color="#555" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      <Ionicons name={rightIcon} size={20} color="#aaa" />
    </TouchableOpacity>
  );

  const renderSectionTitle = (title) => (
    <Text style={styles.sectionTitle}>{title}</Text>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configuración</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {renderSectionTitle("Herramientas")}
        
        {renderSettingItem(
          "analytics-outline", 
          "Diagnóstico del sistema", 
          () => navigateTo("Diagnostics"),
          "Resolver problemas y verificar el estado de la aplicación"
        )}
        
        {renderSettingItem(
          "refresh-outline", 
          "Resetear caché de himnos", 
          resetCache,
          "Recargar datos de himnos desde la base de datos"
        )}
        
        {renderSectionTitle("Apariencia")}
        
        {renderSettingItem(
          "color-palette-outline", 
          "Tema", 
          () => {/* Tema funcionalidad */},
          "Seleccionar tema claro u oscuro"
        )}
        
        {renderSettingItem(
          "text-outline", 
          "Tamaño de texto", 
          () => {/* Tamaño texto funcionalidad */},
          "Ajustar el tamaño de la letra"
        )}

        {renderSectionTitle("Aplicación")}
        
        {renderSettingItem(
          "information-circle-outline", 
          "Acerca de", 
          () => {/* Acerca de funcionalidad */},
          "Versión 1.20.0"
        )}
        
        {renderSettingItem(
          "help-circle-outline", 
          "Ayuda", 
          () => handleOpenLink("https://github.com/JhonAQ/himnario-adonai"),
          "Preguntas frecuentes y soporte"
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'JosefinSans-Bold'
  },
  scrollContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'JosefinSans-SemiBold',
    color: '#777',
    marginTop: 24,
    marginBottom: 8,
    marginLeft: 20,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'JosefinSans-Regular',
  },
  settingDescription: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'JosefinSans-Light',
    marginTop: 2,
  },
});

export default SettingsScreen;