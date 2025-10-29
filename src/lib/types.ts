export type Platform = {
  id: string;
  name: string;
};

export type Genre = {
  id: string;
  name: string;
};

export type Game = {
  id: string;
  name: string;
  description: string;
  price: number;
  platform: Platform;
  genre: Genre;
  type: 'Digital' | 'Physical';
  releaseDate: string;
  developer: string;
  imageId: string;
  rating: number;
};
