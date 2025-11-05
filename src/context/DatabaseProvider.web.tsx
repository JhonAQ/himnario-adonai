'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import initSqlJs, { Database } from 'sql.js';

interface DatabaseContextType {
  db: Database | null;
  loading: boolean;
  error: string | null;
  executeQuery: (query: string, params?: any[]) => Promise<any[]>;
  getFirst: (query: string, params?: any[]) => Promise<any>;
}

const DatabaseContext = createContext<DatabaseContextType | null>(null);

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within DatabaseProvider');
  }
  return context;
}

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<Database | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function setupDb() {
      try {
        console.log('[DB] Initializing SQL.js...');
        
        // Initialize SQL.js
        const SQL = await initSqlJs({
          locateFile: (file) => `https://sql.js.org/dist/${file}`
        });

        // Load database file
        const response = await fetch('/database/himnario.db');
        if (!response.ok) {
          throw new Error('Failed to load database file');
        }
        
        const buffer = await response.arrayBuffer();
        const database = new SQL.Database(new Uint8Array(buffer));
        
        // Verify database
        const result = database.exec('SELECT COUNT(*) as count FROM songs');
        const count = result[0]?.values[0]?.[0] || 0;
        console.log(`[DB] Database loaded with ${count} songs`);
        
        setDb(database);
      } catch (err) {
        console.error('Error initializing database:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    setupDb();
  }, []);

  const executeQuery = async (query: string, params: any[] = []): Promise<any[]> => {
    if (!db) throw new Error('Database not initialized');
    
    try {
      const result = db.exec(query, params);
      if (result.length === 0) return [];
      
      const { columns, values } = result[0];
      return values.map(row => {
        const obj: any = {};
        columns.forEach((col, i) => {
          obj[col] = row[i];
        });
        return obj;
      });
    } catch (err) {
      console.error('Query error:', err);
      throw err;
    }
  };

  const getFirst = async (query: string, params: any[] = []): Promise<any> => {
    const results = await executeQuery(query, params);
    return results[0] || null;
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'JosefinSans-Regular'
      }}>
        <div>Cargando base de datos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        padding: '20px',
        fontFamily: 'JosefinSans-Regular'
      }}>
        <h2 style={{ fontFamily: 'JosefinSans-SemiBold', marginBottom: '10px' }}>
          Error al cargar la base de datos
        </h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <DatabaseContext.Provider value={{ db, loading, error, executeQuery, getFirst }}>
      {children}
    </DatabaseContext.Provider>
  );
}
