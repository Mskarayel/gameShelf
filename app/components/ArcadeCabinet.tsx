import { useState } from "react";
import type { Game, GameStatus } from "../types/game";

// ─── Types & constants ────────────────────────────────────────────────────────

type FilterValue = GameStatus | "all";

const FILTERS: { value: FilterValue; color: string; label: string }[] = [
  { value: "all",       color: "#60a5fa", label: "Tümü"       },
  { value: "playing",   color: "#4ade80", label: "Oynuyor"    },
  { value: "completed", color: "#c9a84c", label: "Tamamlandı" },
  { value: "wishlist",  color: "#f87171", label: "İstek"      },
];

const SLOTS_PER_SHELF = 5;

// ─── Web Audio coin sound ─────────────────────────────────────────────────────

function playChing() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx() as AudioContext;
    const t = ctx.currentTime;

    // Main metallic tone
    const o1 = ctx.createOscillator();
    const g1 = ctx.createGain();
    o1.type = "sine";
    o1.frequency.setValueAtTime(3400, t);
    o1.frequency.exponentialRampToValueAtTime(1700, t + 0.14);
    g1.gain.setValueAtTime(0.38, t);
    g1.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
    o1.connect(g1);
    g1.connect(ctx.destination);
    o1.start(t);
    o1.stop(t + 0.42);

    // High-freq metallic bite
    const o2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    o2.type = "square";
    o2.frequency.setValueAtTime(5200, t);
    o2.frequency.exponentialRampToValueAtTime(2600, t + 0.07);
    g2.gain.setValueAtTime(0.1, t);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    o2.connect(g2);
    g2.connect(ctx.destination);
    o2.start(t);
    o2.stop(t + 0.12);
  } catch {
    // AudioContext not available — silent fail
  }
}

// ─── ArcadeCabinet ────────────────────────────────────────────────────────────

interface ArcadeCabinetProps {
  games: Game[];
  onGameClick: (game: Game) => void;
}

