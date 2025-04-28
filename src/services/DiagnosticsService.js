import LoggerService from './LoggerService';
import { runDatabaseDiagnostics } from '../db/modules/databaseDiagnostics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { searchHymnContent } from '../db/databaseService';

/**
 * Servicio central para diagnósticos del sistema
 */
class DiagnosticsService {
  /**
   * Realiza un diagnóstico de base de datos
   */
  static async runDbDiagnostics() {
    await LoggerService.info('UI', '🔬 Iniciando diagnóstico de base de datos');
    
    // Limpiar logs relacionados con diagnósticos anteriores
    await LoggerService.clearCategoryLogs(['Setup', 'Diagnostics']);
    
    try {
      // Ejecutar diagnóstico
      await runDatabaseDiagnostics();
      await LoggerService.success('UI', '✅ Diagnóstico de base de datos completado');
      return true;
    } catch (error) {
      await LoggerService.error('UI', '❌ Error en diagnóstico de base de datos', error);
      return false;
    }
  }
  
  /**
   * Realiza un diagnóstico de los datos de himnos
   */
  static async runHimnoDiagnostics(db, metaHimnos) {
    await LoggerService.info('UI', '🔬 Iniciando diagnóstico de datos de himnos');
    
    // Limpiar logs relevantes
    await LoggerService.clearCategoryLogs(['HimnosData', 'DataService']);
    
    try {
      // Verificar conexión a base de datos
      await LoggerService.info('HimnosData', '📊 Verificando acceso a la base de datos');
      if (!db) {
        await LoggerService.error('HimnosData', '❌ Base de datos no disponible');
        return false;
      }
      await LoggerService.success('HimnosData', '✅ Base de datos accesible');
      
      // Verificar datos de himnos
      await LoggerService.info('HimnosData', '🎵 Verificando metadatos de himnos');
      if (!metaHimnos || !Array.isArray(metaHimnos)) {
        await LoggerService.error('HimnosData', '❌ No hay datos de himnos disponibles', 
          `metaHimnos es ${metaHimnos === null ? 'null' : typeof metaHimnos}`);
        return false;
      } 
      
      await LoggerService.success('HimnosData', `✅ Datos disponibles: ${metaHimnos.length} himnos`);
      
      // Verificar estructura de primer himno
      if (metaHimnos.length > 0) {
        const firstHymn = metaHimnos[0];
        await LoggerService.debug('HimnosData', '📝 Estructura del primer himno:', 
          `id: ${firstHymn.id}, title: ${firstHymn.title}, categorías: ${firstHymn.categories?.length || 0}`);
      }
      
      // Verificar algunos metadatos importantes
      const missingTitles = metaHimnos.filter(h => !h.title).length;
      const missingNumbers = metaHimnos.filter(h => !h.number).length;
      const emptyCats = metaHimnos.filter(h => !h.categories || h.categories.length === 0).length;
      
      if (missingTitles > 0) {
        await LoggerService.warning('HimnosData', `⚠️ Hay ${missingTitles} himnos sin título`);
      }
      
      if (missingNumbers > 0) {
        await LoggerService.warning('HimnosData', `⚠️ Hay ${missingNumbers} himnos sin número`);
      }
      
      if (emptyCats > 0) {
        await LoggerService.warning('HimnosData', `⚠️ Hay ${emptyCats} himnos sin categorías`);
      }
      
      // Probar carga de himno específico
      try {
        await LoggerService.info('DataService', '🔍 Probando carga de himno específico (ID=1)');
        const hymn = await db.getFirstAsync("SELECT * FROM songs WHERE id = 1");
        
        if (hymn) {
          await LoggerService.success('DataService', `✅ Himno ID=1 cargado: ${hymn.title}`);
        } else {
          await LoggerService.error('DataService', '❌ No se pudo cargar el himno ID=1');
        }
      } catch (error) {
        await LoggerService.error('DataService', '❌ Error al cargar himno específico', error);
      }
      
      await LoggerService.success('UI', '✅ Diagnóstico de datos de himnos completado');
      return true;
    } catch (error) {
      await LoggerService.error('UI', '❌ Error en diagnóstico de datos de himnos', error);
      return false;
    }
  }
  
