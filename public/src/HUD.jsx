// HUD component: lap timer and mini speedometer
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Html } from "@react-three/drei";

export function HUD() {
    const [lapTime, setLapTime] = useState(0);
    const [speed, setSpeed] = useState(0);
    const startRef = useRef(Date.now());

    useFrame((state, delta) => {
        // Update lap timer
        const now = Date.now();
        setLapTime(((now - startRef.current) / 1000).toFixed(2));
        // Approximate speed from camera movement (placeholder)
        // In a real implementation, you'd get vehicle speed from physics API
        const camPos = state.camera.position;
        setSpeed((camPos.length() * 0.1).toFixed(1));
    });

    return (
        <Html position={[0, 0, 0]} style={{ position: "absolute", top: "10px", right: "10px", color: "white", fontFamily: "Arial", pointerEvents: "none" }}>
            <div>
                <div>Lap: {lapTime}s</div>
                <div>Speed: {speed} km/h</div>
            </div>
        </Html>
    );
}
