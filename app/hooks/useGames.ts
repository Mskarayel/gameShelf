import { useState, useEffect, useCallback } from "react";
import type { Game } from "../types/game";
import {
  getGames,
  addGame,
  updateGame,
  deleteGame,
} from "../utils/storage";

export function useGames() {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    setGames(getGames());
  }, []);

  const add = useCallback((game: Game) => {
    addGame(game);
    setGames(getGames());
  }, []);

  const update = useCallback((game: Game) => {
    updateGame(game);
    setGames(getGames());
  }, []);

  const remove = useCallback((id: string) => {
    deleteGame(id);
    setGames(getGames());
  }, []);

  return { games, add, update, remove };
}
