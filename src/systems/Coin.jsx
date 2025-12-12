import { useBox } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { addScore } from "./profileStore";
import { useGameState } from "./gameStateStore";

export function Coin({ position = [0, 0.5, 0], onCollect }) {
  const [ref] = useBox(() => ({
    type: "Static",
    args: [0.3, 0.1, 0.3],
    position,
    isTrigger: true,
  }));

  const [collected, setCollected] = useState(false);
  const rotationRef = useRef(0);
  const { isOnTrack } = useGameState();

  useFrame(() => {
    if (!ref.current || collected) return;

    // Rotate coin
    rotationRef.current += 0.05;
    ref.current.rotation.y = rotationRef.current;
    ref.current.rotation.x = Math.sin(rotationRef.current * 0.5) * 0.3;

    // Bounce up and down
    ref.current.position.y = position[1] + Math.sin(rotationRef.current * 0.03) * 0.2;
  });

  const handleCollect = () => {
    // Only collect coins when on track
    if (!collected && isOnTrack) {
      setCollected(true);
      addScore(10); // 10 points per coin
      if (onCollect) onCollect(position);
    }
  };

  if (collected) return null;

  return (
    <mesh
      ref={ref}
      onClick={handleCollect}
    >
      {/* Coin geometry - cylinder */}
      <cylinderGeometry args={[0.15, 0.15, 0.05, 32]} />
      <meshStandardMaterial
        color="#FFD700"
        metalness={0.8}
        roughness={0.2}
        emissive="#FFAA00"
        emissiveIntensity={0.5}
      />
      
      {/* Glow effect */}
      <mesh position={[0, 0, 0]} scale={1.2}>
        <cylinderGeometry args={[0.18, 0.18, 0.04, 32]} />
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.3}
        />
      </mesh>
    </mesh>
  );
}

export default Coin;
