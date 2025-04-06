const path = require('path');
const { readFile } = require('fs');
const { OpenLyricsParser } = require('openlyrics-parser');
const util = require('util');

const hymnFile = process.argv[2];
let song = null;

const initialCwd = process.env.INIT_CWD || process.cwd();
const filePath = path.resolve(initialCwd, hymnFile);

readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;
    song = OpenLyricsParser(data.toString());
    console.log(util.inspect(song, { depth: null, colors: true }));
});
