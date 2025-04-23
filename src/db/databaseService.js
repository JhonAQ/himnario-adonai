import * as SQLite from "expo-sqlite";
import { setupDatabase } from "./setupDatabase";

// No necesitamos una variable db adicional, ya que setupDatabase mantiene un singleton
const initDatabase = async () => {
  return await setupDatabase();
};

const test = async () => {
  try {
    const database = await initDatabase();
    try {
      const isLoadedTest = await database.getFirstAsync("SELECT * FROM songs");
      if (isLoadedTest) {
        return { status: true };
      } else {
        return { status: false };
      }
    } catch (error) {
      console.error("Error en la consulta SQL:", error);

      const tables = await database.getAllAsync(
        "SELECT name FROM sqlite_master WHERE type='table';"
      );
      console.log("Tablas disponibles en la base de datos:", tables);
      return { status: false };
    }
  } catch (dbError) {
    console.error("Error al inicializar la base de datos:", dbError);
    return { status: false };
  }
};

const getAllHymnsMetadata = async () => {
  const database = await initDatabase();
  const dataResponse = await database.getAllAsync(
    "SELECT title, number, songbook, note, verses_count, publisher FROM songs"
  );
  return dataResponse
};

export { initDatabase, test, getAllHymnsMetadata };
