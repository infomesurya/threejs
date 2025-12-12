import { useBox } from "@react-three/cannon";
import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import useTrackDetection from "./systems/useTrackDetection";
import { updateGameState } from "./systems/gameStateStore";

export function Car({ thirdPerson, headlightsOn, carBodyRef }) {
  const carModel = useLoader(GLTFLoader, process.env.PUBLIC_URL + "/models/car.glb");
  const localRef = useRef(null);
  const effectiveRef = carBodyRef || localRef;
  
  const [chassisBody, chassisApi] = useBox(
    () => ({
      allowSleep: false,
      args: [0.5, 1, 2],
      mass: 150,
      position: [-1.5, 0.5, 3],
      linearDamping: 0.3,
      angularDamping: 0.5,
    }),
    effectiveRef
  );

  // Track detection
  const { isOnTrack, offTrackDuration } = useTrackDetection(chassisBody);

  // Keyboard state
  const keysRef = useRef({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysRef.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Auto-return car to track when off-road for too long
  useEffect(() => {
    if (offTrackDuration > 3 && !isOnTrack && chassisBody?.current) {
      chassisApi.position.set(-1.5, 1, 3);
      chassisApi.velocity.set(0, 0, 0);
      chassisApi.angularVelocity.set(0, 0, 0);
    }
  }, [offTrackDuration, isOnTrack, chassisBody, chassisApi]);

  // Update game state
  useEffect(() => {
    updateGameState({ isOnTrack, offTrackDuration });
  }, [isOnTrack, offTrackDuration]);

  useFrame(() => {
    if (!chassisApi) return;

    const { w, s, a, d, r, arrowup, arrowdown, arrowleft, arrowright } = keysRef.current;

    // Only allow movement on track
    if (!isOnTrack) {
      // Apply braking when off track
      chassisApi.velocity.set(
        chassisApi.velocity.current[0] * 0.92,
        chassisApi.velocity.current[1],
        chassisApi.velocity.current[2] * 0.92
      );
      return;
    }

    // Get current velocity to avoid losing it
    const vel = chassisApi.velocity.current || [0, 0, 0];

    // Forward/Backward movement
    if (w) {
      chassisApi.velocity.set(vel[0], vel[1], vel[2] - 0.4);
    } else if (s) {
      chassisApi.velocity.set(vel[0], vel[1], vel[2] + 0.4);
    }

    // Steering (rotate car around Y axis)
    const angVel = chassisApi.angularVelocity.current || [0, 0, 0];
    if (a) {
      chassisApi.angularVelocity.set(angVel[0], 3, angVel[2]);
    } else if (d) {
      chassisApi.angularVelocity.set(angVel[0], -3, angVel[2]);
    } else {
      chassisApi.angularVelocity.set(angVel[0] * 0.9, angVel[1] * 0.9, angVel[2] * 0.9);
    }

    // Flipping controls
    if (arrowup) {
      chassisApi.applyLocalImpulse([0, -2.5, 0], [0, 0, -1]);
    }
    if (arrowdown) {
      chassisApi.applyLocalImpulse([0, -2.5, 0], [0, 0, 1]);
    }
    if (arrowleft) {
      chassisApi.applyLocalImpulse([0, -2.5, 0], [-0.5, 0, 0]);
    }
    if (arrowright) {
      chassisApi.applyLocalImpulse([0, -2.5, 0], [0.5, 0, 0]);
    }

    // Reset position
    if (r) {
      chassisApi.position.set(-1.5, 0.5, 3);
      chassisApi.velocity.set(0, 0, 0);
      chassisApi.angularVelocity.set(0, 0, 0);
    }
  });

  return (
    <group ref={effectiveRef}>
      <mesh castShadow>
        <boxGeometry args={[0.5, 1, 2]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>

      {/* Car model - hide in third person */}
      {!thirdPerson && carModel && (
        <primitive object={carModel.scene} scale={0.01} />
      )}

      {/* Underglow */}
      <mesh position={[0, -0.05, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[0.5, 1.2]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.3} toneMapped={false} />
      </mesh>
    </group>
  );
}
