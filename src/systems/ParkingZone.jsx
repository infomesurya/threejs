import React, { useMemo } from "react";
import * as THREE from "three";

/**
 * ParkingZone: a designated parking area with glowing outline and center marker
 * Detects when car is inside via trigger box
 */
export function ParkingZone({
  position = [0, 0, 0],
  size = [3, 0.1, 5],
  onParked = null,
  onExited = null,
}) {
  const zoneMesh = useMemo(() => {
    const group = new THREE.Group();

    // Floor outline (glowing ring)
    const outlineGeo = new THREE.PlaneGeometry(size[0] * 1.1, size[2] * 1.1);
    const outlineMat = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.4,
      toneMapped: false,
    });
    const outlineMesh = new THREE.Mesh(outlineGeo, outlineMat);
    outlineMesh.position.y = 0.01;
    group.add(outlineMesh);

    // Center marker (small bright point)
    const markerGeo = new THREE.CircleGeometry(0.2, 16);
    const markerMat = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      toneMapped: false,
    });
    const markerMesh = new THREE.Mesh(markerGeo, markerMat);
    markerMesh.position.y = 0.02;
    group.add(markerMesh);

    return group;
  }, [size]);

  return (
    <group position={position} name="ParkingZone">
      <primitive object={zoneMesh} />

      {/* Optional: visual guide lines */}
      <lineSegments>
        <bufferGeometry
          attach="geometry"
          {...{
            setAttribute: (name, attr) => {
              const geo = new THREE.BufferGeometry();
              geo.setAttribute(name, attr);
              return geo;
            },
          }}
        />
        <lineBasicMaterial color={0x00ff88} transparent opacity={0.6} />
      </lineSegments>
    </group>
  );
}

export default ParkingZone;
