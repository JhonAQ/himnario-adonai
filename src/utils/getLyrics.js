const getName = (name) => {
  if(name == "c") return "Coro"
  if(name[0] == 'v') return "Verso " + name[1]
}

export function getLyrics(hymn){
  const lyrics = hymn.verses.map( v => {
    const lines = v.lines.map((l) => l.content[0].value)
    return {
      type: getName(v.name),
      lines
    }
  })
  return lyrics
}