import { CameraControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { ProjectItemMesh3D } from '@/components/space-planner/project-item-mesh-3d';
import type { UseCameraSwingReturn } from '@/hooks/use-camera-swing';
import type { Project, ProjectItem } from '@/types';

type PerspectiveScene3DProps = {
    project: Project;
    items: ProjectItem[];
    brandColor: string;
    selectedId: number | null;
    onSelectItem: (id: number) => void;
    cameraControlsRef: UseCameraSwingReturn['controlsRef'];
    className?: string;
};

export function PerspectiveScene3D({
    project,
    items,
    brandColor,
    selectedId,
    onSelectItem,
    cameraControlsRef,
    className,
}: PerspectiveScene3DProps) {
    const widthMeters = parseFloat(project.width_m);
    const heightMeters = parseFloat(project.height_m);

    return (
        <div className={className ?? 'h-full w-full overflow-hidden rounded-lg border border-sidebar-border/70 dark:border-sidebar-border'}>
            <Canvas shadows camera={{ position: [8, 8, 8], fov: 45 }}>
                <color attach="background" args={['#f5f5f4']} />
                <ambientLight intensity={0.6} />
                <directionalLight position={[6, 10, 4]} intensity={1} castShadow />

                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[widthMeters / 2, 0, heightMeters / 2]} receiveShadow>
                    <planeGeometry args={[widthMeters, heightMeters]} />
                    <meshStandardMaterial color="#e7e5e4" />
                </mesh>

                {items.map((item) => (
                    <ProjectItemMesh3D
                        key={item.id}
                        item={item}
                        brandColor={brandColor}
                        isSelected={selectedId === item.id}
                        onSelect={onSelectItem}
                    />
                ))}

                <CameraControls ref={cameraControlsRef} />
            </Canvas>
        </div>
    );
}
