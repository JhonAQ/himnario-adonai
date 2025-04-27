import * as SQLite from "expo-sqlite";
import { Alert, Platform } from "react-native";

// Variable global para la base de datos
let databaseInstance = null;

export async function setupDatabase() {
  if (databaseInstance) {
    return databaseInstance;
  }

  const DB_NAME = "himnario.db";

  try {
    console.log("� Abriendo base de datos desde assets...");
    
    try {
      // Método moderno para abrir base de datos con assetSource
      databaseInstance = await SQLite.openDatabaseAsync({
        name: DB_NAME,
        // Cargar desde assets directamente
        assetSource: require("../../assets/database/himnario.db"),
      });
      
      console.log("✅ Base de datos abierta correctamente");
      
      // Activar optimizaciones de rendimiento
      await databaseInstance.execAsync("PRAGMA journal_mode = WAL;");
      
      // Verificar que la base de datos es válida
      try {
        const result = await databaseInstance.getFirstAsync("SELECT COUNT(*) as count FROM songs");
        console.log(`📊 Base de datos contiene ${result.count} canciones`);
      } catch (verifyError) {
        console.error("❌ Error al verificar la base de datos:", verifyError);
        throw new Error("La base de datos parece estar corrupta o incompleta");
      }
      
      return databaseInstance;
    } catch (dbError) {
      console.error("❌ Error al abrir la base de datos:", dbError);
      
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
      
      throw dbError;
    }
  } catch (error) {
    console.error("❌ Error general en setupDatabase:", error);
    throw error;
  }
}