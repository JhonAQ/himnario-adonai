import AsyncStorage from '@react-native-async-storage/async-storage';

const LOG_STORAGE_KEY = '@HimnarioLogs';
const MAX_LOGS = 100;

class LoggerService {
  static logs = [];
  static counter = 0; // Contador para garantizar unicidad
  
  static levels = {
    INFO: '📘 INFO',
    SUCCESS: '✅ OK',
    WARNING: '⚠️ WARN',
    ERROR: '❌ ERROR',
    DEBUG: '🔍 DEBUG',
  };

  static async initialize() {
    try {
      const savedLogs = await AsyncStorage.getItem(LOG_STORAGE_KEY);
      if (savedLogs) {
        this.logs = JSON.parse(savedLogs);
        // Encontrar el counter más alto para continuar desde ahí
        this.logs.forEach(log => {
          const idParts = log.id.split('-');
          if (idParts.length === 2) {
            const counter = parseInt(idParts[1], 10);
            if (!isNaN(counter) && counter > this.counter) {
              this.counter = counter;
            }
          }
        });
        this.counter++; // Incrementar para el próximo ID
      }
      
      this.info('App', 'Servicio de logs inicializado');
    } catch (error) {
      console.error('Error inicializando LoggerService:', error);
    }
  }

  static async _saveLogs() {
    try {
      // Mantener solo los últimos MAX_LOGS registros para evitar problemas de memoria
      this.logs = this.logs.slice(-MAX_LOGS);
      await AsyncStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(this.logs));
    } catch (error) {
      console.error('Error guardando logs:', error);
    }
  }

  static async addLog(level, category, message, details = null) {
    const timestamp = new Date().toISOString();
    let detailsStr = '';
    
    // Procesar los detalles para almacenarlos como string
    if (details) {
      if (details instanceof Error) {
        detailsStr = `${details.message}\n${details.stack || ''}`;
      } else if (typeof details === 'object') {
        try {
          detailsStr = JSON.stringify(details, null, 2);
        } catch (e) {
          detailsStr = String(details);
        }
      } else {
        detailsStr = String(details);
      }
    }

    // Crear un ID único combinando timestamp y un contador
    const uniqueId = `${Date.now()}-${this.counter++}`;

    const logEntry = {
      id: uniqueId,
      timestamp,
      level,
      category,
      message,
      details: detailsStr
    };

    this.logs.push(logEntry);
    await this._saveLogs();
    
    // Mejorar la visualización en la consola
    const logPrefix = `${level} [${category}] ${message}`;
    
    // Mostrar detalles completos en la consola según el tipo
    if (details) {
      if (level.includes('ERROR')) {
        console.error(logPrefix);
        
        if (details instanceof Error) {
          // Mostrar el error completo para mejor depuración
          console.error('Detalles del error:', details);
          console.error('Stack trace:', details.stack);
        } else {
          console.error('Detalles:', details);
        }
      } else if (level.includes('WARN')) {
        console.warn(logPrefix, details);
      } else {
        console.log(logPrefix, details);
      }
    } else {
      console.log(logPrefix);
    }
    
    return logEntry;
  }

  static async info(category, message, details = null) {
    return this.addLog(this.levels.INFO, category, message, details);
  }

  static async success(category, message, details = null) {
    return this.addLog(this.levels.SUCCESS, category, message, details);
  }

  static async warning(category, message, details = null) {
    return this.addLog(this.levels.WARNING, category, message, details);
  }

  static async error(category, message, details = null) {
    return this.addLog(this.levels.ERROR, category, message, details);
  }

  static async debug(category, message, details = null) {
    return this.addLog(this.levels.DEBUG, category, message, details);
  }

  static async clearLogs() {
    this.logs = [];
    await AsyncStorage.removeItem(LOG_STORAGE_KEY);
    return this.info('App', 'Logs eliminados');
  }

  
  /**
   * Elimina los logs de categorías específicas
   */
  static async clearCategoryLogs(categories) {
    if (!Array.isArray(categories) || categories.length === 0) {
      return false;
    }
  
    try {
      const categorySet = new Set(categories);
      this.logs = this.logs.filter(log => !categorySet.has(log.category));
      await this._saveLogs();
      await this.info('App', `Logs de categorías (${categories.join(', ')}) eliminados`);
      return true;
    } catch (error) {
      console.error('Error eliminando logs por categoría:', error);
      return false;
    }
  }

  static async getLogs() {
    return this.logs;
  }

  static async exportLogs() {
    try {
      const logs = await this.getLogs();
      const content = logs.map(log => {
        const timestamp = new Date(log.timestamp).toLocaleString();
        return `[${timestamp}] ${log.level} [${log.category}] ${log.message}\n${log.details ? `Detalles: ${log.details}\n` : ''}`;
      }).join('\n');
      
      return content;
    } catch (error) {
      console.error('Error al exportar logs:', error);
      return `Error al exportar logs: ${error.message}`;
    }
  }


/**
 * Exporta los logs a un archivo y devuelve la ruta
 * @param {string} format - Formato de exportación ('txt' o 'json')
 * @returns {Promise<string>} - Ruta del archivo creado
 */
static async exportLogsToFile(format = 'txt') {
  try {
    await this.info('App', `Exportando logs en formato ${format}`);
    const logs = await this.getLogs();
    let content = '';
    let filename = '';
    
    // Generar nombre de archivo con fecha y hora
    const date = new Date();
    const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const timeStr = `${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}`;
    
    // Agregar BOM (Byte Order Mark) para UTF-8
    const BOM = '\ufeff';
    
    if (format === 'json') {
      // Formato JSON para análisis programático
      content = BOM + JSON.stringify(logs, null, 2);
      filename = `himnario-logs_${dateStr}_${timeStr}.json`;
    } else {
      // Formato texto para lectura humana
      content = BOM + logs.map(log => {
        const timestamp = new Date(log.timestamp).toLocaleString();
        return `[${timestamp}] ${log.level} [${log.category}] ${log.message}\n${log.details ? `Detalles: ${log.details}\n` : ''}`;
      }).join('\n');
      filename = `himnario-logs_${dateStr}_${timeStr}.txt`;
    }
    
    // Guardar el contenido en un archivo con opciones de codificación
    const FileSystem = require('expo-file-system');
    const fileUri = `${FileSystem.documentDirectory}${filename}`;
    
    await FileSystem.writeAsStringAsync(fileUri, content, {
      encoding: FileSystem.EncodingType.UTF8
    });
    
    await this.success('App', `Logs exportados a: ${fileUri}`);
    
    return { fileUri, filename };
  } catch (error) {
    await this.error('App', 'Error exportando logs a archivo', error);
    throw error;
  }
}


}

export default LoggerService;