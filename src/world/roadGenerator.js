import * as THREE from "three";

// Generate a road mesh along a CatmullRomCurve3 by sampling points
export function generateRoadGeometry(points3, width = 4, divisions = 400) {
  const curve = new THREE.CatmullRomCurve3(points3, false, "catmullrom", 0.5);
  const frames = curve.computeFrenetFrames(divisions, false);
  const positions = [];
  const uvs = [];
  const indices = [];

  for (let i = 0; i <= divisions; i++) {
    const t = i / divisions;
    const p = curve.getPointAt(t);
    const binormal = frames.binormals[i];

    // left and right offset
    const half = width / 2;
    const left = new THREE.Vector3().copy(p).addScaledVector(binormal, -half);
    const right = new THREE.Vector3().copy(p).addScaledVector(binormal, half);

    positions.push(left.x, left.y + 0.02, left.z);
    positions.push(right.x, right.y + 0.02, right.z);

    uvs.push(0, t * 10);
    uvs.push(1, t * 10);
  }

  for (let i = 0; i < divisions; i++) {
    const a = i * 2;
    const b = a + 1;
    const c = a + 2;
    const d = a + 3;
    // two triangles (a,b,c) and (b,d,c)
    indices.push(a, c, b);
    indices.push(b, c, d);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

export default generateRoadGeometry;