export function ArcadeCabinet({ games, onGameClick }: ArcadeCabinetProps) {
  const [zoomingId, setZoomingId]   = useState<string | null>(null);
  const [filter, setFilter]         = useState<FilterValue>("all");
  const [coinBounce, setCoinBounce] = useState(false);

  function handleClick(game: Game) {
    setZoomingId(game.id);
    setTimeout(() => {
      setZoomingId(null);
      onGameClick(game);
    }, 340);
  }

  function handleCoin() {
    playChing();
    setCoinBounce(true);
    setTimeout(() => setCoinBounce(false), 300);
  }

  // Filter & build shelves
  const filteredGames =
    filter === "all" ? games : games.filter((g) => g.status === filter);

  const shelfCount = Math.max(3, Math.ceil(filteredGames.length / SLOTS_PER_SHELF) + 1);
  const shelves = Array.from({ length: shelfCount }, (_, i) =>
    Array.from({ length: SLOTS_PER_SHELF }, (_, j) => filteredGames[i * SLOTS_PER_SHELF + j] ?? null)
  );

  return (
    <div style={{ maxWidth: "840px", margin: "0 auto" }}>

      {/* ── MARQUEE ── */}
      <div style={{ position: "relative" }}>
        <svg viewBox="0 0 840 72" style={{ display: "block", width: "100%" }} preserveAspectRatio="none">
          <polygon points="28,2 812,2 840,71 0,71" fill="#0c1a10" />
          <polygon points="28,2 812,2 840,71 0,71" fill="none" stroke="#c9a84c" strokeWidth="2.5" />
          {Array.from({ length: 8 }, (_, i) => (
            <line key={`l${i}`} x1={68 + i * 16} y1="16" x2={68 + i * 16} y2="56"
              stroke="#c9a84c" strokeWidth="1" opacity="0.3" />
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <line key={`r${i}`} x1={572 + i * 16} y1="16" x2={572 + i * 16} y2="56"
              stroke="#c9a84c" strokeWidth="1" opacity="0.3" />
          ))}
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <span style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "clamp(1.1rem, 3.5vw, 2rem)",
            fontWeight: 700,
            color: "#c9a84c",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            textShadow: "0 0 22px rgba(201,168,76,0.75), 0 0 6px rgba(201,168,76,0.4)",
          }}>
            ★ GAMESHELF ★
          </span>
        </div>
      </div>

      {/* ── CABINET BODY ── */}
      <div style={{ backgroundColor: "#1a3a2a", borderLeft: "3px solid #c9a84c", borderRight: "3px solid #c9a84c" }}>
        <div style={{ padding: "14px 20px", backgroundColor: "#0c1a10" }}>
          <div style={{ border: "3px solid #c9a84c", backgroundColor: "#06080a", position: "relative", overflow: "hidden" }}>
            {/* CRT scanlines */}
            <div style={{ position: "absolute", inset: 0,
              background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.12) 3px,rgba(0,0,0,0.12) 4px)",
              pointerEvents: "none", zIndex: 3 }} />
            {/* CRT vignette */}
            <div style={{ position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,0.55) 100%)",
              pointerEvents: "none", zIndex: 3 }} />

            <div className="shelf-screen" style={{ position: "relative", zIndex: 1, maxHeight: "450px", overflowY: "auto", overflowX: "hidden", padding: "14px 14px 4px" }}>
              {/* Empty state overlay */}
              {filteredGames.length === 0 && (
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 4, pointerEvents: "none", gap: "0.5rem" }}>
                  <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: "clamp(1.4rem, 4vw, 2.2rem)", color: "#2a3020", letterSpacing: "0.3em", textTransform: "uppercase" }}>
                    {games.length === 0 ? "INSERT COIN" : "FİLTRE BOŞTU"}
                  </span>
                  <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: "0.7rem", color: "#1e261a", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                    {games.length === 0 ? "Koleksiyon boş. İlk oyununu ekle." : "Bu kategoride hiç oyun yok."}
                  </span>
                </div>
              )}
              {shelves.map((shelf, si) => (
                <ShelfRow key={si} slots={shelf} zoomingId={zoomingId} onGameClick={handleClick} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTROL PANEL ── */}
      <div style={{ position: "relative" }}>
        {/* Trapezoid background */}
        <svg viewBox="0 0 840 88" style={{ display: "block", width: "100%" }} preserveAspectRatio="none">
          <polygon points="0,0 840,0 808,87 32,87" fill="#1a3a2a" />
          <line x1="0"  y1="1"  x2="840" y2="1"  stroke="#c9a84c" strokeWidth="2.5" />
          <line x1="32" y1="86" x2="808" y2="86" stroke="#c9a84c" strokeWidth="1" opacity="0.4" />
        </svg>

        {/* Interactive content overlay */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 7%" }}>

          {/* Joystick (decorative) */}
          <div style={{ position: "relative", width: "44px", height: "44px", flexShrink: 0 }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: "#0a1408", border: "1.5px solid #c9a84c" }} />
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "17px", height: "17px", borderRadius: "50%", backgroundColor: "#c9a84c" }} />
            {/* Cross lines */}
            {[0, 1].map((i) => (
              <div key={i} style={{ position: "absolute", top: "50%", left: "50%", transform: `translate(-50%,-50%) rotate(${i * 90}deg)`, width: "38px", height: "1px", backgroundColor: "#c9a84c", opacity: 0.18 }} />
            ))}
          </div>

          {/* Filter buttons */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {FILTERS.map((f) => {
              const active = filter === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  title={f.label}
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    backgroundColor: f.color,
                    border: active ? `2px solid #fff` : `2px solid ${f.color}`,
                    opacity: active ? 1 : 0.55,
                    cursor: "pointer",
                    boxShadow: active ? `0 0 14px ${f.color}, 0 0 5px ${f.color}` : "none",
                    transition: "opacity 0.15s, box-shadow 0.15s",
                    padding: 0,
                    flexShrink: 0,
                  }}
                />
              );
            })}
          </div>

          {/* Coin slot */}
          <button
            onClick={handleCoin}
            title="Ching!"
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
              flexShrink: 0,
              transform: coinBounce ? "translateY(2px)" : "translateY(0)",
              transition: "transform 0.1s",
            }}
          >
            <svg width="72" height="34" viewBox="0 0 72 34">
              {/* Housing */}
              <rect x="2"  y="2"  width="68" height="30" rx="6"
                fill="#080a06" stroke="#c9a84c" strokeWidth="1.5" />
              {/* Slit opening */}
              <rect x="10" y="13" width="52" height="8" rx="4"
                fill="#020302" stroke="#c9a84c" strokeWidth="1" />
              {/* Shine inside slit */}
              <rect x="12" y="14" width="48" height="2" rx="1"
                fill="#c9a84c" opacity="0.12" />
              {/* Side ridges */}
              <line x1="7"  y1="9"  x2="7"  y2="25" stroke="#c9a84c" strokeWidth="0.75" opacity="0.3" />
              <line x1="65" y1="9"  x2="65" y2="25" stroke="#c9a84c" strokeWidth="0.75" opacity="0.3" />
              {/* Drop arrow */}
              <text x="36" y="30" textAnchor="middle"
                fill="#c9a84c" fontSize="5" fontFamily="Oswald, sans-serif"
                letterSpacing="2" opacity="0.45">
                COIN
              </text>
            </svg>
          </button>

          {/* LED + game count */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            {/* LED */}
            <div style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#4ade80",
              boxShadow: "0 0 8px #4ade80, 0 0 3px #4ade80",
              animation: "ledPulse 1.8s ease-in-out infinite",
              flexShrink: 0,
            }} />
            <button style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: "clamp(0.65rem, 1.4vw, 0.85rem)",
              fontWeight: 600,
              color: "#c9a84c",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              backgroundColor: "transparent",
              border: "1px solid rgba(201,168,76,0.35)",
              padding: "0.2rem 0.6rem",
              cursor: "default",
            }}>
              ▶ {filteredGames.length} OYUN
            </button>
          </div>

        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ height: "54px", backgroundColor: "#1a3a2a", borderLeft: "3px solid #c9a84c", borderRight: "3px solid #c9a84c", borderBottom: "3px solid #c9a84c", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: "10px" }}>
        <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: "0.58rem", color: "#c9a84c", opacity: 0.3, letterSpacing: "0.22em", textTransform: "uppercase" }}>
          SAMET'İN KOLEKSİYONU • 2025
        </span>
      </div>

      {/* ── LEGS ── */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0 72px" }}>
        {[0, 1].map((i) => (
          <div key={i} style={{ width: "58px", height: "26px", backgroundColor: "#1a3a2a", borderLeft: i === 0 ? "3px solid #c9a84c" : "1px solid #3a5030", borderRight: i === 1 ? "3px solid #c9a84c" : "1px solid #3a5030", borderBottom: "3px solid #c9a84c" }} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ShelfRow
// ─────────────────────────────────────────────────────────────────────────────

interface ShelfRowProps {
  slots: (Game | null)[];
  zoomingId: string | null;
  onGameClick: (game: Game) => void;
}

function ShelfRow({ slots, zoomingId, onGameClick }: ShelfRowProps) {
  return (
    <div>
      <div style={{ display: "flex", gap: "8px" }}>
        {slots.map((game, i) =>
          game ? (
            <GameSlot key={i} game={game} zooming={zoomingId === game.id} onClick={() => onGameClick(game)} />
          ) : (
            <EmptySlot key={i} />
          )
        )}
      </div>
      {/* Shelf board */}
      <div style={{ height: "11px", background: "linear-gradient(180deg,#6a4018 0%,#3a2008 35%,#1e1005 100%)", borderBottom: "2px solid rgba(201,168,76,0.55)", margin: "0 0 12px", boxShadow: "0 5px 10px rgba(0,0,0,0.8)" }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GameSlot
// ─────────────────────────────────────────────────────────────────────────────

interface GameSlotProps {
  game: Game;
  zooming: boolean;
  onClick: () => void;
}

function GameSlot({ game, zooming, onClick }: GameSlotProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={game.title}
      style={{ flex: 1, minWidth: 0, height: "132px", padding: 0, border: hovered ? "1px solid #c9a84c" : "1px solid #1e1c10", cursor: "pointer", position: "relative", overflow: "hidden", backgroundColor: "#132b1e", display: "block", animation: zooming ? "thumbnailZoom 0.34s ease" : "none", filter: hovered ? "brightness(1.3)" : "brightness(0.95)", transition: "border-color 0.12s, filter 0.12s" }}
    >
      {game.coverUrl ? (
        <img src={game.coverUrl} alt={game.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
      ) : (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px", padding: "6px" }}>
          <span style={{ fontSize: "1.3rem", color: "#c9a84c", opacity: 0.5 }}>▣</span>
          <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: "0.55rem", color: "#c9a84c", opacity: 0.8, textAlign: "center", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical" as const, letterSpacing: "0.04em", lineHeight: 1.3 }}>
            {game.title}
          </span>
        </div>
      )}
      {hovered && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent,rgba(0,0,0,0.88))", padding: "18px 4px 4px", pointerEvents: "none" }}>
          <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: "0.58rem", color: "#c9a84c", letterSpacing: "0.04em", display: "block", textAlign: "center", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
            {game.title}
          </span>
        </div>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EmptySlot
// ─────────────────────────────────────────────────────────────────────────────

function EmptySlot() {
  return (
    <div style={{ flex: 1, minWidth: 0, height: "132px", border: "1px dashed #1a1c12", backgroundColor: "#070905", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.28 }}>
      <span style={{ fontSize: "0.5rem", color: "#2a2c1a", letterSpacing: "0.35em" }}>· · ·</span>
    </div>
  );
}
