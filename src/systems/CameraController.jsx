import { useFrame, useThree } from "@react-three/fiber";
import { Vector3, Quaternion } from "three";

/**
 * Smooth chase camera following the car (DR/Forza style)
 * Follows behind and slightly above the car with spring damping
 */
export function CameraController({ carBodyRef, enabled = true }) {
  const { camera } = useThree();

  // Camera follow parameters (tunable)
  const cameraDistance = 1.2; // how far back
  const cameraHeight = 0.5; // how high
  const cameraLookAhead = 0.3; // where to look (ahead of car)
  const smoothFactor = 0.08; // lower = smoother (0.05-0.15)

  const targetPos = new Vector3();
  const targetLook = new Vector3();

  useFrame(() => {
    if (!enabled || !carBodyRef?.current) return;

    // Get car position and rotation
    const carPos = new Vector3();
    carPos.setFromMatrixPosition(carBodyRef.current.matrixWorld);

    const carQuat = new Quaternion();
    carQuat.setFromRotationMatrix(carBodyRef.current.matrixWorld);

    // Car forward direction (negative Z in local)
    const carForward = new Vector3(0, 0, -1);
    carForward.applyQuaternion(carQuat);
    carForward.normalize();

    // Car right direction
    const carRight = new Vector3(1, 0, 0);
    carRight.applyQuaternion(carQuat);
    carRight.normalize();

    // Calculate target camera position: behind and above car
    targetPos
      .copy(carPos)
      .addScaledVector(carForward, cameraDistance)
      .addScaledVector(carRight, 0) // center horizontally
      .y += cameraHeight;

    // Calculate where camera should look (ahead of car)
    targetLook
      .copy(carPos)
      .addScaledVector(carForward, cameraLookAhead)
      .y += 0.15;

    // Smoothly interpolate camera position (spring-like)
    camera.position.lerp(targetPos, smoothFactor);

    // Look at target smoothly
    const currentLookDir = new Vector3()
      .subVectors(camera.getWorldDirection(new Vector3()), camera.position)
      .normalize();
    const targetLookDir = new Vector3()
      .subVectors(targetLook, camera.position)
      .normalize();

    currentLookDir.lerp(targetLookDir, smoothFactor * 0.5);
    const lookPos = new Vector3()
      .copy(camera.position)
      .addScaledVector(currentLookDir, 100); // arbitrary far distance

    camera.lookAt(lookPos);
  });

  return null; // invisible component
}

export default CameraController;
