import { useSQLiteContext } from "expo-sqlite";

// Este hook permite acceder a la base de datos desde cualquier componente
export function useDatabase() {
  return useSQLiteContext();
}

export const getAllHymnsMetadata = async (db) => {
  console.time('getAllHymnsMetadata');

  try {
    const songs = await db.getAllAsync(`
      SELECT 
        id, title, number, songbook, note, verses_count, publisher
      FROM songs
      ORDER BY number
    `);

    const categories = await db.getAllAsync(`
      SELECT 
        sc.song_id, 
        c.name as category_name
      FROM song_categories sc
      JOIN categories c ON sc.category_id = c.id
    `);

    const songCategories = {};
    categories.forEach(cat => {
      if (!songCategories[cat.song_id]) {
        songCategories[cat.song_id] = [];
      }
      songCategories[cat.song_id].push(cat.category_name);
    });

    const result = songs.map(song => ({
      ...song,
      categories: songCategories[song.id] || []
    }));

    console.timeEnd('getAllHymnsMetadata');
    return result;
  } catch (error) {
    console.error('Error al obtener metadatos de himnos:', error);
    throw error;
  }
};

export const getHymnById = async (db, id) => {
  console.log("ID:", id);
  const song = await db.getFirstAsync(
    `
    SELECT 
      songs.id,
      songs.title,
      songs.number,
      songs.songbook,
      songs.note,
      songs.verses_count,
      songs.publisher,
      songs.verses,
      GROUP_CONCAT(categories.name, '|||') AS categories
    FROM songs
    LEFT JOIN song_categories ON songs.id = song_categories.song_id
    LEFT JOIN categories ON song_categories.category_id = categories.id
    WHERE songs.id = ?
    GROUP BY songs.id
  `,
    [id]
  );

  if (!song) return null;

  return {
    ...song,
    categories: song.categories
      ? song.categories.split("|||").filter(Boolean)
      : [],
    verses: JSON.parse(song.verses || "[]"),
  };
};

export const searchHymnContent = async (db, query) => {
  console.log(`Buscando "${query}" en contenido de himnos`);
  
  try {
    const searchQuery = `
      SELECT DISTINCT id
      FROM songs
      WHERE verses LIKE ?
      LIMIT 20
    `;
    
    const results = await db.getAllAsync(searchQuery, [`%${query}%`]);
    return results.map(r => r.id);
  } catch (error) {
    console.error('Error al buscar en contenido:', error);
    return [];
  }
};

// Función de prueba
export const test = async (db) => {
  try {
    const isLoadedTest = await db.getFirstAsync("SELECT * FROM songs");
    if (isLoadedTest) {
      return { status: true };
    } else {
      return { status: false };
    }
  } catch (error) {
    console.error("Error en la consulta SQL:", error);

    const tables = await db.getAllAsync(
      "SELECT name FROM sqlite_master WHERE type='table';"
    );
    console.log("Tablas disponibles en la base de datos:", tables);
    return { status: false };
  }
};