  /**
   * Realiza un diagnóstico del sistema de caché
   */
  static async runCacheDiagnostics() {
    await LoggerService.info('UI', '🔬 Iniciando diagnóstico de caché');
    
    // Limpiar logs relevantes
    await LoggerService.clearCategoryLogs(['Cache']);
    
    try {
      // Diagnóstico del sistema de caché
      await LoggerService.info('Cache', '💾 Verificando disponibilidad de AsyncStorage');
      
      if (!AsyncStorage) {
        await LoggerService.error('Cache', '❌ AsyncStorage no está disponible');
        return false;
      }
      
      await LoggerService.success('Cache', '✅ AsyncStorage está disponible');
      
      // Listar claves en AsyncStorage
      await LoggerService.info('Cache', '🔑 Listando claves en AsyncStorage');
      
      try {
        const keys = await AsyncStorage.getAllKeys();
        await LoggerService.debug('Cache', `📋 Claves encontradas (${keys.length}): ${keys.join(', ')}`);
        
        // Verificar caché de himnos
        const himnosKey = 'himnosMetadata';
        if (keys.includes(himnosKey)) {
          await LoggerService.debug('Cache', '🔍 Analizando caché de himnos');
          
          const cachedData = await AsyncStorage.getItem(himnosKey);
          if (cachedData) {
            try {
              const parsed = JSON.parse(cachedData);
              const timestamp = parsed.timestamp ? new Date(parsed.timestamp).toLocaleString() : 'desconocido';
              const count = parsed.data?.length || 0;
              
              await LoggerService.success('Cache', `✅ Caché válida: ${count} himnos, fecha: ${timestamp}`);
            } catch (parseError) {
              await LoggerService.error('Cache', '❌ Error al analizar caché de himnos', parseError);
            }
          } else {
            await LoggerService.warning('Cache', '⚠️ La clave existe pero no hay datos');
          }
        } else {
          await LoggerService.warning('Cache', '⚠️ No se encontró caché de himnos');
        }
        
        // Verificar himnos recientes
        const recentKey = '@HimnarioRecentHymns';
        if (keys.includes(recentKey)) {
          await LoggerService.debug('Cache', '🔍 Analizando himnos recientes');
          
          const recentData = await AsyncStorage.getItem(recentKey);
          if (recentData) {
            try {
              const parsed = JSON.parse(recentData);
              await LoggerService.success('Cache', `✅ ${parsed.length} himnos recientes en caché`);
            } catch (parseError) {
              await LoggerService.error('Cache', '❌ Error al analizar himnos recientes', parseError);
            }
          }
        }
        
      } catch (error) {
        await LoggerService.error('Cache', '❌ Error al listar claves de AsyncStorage', error);
        return false;
      }
      
      await LoggerService.success('UI', '✅ Diagnóstico de caché completado');
      return true;
    } catch (error) {
      await LoggerService.error('UI', '❌ Error en diagnóstico de caché', error);
      return false;
    }
  }
  
