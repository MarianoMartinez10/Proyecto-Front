import type { Platform, Genre } from './types';

export const platforms: Platform[] = [
  { id: 'ps5', name: 'PlayStation 5' },
  { id: 'xbox', name: 'Xbox Series X' },
  { id: 'switch', name: 'Nintendo Switch' },
  { id: 'pc', name: 'PC' },
];

export const genres: Genre[] = [
  { id: 'action', name: 'Acción' },
  { id: 'rpg', name: 'RPG' },
  { id: 'strategy', name: 'Estrategia' },
  { id: 'adventure', name: 'Aventura' },
  { id: 'sports', name: 'Deportes' },
  { id: 'racing', name: 'Carreras' },
  { id: 'shooter', name: 'Disparos' },
  { id: 'simulation', name: 'Simulación' },
];

export const allGames: any[] = [];