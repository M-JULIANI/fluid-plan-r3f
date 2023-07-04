export type Vec3 = {
    x: number,
    y: number,
    z: number
}

export function distanceTo(v1: Vec3, v2: Vec3){
    return Math.abs(v2.x - v1.x) + Math.abs(v2.z - v1.z);
}

export type Point = [number, number];

export type PointCollection = Point[];
