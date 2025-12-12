import React, { useEffect, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { useBox } from "@react-three/cannon";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Trail, Sparkles } from "@react-three/drei";
import * as THREE from "three";

export const Car = ({ selectedCarPath, selectedCarName, thirdPerson, headlightsOn }) => {
  const groupRef = useRef();
  const carVisualRef = useRef(new THREE.Group());
  const velocity = useRef(0);
  const angularVelocity = useRef(0);
  const keysPressed = useRef({});

  // Load the selected car model
  const carModelData = useLoader(GLTFLoader, selectedCarPath || "/models/car.glb");

  // Physics box for the car
  const [ref, api] = useBox(() => ({
    mass: 1,

    args: [0.5, 0.8, 1.8],
    linearDamping: 0.3,
    angularDamping: 0.5,
    position: [-1.5, 0.5, 3],
  }));

  // Clone car model from GLB
  useEffect(() => {
    if (!carModelData || !carVisualRef.current) {
      console.log("Waiting for car model...");
      return;
    }

    try {
      carVisualRef.current.clear();
      const clonedModel = carModelData.scene.clone();
      clonedModel.scale.set(2.0, 2.0, 2.0);
      clonedModel.position.set(0, 0, 0);

      console.log("Car model loaded:", selectedCarName, clonedModel);

      // Check if the model has any meshes
      let hasMeshes = false;
      clonedModel.traverse((node) => {
        if (node.isMesh) hasMeshes = true;
      });

      if (!hasMeshes) {
        console.log("GLB model has no meshes, using fallback car");
        // Fallback: simple car shape
        const carGeometry = new THREE.BoxGeometry(1, 0.5, 2);
        const carMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        const carMesh = new THREE.Mesh(carGeometry, carMaterial);
        carMesh.castShadow = true;
        carMesh.receiveShadow = true;
        carVisualRef.current.add(carMesh);
        return;
      }

      // Setup shadows
      clonedModel.traverse((node) => {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });

      carVisualRef.current.add(clonedModel);
    } catch (e) {
      console.error("Error cloning car model:", e);
      // Fallback on error
      const carGeometry = new THREE.BoxGeometry(1, 0.5, 2);
      const carMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
      const carMesh = new THREE.Mesh(carGeometry, carMaterial);
      carMesh.castShadow = true;
      carMesh.receiveShadow = true;
      carVisualRef.current.add(carMesh);
    }
  }, [carModelData, selectedCarName]);

  // Keyboard input handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key.toLowerCase()] = true;

      // R - Reset position
      if (e.key === "r" || e.key === "R") {
        api.position.set(-1.5, 0.5, 3);
        api.velocity.set(0, 0, 0);
        api.angularVelocity.set(0, 0, 0);
        velocity.current = 0;
        angularVelocity.current = 0;
      }
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [api]);

  // Physics and movement loop
  useFrame(() => {
    if (!ref.current || !api) return;

    const w = keysPressed.current["w"];
    const s = keysPressed.current["s"];
    const a = keysPressed.current["a"];
    const d = keysPressed.current["d"];

    // Acceleration/Braking
    if (w) velocity.current = Math.max(velocity.current - 0.8, -12);
    if (s) velocity.current = Math.min(velocity.current + 0.8, 12);
    if (!w && !s) velocity.current *= 0.95; // Friction

    // Steering
    if (a) angularVelocity.current = 4;
    else if (d) angularVelocity.current = -4;
    else angularVelocity.current *= 0.9;

    // Get current position
    const pos = ref.current.getWorldPosition(new THREE.Vector3());
    const rot = ref.current.quaternion;

    // Get forward direction
    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(rot);

    // Apply velocity
    const currentVel = new THREE.Vector3(api.velocity.x, api.velocity.y, api.velocity.z);
    const newVel = forward.multiplyScalar(velocity.current);
    api.velocity.set(newVel.x, currentVel.y, newVel.z);

    // Apply rotation
    api.angularVelocity.set(0, angularVelocity.current, 0);

    // Track boundaries - auto brake if off track
    if (pos.x < -15 || pos.x > 15 || pos.z < -15 || pos.z > 20) {
      velocity.current *= 0.88;
    }

    // Flip control (arrow keys)
    if (keysPressed.current["arrowup"]) {
      api.velocity.set(0, 8, 0);
    }
    if (keysPressed.current["arrowdown"]) {
      api.velocity.set(0, -8, 0);
    }

    // Update visual position from physics
    if (groupRef.current && ref.current) {
      const pos = ref.current.getWorldPosition(new THREE.Vector3());
      groupRef.current.position.copy(pos);
      groupRef.current.quaternion.copy(ref.current.quaternion);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Physics body (invisible) */}
      <group ref={ref}>
        {/* Visual model */}
        <group ref={carVisualRef} />

        {/* Trail effect on drift */}
        {velocity.current > 5 && (
          <>
            <Trail width={0.2} length={30} decay={1.5} color="#00ff88" attenuation={(t) => t * t} />
          </>
        )}

        {/* Sparkles effect */}
        <Sparkles count={25} scale={2} size={2} speed={0.5} color="#00a86b" />

        {/* Headlights */}
        {headlightsOn && (
          <>
            {/* Right headlight */}
            <pointLight
              position={[0.3, 0.3, 1]}
              intensity={2}
              distance={20}
              color="#ffff99"
              castShadow
            />
            <spotLight
              position={[0.3, 0.3, 1]}
              target-position={[0.3, -5, 20]}
              intensity={1.5}
              angle={0.6}
              distance={50}
              color="#ffff99"
              castShadow
            />

            {/* Left headlight */}
            <pointLight
              position={[-0.3, 0.3, 1]}
              intensity={2}
              distance={20}
              color="#ffff99"
              castShadow
            />
            <spotLight
              position={[-0.3, 0.3, 1]}
              target-position={[-0.3, -5, 20]}
              intensity={1.5}
              angle={0.6}
              distance={50}
              color="#ffff99"
              castShadow
            />
          </>
        )}

        {/* Neon underglow */}
        <pointLight
          position={[0, -0.4, 0]}
          intensity={1.5}
          distance={5}
          color="#00ff88"
        />
      </group>
    </group>
  );
};

export default Car;
