import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import * as SQLite from "expo-sqlite";

export async function setupDatabase() {
  const DB_NAME = "himnario.db";
  const DB_PATH = FileSystem.documentDirectory + DB_NAME;

  try {
    const fileInfo = await FileSystem.getInfoAsync(DB_PATH);

    if (!fileInfo.exists) {
      console.log("📁 Base no existe, intentando copiar...");

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
    } else {
      console.log("🟢 Base de datos ya existe en:", DB_PATH);
    }

    // Verificación adicional para asegurar que el archivo existe
    const dbFileVerify = await FileSystem.getInfoAsync(DB_PATH);
    if (!dbFileVerify.exists || dbFileVerify.size === 0) {
      console.error(
        "⚠️ Error: El archivo de base de datos no existe o está vacío después de la copia"
      );
    } else {
      console.log(
        `📊 Tamaño del archivo de base de datos: ${dbFileVerify.size} bytes`
      );
    }

    // Abrir la base de datos
    const db = await SQLite.openDatabaseAsync(DB_PATH);
    return db;
  } catch (error) {
    console.error("❌ Error al configurar la base de datos:", error);
    throw error;
  }
}
