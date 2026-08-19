import { Text } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import { isSeatingItem, isTableItem } from '@/lib/space-planner-groups';
import type { FurnitureRenderShape, ProjectItem } from '@/types';

type ProjectItemMesh3DProps = {
    item: ProjectItem;
    brandColor: string;
    isSelected: boolean;
    isReserved?: boolean;
    onSelect: (id: number) => void;
};

const RESERVED_COLOR = '#94a3b8';
const STRUCTURAL_DARK = '#2A2826';
const SHELF_WOOD = '#8B6F47';
const PLANT_POT_COLOR = '#8B6F47';
const PLANT_FOLIAGE_COLOR = '#4A6741';

type PartMaterialFn = (baseColor: string) => {
    color: string;
    transparent: boolean;
    opacity: number;
    emissive: string;
    emissiveIntensity: number;
};

type ShapePartsProps = {
    shape: FurnitureRenderShape | undefined;
    seating: boolean;
    widthMeters: number;
    depthMeters: number;
    heightMeters: number;
    color: string;
    material: PartMaterialFn;
};

const LEG_INSET = 0.05;

function ShapeParts({ shape, seating, widthMeters, depthMeters, heightMeters, color, material }: ShapePartsProps) {
    const radius = Math.min(widthMeters, depthMeters) / 2;

    if (shape === 'round') {
        const topThickness = 0.04;
        const pedestalHeight = Math.max(heightMeters - topThickness - 0.03, 0.1);

        return (
            <>
                <mesh position={[0, heightMeters - topThickness / 2, 0]} castShadow receiveShadow>
                    <cylinderGeometry args={[radius, radius, topThickness, 32]} />
                    <meshStandardMaterial {...material(color)} roughness={0.45} />
                </mesh>
                <mesh position={[0, pedestalHeight / 2 + 0.03, 0]} castShadow>
                    <cylinderGeometry args={[0.05, 0.07, pedestalHeight, 12]} />
                    <meshStandardMaterial {...material(STRUCTURAL_DARK)} roughness={0.4} metalness={0.3} />
                </mesh>
                <mesh position={[0, 0.015, 0]} castShadow>
                    <cylinderGeometry args={[radius * 0.55, radius * 0.55, 0.03, 16]} />
                    <meshStandardMaterial {...material(STRUCTURAL_DARK)} roughness={0.4} />
                </mesh>
            </>
        );
    }

    if (shape === 'rect') {
        const legHeight = Math.max(heightMeters - 0.04, 0.1);
        const legPositions: [number, number][] = [
            [-widthMeters / 2 + LEG_INSET, -depthMeters / 2 + LEG_INSET],
            [widthMeters / 2 - LEG_INSET, -depthMeters / 2 + LEG_INSET],
            [-widthMeters / 2 + LEG_INSET, depthMeters / 2 - LEG_INSET],
            [widthMeters / 2 - LEG_INSET, depthMeters / 2 - LEG_INSET],
        ];

        return (
            <>
                <mesh position={[0, heightMeters - 0.02, 0]} castShadow receiveShadow>
                    <boxGeometry args={[widthMeters, 0.04, depthMeters]} />
                    <meshStandardMaterial {...material(color)} roughness={0.45} />
                </mesh>
                {legPositions.map(([lx, lz], index) => (
                    <mesh key={index} position={[lx, legHeight / 2, lz]} castShadow>
                        <boxGeometry args={[0.05, legHeight, 0.05]} />
                        <meshStandardMaterial {...material(STRUCTURAL_DARK)} roughness={0.4} metalness={0.3} />
                    </mesh>
                ))}
            </>
        );
    }

    if (shape === 'chair') {
        const legHeight = heightMeters * 0.5;
        const legPositions: [number, number][] = [
            [-widthMeters / 2 + 0.03, -depthMeters / 2 + 0.03],
            [widthMeters / 2 - 0.03, -depthMeters / 2 + 0.03],
            [-widthMeters / 2 + 0.03, depthMeters / 2 - 0.03],
            [widthMeters / 2 - 0.03, depthMeters / 2 - 0.03],
        ];

        return (
            <>
                <mesh position={[0, legHeight, 0]} castShadow receiveShadow>
                    <boxGeometry args={[widthMeters, 0.05, depthMeters]} />
                    <meshStandardMaterial {...material(color)} roughness={0.7} />
                </mesh>
                <mesh position={[0, legHeight + heightMeters * 0.28, -depthMeters / 2 + 0.02]} castShadow>
                    <boxGeometry args={[widthMeters, heightMeters * 0.55, 0.04]} />
                    <meshStandardMaterial {...material(color)} roughness={0.7} />
                </mesh>
                {legPositions.map(([lx, lz], index) => (
                    <mesh key={index} position={[lx, legHeight / 2, lz]} castShadow>
                        <boxGeometry args={[0.03, legHeight, 0.03]} />
                        <meshStandardMaterial {...material(STRUCTURAL_DARK)} roughness={0.5} metalness={0.3} />
                    </mesh>
                ))}
            </>
        );
    }

    if (shape === 'stool') {
        const legHeight = Math.max(heightMeters - 0.05, 0.1);

        return (
            <>
                <mesh position={[0, heightMeters - 0.025, 0]} castShadow receiveShadow>
                    <cylinderGeometry args={[radius, radius, 0.05, 16]} />
                    <meshStandardMaterial {...material(color)} roughness={0.7} />
                </mesh>
                <mesh position={[0, legHeight / 2, 0]} castShadow>
                    <cylinderGeometry args={[0.03, 0.04, legHeight, 8]} />
                    <meshStandardMaterial {...material(STRUCTURAL_DARK)} roughness={0.4} metalness={0.5} />
                </mesh>
                <mesh position={[0, 0.01, 0]}>
                    <cylinderGeometry args={[radius * 0.9, radius * 0.9, 0.02, 16]} />
                    <meshStandardMaterial {...material(STRUCTURAL_DARK)} roughness={0.5} />
                </mesh>
            </>
        );
    }

    if (shape === 'plant') {
        const foliagePositions: [number, number, number, number][] = [
            [0, heightMeters * 0.6, 0, 1],
            [radius * 0.4, heightMeters * 0.5, 0, 0.8],
            [-radius * 0.4, heightMeters * 0.5, radius * 0.3, 0.8],
            [0, heightMeters * 0.5, -radius * 0.4, 0.8],
            [radius * 0.3, heightMeters * 0.75, radius * 0.2, 0.7],
        ];

        return (
            <>
                <mesh position={[0, heightMeters * 0.18, 0]} castShadow receiveShadow>
                    <cylinderGeometry args={[radius * 0.75, radius * 0.6, heightMeters * 0.35, 16]} />
                    <meshStandardMaterial {...material(PLANT_POT_COLOR)} roughness={0.7} />
                </mesh>
                {foliagePositions.map(([px, py, pz, scale], index) => (
                    <mesh key={index} position={[px, py, pz]} scale={[scale, scale * 1.3, scale]} castShadow>
                        <sphereGeometry args={[radius * 0.5, 8, 6]} />
                        <meshStandardMaterial {...material(PLANT_FOLIAGE_COLOR)} roughness={0.8} />
                    </mesh>
                ))}
            </>
        );
    }

    if (shape === 'shelf') {
        const shelfYPositions = [0.1, heightMeters * 0.4, heightMeters * 0.7, heightMeters - 0.05];

        return (
            <>
                {[-widthMeters / 2 + 0.02, widthMeters / 2 - 0.02].map((sx, index) => (
                    <mesh key={index} position={[sx, heightMeters / 2, 0]} castShadow>
                        <boxGeometry args={[0.04, heightMeters, depthMeters]} />
                        <meshStandardMaterial {...material(SHELF_WOOD)} roughness={0.6} />
                    </mesh>
                ))}
                {shelfYPositions.map((sy, index) => (
                    <mesh key={index} position={[0, sy, 0]} castShadow receiveShadow>
                        <boxGeometry args={[widthMeters - 0.08, 0.03, depthMeters]} />
                        <meshStandardMaterial {...material(SHELF_WOOD)} roughness={0.6} />
                    </mesh>
                ))}
                <mesh position={[0, heightMeters / 2, -depthMeters / 2 + 0.005]}>
                    <boxGeometry args={[widthMeters - 0.1, heightMeters - 0.1, 0.01]} />
                    <meshStandardMaterial {...material(color)} roughness={0.6} />
                </mesh>
            </>
        );
    }

    return (
        <mesh position={[0, heightMeters / 2, 0]} castShadow receiveShadow>
            {seating ? <cylinderGeometry args={[radius, radius, heightMeters, 16]} /> : <boxGeometry args={[widthMeters, heightMeters, depthMeters]} />}
            <meshStandardMaterial {...material(color)} />
        </mesh>
    );
}

