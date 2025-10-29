import { GameCatalog } from '@/components/game/game-catalog';
import { allGames } from '@/lib/data';

export default function ProductosPage() {
  return (
    <div className="container mx-auto px-4">
      <GameCatalog games={allGames} />
    </div>
  );
}
