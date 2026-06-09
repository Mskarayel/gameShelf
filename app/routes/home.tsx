import { useState } from "react";
import type { Game } from "../types/game";
import { useGames } from "../hooks/useGames";
import { ArcadeCabinet } from "../components/ArcadeCabinet";
import { GameDetail } from "../components/GameDetail";
import { GameForm } from "../components/GameForm";

export function meta() {
  return [
    { title: "GameShelf" },
    { name: "description", content: "Oyun koleksiyonunu takip et" },
  ];
}

// ── Neon sign component ───────────────────────────────────────────────────────

interface NeonSignProps {
  text: string;
  color: string;
  animation: string;
  duration?: string;
  fontSize?: string;
}

function NeonSign({ text, color, animation, duration = "4s", fontSize = "1rem" }: NeonSignProps) {
  const glow = `0 0 4px ${color}, 0 0 14px ${color}, 0 0 30px ${color}88, 0 0 55px ${color}44`;
  return (
    <span
      style={{
        fontFamily: "'Oswald', sans-serif",
        fontSize,
        fontWeight: 700,
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        color,
        textShadow: glow,
        animation: `${animation} ${duration} infinite`,
        userSelect: "none",
        pointerEvents: "none",
        display: "block",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );
}

// ── Brick wall background (CSS gradient staggered pattern) ────────────────────

const wallBackground: React.CSSProperties = {
  backgroundColor: "#0a0805",
  backgroundImage: "linear-gradient(rgba(10,8,5,0.75), rgba(10,8,5,0.75)), url('/brick.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundAttachment: "fixed",
};

// ─────────────────────────────────────────────────────────────────────────────

export default function Home() {
  const { games, add, update, remove } = useGames();
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [editingGame, setEditingGame]   = useState<Game | null>(null);
  const [showForm, setShowForm]         = useState(false);

  function openAdd() {
    setEditingGame(null);
    setShowForm(true);
  }

  function openEdit() {
    if (!selectedGame) return;
    setEditingGame(selectedGame);
    setSelectedGame(null);
    setShowForm(true);
  }

  function handleDelete() {
    if (!selectedGame) return;
    remove(selectedGame.id);
    setSelectedGame(null);
  }

  function handleFormSubmit(game: Game) {
    if (editingGame) update(game);
    else add(game);
    setEditingGame(null);
    setShowForm(false);
  }

  function handleFormCancel() {
    setEditingGame(null);
    setShowForm(false);
  }

  return (
    <div style={{ minHeight: "100vh", ...wallBackground, position: "relative", overflow: "hidden" }}>

      {/* ── NEON SIGNS (z-index: 1, behind cabinet) ── */}

      {/* GAME OVER — sol orta, hafif eğik */}
      <div style={{ position: "fixed", left: "18px", top: "44%", zIndex: 1, transform: "rotate(-5deg)", transformOrigin: "left center" }}>
        <NeonSign text="GAME OVER" color="#ff3030" animation="neonFlicker" duration="5s" fontSize="1.45rem" />
      </div>

      {/* INSERT COIN — sağ taraf, yukarıdan 1/3 */}
      <div style={{ position: "fixed", right: "18px", top: "32%", zIndex: 1 }}>
        <NeonSign text="INSERT COIN" color="#30aaff" animation="neonBreath" duration="3s" fontSize="0.9rem" />
      </div>

      {/* HIGH SCORE — sol alt, dolabın yanına yakın */}
      <div style={{ position: "fixed", left: "18px", bottom: "80px", zIndex: 1 }}>
        <NeonSign text="HIGH SCORE" color="#ff30ff" animation="neonBreath2" duration="3.5s" fontSize="1.1rem" />
      </div>

      {/* PLAY MORE — sağ alt köşe, küçük, sarı neon */}
      <div style={{ position: "fixed", right: "18px", bottom: "22px", zIndex: 1 }}>
        <NeonSign text="PLAY MORE" color="#c9a84c" animation="neonBreath" duration="4.5s" fontSize="0.72rem" />
      </div>

      {/* ── MAIN CONTENT (z-index: 2, above neon signs) ── */}
      <div style={{ position: "relative", zIndex: 2, padding: "1.25rem 1rem 2.5rem" }}>

        {/* Top bar */}
        <div style={{ maxWidth: "840px", margin: "0 auto 1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: "0.72rem", color: "#3a3520", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            {games.length} Oyun Koleksiyonda
          </span>
          <button
            onClick={openAdd}
            style={{ backgroundColor: "#c9a84c", color: "#1a3a2a", border: "none", fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.45rem 1.15rem", cursor: "pointer" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.backgroundColor = "#e0be60")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.backgroundColor = "#c9a84c")}
          >
            + Oyun Ekle
          </button>
        </div>

        {/* Cabinet with glow wrapper */}
        <div style={{ position: "relative", maxWidth: "840px", margin: "0 auto" }}>
          {/* Ambient glow behind cabinet */}
          <div style={{
            position: "absolute",
            inset: "-50px -30px",
            background: "radial-gradient(ellipse 85% 65% at 50% 50%, rgba(26,58,42,0.5) 0%, rgba(201,168,76,0.1) 45%, transparent 70%)",
            filter: "blur(22px)",
            pointerEvents: "none",
            zIndex: 0,
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <ArcadeCabinet games={games} onGameClick={setSelectedGame} />
          </div>
        </div>

        {/* ── Floor strip ── */}
        <div style={{ maxWidth: "980px", margin: "-2px auto 0", position: "relative", zIndex: 0, overflow: "hidden" }}>
          <div style={{
            height: "70px",
            backgroundColor: "#2a1f0e",
            backgroundImage: [
              // Main wood plank lines (vertical grain)
              "repeating-linear-gradient(90deg, transparent 0px, transparent 36px, rgba(0,0,0,0.18) 36px, rgba(0,0,0,0.18) 38px)",
              // Subtle secondary grain
              "repeating-linear-gradient(89deg, transparent 0px, transparent 62px, rgba(255,255,255,0.025) 62px, rgba(255,255,255,0.025) 64px)",
            ].join(", "),
            transform: "perspective(600px) rotateX(16deg)",
            transformOrigin: "top center",
            boxShadow: "inset 0 18px 32px rgba(0,0,0,0.9), inset 0 -2px 6px rgba(201,168,76,0.06), 0 6px 16px rgba(0,0,0,0.6)",
            borderTop: "1px solid rgba(201,168,76,0.12)",
          }} />
        </div>

        {/* Game Detail modal */}
        {selectedGame && (
          <GameDetail
            game={selectedGame}
            onBack={() => setSelectedGame(null)}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}

        {/* Add/Edit Form modal */}
        {showForm && (
          <div
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(6,5,3,0.9)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", animation: "fadeInDetail 0.25s ease" }}
            onClick={handleFormCancel}
          >
            <div
              style={{ maxWidth: "680px", width: "100%", maxHeight: "90vh", overflowY: "auto" }}
              onClick={(e) => e.stopPropagation()}
            >
              <GameForm editingGame={editingGame} onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
