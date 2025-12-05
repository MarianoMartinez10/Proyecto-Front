"use client";

import React, { useState, useEffect } from 'react';
import { GameCard } from './game-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { platforms, genres } from '@/lib/data';
import { Loader2, ListFilter, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Game } from '@/lib/types';
import { ApiClient } from '@/lib/api-client';

interface GameCatalogProps {
  initialGames: Game[];
}

export function GameCatalog({ initialGames }: GameCatalogProps) {
  // Estado para los filtros
  const [games, setGames] = useState<Game[]>(initialGames || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [loading, setLoading] = useState(false);
  
  // Estado para la paginación
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Efecto principal: Recargar productos cuando cambia CUALQUIER filtro
  useEffect(() => {
    const fetchFilteredGames = async () => {
      setLoading(true);
      try {
        const response = await ApiClient.getProducts({
          page,
          limit: 8,
          search: searchQuery,
          platform: selectedPlatform, // Ahora enviamos la plataforma
          genre: selectedGenre        // Ahora enviamos el género
        });

        if (Array.isArray(response)) {
           setGames(response);
        } else {
           setGames(response.products);
           setTotalPages(response.meta?.totalPages || 1);
        }
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce solo para la búsqueda de texto para no saturar la API
    const timeoutId = setTimeout(() => {
        fetchFilteredGames();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, page, selectedPlatform, selectedGenre]); // Añadimos dependencias críticas

  // Resetear paginación si cambian los filtros (UX Mejorada)
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedPlatform, selectedGenre]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedPlatform('all');
    setSelectedGenre('all');
    setPage(1);
  };

  return (
    <section className="py-12 md:py-16">
      <div className="space-y-4 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="font-headline text-3xl font-bold md:text-4xl">Explorar Colección</h2>
        </div>
        
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end bg-muted/30 p-6 rounded-lg border border-border/50">
          <Input
            placeholder="Buscar por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="md:col-span-2 bg-background"
          />
          
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Plataforma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las Plataformas</SelectItem>
              {platforms.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Género" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Géneros</SelectItem>
              {genres.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
            </SelectContent>
          </Select>

          <Button onClick={resetFilters} variant="outline" className="w-full border-dashed md:col-start-4">
            <ListFilter className="mr-2 h-4 w-4" />
            Limpiar Filtros
          </Button>
        </div>
      </div>

      {/* Grid de Productos */}
      {loading ? (
        <div className="py-24 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        </div>
      ) : games.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
          
          {/* Paginación */}
          <div className="flex justify-center items-center gap-4 mt-12">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              Página {page} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-24 bg-muted/20 rounded-lg border-2 border-dashed">
          <h3 className="font-headline text-2xl font-bold">No se encontraron juegos</h3>
          <p className="text-muted-foreground mt-2">Prueba seleccionando "Todas" o "Todos" para ver el catálogo completo.</p>
          <Button onClick={resetFilters} variant="link" className="mt-4 text-primary">
            Limpiar filtros
          </Button>
        </div>
      )}
    </section>
  );
}
