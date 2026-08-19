import type { ThreeEvent } from '@react-three/fiber';
import { isSeatingItem } from '@/lib/space-planner-groups';
import type { ProjectItem } from '@/types';

type ProjectItemMesh3DProps = {
    item: ProjectItem;
    brandColor: string;
    isSelected: boolean;
    onSelect: (id: number) => void;
};

export function ProjectItemMesh3D({ item, brandColor, isSelected, onSelect }: ProjectItemMesh3DProps) {
    const widthMeters = parseFloat(item.furniture?.width_m ?? '1');
    const depthMeters = parseFloat(item.furniture?.depth_m ?? '1');
    const heightMeters = parseFloat(item.furniture?.height_m ?? '0.75');
    const x = parseFloat(item.x_coord);
    const z = parseFloat(item.y_coord);
    const color = item.custom_color ?? item.furniture?.default_color ?? brandColor;
    const seating = isSeatingItem(item);

    const handleClick = (event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        onSelect(item.id);
    };

    return (
        <mesh
            position={[x, heightMeters / 2, z]}
            rotation={[0, (item.rotation * Math.PI) / 180, 0]}
            castShadow
            onClick={handleClick}
        >
            {seating ? (
                <cylinderGeometry
                    args={[Math.min(widthMeters, depthMeters) / 2, Math.min(widthMeters, depthMeters) / 2, heightMeters, 16]}
                />
            ) : (
                <boxGeometry args={[widthMeters, heightMeters, depthMeters]} />
            )}
            <meshStandardMaterial color={color} emissive={isSelected ? '#111827' : '#000000'} emissiveIntensity={isSelected ? 0.2 : 0} />
        </mesh>
    );
}
