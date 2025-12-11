import { useEffect, useState } from "react";

/**
 * Profile management - stores player scores and game state
 */
let profileState = {
  playerName: "Player",
  totalScore: 0,
  coinsCollected: 0,
  gamesPlayed: 0,
  bestScore: 0,
};

const profileListeners = new Set();

export function updateProfile(updates) {
  profileState = { ...profileState, ...updates };
  profileListeners.forEach((callback) => callback(profileState));
}

export function useProfile() {
  const [profile, setProfile] = useState(profileState);

  useEffect(() => {
    const handleUpdate = (newProfile) => setProfile(newProfile);
    profileListeners.add(handleUpdate);
    return () => profileListeners.delete(handleUpdate);
  }, []);

  return profile;
}

export function addScore(points) {
  updateProfile({
    totalScore: profileState.totalScore + points,
    coinsCollected: profileState.coinsCollected + 1,
    bestScore: Math.max(profileState.bestScore, profileState.totalScore + points),
  });
}

export function resetGameScore() {
  updateProfile({
    totalScore: 0,
    coinsCollected: 0,
    gamesPlayed: profileState.gamesPlayed + 1,
  });
}

const profileExport = { useProfile, addScore, resetGameScore, updateProfile };
export default profileExport;