    /**
   * Realiza un diagnóstico del flujo de datos a la UI
   * Este diagnóstico rastrea el camino de los datos desde la carga hasta el renderizado
   */
  static async runUIDataFlowDiagnostics(db, metaHimnos, contextValue = null) {
    await LoggerService.info('UI', '🔬 Iniciando diagnóstico de flujo de datos a la UI');
    
    // Limpiar logs relevantes
    await LoggerService.clearCategoryLogs(['UIDataFlow']);
    
    try {
      // 1. Verificar los datos de origen (Base de Datos)
      await LoggerService.debug('UIDataFlow', '📊 Verificando origen de datos');
      
      if (!db) {
        await LoggerService.error('UIDataFlow', '❌ Base de datos no disponible');
        return false;
      }
      
      // 2. Verificar los datos cargados en memoria (metaHimnos)
      await LoggerService.debug('UIDataFlow', '📋 Verificando datos cargados en memoria');
      
      if (!metaHimnos) {
        await LoggerService.error('UIDataFlow', '❌ Variable metaHimnos no disponible');
        return false;
      } else if (!Array.isArray(metaHimnos)) {
        await LoggerService.error('UIDataFlow', `❌ metaHimnos no es un array: ${typeof metaHimnos}`);
        return false;
      } else if (metaHimnos.length === 0) {
        await LoggerService.error('UIDataFlow', '❌ metaHimnos es un array vacío');
        return false;
      }
      
      await LoggerService.success('UIDataFlow', `✅ metaHimnos contiene ${metaHimnos.length} elementos`);
      
      // 3. Examinar un elemento para verificar estructura
      const sampleHymn = metaHimnos[0];
      await LoggerService.debug('UIDataFlow', '🔍 Muestra de datos:', 
        `ID: ${sampleHymn.id}, Título: ${sampleHymn.title}, Número: ${sampleHymn.number}`);
      
      // 4. Verificar las propiedades críticas que se usan en los componentes UI
      const requiredProps = ['id', 'title', 'number', 'categories'];
      const missingProps = requiredProps.filter(prop => !sampleHymn.hasOwnProperty(prop));
      
      if (missingProps.length > 0) {
        await LoggerService.error('UIDataFlow', `❌ Faltan propiedades requeridas: ${missingProps.join(', ')}`);
      } else {
        await LoggerService.success('UIDataFlow', '✅ Estructura de datos correcta para UI');
      }
      
      // 5. Verificar si las categorías se procesan correctamente
      await LoggerService.debug('UIDataFlow', '📑 Verificando procesamiento de categorías');
      try {
        const categoriesMap = new Map();
        
        metaHimnos.forEach(hymn => {
          if (Array.isArray(hymn.categories)) {
            hymn.categories.forEach(cat => {
              categoriesMap.set(cat, (categoriesMap.get(cat) || 0) + 1);
            });
          }
        });
        
        const categoriesCount = categoriesMap.size;
        if (categoriesCount === 0) {
          await LoggerService.warning('UIDataFlow', '⚠️ No se encontraron categorías');
        } else {
          await LoggerService.success('UIDataFlow', `✅ Se encontraron ${categoriesCount} categorías diferentes`);
          
          // Muestra las primeras 5 categorías y su conteo
          const topCategories = Array.from(categoriesMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
            
          await LoggerService.debug('UIDataFlow', '📊 Top 5 categorías:', 
            topCategories.map(([cat, count]) => `${cat}: ${count}`).join(', '));
        }
      } catch (error) {
        await LoggerService.error('UIDataFlow', '❌ Error al procesar categorías', error);
      }
      
      // 6. Si se proporciona el contexto, verificar su contenido
      if (contextValue) {
        await LoggerService.debug('UIDataFlow', '🔄 Verificando estado del contexto HimnosContext');
        
        // Verificar propiedades clave del contexto
        const contextKeys = ['metaHimnos', 'categorizedData', 'isLoading', 'searchQuery'];
        const contextStatus = {};
        
        contextKeys.forEach(key => {
          if (contextValue.hasOwnProperty(key)) {
            if (key === 'metaHimnos') {
              contextStatus[key] = Array.isArray(contextValue[key]) ? 
                `Array(${contextValue[key].length})` : 
                String(contextValue[key]);
            } else if (key === 'categorizedData') {
              contextStatus[key] = Array.isArray(contextValue[key]) ? 
                `Array(${contextValue[key].length})` : 
                String(contextValue[key]);
            } else {
              contextStatus[key] = String(contextValue[key]);
            }
          } else {
            contextStatus[key] = 'MISSING';
          }
        });
        
        await LoggerService.debug('UIDataFlow', '🔄 Estado del contexto:', JSON.stringify(contextStatus, null, 2));
        
        // Verificar datos categorizados
        if (contextValue.categorizedData) {
          if (Array.isArray(contextValue.categorizedData) && contextValue.categorizedData.length > 0) {
            await LoggerService.success('UIDataFlow', `✅ categorizedData contiene ${contextValue.categorizedData.length} categorías`);
          } else {
            await LoggerService.error('UIDataFlow', '❌ categorizedData está vacío o no es un array');
          }
        } else {
          await LoggerService.error('UIDataFlow', '❌ categorizedData no está disponible en el contexto');
        }
      }
      
      // 7. Verificar el estado de caché para ver si está interfiriendo
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        const cachedData = await AsyncStorage.getItem('himnosMetadata');
        
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          if (parsed && parsed.data) {
            await LoggerService.debug('UIDataFlow', `📦 Datos en caché: ${parsed.data.length} himnos, timestamp: ${new Date(parsed.timestamp).toLocaleString()}`);
            
            // Comparar con los datos actuales
            if (metaHimnos.length !== parsed.data.length) {
              await LoggerService.warning('UIDataFlow', `⚠️ Discrepancia: ${metaHimnos.length} himnos en memoria vs ${parsed.data.length} en caché`);
            }
          }
        } else {
          await LoggerService.debug('UIDataFlow', '📦 No hay datos en caché');
        }
      } catch (error) {
        await LoggerService.error('UIDataFlow', '❌ Error al verificar caché', error);
      }
      
      await LoggerService.success('UI', '✅ Diagnóstico de flujo de datos a UI completado');
      return true;
    } catch (error) {
      await LoggerService.error('UI', '❌ Error en diagnóstico de flujo de datos a UI', error);
      return false;
    }
  }

  
  /**
   * Realiza un diagnóstico del sistema de búsqueda
   */
  static async runSearchDiagnostics(db, metaHimnos) {
    await LoggerService.info('UI', '🔬 Iniciando diagnóstico de búsqueda');

    // Limpiar logs relevantes
    await LoggerService.clearCategoryLogs(['Search']);
    
    try {
      // Verificar disponibilidad de datos para búsqueda
      await LoggerService.info('Search', '🔍 Verificando disponibilidad de datos para búsqueda');
      
      if (!metaHimnos || !Array.isArray(metaHimnos) || metaHimnos.length === 0) {
        await LoggerService.error('Search', '❌ No hay datos disponibles para búsqueda');
        return false;
      }
      
      await LoggerService.success('Search', `✅ Datos disponibles: ${metaHimnos.length} himnos`);
      
      // Probar búsqueda por número
      await LoggerService.info('Search', '🔢 Probando búsqueda por número');
      
      // Buscar un número que sabemos existe
      const numeroExistente = metaHimnos.length > 0 ? metaHimnos[0].number : '1';
      const resultadosNumero = metaHimnos.filter(h => h.number && h.number.toString() === numeroExistente);
      
      if (resultadosNumero.length > 0) {
        await LoggerService.success('Search', `✅ Búsqueda por número "${numeroExistente}" encontró ${resultadosNumero.length} resultados`);
      } else {
        await LoggerService.warning('Search', `⚠️ Búsqueda por número "${numeroExistente}" no encontró resultados`);
      }
      
      // Probar búsqueda por título
      await LoggerService.info('Search', '📝 Probando búsqueda por título');
      
      // Usar una palabra común que debería estar en varios títulos
      const palabraComun = metaHimnos.length > 0 ? 
        metaHimnos[0].title.split(' ')[0] : 'amor';
      
      const resultadosTitulo = metaHimnos.filter(h => 
        h.title && h.title.toLowerCase().includes(palabraComun.toLowerCase())
      );
      
      if (resultadosTitulo.length > 0) {
        await LoggerService.success('Search', `✅ Búsqueda por título "${palabraComun}" encontró ${resultadosTitulo.length} resultados`);
      } else {
        await LoggerService.warning('Search', `⚠️ Búsqueda por título "${palabraComun}" no encontró resultados`);
      }
      
      // Probar búsqueda en contenido
      if (db) {
        await LoggerService.info('Search', '📄 Probando búsqueda en contenido');
        try {
          const contentResults = await searchHymnContent(db, palabraComun);
          
          if (contentResults && contentResults.length > 0) {
            await LoggerService.success('Search', `✅ Búsqueda en contenido encontró ${contentResults.length} resultados`);
          } else {
            await LoggerService.warning('Search', '⚠️ Búsqueda en contenido no encontró resultados');
          }
        } catch (error) {
          await LoggerService.error('Search', '❌ Error en búsqueda de contenido', error);
        }
      }
      
      await LoggerService.success('UI', '✅ Diagnóstico de búsqueda completado');
      return true;
    } catch (error) {
      await LoggerService.error('UI', '❌ Error en diagnóstico de búsqueda', error);
      return false;
    }
  }
  
  /**
   * Realizar diagnóstico de archivos
   */
  static async runFileSystemDiagnostics() {
    await LoggerService.info('UI', '🔬 Iniciando diagnóstico de sistema de archivos');
    
    // Limpiar logs relevantes
    await LoggerService.clearCategoryLogs(['FileSystem']);
    
    try {
      await LoggerService.info('FileSystem', '📁 Analizando directorios de la aplicación');
      
      // Verificar directorio documentos
      const docDir = FileSystem.documentDirectory;
      const docDirInfo = await FileSystem.getInfoAsync(docDir);
      
      await LoggerService.debug('FileSystem', `📂 Directorio documentos: ${docDir}`);
      await LoggerService.debug('FileSystem', `✅ Existe: ${docDirInfo.exists}, Tamaño: ${docDirInfo.size || 'N/A'}`);
      
      try {
        // Listar archivos
        const docFiles = await FileSystem.readDirectoryAsync(docDir);
        await LoggerService.debug('FileSystem', `📋 Archivos en directorio documentos (${docFiles.length}): ${docFiles.join(', ')}`);
        
        // Analizar espacio en disco
        const freeSpace = await FileSystem.getFreeDiskStorageAsync();
        const totalSpace = await FileSystem.getTotalDiskCapacityAsync();
        
        await LoggerService.debug('FileSystem', `💾 Espacio libre: ${Math.round(freeSpace / (1024*1024))} MB`);
        await LoggerService.debug('FileSystem', `💾 Espacio total: ${Math.round(totalSpace / (1024*1024))} MB`);
        await LoggerService.debug('FileSystem', `📊 Porcentaje libre: ${Math.round((freeSpace/totalSpace)*100)}%`);
        
      } catch (error) {
        await LoggerService.error('FileSystem', '❌ Error al listar archivos', error);
      }
      
      await LoggerService.success('UI', '✅ Diagnóstico del sistema de archivos completado');
      return true;
    } catch (error) {
      await LoggerService.error('UI', '❌ Error en diagnóstico del sistema de archivos', error);
      return false;
    }
  }
  
  /**
   * Realizar un diagnóstico completo del sistema
   */
  static async runFullDiagnostics(db, metaHimnos) {
    await LoggerService.info('UI', '🔬 Iniciando diagnóstico completo del sistema');
    
    try {
      // Ejecutar todos los diagnósticos
      await this.runDbDiagnostics();
      await this.runHimnoDiagnostics(db, metaHimnos);
      await this.runCacheDiagnostics();
      await this.runSearchDiagnostics(db, metaHimnos);
      await this.runFileSystemDiagnostics();
      
      await LoggerService.success('UI', '✅ Diagnóstico completo finalizado exitosamente');
      return true;
    } catch (error) {
      await LoggerService.error('UI', '❌ Error en diagnóstico completo', error);
      return false;
    }
  }
  
  /**
   * Retorna las categorías disponibles para filtrado de logs
   */
  static getDiagnosticCategories() {
    return [
      { id: 'all', name: 'Todos los logs', icon: 'list' },
      { id: 'Setup', name: 'Base de datos', icon: 'server' },
      { id: 'Cache', name: 'Caché', icon: 'save' },
      { id: 'DataService', name: 'Servicio de datos', icon: 'cube' },
      { id: 'HimnosData', name: 'Datos de himnos', icon: 'musical-notes' },
      { id: 'Search', name: 'Búsqueda', icon: 'search' },
      { id: 'RecentHymns', name: 'Himnos recientes', icon: 'time' },
      { id: 'UI', name: 'Interfaz de usuario', icon: 'phone-portrait' },
      { id: 'FileSystem', name: 'Sistema de archivos', icon: 'folder' },
      { id: 'Diagnostics', name: 'Diagnóstico', icon: 'analytics' },
      { id: 'UIDataFlow', name: 'Flujo de datos UI', icon: 'code' },
    ];
  }
  
  /**
   * Retorna los tipos de diagnóstico disponibles
   */
  static getDiagnosticTypes() {
    return [
      { 
        id: 'database', 
        title: 'Diagnóstico de Base de Datos', 
        description: 'Verifica archivos, conexión y estructura de la base de datos',
        icon: 'server',
        action: this.runDbDiagnostics
      },
      { 
        id: 'hymnData', 
        title: 'Diagnóstico de Datos de Himnos', 
        description: 'Verifica carga de metadatos de himnos y procesamiento',
        icon: 'musical-notes',
        action: this.runHimnoDiagnostics
      },
      { 
        id: 'cache', 
        title: 'Diagnóstico de Caché', 
        description: 'Verifica almacenamiento y recuperación de datos en caché',
        icon: 'save',
        action: this.runCacheDiagnostics
      },
      { 
        id: 'search', 
        title: 'Diagnóstico de Búsqueda', 
        description: 'Prueba el sistema de búsqueda de himnos',
        icon: 'search',
        action: this.runSearchDiagnostics
      },
      { 
        id: 'filesystem', 
        title: 'Diagnóstico del Sistema de Archivos', 
        description: 'Verifica acceso a archivos y espacio disponible',
        icon: 'folder',
        action: this.runFileSystemDiagnostics
      },
      { 
        id: 'uidataflow', 
        title: 'Diagnóstico de Flujo a UI', 
        description: 'Verifica el camino de datos desde BD hasta componentes',
        icon: 'code',
        action: this.runUIDataFlowDiagnostics
      },

      { 
        id: 'all', 
        title: 'Diagnóstico Completo', 
        description: 'Ejecuta todas las pruebas de diagnóstico',
        icon: 'layers',
        action: this.runFullDiagnostics
      }
    ];
  }
}

export default DiagnosticsService;