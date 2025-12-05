import { z } from "zod";

// Diccionarios de traducción (ID -> Nombre legible)
const PLATFORM_NAMES: Record<string, string> = {
  'ps5': 'PlayStation 5',
  'xbox': 'Xbox Series X',
  'switch': 'Nintendo Switch',
  'pc': 'PC',
  'multi': 'Multiplataforma'
};

const GENRE_NAMES: Record<string, string> = {
  'action': 'Acción',
  'rpg': 'RPG',
  'strategy': 'Estrategia',
  'adventure': 'Aventura',
  'sports': 'Deportes',
  'puzzle': 'Puzzle',
  'racing': 'Carreras',
  'shooter': 'Disparos',
  'simulation': 'Simulación'
};

// Schema para Plataforma (Backend: id, nombre)
export const PlatformSchema = z.object({
  id: z.string(),
  nombre: z.string(),
});

// Schema para Género
export const GenreSchema = z.object({
  id: z.string(),
  nombre: z.string(),
});

// Schema para Producto (Mapeando respuesta del Backend)
export const ProductSchema = z.object({
  _id: z.string(),
  nombre: z.string(),
  descripcion: z.string(),
  precio: z.number(),
  stock: z.number().default(0),
  imagenUrl: z.string().nullable().optional(),
  // Manejamos el caso de que venga poblado (objeto) o solo ID (string)
  plataformaId: z.union([z.string(), PlatformSchema]),
  generoId: z.union([z.string(), GenreSchema]),
  tipo: z.enum(['Fisico', 'Digital']),
  desarrollador: z.string(),
  calificacion: z.number().default(0),
  fechaLanzamiento: z.string().or(z.date()).optional(),
}).transform((data) => {
  
  // Lógica de resolución de Plataforma
  let platformData = { id: 'unknown', name: 'Plataforma' };
  if (typeof data.plataformaId === 'object') {
     platformData = { 
       id: (data.plataformaId as any)._id || (data.plataformaId as any).id, 
       name: data.plataformaId.nombre 
     };
  } else if (typeof data.plataformaId === 'string') {
     // AQUÍ ESTÁ EL ARREGLO: Buscamos el nombre en el diccionario
     const pId = data.plataformaId;
     platformData = { 
       id: pId, 
       name: PLATFORM_NAMES[pId] || pId // Si no existe en el mapa, usa el ID original
     };
  }

  // Lógica de resolución de Género
  let genreData = { id: 'unknown', name: 'Género' };
  if (typeof data.generoId === 'object') {
     genreData = { 
       id: (data.generoId as any)._id || (data.generoId as any).id, 
       name: data.generoId.nombre 
     };
  } else if (typeof data.generoId === 'string') {
     // AQUÍ ESTÁ EL ARREGLO: Buscamos el nombre en el diccionario
     const gId = data.generoId;
     genreData = { 
       id: gId, 
       name: GENRE_NAMES[gId] || gId 
     };
  }

  return {
    id: data._id,
    name: data.nombre,
    description: data.descripcion,
    price: data.precio,
    stock: data.stock,
    imageId: data.imagenUrl && (data.imagenUrl.startsWith('http') || data.imagenUrl.startsWith('/')) 
      ? data.imagenUrl 
      : "/placeholder.png",
    platform: platformData,
    genre: genreData,
    type: data.tipo === 'Fisico' ? 'Physical' : 'Digital',
    developer: data.desarrollador,
    rating: data.calificacion,
    releaseDate: data.fechaLanzamiento ? new Date(data.fechaLanzamiento).toISOString() : new Date().toISOString()
  };
});

export type Product = z.infer<typeof ProductSchema>;
