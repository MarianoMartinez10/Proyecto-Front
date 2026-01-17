import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { platforms, genres } from '@/lib/data';
import { PixelHero } from '@/components/pixel-hero';
// ELIMINADA: import { GameRecommendations } from '@/components/game/recommendations';
import { CategoryCard } from '@/components/game/category-card';

// Mapeo de imágenes para géneros (Placeholders de alta calidad)
const genreImages: Record<string, string> = {
  action: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=600&auto=format&fit=crop", // Action/Gaming
  rpg: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=600&auto=format&fit=crop", // Fantasy
  strategy: "https://images.unsplash.com/photo-1535025183041-0991a977e25b?q=80&w=600&auto=format&fit=crop", // Strategy/Board
  adventure: "https://images.unsplash.com/photo-1627856013091-bf7405299498?q=80&w=600&auto=format&fit=crop", // Jungle/Adventure
  sports: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=600&auto=format&fit=crop", // Sports/Soccer
  racing: "https://images.unsplash.com/photo-1547754980-3df97fed72a8?q=80&w=600&auto=format&fit=crop", // Cars
  shooter: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?q=80&w=600&auto=format&fit=crop", // FPS controller
  simulation: "https://images.unsplash.com/photo-1593118247619-e2d6f056869e?q=80&w=600&auto=format&fit=crop", // Sim/Joystick
};

// Fallback image
const defaultImage = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600";

// Mapeo de imágenes para plataformas
const platformImages: Record<string, string> = {
  ps5: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=600&auto=format&fit=crop", // PS5 Controller/Console
  xbox: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=600&auto=format&fit=crop", // Xbox Series X
  switch: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?q=80&w=600&auto=format&fit=crop", // Switch Joycons
  pc: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=600&auto=format&fit=crop", // Gaming Setup
};

export default function Home() {
  return (
    <div className="flex flex-col gap-12 md:gap-16">
      {/* Reemplazamos el Hero antiguo con el nuevo PixelHero basado en la imagen sugerida */}
      <PixelHero />

      <div className="container mx-auto px-4 space-y-12 md:space-y-16">
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-headline text-3xl font-bold md:text-4xl text-center md:text-left">Explorar por Plataforma</h2>
            <Button variant="outline" asChild className="hidden md:flex">
              <Link href="/productos">Ver todo</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {platforms.map(platform => (
              <CategoryCard
                key={platform.id}
                title={platform.name}
                image={platformImages[platform.id] || defaultImage}
                href="/productos"
              />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" asChild className="w-full">
              <Link href="/productos">Ver todo</Link>
            </Button>
          </div>
        </section>

        {/* ELIMINADA: Sección de Recomendaciones IA */}

        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-headline text-3xl font-bold md:text-4xl text-center md:text-left">Explorar por Género</h2>
            <Button variant="outline" asChild className="hidden md:flex">
              <Link href="/productos">Ver todo</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {genres.map(genre => (
              <CategoryCard
                key={genre.id}
                title={genre.name}
                image={genreImages[genre.id] || defaultImage}
                href="/productos"
              />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" asChild className="w-full">
              <Link href="/productos">Ver todo</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}