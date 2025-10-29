"use client";

import React, { useState, useMemo } from 'react';
import type { Game } from '@/lib/types';
import { GameCard } from './game-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { platforms, genres } from '@/lib/data';
import { Slider } from '@/components/ui/slider';
import { formatCurrency } from '@/lib/utils';
import { ListFilter } from 'lucide-react';

interface GameCatalogProps {
  games: Game[];
}

export function GameCatalog({ games }: GameCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 70]);

  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPlatform = selectedPlatform === 'all' || game.platform.id === selectedPlatform;
      const matchesGenre = selectedGenre === 'all' || game.genre.id === selectedGenre;
      const matchesPrice = game.price >= priceRange[0] && game.price <= priceRange[1];
      return matchesSearch && matchesPlatform && matchesGenre && matchesPrice;
    });
  }, [games, searchQuery, selectedPlatform, selectedGenre, priceRange]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedPlatform('all');
    setSelectedGenre('all');
    setPriceRange([0, 70]);
  };

  return (
    <section className="py-12 md:py-16">
      <div className="space-y-4 mb-8">
        <h2 className="font-headline text-3xl font-bold md:text-4xl">Explore Our Collection</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <Input
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="md:col-span-2"
          />
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              {platforms.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {genres.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="space-y-2 md:col-span-2 lg:col-span-3">
            <label className="text-sm font-medium">Price Range</label>
            <div className='flex items-center gap-4'>
                <Slider
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value)}
                    max={70}
                    step={1}
                />
                <div className="text-sm font-semibold w-32 text-center">{formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}</div>
            </div>
          </div>
          <Button onClick={resetFilters} variant="outline" className="w-full">
            <ListFilter className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>
        </div>
      </div>

      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="font-headline text-2xl font-bold">No Games Found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your filters to find your next adventure.</p>
        </div>
      )}
    </section>
  );
}
