import { useBox, useRaycastVehicle } from "@react-three/cannon";
import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useControls } from "./useControls";
import { useWheels } from "./useWheels";
import { WheelDebug } from "./WheelDebug";
import { Trail, Sparkles, SpotLight } from "@react-three/drei";
import useTrackDetection from "./systems/useTrackDetection";
import { updateGameState, useGameState } from "./systems/gameStateStore";

export function Car({ thirdPerson, headlightsOn, carBodyRef }) {
  // thanks to the_86_guy!
  // https://sketchfab.com/3d-models/low-poly-car-muscle-car-2-ac23acdb0bd54ab38ea72008f3312861
  let result = useLoader(
    GLTFLoader,
    process.env.PUBLIC_URL + "/models/car.glb"
  ).scene;

  const position = [-1.5, 0.4, 3];
  const width = 0.6;
  const height = 0.3;
  const front = 0.8;
  const wheelRadius = 0.2;

  const chassisBodyArgs = [width, height, front * 2];
  const localRef = useRef(null);
  const vehicleRef = useRef(null);
  const effectiveRef = carBodyRef || localRef;

  const [chassisBody, chassisApi] = useBox(
    () => ({
      allowSleep: false,
      args: chassisBodyArgs,
      mass: 300,
      position,
    }),
    effectiveRef,
  );

  const [wheels, wheelInfos] = useWheels(width, height, front, wheelRadius);

  const [, vehicleApi] = useRaycastVehicle(
    () => ({
      chassisBody,
      wheelInfos,
      wheels,
    }),
    vehicleRef,
  );

  // Track when vehicle is fully initialized
  const [vehicleReady, setVehicleReady] = useState(false);

  useEffect(() => {
    // Check if vehicleApi is ready by testing if methods exist
    if (vehicleApi && typeof vehicleApi.applyEngineForce === 'function') {
      setVehicleReady(true);
      // Set vehicleApi on chassis body's userData for collision detection
      if (chassisBody.current) {
        chassisBody.current.userData = chassisBody.current.userData || {};
        chassisBody.current.userData.vehicleApi = vehicleApi;
      }
    } else {
      // If vehicleApi is not ready, ensure we don't have stale references
      if (chassisBody.current && chassisBody.current.userData) {
        chassisBody.current.userData.vehicleApi = undefined;
      }
    }
  }, [vehicleApi, chassisBody]);

  // Track detection
  const { isOnTrack, offTrackDuration, trackBounds } = useTrackDetection(chassisBody);
  const { resetPosition, gameStatus } = useGameState();

  const canMove = (gameStatus === 'playing' || gameStatus === 'start');
  // Only pass vehicleApi to useControls when it's ready
  const controls = useControls(
    vehicleReady ? vehicleApi : null,
    vehicleReady ? chassisApi : null,
    canMove
  );

  useFrame(() => {
    // Auto reset if off track for too long
    if (!isOnTrack && offTrackDuration > 0.5 && chassisBody?.current) {
      const trackCenterX = (trackBounds.minX + trackBounds.maxX) / 2;
      const trackCenterZ = (trackBounds.minZ + trackBounds.maxZ) / 2;

      chassisApi.position.set(trackCenterX, 1, trackCenterZ);
      chassisApi.velocity.set(0, 0, 0);
      chassisApi.angularVelocity.set(0, 0, 0);
      // vehicleApi.reset(); // Method does not exist, physics reset is sufficient
    }
  });

  // Handle reset from Game State (triggered by HUD button)
  useEffect(() => {
    if (resetPosition && chassisBody?.current) {
      // Reset car position to center of track
      const trackCenterX = (trackBounds.minX + trackBounds.maxX) / 2;
      const trackCenterZ = (trackBounds.minZ + trackBounds.maxZ) / 2;

      chassisApi.position.set(trackCenterX, 1, trackCenterZ);
      chassisApi.velocity.set(0, 0, 0);
      chassisApi.angularVelocity.set(0, 0, 0);

      // Reset vehicle
      // vehicleApi.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetPosition, trackBounds, vehicleApi, chassisBody, chassisApi]);

  // Publish game state changes
  useEffect(() => {
    updateGameState({
      isOnTrack,
      offTrackDuration,
    });
  }, [isOnTrack, offTrackDuration]);

  // Skid mark trails for each wheel when braking (s) or drifting (a/d)
  const isBraking = controls.s;
  const isDrifting = controls.a || controls.d;
  const showTrail = isBraking || isDrifting;

  // Import Trail from drei
  // Note: Trail creates a line that follows a moving object

  // Camera spring logic (commented out unused ref warning, logic handled directly in useFrame for now)
  // const camPosRef = useRef(new Vector3());

  // Camera logic moved to CameraController.jsx to prevent conflict
  /*
  useFrame((state) => {
    if (!thirdPerson) return;
    // ... old camera logic removed ...
  });
  */

  useEffect(() => {
    if (!result) return;

    let mesh = result;
    mesh.scale.set(0.0012, 0.0012, 0.0012);

    mesh.children[0].position.set(-365, -18, -67);
  }, [result]);

  return (
    <group name="vehicle">
      <group ref={chassisBody} name="chassisBody">
        <primitive object={result} rotation-y={Math.PI} position={[0, -0.09, 0]} />
      </group>

      {/* <mesh ref={chassisBody}>
        <meshBasicMaterial transparent={true} opacity={0.3} />
        <boxGeometry args={chassisBodyArgs} />
      </mesh> */}

      {/* Trail for skid marks */}
      {showTrail && (
        <Trail width={0.1} length={5} color="#555" attenuation={(t) => 1 - t}>
          <mesh ref={wheels[0]} />
          <mesh ref={wheels[1]} />
          <mesh ref={wheels[2]} />
          <mesh ref={wheels[3]} />
        </Trail>
      )}

      {/* Dust/Smoke/Sparks */}
      {showTrail && (
        <Sparkles count={20} scale={[1, 1, 1]} size={2} speed={0.5} color="white" />
      )}

      {/* Headlights */}
      {headlightsOn && (
        <SpotLight
          distance={10}
          angle={0.3}
          penumbra={0.5}
          intensity={2}
          position={[0, 0.2, 0]}
          target={new Vector3(0, 0, -1)}
          color="white"
        />
      )}

      {/* Engine audio - disabled */}
      {/* <EngineAudio vehicleApi={vehicleApi} /> */}
      {/* <DriftingScore vehicleApi={vehicleApi} /> */}

      {/* Underglow */}
      <mesh position={[0, -0.05, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[0.5, 1.2]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.3} toneMapped={false} />
      </mesh>

      <WheelDebug wheelRef={wheels[0]} radius={wheelRadius} />
      <WheelDebug wheelRef={wheels[1]} radius={wheelRadius} />
      <WheelDebug wheelRef={wheels[2]} radius={wheelRadius} />
      <WheelDebug wheelRef={wheels[3]} radius={wheelRadius} />
    </group>
  );
}
