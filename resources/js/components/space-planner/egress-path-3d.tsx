import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { EgressPath } from '@/types';

type EgressPath3DProps = {
    path: EgressPath;
};

const ARROW_COUNT = 5;
const ARROW_SPEED = 0.12;
const PATH_HEIGHT = 0.02;

export function EgressPath3D({ path }: EgressPath3DProps) {
    const arrowRefs = useRef<(THREE.Mesh | null)[]>([]);
    const phases = useRef(Array.from({ length: ARROW_COUNT }, (_, index) => index / ARROW_COUNT));

    const curve = useMemo(() => {
        const points = path.path_points.map((point) => new THREE.Vector3(point.x, PATH_HEIGHT, point.y));

        return points.length >= 2 ? new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.3) : null;
    }, [path.path_points]);

    useFrame((_, delta) => {
        if (!curve) {
            return;
        }

        phases.current = phases.current.map((phase) => (phase + delta * ARROW_SPEED) % 1);

        arrowRefs.current.forEach((mesh, index) => {
            if (!mesh) {
                return;
            }

            const phase = phases.current[index];
            const point = curve.getPointAt(phase);
            const tangent = curve.getTangentAt(phase);

            mesh.position.set(point.x, PATH_HEIGHT + 0.08, point.z);
            mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);

            const material = mesh.material as THREE.MeshBasicMaterial;
            material.opacity = 0.4 + Math.sin(phase * Math.PI) * 0.6;
        });
    });

    if (!curve) {
        return null;
    }

    return (
        <group>
            <mesh>
                <tubeGeometry args={[curve, 64, 0.05, 8, false]} />
                <meshBasicMaterial color="#dc2626" transparent opacity={0.35} />
            </mesh>

            {Array.from({ length: ARROW_COUNT }).map((_, index) => (
                <mesh
                    key={index}
                    ref={(node) => {
                        arrowRefs.current[index] = node;
                    }}
                >
                    <coneGeometry args={[0.09, 0.2, 8]} />
                    <meshBasicMaterial color="#dc2626" transparent opacity={0.7} />
                </mesh>
            ))}
        </group>
    );
}
