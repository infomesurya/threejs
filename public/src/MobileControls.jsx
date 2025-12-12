// MobileControls component: On-screen joystick and buttons
import { Html } from "@react-three/drei";
import { useEffect, useState } from "react";

export function MobileControls({ onControl }) {
    // Simple placeholder for touch controls
    // In a real app, you'd use a library like 'nipplejs' or custom touch handlers
    // to feed into the same vehicleApi/chassisApi logic

    return (
        <Html fullscreen style={{ pointerEvents: "none" }}>
            <div style={{ position: "absolute", bottom: 20, left: 20, pointerEvents: "auto" }}>
                {/* Joystick Placeholder */}
                <div style={{ width: 100, height: 100, background: "rgba(255,255,255,0.2)", borderRadius: "50%" }}></div>
            </div>
            <div style={{ position: "absolute", bottom: 20, right: 20, pointerEvents: "auto" }}>
                {/* Throttle Button */}
                <button style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(0,255,0,0.5)", border: "none" }}>GO</button>
            </div>
        </Html>
    );
}
