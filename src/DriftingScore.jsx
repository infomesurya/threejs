// DriftingScore component: shows floating score text when drifting
import { useEffect, useState } from "react";
import { useControls } from "./useControls";
import { Html } from "@react-three/drei";

export function DriftingScore({ vehicleApi }) {
    const controls = useControls(vehicleApi);
    const [score, setScore] = useState(null);

    useEffect(() => {
        if (controls.a || controls.d) {
            // simple scoring: +10 per drift event, could be refined
            setScore({ value: "+10", time: Date.now() });
        }
    }, [controls.a, controls.d]);

    if (!score) return null;
    // hide after 1 second
    if (Date.now() - score.time > 1000) return null;

    return (
        <Html position={[0, 1, 0]} style={{ color: "#ff0", fontSize: "2rem", pointerEvents: "none" }}>
            {score.value}
        </Html>
    );
}
