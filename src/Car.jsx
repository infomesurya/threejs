import { useBox } from "@react-three/cannon";
import { useFrame, useThree, useLoader } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Quaternion, Vector3 } from "three";
import { Trail, Sparkles, SpotLight } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { updateGameState } from "./systems/gameStateStore";

export function Car({ thirdPerson = false, headlightsOn = true, carBodyRef }) {
  // Load car model - ALL HOOKS AT TOP LEVEL
  const carModelData = useLoader(GLTFLoader, process.env.PUBLIC_URL + "/models/car.glb");
  
  const meshRef = useRef(null);
  const carVisualRef = useRef(null);
  const { camera } = useThree();

  // Car dimensions
  const width = 0.5;
  const height = 0.8;
  const length = 1.8;

  const [, chassisApi] = useBox(
    () => ({
      allowSleep: false,
      args: [width, height, length],
      mass: 150,
      position: [-1.5, 0.5, 3],
      linearDamping: 0.2,
      angularDamping: 0.4,
    }),
    meshRef
  );

  // Sync ref for Scene camera controller
  useEffect(() => {
    if (carBodyRef && meshRef.current) {
      carBodyRef.current = meshRef.current;
    }
  }, [carBodyRef]);

  // Clone and setup car model
  useEffect(() => {
    if (!carModelData || !carVisualRef.current) return;
    
    try {
      // Clear previous children
      while (carVisualRef.current.children.length > 0) {
        carVisualRef.current.removeChild(carVisualRef.current.children[0]);
      }
      
      // Clone the model
      const clonedModel = carModelData.scene.clone();
      
      // Scale and position the model
      clonedModel.scale.set(1.2, 1.2, 1.2);
      clonedModel.position.set(0, -0.2, 0);
      
      // Enable shadows for all meshes
      clonedModel.traverse((node) => {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      
      carVisualRef.current.add(clonedModel);
    } catch (e) {
      console.error("Error setting up car model:", e);
    }
  }, [carModelData]);

  // Keyboard state
  const keysRef = useRef({});
  const trackStateRef = useRef({ isOnTrack: true, offTrackDuration: 0 });

  // Setup keyboard controls
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

  // Main physics and input loop
  useFrame(({ clock }) => {
    if (!chassisApi || !meshRef.current) return;

    const keys = keysRef.current;
    const { w, s, a, d, r, arrowup, arrowdown } = keys;

    // Check track bounds
    const carPos = new Vector3();
    carPos.setFromMatrixPosition(meshRef.current.matrixWorld);
    
    const isOnTrack = carPos.x > -15 && carPos.x < 15 && carPos.z > -15 && carPos.z < 20;
    
    if (!isOnTrack) {
      trackStateRef.current.offTrackDuration += 1;
      trackStateRef.current.isOnTrack = false;
    } else {
      trackStateRef.current.offTrackDuration = 0;
      trackStateRef.current.isOnTrack = true;
    }

    // Update game state
    updateGameState({ 
      isOnTrack: trackStateRef.current.isOnTrack,
      offTrackDuration: trackStateRef.current.offTrackDuration
    });

    // Auto-reset if off track too long
    if (trackStateRef.current.offTrackDuration > 300) {
      try {
        chassisApi.position.set(-1.5, 0.5, 3);
        chassisApi.velocity.set(0, 0, 0);
        chassisApi.angularVelocity.set(0, 0, 0);
        trackStateRef.current.offTrackDuration = 0;
      } catch (e) {
        // Ignore
      }
      return;
    }

    // Get current velocity
    let vel = [0, 0, 0];
    try {
      if (chassisApi.velocity?.current) {
        vel = [...chassisApi.velocity.current];
      }
    } catch (e) {
      // Use default
    }

    // Apply throttle - W key forward
    if (w && isOnTrack) {
      const newVelZ = Math.max(vel[2] - 0.8, -12);
      try {
        chassisApi.velocity.set(vel[0], vel[1], newVelZ);
      } catch (e) {
        // Ignore
      }
    } else if (s && isOnTrack) {
      // S key reverse
      const newVelZ = Math.min(vel[2] + 0.8, 12);
      try {
        chassisApi.velocity.set(vel[0], vel[1], newVelZ);
      } catch (e) {
        // Ignore
      }
    } else {
      // Coast with friction
      try {
        chassisApi.velocity.set(vel[0] * 0.92, vel[1], vel[2] * 0.92);
      } catch (e) {
        // Ignore
      }
    }

    // Get current angular velocity
    let angVel = [0, 0, 0];
    try {
      if (chassisApi.angularVelocity?.current) {
        angVel = [...chassisApi.angularVelocity.current];
      }
    } catch (e) {
      // Use default
    }

    // Apply steering - A/D keys for left/right
    if (a && isOnTrack) {
      try {
        chassisApi.angularVelocity.set(angVel[0], 4, angVel[2]);
      } catch (e) {
        // Ignore
      }
    } else if (d && isOnTrack) {
      try {
        chassisApi.angularVelocity.set(angVel[0], -4, angVel[2]);
      } catch (e) {
        // Ignore
      }
    } else {
      try {
        chassisApi.angularVelocity.set(angVel[0] * 0.85, angVel[1] * 0.85, angVel[2] * 0.85);
      } catch (e) {
        // Ignore
      }
    }

    // Flip controls - Arrow keys
    if (arrowup) {
      try {
        chassisApi.applyLocalImpulse([0, 2.5, -1.2], [0, 0, 0.5]);
      } catch (e) {
        // Ignore
      }
      keys.arrowup = false;
    }
    if (arrowdown) {
      try {
        chassisApi.applyLocalImpulse([0, 2.5, 1.2], [0, 0, -0.5]);
      } catch (e) {
        // Ignore
      }
      keys.arrowdown = false;
    }

    // Reset position - R key
    if (r) {
      try {
        chassisApi.position.set(-1.5, 0.5, 3);
        chassisApi.velocity.set(0, 0, 0);
        chassisApi.angularVelocity.set(0, 0, 0);
      } catch (e) {
        // Ignore
      }
      keys.r = false;
    }

    // Off-track braking
    if (!isOnTrack) {
      try {
        chassisApi.velocity.set(vel[0] * 0.88, vel[1], vel[2] * 0.88);
      } catch (e) {
        // Ignore
      }
    }

    // Third-person camera - K key toggle
    if (thirdPerson && meshRef.current) {
      try {
        const carQuat = new Quaternion();
        carQuat.setFromRotationMatrix(meshRef.current.matrixWorld);
        
        const carForward = new Vector3(0, 0, -1).applyQuaternion(carQuat);
        carForward.normalize();

        const targetPos = carPos
          .clone()
          .addScaledVector(carForward, 1.5)
          .add(new Vector3(0, 0.7, 0));

        const lookPos = carPos
          .clone()
          .addScaledVector(carForward, 0.4)
          .add(new Vector3(0, 0.3, 0));

        camera.position.lerp(targetPos, 0.1);
        camera.lookAt(lookPos);
      } catch (e) {
        // Ignore
      }
    }
  });

  // Determine if showing effects
  const keys = keysRef.current;
  const showEffects = (keys.s || keys.a || keys.d) && trackStateRef.current.isOnTrack;

  return (
    <group ref={meshRef}>
      {/* Invisible physics body */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[width, height, length]} />
        <meshStandardMaterial transparent opacity={0} wireframe={false} />
      </mesh>

      {/* Car GLB Model Container - ALWAYS RENDERED */}
      <group ref={carVisualRef} position={[0, 0, 0]} />

      {/* Trail effect */}
      {showEffects && (
        <Trail
          width={0.12}
          length={12}
          decay={1.2}
          color="#888"
          attenuation={(t) => t * t}
        >
          <mesh position={[0, -height / 2, 0]} />
        </Trail>
      )}

      {/* Drift sparkles */}
      {showEffects && (
        <Sparkles
          count={25}
          scale={[width * 1.5, height * 0.5, length]}
          size={1.5}
          speed={0.3}
          opacity={0.6}
        />
      )}

      {/* Headlights - L key toggle */}
      {headlightsOn && (
        <>
          <SpotLight
            position={[-width / 4, height / 3, -length / 2.2]}
            angle={0.35}
            penumbra={0.5}
            distance={15}
            intensity={1.8}
            color="#ffffcc"
            castShadow
          />
          <SpotLight
            position={[width / 4, height / 3, -length / 2.2]}
            angle={0.35}
            penumbra={0.5}
            distance={15}
            intensity={1.8}
            color="#ffffcc"
            castShadow
          />
        </>
      )}

      {/* Underglow neon */}
      <mesh position={[0, -height / 2 - 0.01, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[width * 1.3, length * 1.4]} />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.2}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