export function ProjectItemMesh3D({ item, brandColor, isSelected, isReserved = false, onSelect }: ProjectItemMesh3DProps) {
    const widthMeters = parseFloat(item.furniture?.width_m ?? '1');
    const depthMeters = parseFloat(item.furniture?.depth_m ?? '1');
    const heightMeters = parseFloat(item.furniture?.height_m ?? '0.75');
    const x = parseFloat(item.x_coord);
    const z = parseFloat(item.y_coord);

    const renderMetadata = item.furniture?.render_metadata;
    const accentColor = item.custom_color ?? (renderMetadata?.brand_accent ? brandColor : item.furniture?.default_color) ?? brandColor;
    const seating = isSeatingItem(item);
    const shape = renderMetadata?.shape ?? (isTableItem(item) ? 'rect' : undefined);

    const material: PartMaterialFn = (base) => ({
        color: isReserved ? RESERVED_COLOR : base,
        transparent: isReserved,
        opacity: isReserved ? 0.55 : 1,
        emissive: isSelected ? '#111827' : '#000000',
        emissiveIntensity: isSelected ? 0.2 : 0,
    });

    const handleClick = (event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        onSelect(item.id);
    };

    return (
        <group position={[x, 0, z]} rotation={[0, (item.rotation * Math.PI) / 180, 0]} onClick={handleClick}>
            <ShapeParts
                shape={shape}
                seating={seating}
                widthMeters={widthMeters}
                depthMeters={depthMeters}
                heightMeters={heightMeters}
                color={accentColor}
                material={material}
            />

            {isReserved && (
                <Text position={[0, heightMeters + 0.35, 0]} fontSize={0.18} color="#7f1d1d" anchorX="center" anchorY="middle">
                    Reserved
                </Text>
            )}
        </group>
    );
}
