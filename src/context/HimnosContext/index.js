// import { createContext } from 'react';
// export { HimnosProvider } from './HimnosProvider';

// // Crear y exportar el contexto
// export const HimnosContext = createContext();

import { createContext } from 'react';

// Crear y exportar el contexto
export const HimnosContext = createContext();

// Exportar el proveedor desde un archivo aparte sin importarlo directamente
export { HimnosProvider } from './HimnosProvider';