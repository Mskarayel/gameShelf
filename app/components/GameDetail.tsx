import type { Game, GameStatus } from "../types/game";

interface GameDetailProps {
  game: Game;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const statusConfig: Record<GameStatus, { label: string; color: string; bg: string }> = {
  playing:   { label: "Oynuyor",       color: "#4ade80", bg: "rgba(20,83,45,0.55)"  },
  completed: { label: "Tamamlandı",    color: "#c9a84c", bg: "rgba(26,58,42,0.55)"  },
  dropped:   { label: "Bırakıldı",     color: "#f87171", bg: "rgba(59,16,16,0.55)"  },
  wishlist:  { label: "İstek Listesi", color: "#94a3b8", bg: "rgba(30,41,59,0.55)"  },
};

export function GameDetail({ game, onBack, onEdit, onDelete }: GameDetailProps) {
  const s = statusConfig[game.status];

  return (
    /* Backdrop */
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(6,5,3,0.92)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onBack}
    >
      {/* Panel */}
      <div
        style={{
          backgroundColor: "#18160e",
          border: "2px solid #c9a84c",
          maxWidth: "780px",
          width: "100%",
          display: "flex",
          maxHeight: "88vh",
          overflow: "hidden",
          animation: "fadeInDetail 0.28s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Left: Cover ── */}
        <div
          style={{
            width: "clamp(150px, 28%, 250px)",
            flexShrink: 0,
            backgroundColor: "#1a3a2a",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "320px",
          }}
        >
          {game.coverUrl ? (
            <img
              src={game.coverUrl}
              alt={game.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <span style={{ fontSize: "3.5rem", color: "#c9a84c", opacity: 0.25 }}>▣</span>
          )}
          {/* Gold right edge */}
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: "2px",
              backgroundColor: "#c9a84c",
              opacity: 0.5,
            }}
          />
        </div>

        {/* ── Right: Info ── */}
        <div
          style={{
            flex: 1,
            padding: "1.75rem 2rem",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          {/* Back */}
          <button
            onClick={onBack}
            style={{
              alignSelf: "flex-start",
              backgroundColor: "transparent",
              color: "#5a5040",
              border: "none",
              fontFamily: "'Oswald', sans-serif",
              fontSize: "0.72rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: "pointer",
              padding: 0,
              marginBottom: "1.25rem",
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#c9a84c")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#5a5040")}
          >
            ← Dolaba Dön
          </button>

          {/* Status badge */}
          <div
            style={{
              alignSelf: "flex-start",
              backgroundColor: s.bg,
              color: s.color,
              border: `1px solid ${s.color}`,
              fontFamily: "'Oswald', sans-serif",
              fontSize: "0.62rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "0.15rem 0.65rem",
              marginBottom: "0.65rem",
            }}
          >
            {s.label}
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: "clamp(1.35rem, 3.5vw, 2rem)",
              fontWeight: 700,
              color: "#e8e0d0",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              lineHeight: 1.1,
              marginBottom: "0.4rem",
            }}
          >
            {game.title}
          </h1>

          {/* Platform / Genre */}
          <p
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: "0.82rem",
              color: "#c9a84c",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: 0.7,
              marginBottom: "1.1rem",
            }}
          >
            {game.platform}
            {game.genre ? ` · ${game.genre}` : ""}
          </p>

          {/* Divider */}
          <div
            style={{ height: "1px", backgroundColor: "#2a2618", marginBottom: "1.1rem" }}
          />

          {/* Rating */}
          {game.rating !== null && (
            <div style={{ marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
              <span
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "#c9a84c",
                  lineHeight: 1,
                }}
              >
                ★ {game.rating}
              </span>
              <span
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: "0.95rem",
                  color: "#5a5040",
                }}
              >
                / 10
              </span>
            </div>
          )}

          {/* Notes */}
          {game.notes && (
            <p
              style={{
                fontSize: "0.875rem",
                color: "#9a9080",
                lineHeight: 1.7,
                borderLeft: "2px solid #3a3520",
                paddingLeft: "0.85rem",
                marginBottom: "1.25rem",
                fontStyle: "italic",
              }}
            >
              {game.notes}
            </p>
          )}

          {/* Date added */}
          <p
            style={{
              fontSize: "0.68rem",
              color: "#3a3520",
              letterSpacing: "0.06em",
              marginBottom: "auto",
            }}
          >
            Eklenme:{" "}
            {new Date(game.addedAt).toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid #2a2618",
              marginTop: "1.5rem",
            }}
          >
            <button
              onClick={onEdit}
              style={{
                flex: 1,
                backgroundColor: "transparent",
                color: "#c9a84c",
                border: "2px solid #c9a84c",
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 700,
                fontSize: "0.82rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "0.6rem 0",
                cursor: "pointer",
              }}
            >
              Düzenle
            </button>
            <button
              onClick={onDelete}
              style={{
                flex: 1,
                backgroundColor: "transparent",
                color: "#f87171",
                border: "2px solid #3a1010",
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 700,
                fontSize: "0.82rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "0.6rem 0",
                cursor: "pointer",
              }}
            >
              Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
