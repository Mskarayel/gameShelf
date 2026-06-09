import type { Game, GameStatus } from "../types/game";

interface GameCardProps {
  game: Game;
  onEdit: (game: Game) => void;
  onDelete: (id: string) => void;
}

const statusConfig: Record<GameStatus, { label: string; color: string; bg: string }> = {
  playing:   { label: "Oynuyor",       color: "#4ade80", bg: "#14532d" },
  completed: { label: "Tamamlandı",    color: "#c9a84c", bg: "#1a3a2a" },
  dropped:   { label: "Bırakıldı",     color: "#f87171", bg: "#3b1010" },
  wishlist:  { label: "İstek Listesi", color: "#94a3b8", bg: "#1e293b" },
};

export function GameCard({ game, onEdit, onDelete }: GameCardProps) {
  const s = statusConfig[game.status];

  return (
    <div
      style={{
        backgroundColor: "#242018",
        border: "1px solid #3a3528",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Cover */}
      <div
        style={{
          position: "relative",
          height: "10rem",
          backgroundColor: "#1a3a2a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {game.coverUrl ? (
          <img
            src={game.coverUrl}
            alt={game.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <span style={{ fontSize: "2.5rem", opacity: 0.4 }}>▣</span>
        )}
        <span
          style={{
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            backgroundColor: s.bg,
            color: s.color,
            border: `1px solid ${s.color}`,
            fontFamily: "'Oswald', sans-serif",
            fontSize: "0.65rem",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            padding: "0.15rem 0.5rem",
          }}
        >
          {s.label}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: "0.85rem", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "1rem",
            fontWeight: 600,
            color: "#e8e0d0",
            letterSpacing: "0.03em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            marginBottom: "0.2rem",
          }}
        >
          {game.title}
        </h3>

        <p style={{ fontSize: "0.75rem", color: "#8a8070", marginBottom: "0.4rem" }}>
          {game.platform}
          {game.genre ? ` · ${game.genre}` : ""}
        </p>

        {game.rating !== null && (
          <p
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: "0.85rem",
              color: "#c9a84c",
              fontWeight: 600,
              marginBottom: "0.3rem",
            }}
          >
            ★ {game.rating} / 10
          </p>
        )}

        {game.notes && (
          <p
            style={{
              fontSize: "0.72rem",
              color: "#8a8070",
              marginBottom: "0.5rem",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical" as const,
              overflow: "hidden",
            }}
          >
            {game.notes}
          </p>
        )}

        {/* Buttons */}
        <div style={{ marginTop: "auto", paddingTop: "0.75rem", display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => onEdit(game)}
            style={{
              flex: 1,
              backgroundColor: "transparent",
              color: "#c9a84c",
              border: "1px solid #c9a84c",
              fontFamily: "'Oswald', sans-serif",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding: "0.35rem 0",
              cursor: "pointer",
            }}
          >
            Düzenle
          </button>
          <button
            onClick={() => onDelete(game.id)}
            style={{
              flex: 1,
              backgroundColor: "transparent",
              color: "#f87171",
              border: "1px solid #3a3528",
              fontFamily: "'Oswald', sans-serif",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding: "0.35rem 0",
              cursor: "pointer",
            }}
          >
            Sil
          </button>
        </div>
      </div>
    </div>
  );
}
