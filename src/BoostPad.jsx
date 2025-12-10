// BoostPad component: adds a glowing neon pad that boosts car torque when overlapped
import { useEffect } from "react";
import { useBox } from "@react-three/cannon";
import { MeshStandardMaterial, Color } from "three";

export function BoostPad({ position = [0, 0.01, 0], size = [2, 0.02, 2] }) {
    const [ref, api] = useBox(() => ({
        type: "Static",
        args: size,
        position,
        isTrigger: true,
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

    // boost logic: when car body enters, apply extra torque for 3 seconds
    useEffect(() => {
        const handleCollide = (e) => {
            const body = e.body; // the other body (car chassis)
            if (body && body.userData && body.userData.vehicleApi) {
                const vehicleApi = body.userData.vehicleApi;
                // increase engine force by 50% for 3 seconds
                const boost = 1.5; // 50% more torque (original 1 -> 1.5)
                const originalForce = 150; // assume base force
                vehicleApi.applyEngineForce(originalForce * boost, 2);
                vehicleApi.applyEngineForce(originalForce * boost, 3);
                setTimeout(() => {
                    vehicleApi.applyEngineForce(originalForce, 2);
                    vehicleApi.applyEngineForce(originalForce, 3);
                }, 3000);
            }
        };
        api.addEventListener("collide", handleCollide);
        return () => api.removeEventListener("collide", handleCollide);
    }, [api]);

    return <mesh ref={ref} />;
}
