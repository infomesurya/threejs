import React, { useState } from "react";
import { useProfile, resetGameScore } from "./profileStore";
import { useGameState } from "./gameStateStore";

/**
 * ProfileHUD: Displays player profile, score, and game controls
 */
function ProfileHUD() {
  const profile = useProfile();
  const { isOnTrack } = useGameState();
  const [showNameInput, setShowNameInput] = useState(false);
  const [inputName, setInputName] = useState(profile.playerName);

  const handleRestartGame = () => {
    // Reset game score but keep profile
    resetGameScore();
    // Reload page to restart game
    window.location.reload();
  };

  const handleNameChange = () => {
    if (inputName.trim()) {
      // Update profile with new name
      const { updateProfile } = require("./profileStore");
      updateProfile({ playerName: inputName.trim() });
      setShowNameInput(false);
    }
  };

  const profileStyle = {
    position: "fixed",
    top: "20px",
    left: "20px",
    background: "linear-gradient(135deg, rgba(20,20,40,0.95), rgba(10,10,30,0.95))",
    padding: "20px",
    borderRadius: "12px",
    border: "2px solid #00ffff",
    boxShadow: "0 0 30px rgba(0,255,255,0.4)",
    color: "#fff",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    minWidth: "280px",
    zIndex: 1000,
  };

  const statsStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginTop: "15px",
  };

  const statBoxStyle = {
    background: "rgba(0,100,255,0.2)",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #0088ff",
    textAlign: "center",
  };

  const statValueStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#00ffff",
    marginBottom: "4px",
  };

  const statLabelStyle = {
    fontSize: "11px",
    color: "#88ccff",
  };

  const buttonStyle = {
    marginTop: "15px",
    padding: "10px 15px",
    background: "linear-gradient(135deg, #0088ff, #00ccff)",
    border: "none",
    borderRadius: "6px",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
    fontSize: "12px",
    transition: "all 0.3s",
  };

  const nameDisplayStyle = {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#00ffff",
    marginBottom: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const editButtonStyle = {
    background: "none",
    border: "none",
    color: "#00ffff",
    cursor: "pointer",
    fontSize: "12px",
    padding: "4px 8px",
  };

  return (
    <div style={profileStyle}>
      <style>{`
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 10px rgba(0,255,255,0.5); }
          50% { text-shadow: 0 0 20px rgba(0,255,255,1); }
        }
        .player-name { animation: glow 2s infinite; }
      `}</style>

      <div style={nameDisplayStyle}>
        <span className="player-name">{profile.playerName}</span>
        <button
          style={editButtonStyle}
          onClick={() => setShowNameInput(!showNameInput)}
          title="Edit name"
        >
          ✎
        </button>
      </div>

      {showNameInput && (
        <div style={{ marginBottom: "10px", display: "flex", gap: "8px" }}>
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            style={{
              flex: 1,
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #0088ff",
              background: "rgba(0,50,100,0.8)",
              color: "#00ffff",
              fontSize: "12px",
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleNameChange();
            }}
          />
          <button
            onClick={handleNameChange}
            style={{
              padding: "6px 10px",
              background: "#00ff88",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              color: "#000",
              fontSize: "11px",
            }}
          >
            OK
          </button>
        </div>
      )}

      <div style={statsStyle}>
        <div style={statBoxStyle}>
          <div style={statValueStyle}>{profile.coinsCollected}</div>
          <div style={statLabelStyle}>Coins This Game</div>
        </div>

        <div style={statBoxStyle}>
          <div style={statValueStyle}>{profile.totalScore}</div>
          <div style={statLabelStyle}>Score This Game</div>
        </div>

        <div style={statBoxStyle}>
          <div style={statValueStyle}>{profile.gamesPlayed}</div>
          <div style={statLabelStyle}>Games Played</div>
        </div>

        <div style={statBoxStyle}>
          <div style={statValueStyle}>{profile.bestScore}</div>
          <div style={statLabelStyle}>Best Score</div>
        </div>
      </div>

      <button
        style={buttonStyle}
        onClick={handleRestartGame}
        onMouseEnter={(e) => {
          e.target.style.background =
            "linear-gradient(135deg, #00ddff, #00aaff)";
          e.target.style.transform = "scale(1.02)";
        }}
        onMouseLeave={(e) => {
          e.target.style.background =
            "linear-gradient(135deg, #0088ff, #00ccff)";
          e.target.style.transform = "scale(1)";
        }}
      >
        🔄 RESTART GAME
      </button>

      <div style={{ marginTop: "15px", fontSize: "11px", color: "#88ccff" }}>
        <div>
          Status:{" "}
          <span style={{ color: isOnTrack ? "#00ff88" : "#ff3333" }}>
            {isOnTrack ? "🏁 On Track" : "⚠️ Off Road"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProfileHUD;
