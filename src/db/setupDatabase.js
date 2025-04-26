import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import * as SQLite from "expo-sqlite";
import * as SplashScreen from "expo-splash-screen";
import { Alert, Platform } from "react-native";

// Variable global para la base de datos
let databaseInstance = null;

export async function setupDatabase() {
  if (databaseInstance) {
    return databaseInstance;
  }

  const DB_NAME = "himnario.db";
  const DB_PATH = FileSystem.documentDirectory + DB_NAME;

  const EXPECTED_VERSION = parseInt(
    process.env.EXPO_PUBLIC_API_DB_VERSION || "1",
    10
  );
  console.log(`📋 Versión de BD esperada: ${EXPECTED_VERSION}`);

  try {
    const fileInfo = await FileSystem.getInfoAsync(DB_PATH);
    
    if (fileInfo.exists) {
      console.log("🟢 Base encontrada en:", DB_PATH);
      
      try {
        databaseInstance = await SQLite.openDatabaseAsync(DB_PATH);
        return databaseInstance;
      } catch (dbError) {
        console.error("❌ Error al abrir la base existente:", dbError);
        // Intentar eliminar y copiar de nuevo
      }
    }
    
    // Si llegamos aquí, necesitamos copiar la base de datos
    console.log("📁 Copiando base de datos desde assets...");
    
    try {
      // Si existe una versión anterior, eliminarla
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(DB_PATH);
        console.log("�️ Eliminada base de datos anterior");
      }
      
      // Usar el enfoque de Asset para obtener la base de datos
      try {
        const asset = await Asset.loadAsync(require("../../assets/database/himnario.db"));
        const dbAsset = asset[0];
        
        console.log("✅ Asset cargado:", dbAsset.localUri);
        
        await FileSystem.copyAsync({
          from: dbAsset.localUri,
          to: DB_PATH,
        });
        
        console.log("� Base copiada a:", DB_PATH);
      } catch (assetError) {
        console.error("❌ Error con Asset.loadAsync:", assetError);
        
        // Alternativa: buscar la base de datos directamente en assets
        const assetUri = Asset.fromModule(require("../../assets/database/himnario.db")).uri;
        console.log("🔄 Intentando con URI alternativa:", assetUri);
        
        await FileSystem.copyAsync({
          from: assetUri,
          to: DB_PATH,
        });
      }
      
      // Verificar que la copia fue exitosa
      const copied = await FileSystem.getInfoAsync(DB_PATH);
      if (!copied.exists || copied.size < 1000) {
        throw new Error(`La base de datos no se copió correctamente. Tamaño: ${copied.size || 0} bytes`);
      }
      
      databaseInstance = await SQLite.openDatabaseAsync(DB_PATH);
      return databaseInstance;
      
    } catch (copyError) {
      console.error("❌ Error fatal al copiar la base de datos:", copyError);
      
      // En una app de producción, mostrar un error al usuario
      if (Platform.OS !== "web" && !__DEV__) {
        setTimeout(() => {
          Alert.alert(
            "Error al iniciar",
            "No se pudo cargar la base de datos de himnos. Por favor reinstale la aplicación o contacte a soporte.",
            [{ text: "OK" }]
          );
        }, 1000);
      }
      
      throw copyError;
    }
    
  } catch (error) {
    console.error("❌ Error general en setupDatabase:", error);
    throw error;
  }
}