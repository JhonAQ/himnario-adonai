import * as SQLite from "expo-sqlite";
// Corregir la importación para que coincida con cómo se exporta
import { setupDatabase } from "./setupDatabase";

// En lugar de inicializar la base de datos con top-level await
let db = null;

// Esta implementación asegura que la base de datos solo se abre una vez
const initDatabase = async () => {
  if (!db) {
    // Usar setupDatabase en lugar de abrir directamente
    db = await setupDatabase();

    // Verificar estructura de la base de datos
    const tables = await db.getAllAsync(
      "SELECT name FROM sqlite_master WHERE type='table';"
    );
    console.log(
      "📊 Tablas en la base de datos después de inicializar:",
      tables
    );

    if (tables.length === 0) {
      console.error(
        "⚠️ La base de datos no contiene tablas. Verifica el archivo en assets."
      );
    }
  }
  return db;
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
  console.log(dataResponse);
};

export { initDatabase, test, getAllHymnsMetadata };
