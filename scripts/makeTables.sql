CREATE TABLE songs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  number INTEGER UNIQUE NOT NULL,
  songbook TEXT NOT NULL,
  title TEXT NOT NULL,
  author TEXT DEFAULT 'Desconocido',
  note TEXT,
  category_id INTEGER,
  verses_count INTEGER,
  lyrics TEXT NOT NULL,
  publisher TEXT DEFAULT 'Editorial Siembra',
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

INSERT INTO categories (name) VALUES 
("Adoración"),
("Coros"),
("Consagración"),
("Evangelismo"),
("Navidad");


CREATE TABLE recently_viewed (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  song_id INTEGER NOT NULL,
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (song_id) REFERENCES songs(id)
);

