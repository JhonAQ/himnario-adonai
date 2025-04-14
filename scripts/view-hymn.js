const path = require('path');
const { readFile, writeFile } = require('fs');
const { OpenLyricsParser } = require('openlyrics-parser');
const util = require('util');

const hymnFile = process.argv[2];
let song = null;

const initialCwd = process.env.INIT_CWD || process.cwd();
const filePath = path.resolve(initialCwd, hymnFile);
const outputPath = path.resolve(initialCwd, 'parsed_song.json');

readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;
    song = OpenLyricsParser(data.toString());

    writeFile(outputPath, JSON.stringify(song, null, 2), 'utf8', (err) => {
        if (err) throw err;
        console.log(`Archivo guardado en: ${outputPath}`);
    });

    console.log(util.inspect(song, { depth: null, colors: true }));
});
