import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import * as SQLite from 'expo-sqlite';


export async function setupDatabase() {
  const DB_NAME = 'himnario.db';
  const DB_PATH = FileSystem.documentDirectory + DB_NAME;

  const fileInfo = await FileSystem.getInfoAsync(DB_PATH);

  if (!fileInfo.exists) {
    console.log("📁 Base no existe, intentando copiar...");

    const asset = Asset.fromModule(require('../../assets/database/himnario.db'));
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

  return SQLite.openDatabaseAsync(DB_NAME);
}
