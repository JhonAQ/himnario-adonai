import React, { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, View, Text, Alert, Platform } from "react-native";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import * as Asset from "expo-asset";

// Crear contexto para la base de datos
const DatabaseContext = createContext(null);

// Constantes de base de datos
const DB_NAME = "himnario.db";
const DB_DIR = FileSystem.documentDirectory + 'SQLite/';
const DB_PATH = DB_DIR + DB_NAME;

// Hook para usar la base de datos
export function useDatabase() {
  return useContext(DatabaseContext);
}

export function DatabaseProvider({ children }) {
  const [db, setDb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function setupDb() {
      try {
        console.log("[DB] Iniciando configuración de base de datos...");
        
        // Asegurar que existe el directorio
        const dirInfo = await FileSystem.getInfoAsync(DB_DIR);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(DB_DIR, { intermediates: true });
          console.log("[DB] Directorio SQLite creado");
        }
        
        // Verificar si existe la base de datos
        const fileInfo = await FileSystem.getInfoAsync(DB_PATH);
        
        // Si no existe, copiarla desde assets
        if (!fileInfo.exists) {
          console.log("[DB] Base de datos no encontrada, copiando desde assets...");
          
          // Obtener referencia al asset
          const asset = Asset.Asset.fromModule(require("../../assets/database/himnario.db"));
          await asset.downloadAsync();
          
          // Copiar archivo
          await FileSystem.copyAsync({
            from: asset.localUri,
            to: DB_PATH
          });
          console.log("[DB] Base de datos copiada");
        }
        
        // Usar el método de apertura que funciona en ambos entornos
        const database = await SQLite.openDatabaseAsync(DB_NAME);
        console.log("[DB] Base de datos abierta correctamente");
        
        // Activar optimización WAL
        await database.execAsync("PRAGMA journal_mode = WAL;");
        
        // Verificar que se puede acceder a los datos
        const result = await database.getFirstAsync("SELECT COUNT(*) as count FROM songs");
        console.log(`[DB] Base de datos contiene ${result?.count || 0} canciones`);
        
        setDb(database);
      } catch (err) {
        console.error("Error al inicializar la base de datos:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    setupDb();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "JosefinSans-SemiBold",
            fontSize: 18,
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          Error al cargar la base de datos
        </Text>
        <Text
          style={{ fontFamily: "JosefinSans-Regular", textAlign: "center" }}
        >
          {error}
        </Text>
      </View>
    );
  }

  return (
    <DatabaseContext.Provider value={db}>
      {children}
    </DatabaseContext.Provider>
  );
}