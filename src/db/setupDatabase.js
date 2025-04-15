import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { Asset } from 'expo-asset';

const DB_NAME = 'himnario.db';
const DB_PATH = `${FileSystem.documentDirectory}${DB_NAME}`;

export async function setupDatabase() {
  const fileInfo = await FileSystem.getInfoAsync(DB_PATH);

  if (!fileInfo.exists) {
    console.log('Copiando base de datos por primera vez...');
    const asset = Asset.fromModule(require('../../assets/database/himnario.db'));
    await asset.downloadAsync();
    await FileSystem.copyAsync({
      from: asset.localUri,
      to: DB_PATH
    });
  }

  return SQLite.openDatabase(DB_NAME);
}
