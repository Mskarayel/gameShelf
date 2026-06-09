import { useState } from "react";
import type { Game } from "../types/game";
import { useGames } from "../hooks/useGames";
import { GameForm } from "../components/GameForm";
import { GameList } from "../components/GameList";

export function meta() {
  return [
    { title: "GameShelf" },
    { name: "description", content: "Oyun koleksiyonunu takip et" },
  ];
}

export default function Home() {
  const { games, add, update, remove } = useGames();
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [showForm, setShowForm] = useState(false);

  function handleSubmit(game: Game) {
    if (editingGame) {
      update(game);
      setEditingGame(null);
    } else {
      add(game);
    }
    setShowForm(false);
  }

  function handleEdit(game: Game) {
    setEditingGame(game);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancel() {
    setEditingGame(null);
    setShowForm(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-indigo-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎮</span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">GameShelf</h1>
              <p className="text-xs text-indigo-200">Oyun koleksiyonun</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-indigo-200">
              {games.length} oyun
            </span>
            <button
              onClick={() => {
                setEditingGame(null);
                setShowForm((v) => !v);
              }}
              className="bg-white text-indigo-700 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-indigo-50 transition"
            >
              {showForm && !editingGame ? "Kapat" : "+ Oyun Ekle"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {showForm && (
          <GameForm
            onSubmit={handleSubmit}
            editingGame={editingGame}
            onCancel={handleCancel}
          />
        )}

        <GameList games={games} onEdit={handleEdit} onDelete={remove} />
      </main>
    </div>
  );
}
