import * as SQLite from 'expo-sqlite';

const db = await SQLite.openDatabaseAsync('hymns.db');

async function testDatabaseLoaded(){
  const isLoadedTest = await db.getFirstAsync('SELECT * FROM hymns');
  console.log(isLoadedTest);
}



export default getAllHymnsMetadata;