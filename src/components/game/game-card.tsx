"use client";

import Link from "next/link";
import Image from "next/image";
import type { Game } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatCurrency, cn } from "@/lib/utils";
import { Heart, ShoppingCart, Zap } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { PlatformIcon } from "../icons";
import { Badge } from "@/components/ui/badge";

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const isWishlisted = isInWishlist(game.id);
  const hasStock = game.stock !== undefined && game.stock > 0;

  // Manejo de URL de imagen robusto
  const imageUrl = (game.imageId && (game.imageId.startsWith('http') || game.imageId.startsWith('/')))
    ? game.imageId
    : "https://placehold.co/600x400/png?text=4Fun";

  return (
    <Link href={`/productos/${game.id}`} className="block h-full cursor-pointer" prefetch={false}>
      <Card
        className="group relative flex h-full flex-col overflow-hidden rounded-lg border-0 bg-transparent shadow-none transition-all duration-300 hover:bg-transparent"
        aria-labelledby={`game-title-${game.id}`}
      >
        {/* --- SECCIÓN DE IMAGEN (Cover Art) --- */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-muted mb-3 shadow-md group-hover:shadow-xl transition-all duration-300">
          <Image
            src={imageUrl}
            alt={`Portada de ${game.name}`}
            fill
            className={cn(
              "object-cover transition-transform duration-500 ease-out group-hover:scale-105",
              !hasStock && "grayscale opacity-60"
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />

          {/* Wishlist Button (Overlay - Top Right) */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <Button
              size="icon"
              variant="secondary"
              className={cn(
                "h-8 w-8 rounded-full backdrop-blur-md shadow-sm",
                isWishlisted ? "text-red-500 bg-white/90" : "text-foreground bg-background/80"
              )}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); // Stop link navigation
                toggleWishlist(game);
              }}
            >
              <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
            </Button>
          </div>

          {/* Details Overlay (Hover) - Moved from bottom */}
          <div className="absolute inset-x-0 bottom-0 p-3 flex flex-col justify-end gap-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-white/90 text-black backdrop-blur-sm border-0 font-bold">
                {game.platform?.name || 'Plataforma'}
              </Badge>
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-black/60 text-white backdrop-blur-sm border border-white/10">
                {game.genre?.name || 'Género'}
              </Badge>
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-primary/90 text-primary-foreground backdrop-blur-sm border-0">
                {game.type === 'Physical' ? 'Físico' : 'Key'}
              </Badge>
            </div>
          </div>

          {/* Badges Minimalistas (Overlay - Top Left - Only meaningful ones) */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {!hasStock && (
              <Badge variant="destructive" className="bg-red-500/90 shadow-sm text-[10px]">Agotado</Badge>
            )}
          </div>
        </div>

        {/* --- SECCIÓN DE INFO (Storefront Style) --- */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-col gap-0.5">
            <h3
              id={`game-title-${game.id}`}
              className="font-headline font-bold text-sm md:text-base leading-tight text-foreground truncate max-w-[180px] group-hover:text-primary transition-colors"
              title={game.name}
            >
              {game.name}
            </h3>
            {/* Removed Platform/Type text from here */}
          </div>

          <div className="flex flex-col items-end">
            <span className="font-bold text-base md:text-lg text-foreground bg-transparent">
              {formatCurrency(game.price)}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
