DROP TABLE IF EXISTS song_categories;
DROP TABLE IF EXISTS songs;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS recently_viewed;

CREATE TABLE songs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  number INTEGER UNIQUE NOT NULL,
  songbook TEXT NOT NULL,
  title TEXT NOT NULL,
  author TEXT DEFAULT 'Desconocido',
  note TEXT,
  verses_count INTEGER,
  verses TEXT NOT NULL,
  publisher TEXT DEFAULT 'Editorial Siembra'
);

CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE song_categories (
  song_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  PRIMARY KEY (song_id, category_id),
  FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE recently_viewed (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  song_id INTEGER NOT NULL,
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (song_id) REFERENCES songs(id)
);

-- Insertar categorías
INSERT INTO categories (name) VALUES 
('Adoración y Alabanza'),
('Espíritu Santo'),
('Vida de Cristo'),
('Iglesia y Comunidad'),
('Arrepentimiento y Confesión'),
('Esperanza y Segunda Venida'),
('Bautismo y Santa Cena'),
('Oración y Devoción Personal'),
('Navidad y Pascua'),
('Funerales y Consuelo'),
('Niños y Escuela Dominical'),
('Misión y Evangelismo'),
('Consagración y Servicio'),
('Coros');
