import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import * as SQLite from "expo-sqlite";
import Constants from "expo-constants";

// Variable global para la base de datos
let databaseInstance = null;

export async function setupDatabase() {
  // Si ya tenemos una instancia, la retornamos inmediatamente
  if (databaseInstance) {
    return databaseInstance;
  }

  const DB_NAME = "himnario.db";
  const DB_PATH = FileSystem.documentDirectory + DB_NAME;

  // Usar la variable de entorno correcta para la versión esperada
  const EXPECTED_VERSION = parseInt(
    process.env.EXPO_PUBLIC_API_DB_VERSION || "1",
    10
  );
  console.log(`📋 Versión de BD esperada: ${EXPECTED_VERSION}`);

  let needsCopy = false;

  try {
    const fileInfo = await FileSystem.getInfoAsync(DB_PATH);

    if (fileInfo.exists) {
      console.log("🟢 Base encontrada en:", DB_PATH);

      try {
        // Abrir la base de datos solo una vez y guardar la instancia
        databaseInstance = await SQLite.openDatabaseAsync(DB_PATH);

        console.log("📊 Consultando versión de base de datos...");
        const result = await databaseInstance.getFirstAsync(
          "PRAGMA user_version"
        );
        console.log("📊 Resultado PRAGMA:", result);

        const currentVersion = result?.user_version || 0;
        console.log(
          `🔍 Versión actual: ${currentVersion}, esperada: ${EXPECTED_VERSION}`
        );

        if (currentVersion !== EXPECTED_VERSION) {
          console.log("📌 Versión desactualizada. Reemplazando base...");

          // Cerrar la conexión antes de reemplazar
          databaseInstance = null;

          needsCopy = true;
        } else {
          console.log("✅ Versión correcta, no se reemplaza.");
          return databaseInstance;
        }
      } catch (dbError) {
        console.error("❌ Error al verificar versión:", dbError);
        databaseInstance = null;
        needsCopy = true;
      }
    } else {
      console.log("📁 Base no existe, será copiada...");
      needsCopy = true;
    }

    if (needsCopy) {
      // Si necesitamos copiar, primero cerramos cualquier conexión existente
      if (databaseInstance) {
        databaseInstance = null;
      }

      // Eliminar archivo existente si es necesario
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(DB_PATH);
        console.log("🗑️ Eliminada base de datos anterior");
      }

      const asset = Asset.fromModule(
        require("../../assets/database/himnario.db")
      );
      await asset.downloadAsync();
      console.log("✅ Asset descargado:", asset.localUri);

      await FileSystem.copyAsync({
        from: asset.localUri,
        to: DB_PATH,
      });

      console.log("📥 Base copiada a:", DB_PATH);

      // Abrir la base de datos nueva
      databaseInstance = await SQLite.openDatabaseAsync(DB_PATH);
    }

    return databaseInstance;
  } catch (error) {
    console.error("❌ Error al configurar la base de datos:", error);
    throw error;
  }
}
