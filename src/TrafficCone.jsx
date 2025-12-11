// TrafficCone component: simple orange cone obstacle
import { useBox } from "@react-three/cannon";

export function TrafficCone({ position = [0, 0, 0] }) {
    const [ref] = useBox(() => ({
        mass: 1,
        args: [0.4, 0.5, 0.4], // approximate box collider for cone
        position,
    }));
    // optional rotation animation removed as physics handles movement
    return (
        <mesh ref={ref} position={position} castShadow>
            <coneGeometry args={[0.2, 0.5, 8]} />
            <meshStandardMaterial color="#ff6600" />
        </mesh>
    );
}
