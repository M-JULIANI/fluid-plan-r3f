import { Vec3 } from "./types"

export const vecToArray = (vector: Vec3) => [vector.x, vector.y, vector.z];
export const arrayToVec = (a: number[]): Vec3 => { return { x: a[0], y: a[1], z: a[2] } as Vec3 };

export const vecToArrayString = (vec: Vec3): string =>{
    const array = vecToArray(vec);
    return array.join(',');
}