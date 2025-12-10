// EngineAudio component: plays engine sound and adjusts pitch based on vehicle speed (approx RPM)
import { useEffect, useRef } from "react";
import { PositionalAudio } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

export function EngineAudio({ vehicleApi }) {
    const audioRef = useRef();
    const { camera } = useThree();

    useEffect(() => {
        if (!audioRef.current) return;
        const sound = audioRef.current;
        sound.setRefDistance(5);
        sound.setLoop(true);
        sound.setVolume(0.5);
        sound.play();
        return () => {
            sound.stop();
        };
    }, []);

    // Update playbackRate based on vehicle speed (approx RPM)
    useEffect(() => {
        const interval = setInterval(() => {
            if (!vehicleApi || !audioRef.current) return;
            // Approximate speed from wheel angular velocity (simple approximation)
            const wheelVel = vehicleApi.getWheelSpeed ? vehicleApi.getWheelSpeed(2) : 0; // placeholder
            const rpm = Math.abs(wheelVel) * 60; // not accurate but gives variation
            const rate = Math.min(Math.max(rpm / 2000, 0.5), 2); // clamp between 0.5 and 2
            audioRef.current.setPlaybackRate(rate);
        }, 100);
        return () => clearInterval(interval);
    }, [vehicleApi]);

    return (
        <PositionalAudio
            ref={audioRef}
            url={process.env.PUBLIC_URL + "/audio/engine_loop.mp3"}
            distance={20}
        />
    );
}
