const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const { OpenLyricsParser } = require("openlyrics-parser");
require("dotenv").config();

const DB_VERSION = parseInt(process.env.EXPO_PUBLIC_API_DB_VERSION || "1", 10);
console.log(`Configurando versión de DB: ${DB_VERSION}`);

const db = new Database("./assets/database/himnario.db");

db.pragma(`user_version = ${DB_VERSION}`);

const version = db.pragma("user_version", { simple: true });
console.log(`Versión de la base de datos establecida: ${version}`);

try {
  db.exec(fs.readFileSync("./scripts/makeTables.sql", "utf8"));
  console.log("✅ Tablas creadas correctamente.");
} catch (err) {
  console.error(`❌ Error al crear las tablas: ${err.message}`);
  process.exit(1);
}

const dir = "./raw-data/Tuya-es-La-Gloria-2022";

const insertCategory = db.prepare(`
  INSERT OR IGNORE INTO categories (name) VALUES (?)
`);

const insertSong = db.prepare(`
  INSERT INTO songs (number, songbook, title, author, note, verses_count, verses, publisher)
  VALUES (@number, @songbook, @title, @author,
          @note, @verses_count, @verses, @publisher)
`);

const insertSongCategory = db.prepare(`
  INSERT OR IGNORE INTO song_categories (song_id, category_id) VALUES (?, ?)
`);

const getCategoryId = db.prepare(`
  SELECT id FROM categories WHERE name = ?
`);

const files = fs.readdirSync(dir).filter((f) => f.endsWith(".xml"));

files.forEach((filename, index) => {
  try {
    const raw = fs.readFileSync(path.join(dir, filename), "utf8");
    const hymn = OpenLyricsParser(raw.toString());

    const number = parseInt(filename.split(" ")[0]);
    const title = hymn.properties.titles[0]?.value || `Sin título ${index}`;
    const author = hymn.properties.authors[0]?.value || "Desconocido";
    const note = hymn.properties.key || null;
    const songbook = hymn.properties.songBooks[0]?.name || "Desconocido";
    const publisher = hymn.properties.publisher || "Editorial Siembra";
    const verses_count = hymn.verses.length;
    const verses = JSON.stringify(hymn.verses);

    const categoryNames = hymn.properties.themes?.map((t) => t.value) || [
      "Sin categoría",
    ];

    for (const name of categoryNames) {
      insertCategory.run(name);
    }

    const result = insertSong.run({
      number,
      songbook,
      title,
      author,
      note,
      verses_count,
      verses,
      publisher,
    });

    const songId = result.lastInsertRowid;

    for (const name of categoryNames) {
      const categoryId = getCategoryId.get(name)?.id;
      if (categoryId) {
        insertSongCategory.run(songId, categoryId);
      }
    }

    console.log(`✅ Insertado: ${number} - ${title}`);
  } catch (err) {
    console.error(`❌ Error en archivo ${filename}:`, err.message);
  }
});
