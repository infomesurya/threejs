import React from "react";
import { useGameState } from "./gameStateStore";

/**
 * TrackStatusHUD: Displays track status and off-track warning
 */
function TrackStatusHUD() {
  const { isOnTrack, offTrackDuration } = useGameState();

  const statusStyle = {
    position: "fixed",
    bottom: "120px",
    left: "20px",
    background: isOnTrack
      ? "linear-gradient(135deg, rgba(0,100,0,0.9), rgba(0,50,0,0.95))"
      : "linear-gradient(135deg, rgba(150,0,0,0.95), rgba(100,0,0,0.95))",
    padding: "15px 20px",
    borderRadius: "10px",
    border: `2px solid ${isOnTrack ? "#00ff88" : "#ff3333"}`,
    boxShadow: isOnTrack
      ? "0 0 20px rgba(0,255,136,0.5)"
      : "0 0 30px rgba(255,51,51,0.8)",
    color: "#fff",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: "12px",
    minWidth: "220px",
    animation: !isOnTrack ? "pulse-warning 0.6s infinite" : "none",
  };

  const messageStyle = {
    marginTop: "8px",
    fontSize: "11px",
    color: isOnTrack ? "#aaa" : "#ffff00",
    fontWeight: isOnTrack ? "normal" : "bold",
  };

  return (
    <>
      <style>{`
        @keyframes pulse-warning {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>

      {/* Track Status */}
      <div style={statusStyle}>
        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
          {isOnTrack ? "🏁 ON TRACK" : "⚠️ OFF TRACK"}
        </div>
        <div style={messageStyle}>
          {isOnTrack
            ? "Drive carefully"
            : `Off track for ${offTrackDuration.toFixed(1)}s`}
        </div>
        {!isOnTrack && (
          <div style={{ marginTop: "8px", fontSize: "10px", color: "#ffff00" }}>
            ⚠️ Return to track immediately!
          </div>
        )}
      </div>
    </>
  );
}

export default TrackStatusHUD;
