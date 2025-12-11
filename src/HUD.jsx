// HUD component: lap timer and mini speedometer
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Html } from "@react-three/drei";

import { updateGameState, useGameState, getGameState } from "./systems/gameStateStore";

export function HUD() {
    const [lapTime, setLapTime] = useState(0);
    const [speed, setSpeed] = useState(0);
    const [timeLeft, setTimeLeft] = useState("1:00.0"); // 60 seconds
    const startRef = useRef(0);

    // Game state
    const { isOnTrack, gameStatus } = useGameState();

    useFrame((state, delta) => {
        const currentStatus = getGameState().gameStatus;

        if (currentStatus === 'playing') {
            const now = Date.now();
            // Calculate remaining time
            const elapsed = (now - startRef.current) / 1000;
            const remaining = Math.max(60 - elapsed, 0);
            setTimeLeft(remaining.toFixed(1));

            if (remaining <= 0) {
                updateGameState({ gameStatus: 'finished' });
            }

            // Format timer as MM:SS
            const minutes = Math.floor(remaining / 60);
            const seconds = (remaining % 60).toFixed(1);
            const timeString = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            setTimeLeft(timeString);

            // Update traditional lap timer (counting up)
            setLapTime(elapsed.toFixed(2));

            // Speed logic
            const camPos = state.camera.position;
            setSpeed((camPos.length() * 0.1).toFixed(1));
        }
    });

    const startGame = () => {
        startRef.current = Date.now();
        updateGameState({ gameStatus: 'playing', resetPosition: Date.now() });
    };

    return (
        <>
            {/* Gameplay HUD */}
            {gameStatus === 'playing' && (
                <Html position={[0, 0, 0]} style={{ position: "absolute", top: "10px", right: "10px", color: "white", fontFamily: "Arial", pointerEvents: "none" }}>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "24px", fontWeight: "bold", color: parseFloat(timeLeft) < 10 ? "#ff3333" : "white" }}>
                            Time: {timeLeft}
                        </div>
                        <div>Lap: {lapTime}s</div>
                        <div>Speed: {speed} km/h</div>
                        <div style={{ color: "#00ff88", marginTop: "10px", fontSize: "12px" }}>
                            💡 Press K for DR-style camera
                        </div>
                    </div>
                </Html>
            )}

            {/* Start Screen */}
            {gameStatus === 'start' && (
                <Html center>
                    <div style={{
                        background: "rgba(0, 0, 0, 0.8)",
                        padding: "40px",
                        borderRadius: "20px",
                        textAlign: "center",
                        color: "white",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        minWidth: "400px",
                        pointerEvents: "auto" // Ensure button works
                    }}>
                        <h1 style={{ fontSize: "48px", margin: "0 0 20px 0", background: "linear-gradient(45deg, #00ff88, #00bdff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            RACING GAME
                        </h1>
                        <p style={{ fontSize: "18px", color: "#aaa", marginBottom: "30px" }}>
                            Complete as many laps as you can in 60 seconds!
                        </p>
                        <button
                            onClick={startGame}
                            style={{
                                background: "#00ff88",
                                color: "#000",
                                border: "none",
                                padding: "15px 40px",
                                borderRadius: "30px",
                                fontSize: "24px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                transition: "transform 0.2s"
                            }}
                            onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
                            onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                        >
                            START GAME
                        </button>
                    </div>
                </Html>
            )}

            {/* Game Over Screen */}
            {gameStatus === 'finished' && (
                <Html center>
                    <div style={{
                        background: "rgba(0, 0, 0, 0.9)",
                        padding: "40px",
                        borderRadius: "20px",
                        textAlign: "center",
                        color: "white",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        minWidth: "400px",
                        pointerEvents: "auto" // Ensure button works
                    }}>
                        <h1 style={{ fontSize: "48px", margin: "0 0 10px 0", color: "#ff3333" }}>
                            TIME'S UP!
                        </h1>
                        <div style={{ fontSize: "24px", marginBottom: "30px" }}>
                            Final Score: {lapTime}s
                        </div>
                        <button
                            onClick={startGame}
                            style={{
                                background: "linear-gradient(45deg, #00aaff, #00ff88)",
                                color: "#000",
                                border: "none",
                                padding: "15px 40px",
                                borderRadius: "30px",
                                fontSize: "24px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                transition: "all 0.2s"
                            }}
                            onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
                            onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                        >
                            PLAY AGAIN
                        </button>
                    </div>
                </Html>
            )}

            {/* Out of Bounds Dialog (Only shows when playing) */}
            {(!isOnTrack && gameStatus === 'playing') && (
                <Html center>
                    <div style={{
                        background: "rgba(0, 0, 0, 0.85)",
                        padding: "30px",
                        borderRadius: "15px",
                        color: "white",
                        textAlign: "center",
                        border: "2px solid #ff3333",
                        boxShadow: "0 0 20px rgba(255, 51, 51, 0.5)",
                        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                        minWidth: "300px",
                        backdropFilter: "blur(5px)"
                    }}>
                        <h2 style={{ color: "#ff3333", margin: "0 0 15px 0", textTransform: "uppercase", letterSpacing: "2px" }}>
                            ⚠ Out of Bounds
                        </h2>
                        <p style={{ marginBottom: "20px", fontSize: "1.1em" }}>
                            You have left the race track!
                        </p>
                        <button
                            onClick={() => updateGameState({ resetPosition: Date.now() })}
                            style={{
                                background: "linear-gradient(45deg, #ff3333, #ff6666)",
                                color: "white",
                                border: "none",
                                padding: "12px 24px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontSize: "16px",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                                transition: "transform 0.1s",
                                boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
                            }}
                            onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                            onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                        >
                            Return to Track
                        </button>
                    </div>
                </Html>
            )}
        </>
    );
}
