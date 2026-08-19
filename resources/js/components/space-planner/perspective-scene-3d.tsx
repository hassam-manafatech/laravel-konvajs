import { CameraControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { EgressPath3D } from '@/components/space-planner/egress-path-3d';
import { ProjectItemMesh3D } from '@/components/space-planner/project-item-mesh-3d';
import type { UseCameraSwingReturn } from '@/hooks/use-camera-swing';
import type { Project, ProjectItem } from '@/types';

type PerspectiveScene3DProps = {
    project: Project;
    items: ProjectItem[];
    brandColor: string;
    selectedId: number | null;
    onSelectItem: (id: number) => void;
    isReserved?: (item: ProjectItem) => boolean;
    cameraControlsRef: UseCameraSwingReturn['controlsRef'];
    className?: string;
};

const WALL_HEIGHT = 3;

export function PerspectiveScene3D({
    project,
    items,
    brandColor,
    selectedId,
    onSelectItem,
    isReserved,
    cameraControlsRef,
    className,
}: PerspectiveScene3DProps) {
    const widthMeters = parseFloat(project.width_m);
    const heightMeters = parseFloat(project.height_m);
    const roomSpan = Math.max(widthMeters, heightMeters);
    const roomDiagonal = Math.sqrt(widthMeters ** 2 + heightMeters ** 2);

    return (
        <div className={className ?? 'h-full w-full overflow-hidden rounded-lg border border-sidebar-border/70 dark:border-sidebar-border'}>
            <Canvas
                shadows
                camera={{ position: [8, 8, 8], fov: 45 }}
                gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
            >
                <color attach="background" args={['#f5f1ea']} />
                <fog attach="fog" args={['#f5f1ea', roomDiagonal * 1.2, roomDiagonal * 2.5]} />

                <ambientLight color="#fff5e8" intensity={0.5} />
                <hemisphereLight color="#fff5e8" groundColor="#c4b394" intensity={0.35} />
                <directionalLight
                    position={[widthMeters * 0.6, 10, heightMeters * 0.5]}
                    intensity={1}
                    color="#fff0d5"
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                    shadow-camera-left={-roomSpan}
                    shadow-camera-right={roomSpan}
                    shadow-camera-top={roomSpan}
                    shadow-camera-bottom={-roomSpan}
                    shadow-camera-near={0.5}
                    shadow-camera-far={40}
                    shadow-bias={-0.0005}
                />
                <directionalLight position={[-widthMeters * 0.4, 4, -heightMeters * 0.3]} intensity={0.25} color="#c4b394" />

                {/* Floor */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[widthMeters / 2, 0, heightMeters / 2]} receiveShadow>
                    <planeGeometry args={[widthMeters, heightMeters]} />
                    <meshStandardMaterial color="#E8DCC4" roughness={0.9} />
                </mesh>

                {/* Back wall (z = 0) */}
                <mesh position={[widthMeters / 2, WALL_HEIGHT / 2, 0]} receiveShadow>
                    <boxGeometry args={[widthMeters, WALL_HEIGHT, 0.12]} />
                    <meshStandardMaterial color="#F5F1EA" roughness={0.95} />
                </mesh>
                <mesh position={[widthMeters / 2, 0.04, 0.07]}>
                    <boxGeometry args={[widthMeters, 0.08, 0.02]} />
                    <meshStandardMaterial color="#2A2826" roughness={0.7} />
                </mesh>

                {/* Left wall (x = 0) */}
                <mesh position={[0, WALL_HEIGHT / 2, heightMeters / 2]} receiveShadow>
                    <boxGeometry args={[0.12, WALL_HEIGHT, heightMeters]} />
                    <meshStandardMaterial color="#F5F1EA" roughness={0.95} />
                </mesh>
                <mesh position={[0.07, 0.04, heightMeters / 2]}>
                    <boxGeometry args={[0.02, 0.08, heightMeters]} />
                    <meshStandardMaterial color="#2A2826" roughness={0.7} />
                </mesh>

                {items.map((item) => (
                    <ProjectItemMesh3D
                        key={item.id}
                        item={item}
                        brandColor={brandColor}
                        isSelected={selectedId === item.id}
                        isReserved={isReserved?.(item) ?? false}
                        onSelect={onSelectItem}
                    />
                ))}

                {project.fire_safety_active && (project.egressPaths ?? []).map((path) => <EgressPath3D key={path.id} path={path} />)}

                <CameraControls ref={cameraControlsRef} />
            </Canvas>
        </div>
    );
}
