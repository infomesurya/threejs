import { useEffect, useState } from "react";

/**
 * Global game state for track and off-road status
 * Used to share state between Car and HUD components
 */
let gameState = {
  isOnTrack: true,
  offTrackDuration: 0,
  offTrackMessage: "",
  resetPosition: null, // Timestamp when reset is requested
  gameStatus: 'start', // 'start', 'playing', 'finished'
};

const listeners = new Set();

export function updateGameState(updates) {
  gameState = { ...gameState, ...updates };
  listeners.forEach((callback) => callback(gameState));
}

export function useGameState() {
  const [state, setState] = useState(gameState);

  useEffect(() => {
    const handleUpdate = (newState) => setState(newState);
    listeners.add(handleUpdate);
    return () => listeners.delete(handleUpdate);
  }, []);

  return state;
}

export function getGameState() {
  return gameState;
}

const gameStateExport = { useGameState, updateGameState, getGameState };
export default gameStateExport;
