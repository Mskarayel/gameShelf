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

const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#1c1a17",
  border: "1px solid #3a3528",
  color: "#e8e0d0",
  padding: "0.5rem 0.75rem",
  fontSize: "0.875rem",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "'Oswald', sans-serif",
  fontSize: "0.75rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: "#c9a84c",
  marginBottom: "0.35rem",
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: "#242018",
        border: "1px solid #3a3528",
        borderLeft: "3px solid #c9a84c",
        padding: "1.5rem",
      }}
    >
      <h2
        style={{
          fontFamily: "'Oswald', sans-serif",
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "#c9a84c",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: "1.25rem",
        }}
      >
        {editingGame ? "// Kaydı Güncelle" : "// Yeni Oyun Ekle"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Oyun Adı *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="örn: Red Dead Redemption 2"
          />
        </div>

        <div>
          <label style={labelStyle}>Platform *</label>
          <input
            name="platform"
            value={form.platform}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="PC, PS5, Xbox, Switch..."
          />
        </div>

        <div>
          <label style={labelStyle}>Tür</label>
          <input
            name="genre"
            value={form.genre}
            onChange={handleChange}
            style={inputStyle}
            placeholder="RPG, FPS, Strateji..."
          />
        </div>

        <div>
          <label style={labelStyle}>Durum</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            <option value="wishlist">İstek Listesi</option>
            <option value="playing">Oynuyor</option>
            <option value="completed">Tamamlandı</option>
            <option value="dropped">Bırakıldı</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Puan (1-10)</label>
          <input
            name="rating"
            type="number"
            min="1"
            max="10"
            value={form.rating}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Opsiyonel"
          />
        </div>

        <div>
          <label style={labelStyle}>Kapak Resmi URL</label>
          <input
            name="coverUrl"
            value={form.coverUrl}
            onChange={handleChange}
            style={inputStyle}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="mt-4">
        <label style={labelStyle}>Notlar</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={2}
          style={{ ...inputStyle, resize: "none" }}
          placeholder="Kısa not ekleyebilirsin..."
        />
      </div>

      <div className="flex gap-3 mt-5">
        <button
          type="submit"
          style={{
            flex: 1,
            backgroundColor: "#c9a84c",
            color: "#1a3a2a",
            border: "none",
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 700,
            fontSize: "0.875rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "0.6rem 0",
            cursor: "pointer",
          }}
        >
          {editingGame ? "Güncelle" : "Koleksiyona Ekle"}
        </button>
        {editingGame && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              backgroundColor: "transparent",
              color: "#8a8070",
              border: "1px solid #3a3528",
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 600,
              fontSize: "0.875rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "0.6rem 0",
              cursor: "pointer",
            }}
          >
            İptal
          </button>
        )}
      </div>
    </form>
  );
}
