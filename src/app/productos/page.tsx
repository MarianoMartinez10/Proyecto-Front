import { GameCatalog } from '@/components/game/game-catalog';
import { ApiClient } from '@/lib/api-client';

export default async function ProductosPage() {
  // Nota: Esto se ejecuta en el servidor al cargar la página por primera vez
  const response = await ApiClient.getProducts({ page: 1, limit: 8 });
  
  // Extraemos el array, ya sea que venga directo o dentro de un objeto
  const games = Array.isArray(response) ? response : response.products;
  
  return (
    <div className="container mx-auto px-4">
      {/* Pasamos los juegos iniciales */}
      <GameCatalog initialGames={games} />
    </div>
  );
}