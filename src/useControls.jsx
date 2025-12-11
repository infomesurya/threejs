import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export const useControls = (vehicleApi, chassisApi, isOnTrack = true) => {
  const controlsRef = useRef({});
  const resetTriggeredRef = useRef(false);

  useEffect(() => {
    const keyDownPressHandler = (e) => {
      const key = e.key.toLowerCase();
      controlsRef.current[key] = true;
      if (key === 'r' && !resetTriggeredRef.current) {
        resetTriggeredRef.current = true;
      }
    }

    const keyUpPressHandler = (e) => {
      const key = e.key.toLowerCase();
      controlsRef.current[key] = false;
      if (key === 'r') {
        resetTriggeredRef.current = false;
      }
    }

    window.addEventListener("keydown", keyDownPressHandler);
    window.addEventListener("keyup", keyUpPressHandler);
    return () => {
      window.removeEventListener("keydown", keyDownPressHandler);
      window.removeEventListener("keyup", keyUpPressHandler);
    }
  }, []);

  useFrame(() => {
    // Guard: ensure vehicleApi and chassisApi are fully initialized
    if (!vehicleApi || !chassisApi) return;

    // Additional safety check - vehicleApi methods might not be ready yet
    try {
      if (!vehicleApi.applyEngineForce || !vehicleApi.setSteeringValue || !vehicleApi.setBrake) {
        return;
      }
    } catch (e) {
      // vehicleApi not ready yet
      return;
    }

    if (!isOnTrack) {
      vehicleApi.setBrake(10, 2);
      vehicleApi.setBrake(10, 3);
      vehicleApi.applyEngineForce(0, 2);
      vehicleApi.applyEngineForce(0, 3);
      return;
    }

    vehicleApi.setBrake(0, 2);
    vehicleApi.setBrake(0, 3);

    const { w, s, a, d, arrowdown, arrowup, arrowleft, arrowright, r } = controlsRef.current;

    if (w) {
      vehicleApi.applyEngineForce(3000, 2);
      vehicleApi.applyEngineForce(3000, 3);
    } else if (s) {
      vehicleApi.applyEngineForce(-2500, 2);
      vehicleApi.applyEngineForce(-2500, 3);
    } else {
      vehicleApi.applyEngineForce(0, 2);
      vehicleApi.applyEngineForce(0, 3);
    }

    if (a) {
      vehicleApi.setSteeringValue(0.35, 2);
      vehicleApi.setSteeringValue(0.35, 3);
      vehicleApi.setSteeringValue(-0.1, 0);
      vehicleApi.setSteeringValue(-0.1, 1);
    } else if (d) {
      vehicleApi.setSteeringValue(-0.35, 2);
      vehicleApi.setSteeringValue(-0.35, 3);
      vehicleApi.setSteeringValue(0.1, 0);
      vehicleApi.setSteeringValue(0.1, 1);
    } else {
      for (let i = 0; i < 4; i++) {
        vehicleApi.setSteeringValue(0, i);
      }
    }

    // Flip Controls - small continuous impulse/torque
    // Applying local impulse at an offset to create rotation
    if (arrowdown) chassisApi.applyLocalImpulse([0, -2.5, 0], [0, 0, +1]);
    if (arrowup) chassisApi.applyLocalImpulse([0, -2.5, 0], [0, 0, -1]);
    if (arrowleft) chassisApi.applyLocalImpulse([0, -2.5, 0], [-0.5, 0, 0]);
    if (arrowright) chassisApi.applyLocalImpulse([0, -2.5, 0], [+0.5, 0, 0]);

    if (r && resetTriggeredRef.current) {
      // Reset to starting position (only once per key press)
      chassisApi.velocity.set(0, 0, 0);
      chassisApi.angularVelocity.set(0, 0, 0);
      chassisApi.rotation.set(0, 0, 0);
      chassisApi.position.set(-1.5, 0.5, 3);
      resetTriggeredRef.current = false; // Reset the trigger
    }
  });

  return controlsRef.current;
}
