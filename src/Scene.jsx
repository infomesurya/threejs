import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Sky, // Import Sky
} from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { Car } from "./Car";
import { Ground } from "./Ground";
import { Track } from "./Track";
import { HUD } from "./HUD";
import { BoostPad } from "./BoostPad";

import { FinishLine } from "./FinishLine";
import { TrafficCone } from "./TrafficCone";

export function Scene({ selectedCarPath, selectedCarName }) {
  const [thirdPerson, setThirdPerson] = useState(false);
  const [cameraPosition, setCameraPosition] = useState([-6, 3.9, 6.21]);
  const [headlightsOn, setHeadlightsOn] = useState(false); // Move state inside component

  // Key listener for headlights toggle (L)
  useEffect(() => {
    const handler = (e) => {
      if (e.key.toLowerCase() === "l") {
        setHeadlightsOn((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    function keydownHandler(e) {
      if (e.key === "k") {
        // random is necessary to trigger a state change
        if (thirdPerson) setCameraPosition([-6, 3.9, 6.21 + Math.random() * 0.01]);
        setThirdPerson(!thirdPerson);
      }
    }

    window.addEventListener("keydown", keydownHandler);
    return () => window.removeEventListener("keydown", keydownHandler);
  }, [thirdPerson]);

  return (
    <Suspense fallback={null}>
      {/* Sunrise sky */}
      <Sky
        sunPosition={[100, 10, 100]}
        turbidity={10}
        rayleigh={2}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
        inclination={0.49} // low sun
        azimuth={0.25}
      />
      {/* Orange fog for morning */}
      <fog attach="fog" args={['#ffae42', 10, 50]} />

      <Environment
        files={process.env.PUBLIC_URL + "/textures/envmap.hdr"}
        background={"both"}
      />
      {/* HUD & Arcade Elements */}
      <HUD />
      <FinishLine position={[0, 0, -10]} />
      {/* Random cones */}
      <TrafficCone position={[2, 0.5, -5]} />
      <TrafficCone position={[-2, 0.5, -15]} />
      <TrafficCone position={[0, 0.5, -25]} />

      {/* Boost Pads */}
      <BoostPad position={[0, 0.01, -20]} />

      <PerspectiveCamera makeDefault position={cameraPosition} fov={40} />
      {!thirdPerson && (
        <OrbitControls target={[-2.64, -0.71, 0.03]} />
      )}

      <Ground />
      <Track />
      <Car selectedCarPath={selectedCarPath} selectedCarName={selectedCarName} thirdPerson={thirdPerson} headlightsOn={headlightsOn} />
    </Suspense>
  );
}
