import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Linking
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTabBar } from '../context/TabBarContext';
import { useEffect } from 'react';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { setHideBar } = useTabBar();
  
  useEffect(() => {
    setHideBar(false);
  }, []);

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  const handleOpenLink = (url) => {
    Linking.openURL(url).catch(err => console.error("Error al abrir el enlace:", err));
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