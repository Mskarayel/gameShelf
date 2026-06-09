import type { Game } from "../types/game";

const STORAGE_KEY = "gameshelf_games";

export function getGames(): Game[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveGames(games: Game[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
}

export function addGame(game: Game): void {
  const games = getGames();
  saveGames([...games, game]);
}

export function updateGame(updated: Game): void {
  const games = getGames();
  saveGames(games.map((g) => (g.id === updated.id ? updated : g)));
}

export function deleteGame(id: string): void {
  const games = getGames();
  saveGames(games.filter((g) => g.id !== id));
}
