export type GameStatus = "playing" | "completed" | "dropped" | "wishlist";

export interface Game {
  id: string;
  title: string;
  platform: string;
  genre: string;
  status: GameStatus;
  rating: number | null;
  notes: string;
  coverUrl: string;
  addedAt: string;
}
