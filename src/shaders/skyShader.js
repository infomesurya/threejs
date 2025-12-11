// Simple gradient sky shader with sun position uniform
export const SkyShader = {
  uniforms: {
    sunPos: { value: [0, 1, 0] },
    topColor: { value: [0.6, 0.8, 1.0] },
    bottomColor: { value: [0.9, 0.6, 0.3] },
    time: { value: 0 },
  },
  vertexShader: `
    varying vec3 vWorldPos;
    void main() {
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPos = worldPos.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 topColor;
    uniform vec3 bottomColor;
    uniform float time;
    varying vec3 vWorldPos;
    void main() {
      float h = normalize(vWorldPos).y * 0.5 + 0.5;
      vec3 col = mix(bottomColor, topColor, pow(h, 0.6 + 0.4 * sin(time * 0.05)));
      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

export default SkyShader;
