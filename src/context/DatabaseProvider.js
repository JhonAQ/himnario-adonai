import React from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import { ActivityIndicator, View, Text } from 'react-native';

// Función para inicializar la base de datos con migraciones si son necesarias
async function initializeDatabase(db) {
  try {
    // Activar optimizaciones de rendimiento
    await db.execAsync("PRAGMA journal_mode = WAL;");
    
    // Verificar que podemos leer datos
    const result = await db.getFirstAsync("SELECT COUNT(*) as count FROM songs");
    console.log(`📊 Base de datos contiene ${result.count} canciones`);
    
  } catch (error) {
    console.error("Error durante la inicialización de la base de datos:", error);
    throw error;
  }
}

export function DatabaseProvider({ children }) {
  return (
    <SQLiteProvider 
      databaseName="himnario.db"
      assetSource={{ assetId: require("../../assets/database/himnario.db") }}
      onInit={initializeDatabase}
      fallbackRender={({ error }) => (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {error ? (
            <Text>Error al cargar la base de datos: {error.message}</Text>
          ) : (
            <ActivityIndicator size="large" />
          )}
        </View>
      )}
    >
      {children}
    </SQLiteProvider>
  );
}