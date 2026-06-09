import type { Game, GameStatus } from "../types/game";

interface GameCardProps {
  game: Game;
  onEdit: (game: Game) => void;
  onDelete: (id: string) => void;
}

const statusLabels: Record<GameStatus, { label: string; color: string }> = {
  playing: { label: "Oynuyor", color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  completed: { label: "Tamamlandı", color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
  dropped: { label: "Bırakıldı", color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
  wishlist: { label: "İstek Listesi", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" },
};

export function GameCard({ game, onEdit, onDelete }: GameCardProps) {
  const status = statusLabels[game.status];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-shadow">
      <div className="relative h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        {game.coverUrl ? (
          <img
            src={game.coverUrl}
            alt={game.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <span className="text-4xl select-none">🎮</span>
        )}
        <span
          className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full ${status.color}`}
        >
          {status.label}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base truncate">
          {game.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {game.platform}
          {game.genre ? ` · ${game.genre}` : ""}
        </p>

        {game.rating !== null && (
          <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mt-1">
            ★ {game.rating}/10
          </p>
        )}

        {game.notes && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {game.notes}
          </p>
        )}

        <div className="mt-auto pt-3 flex gap-2">
          <button
            onClick={() => onEdit(game)}
            className="flex-1 text-xs bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-medium py-1.5 rounded-lg transition"
          >
            Düzenle
          </button>
          <button
            onClick={() => onDelete(game.id)}
            className="flex-1 text-xs bg-red-50 hover:bg-red-100 dark:bg-red-950 dark:hover:bg-red-900 text-red-600 dark:text-red-400 font-medium py-1.5 rounded-lg transition"
          >
            Sil
          </button>
        </div>
      </div>
    </div>
  );
}
