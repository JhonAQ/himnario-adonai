import React, { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { initializeDatabase } from "../db/modules/databaseInitializer";

// Crear contexto para la base de datos
const DatabaseContext = createContext(null);

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
        // Inicializar la base de datos usando el método que funciona en producción
        const database = await initializeDatabase();
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