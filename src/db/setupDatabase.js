import { initializeDatabase } from './modules/databaseInitializer';
import { resetDatabase } from './modules/databaseReset';
import { runDatabaseDiagnostics } from './modules/databaseDiagnostics';
import { getDatabaseInstance } from './modules/databaseUtils';

/**
 * Realiza la configuración y apertura de la base de datos
 */
export async function setupDatabase() {
  return await initializeDatabase();
}

/**
 * Retorna la instancia actual de la base de datos
 */

// Exportamos las utilidades para reseteo y diagnóstico
export {getDatabaseInstance, resetDatabase, runDatabaseDiagnostics };