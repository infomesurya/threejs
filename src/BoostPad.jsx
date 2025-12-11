// BoostPad component: adds a glowing neon pad that boosts car torque when overlapped
import { useEffect } from "react";
import { useBox } from "@react-three/cannon";
import { MeshStandardMaterial, Color } from "three";

export function BoostPad({ position = [0, 0.01, 0], size = [2, 0.02, 2] }) {
    // Use onCollide in the collider options instead of attaching event listeners
    const [ref] = useBox(() => ({
        type: "Static",
        args: size,
        position,
        isTrigger: true,
        onCollide: (e) => {
            const body = e.body; // the other body (car chassis)
            if (body && body.userData && body.userData.vehicleApi) {
                const vehicleApi = body.userData.vehicleApi;
                const boost = 1.5; // 50% more torque
                const originalForce = 150; // assume base force
                vehicleApi.applyEngineForce(originalForce * boost, 2);
                vehicleApi.applyEngineForce(originalForce * boost, 3);
                setTimeout(() => {
                    vehicleApi.applyEngineForce(originalForce, 2);
                    vehicleApi.applyEngineForce(originalForce, 3);
                }, 3000);
            }
        }
    }));

    // visual material
    useEffect(() => {
        if (ref.current) {
            ref.current.material = new MeshStandardMaterial({
                color: new Color("#00ffff"),
                emissive: new Color("#00ffff"),
                emissiveIntensity: 1,
                transparent: true,
                opacity: 0.6,
            });
        }
    }, [ref]);

    // boost logic handled by the `onCollide` option above

    return <mesh ref={ref} />;
}
