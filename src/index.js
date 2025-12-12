import "./index.css"
import { createRoot } from "react-dom/client"
import { Canvas } from "@react-three/fiber"
import { Scene } from "./Scene"
import { Physics } from "@react-three/cannon"
import TrackStatusHUD from "./systems/TrackStatusHUD"


createRoot(document.getElementById("root")).render(
  <>
    <Canvas>
      <Physics broadphase="SAP" gravity={[0, -2.6, 0]}>
        <Scene />
      </Physics>
    </Canvas>

    {/* UI Outside Canvas */}
    <TrackStatusHUD />

    {/* EngineAudio disabled */}

    <div className="controls">
      <p>🎮 <strong>WASD</strong> to drive</p>
      <p>🔄 <strong>K</strong> to toggle car chase camera</p>
      <p>🔙 <strong>R</strong> to reset car position</p>
      <p>🤸 <strong>Arrow Keys</strong> for flips & stunts</p>
    </div>
  </>
)
