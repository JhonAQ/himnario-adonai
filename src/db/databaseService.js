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

// Modifica la función getAllHymnsMetadata para ser más eficiente
const getAllHymnsMetadata = async () => {
  console.time('getAllHymnsMetadata'); // Para medir el tiempo de ejecución
  const database = await initDatabase();

  try {
    // Primero obtenemos los himnos básicos sin categorías (consulta más rápida)
    const songs = await database.getAllAsync(`
      SELECT 
        id, title, number, songbook, note, verses_count, publisher
      FROM songs
      ORDER BY number
    `);

    // Luego obtenemos las categorías en una consulta separada
    const categories = await database.getAllAsync(`
      SELECT 
        sc.song_id, 
        c.name as category_name
      FROM song_categories sc
      JOIN categories c ON sc.category_id = c.id
    `);

    // Hacemos el procesamiento en memoria (más rápido que JOIN en SQLite)
    const songCategories = {};
    categories.forEach(cat => {
      if (!songCategories[cat.song_id]) {
        songCategories[cat.song_id] = [];
      }
      songCategories[cat.song_id].push(cat.category_name);
    });

    // Combinamos los datos
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

const getHymnById = async (id) => {
  const database = await initDatabase();

  console.log("ID:", id);
  const song = await database.getFirstAsync(
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


const searchHymnContent = async (query) => {
  const database = await initDatabase();
  console.log(`Buscando "${query}" en contenido de himnos`);
  
  try {
    const searchQuery = `
      SELECT DISTINCT id
      FROM songs
      WHERE verses LIKE ?
      LIMIT 20
    `;
    
    const results = await database.getAllAsync(searchQuery, [`%${query}%`]);
    return results.map(r => r.id);
  } catch (error) {
    console.error('Error al buscar en contenido:', error);
    
    try {
      console.log('Intentando búsqueda en memoria...');
      const allSongs = await getAllHymnsMetadata();
      
      const results = [];
      for (const song of allSongs.slice(0, 60)) {
        try {
          const fullHymn = await getHymnById(song.id);
          if (fullHymn && fullHymn.verses) {
            // Convertir a texto plano para búsqueda simple
            const versesText = JSON.stringify(fullHymn.verses);
            if (versesText.toLowerCase().includes(query.toLowerCase())) {
              results.push(song.id);
            }
          }
        } catch (hymn_error) {
          console.log(`Error al procesar himno ${song.id}`, hymn_error);
        }
      }
      return results;
    } catch (backupError) {
      console.error('Error en búsqueda de respaldo:', backupError);
      return [];
    }
  }
};

// ... resto del código ...

export { initDatabase, test, getAllHymnsMetadata, getHymnById, searchHymnContent };