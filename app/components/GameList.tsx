import type { Game } from "../types/game";
import { GameCard } from "./GameCard";

interface GameListProps {
  games: Game[];
  onEdit: (game: Game) => void;
  onDelete: (id: string) => void;
}

export function GameList({ games, onEdit, onDelete }: GameListProps) {
  if (games.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400 dark:text-gray-600">
        <p className="text-5xl mb-4">🎮</p>
        <p className="text-lg font-medium">Henüz oyun eklenmedi.</p>
        <p className="text-sm mt-1">Yukarıdaki formu kullanarak ilk oyununu ekle!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {games.map((game) => (
        <GameCard key={game.id} game={game} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
