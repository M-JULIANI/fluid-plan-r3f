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

function vec3EqualityCheck(a: Vec3, b: Vec3): boolean {
    return a.x === b.x && a.y === b.y && a.z === b.z;
}


export const uniqueVectors = (vectors: Vec3[]) => [...new Set(vectors.map((x)=> JSON.stringify(x)))].map((x)=>JSON.parse(x));

