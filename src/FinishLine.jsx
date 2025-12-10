import { useLoader } from "@react-three/fiber";
import { TextureLoader, RepeatWrapping } from "three";
import { useBox } from "@react-three/cannon";

export function FinishLine({ position = [0, 0, 0] }) {
    const [ref] = useBox(() => ({
        isTrigger: true,
        args: [3, 2, 0.1],
        position,
        onCollide: (e) => console.log("Lap Finished!"), // Placeholder for lap logic
    }));

    // Simple checkered texture data URI (white/black 2x2 grid)
    const flagTexture = useLoader(TextureLoader, "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABZJREFUeNpi2r9/vzkDAwMjhAAGAAgwAA1mAo06XQmnAAAAAElFTkSuQmCC");



    // repeat texture
    flagTexture.wrapS = flagTexture.wrapT = RepeatWrapping;
    flagTexture.repeat.set(5, 2);


    return (
        <group position={position}>
            {/* Arch pillars */}
            <mesh position={[-1.5, 1, 0]}>
                <boxGeometry args={[0.2, 2, 0.2]} />
                <meshStandardMaterial color="white" />
            </mesh>
            <mesh position={[1.5, 1, 0]}>
                <boxGeometry args={[0.2, 2, 0.2]} />
                <meshStandardMaterial color="white" />
            </mesh>
            {/* Top bar */}
            <mesh position={[0, 2, 0]}>
                <boxGeometry args={[3.2, 0.2, 0.2]} />
                <meshStandardMaterial color="white" />
            </mesh>
            {/* Flag */}
            <mesh position={[0, 1.5, 0]}>
                <planeGeometry args={[2.8, 1]} />
                <meshStandardMaterial map={flagTexture} transparent={true} opacity={0.8} />
            </mesh>
        </group>
    );
}
