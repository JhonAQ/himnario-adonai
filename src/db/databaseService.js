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

  const dataResponse = await database.getAllAsync(`
    SELECT 
      songs.id,
      songs.title,
      songs.number,
      songs.songbook,
      songs.note,
      songs.verses_count,
      songs.publisher,
      GROUP_CONCAT(categories.name, '|||') AS categories
    FROM songs
    LEFT JOIN song_categories ON songs.id = song_categories.song_id
    LEFT JOIN categories ON song_categories.category_id = categories.id
    GROUP BY songs.id
    ORDER BY songs.number
  `);

  const hymnsWithCategoriesAsArray = dataResponse.map(song => ({
    ...song,
    categories: song.categories
      ? song.categories.split("|||").filter(Boolean)
      : [],
  }));

  return hymnsWithCategoriesAsArray;
};


export { initDatabase, test, getAllHymnsMetadata };
