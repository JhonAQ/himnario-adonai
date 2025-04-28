import LoggerService from "../../../services/LoggerService";

// Lista de categorías conocidas
const CATEGORIES = [
  'Espíritu Santo',
  'Vida de Cristo',
  'Coros',
  'Adoración y Alabanza',
  'Iglesia y Comunidad',
  'Arrepentimiento y Confesión',
  'Esperanza y Segunda Venida',
  'Bautismo y Santa Cena',
  'Oración y Devoción Personal',
  'Navidad y Pascua',
  'Funerales y Consuelo',
  'Niños y Escuela Dominical',
  'Misión y Evangelismo',
  'Consagración y Servicio',
];

/**
 * Obtiene todas las categorías disponibles con metadata
 */
export function getCategories(metadata) {
  if (!metadata) {
    LoggerService.warning('Categories', 'No hay datos para categorizar');
    return [];
  }

  try {
    return CATEGORIES.map((category) => {
      const hymns = metadata.filter(h => h.categories.includes(category));
      return {
        title: category,
        cantidad: hymns.length,
        ids: hymns.map(h => h.id)
      };
    }).filter(category => category.cantidad > 0);
  } catch (error) {
    LoggerService.error('Categories', 'Error al procesar categorías', error);
    return [];
  }
}

/**
 * Obtiene un himno del día basado en la fecha
 */
export function getHymnOfTheDay(metadata) {
  if (!metadata || !metadata.length) {
    return null;
  }
  
  try {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    
    // Crear un número basado en la fecha que sea consistente día a día
    const seed = dateString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Usar ese número para seleccionar un himno (módulo para mantenerlo dentro del rango)
    const index = seed % metadata.length;
    
    return metadata[index];
  } catch (error) {
    LoggerService.error('Categories', 'Error al obtener himno del día', error);
    return null;
  }
}