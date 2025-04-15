const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const { OpenLyricsParser } = require('openlyrics-parser');

// Inicializar DB
const db = new Database('./assets/database/himnario.db');
db.exec(fs.readFileSync('./scripts/makeTables.sql', 'utf8'));

// Directorio con los XML
const dir = './raw-data/Tuya-es-La-Gloria-2022';

// Preparar sentencias SQL
const insertCategory = db.prepare(`
  INSERT OR IGNORE INTO categories (name) VALUES (?)
`);

const insertSong = db.prepare(`
  INSERT INTO songs (number, songbook, title, author, note, category_id, verses_count, lyrics, publisher)
  VALUES (@number, @songbook, @title, @author, 
          @note, 
          (SELECT id FROM categories WHERE name = @category), 
          @verses_count, @lyrics, @publisher)
`);

const files = fs.readdirSync(dir).filter(f => f.endsWith('.xml'));

files.forEach((filename, index) => {
  try {
    const raw = fs.readFileSync(path.join(dir, filename), 'utf8');
    const hymn = OpenLyricsParser(raw.toString());

    const number = parseInt(filename.split(' ')[0]);
    const title = hymn.properties.titles[0]?.value || `Sin título ${index}`;
    const author = hymn.properties.authors[0]?.value || 'Desconocido';
    const note = hymn.properties.key || null;
    const songbook = hymn.properties.songBooks[0]?.name || 'Desconocido';
    const category = hymn.properties.themes[0]?.value || 'Sin categoría';
    const publisher = hymn.properties.publisher || 'Editorial Siembra';
    const verses_count = hymn.verses.length;
    const lyrics = JSON.stringify(hymn.verses);

    // Asegurar que exista la categoría
    insertCategory.run(category);

    // Insertar himno
    insertSong.run({
      number,
      songbook,
      title,
      author,
      note,
      category,
      verses_count,
      lyrics,
      publisher
    });

    console.log(`✅ Insertado: ${number} - ${title}`);
  } catch (err) {
    console.error(`❌ Error en archivo ${filename}:`, err.message);
  }
});
