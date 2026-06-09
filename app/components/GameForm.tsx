import { useState, useEffect } from "react";
import type { Game, GameStatus } from "../types/game";

interface GameFormProps {
  onSubmit: (game: Game) => void;
  editingGame: Game | null;
  onCancel: () => void;
}

const defaultForm = {
  title: "",
  platform: "",
  genre: "",
  status: "wishlist" as GameStatus,
  rating: "",
  notes: "",
  coverUrl: "",
};

export function GameForm({ onSubmit, editingGame, onCancel }: GameFormProps) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (editingGame) {
      setForm({
        title: editingGame.title,
        platform: editingGame.platform,
        genre: editingGame.genre,
        status: editingGame.status,
        rating: editingGame.rating?.toString() ?? "",
        notes: editingGame.notes,
        coverUrl: editingGame.coverUrl,
      });
    } else {
      setForm(defaultForm);
    }
  }, [editingGame]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const game: Game = {
      id: editingGame?.id ?? crypto.randomUUID(),
      title: form.title,
      platform: form.platform,
      genre: form.genre,
      status: form.status,
      rating: form.rating ? Number(form.rating) : null,
      notes: form.notes,
      coverUrl: form.coverUrl,
      addedAt: editingGame?.addedAt ?? new Date().toISOString(),
    };
    onSubmit(game);
    setForm(defaultForm);
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 space-y-4"
    >
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
        {editingGame ? "Oyunu Düzenle" : "Yeni Oyun Ekle"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Oyun Adı *
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Örn: The Witcher 3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Platform *
          </label>
          <input
            name="platform"
            value={form.platform}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Örn: PC, PS5, Xbox"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tür
          </label>
          <input
            name="genre"
            value={form.genre}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Örn: RPG, FPS, Strateji"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Durum
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="wishlist">İstek Listesi</option>
            <option value="playing">Oynuyor</option>
            <option value="completed">Tamamlandı</option>
            <option value="dropped">Bırakıldı</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Puan (1-10)
          </label>
          <input
            name="rating"
            type="number"
            min="1"
            max="10"
            value={form.rating}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Opsiyonel"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Kapak Resmi URL
          </label>
          <input
            name="coverUrl"
            value={form.coverUrl}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="https://..."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Notlar
        </label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={2}
          className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          placeholder="Kısa not..."
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition"
        >
          {editingGame ? "Güncelle" : "Ekle"}
        </button>
        {editingGame && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-2 rounded-lg transition"
          >
            İptal
          </button>
        )}
      </div>
    </form>
  );
}
