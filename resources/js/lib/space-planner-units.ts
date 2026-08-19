export const METERS_TO_PX = 60;

export function metersToPixels(meters: number): number {
    return meters * METERS_TO_PX;
}

export function pixelsToMeters(pixels: number): number {
    return pixels / METERS_TO_PX;
}
