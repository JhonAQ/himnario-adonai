const {readFile}  = require('fs');
const {OpenLyricsParser} = require('openlyrics-parser');

const hymnFile = process.argv[2];
let song = null;

readFile(hymnFile, 'utf8', (err, data) => {
    if (err) throw err;
    song = OpenLyricsParser(data.toString());
    console.log(song);
})