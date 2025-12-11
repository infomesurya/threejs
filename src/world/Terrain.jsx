import React, { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { fractalNoise } from "./noise";

export function Terrain({ size = 200, segments = 128, scale = 0.02, height = 6 }) {
  const meshRef = useRef();
  const { camera } = useThree();

  // build grid once
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, [size, segments]);

  // store a copy of the base positions
  const basePositions = useMemo(() => {
    const arr = geometry.attributes.position.array.slice();
    return new Float32Array(arr);
  }, [geometry]);

  useFrame(() => {
    if (!meshRef.current) return;
    const pos = geometry.attributes.position.array;
    const base = basePositions;

    // world offset from camera to create infinite feel
    const offsetX = camera.position.x / (size / 4);
    const offsetZ = camera.position.z / (size / 4);

    for (let i = 0; i < pos.length; i += 3) {
      const bx = base[i];
      const bz = base[i + 2];
      // sample noise at world coords
      const n = fractalNoise((bx + offsetX * size) * scale, (bz + offsetZ * size) * scale, 5);
      pos[i + 1] = n * height; // y
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geometry} receiveShadow castShadow>
      <meshStandardMaterial color="#5a8f5a" roughness={1} metalness={0} />
    </mesh>
  );
}

export default Terrain;
