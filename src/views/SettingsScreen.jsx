import React, { useContext } from 'react';
import { 
  View, 
  Text, 
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
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center bg-surface px-5 py-4 border-b border-neutral-100"
    >
      <View className="w-10 h-10 rounded-xl bg-surface-secondary items-center justify-center mr-4">
        <Ionicons name={icon} size={22} color="#6B7280" />
      </View>
      <View className="flex-1">
        <Text className="font-josefinSemibold text-base text-foreground">
          {title}
        </Text>
        {description && (
          <Text className="font-josefin text-sm text-foreground-secondary mt-1">
            {description}
          </Text>
        )}
      </View>
      <Ionicons name={rightIcon} size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );

  const renderSectionTitle = (title) => (
    <Text className="font-josefinSemibold text-sm text-foreground-muted uppercase tracking-wide mt-8 mb-2 mx-5">
      {title}
    </Text>
  );

  return (
    <View className="flex-1 bg-background">
      {/* Modern header */}
      <View className="pt-16 pb-6 px-5 bg-surface border-b border-neutral-100">
        <Text className="font-josefinBold text-2xl text-foreground">
          Configuración
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
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
        
        {/* Bottom spacing */}
        <View className="h-20" />
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;