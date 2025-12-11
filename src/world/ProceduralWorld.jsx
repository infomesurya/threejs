import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Terrain from "./Terrain";
import generateRoadGeometry from "./roadGenerator";
import { SkyShader } from "../shaders/skyShader";
import { fractalNoise } from "./noise";

export function ProceduralWorld({ enabled = true }) {
  const skyRef = useRef();

  // sample procedural road control points
  const controlPoints = useMemo(() => {
    const pts = [];
    const len = 12;
    for (let i = 0; i < len; i++) {
      const t = (i / (len - 1)) * Math.PI * 2;
      const r = 40 + Math.sin(i * 0.5) * 10;
      const x = Math.cos(t) * r;
      const z = Math.sin(t) * r;
      const y = fractalNoise(x * 0.01, z * 0.01, 3) * 4;
      pts.push(new THREE.Vector3(x, y + 0.05, z));
    }
    return pts;
  }, []);

  const roadGeometry = useMemo(() => generateRoadGeometry(controlPoints, 6, 600), [controlPoints]);

  useFrame((state, delta) => {
    if (skyRef.current) {
      skyRef.current.material.uniforms.time.value += delta;
    }
  });

  if (!enabled) return null;

  return (
    <group name="ProceduralWorld">
      <mesh ref={skyRef} frustumCulled={false} rotation={[0, 0, 0]}>
        <sphereBufferGeometry args={[500, 32, 32]} />
        <shaderMaterial
          side={THREE.BackSide}
          uniforms={SkyShader.uniforms}
          vertexShader={SkyShader.vertexShader}
          fragmentShader={SkyShader.fragmentShader}
        />
      </mesh>

      <Terrain size={400} segments={196} scale={0.003} height={9} />

      <mesh geometry={roadGeometry} castShadow receiveShadow>
        <meshStandardMaterial color="#222" metalness={0.1} roughness={0.9} />
      </mesh>
    </group>
  );
}

export default ProceduralWorld;
