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
      <div
        style={{
          textAlign: "center",
          padding: "5rem 1rem",
          border: "1px dashed #3a3528",
        }}
      >
        <p
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "3rem",
            color: "#3a3528",
            marginBottom: "1rem",
            letterSpacing: "0.1em",
          }}
        >
          INSERT COIN
        </p>
        <p
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "1rem",
            color: "#8a8070",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Rafın boş duruyor. Koleksiyonuna ilk oyunu ekle.
        </p>
        <p
          style={{
            fontSize: "0.8rem",
            color: "#3a3528",
            marginTop: "0.5rem",
          }}
        >
          Yukarıdaki "+ Oyun Ekle" butonuna bas, başlayalım.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "1rem",
      }}
    >
      {games.map((game) => (
        <GameCard key={game.id} game={game} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
