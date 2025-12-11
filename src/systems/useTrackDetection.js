import { useFrame } from "@react-three/fiber";
import { useState, useRef } from "react";

/**
 * useTrackDetection: Detects if car is on track or off-road
 * Returns isOnTrack and trackDistance
 */
export function useTrackDetection(chassisBody) {
  const [isOnTrack, setIsOnTrack] = useState(true);
  const [offTrackDuration, setOffTrackDuration] = useState(0);
  const lastCheckRef = useRef(0);

  // Track boundaries (approximate from Track.jsx collider positions)
  const trackBounds = {
    minX: -8,
    maxX: 3,
    minZ: -6,
    maxZ: 4,
  };

  useFrame(() => {
    if (!chassisBody?.current) return;

    const carPos = chassisBody.current.position;
    const now = Date.now();

    // Check every 100ms
    if (now - lastCheckRef.current > 100) {
      lastCheckRef.current = now;

      const onTrack =
        carPos.x >= trackBounds.minX &&
        carPos.x <= trackBounds.maxX &&
        carPos.z >= trackBounds.minZ &&
        carPos.z <= trackBounds.maxZ;

      if (!onTrack) {
        setOffTrackDuration((prev) => prev + 0.1);
      } else {
        setOffTrackDuration(0);
      }

      setIsOnTrack(onTrack);
    }
  });

  return {
    isOnTrack,
    offTrackDuration,
    trackBounds,
  };
}

export default useTrackDetection;
