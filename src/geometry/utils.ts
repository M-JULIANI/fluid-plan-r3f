import { Vec3 } from "./types"

export const vecToArray = (vector: Vec3) => [vector.x, vector.y, vector.z];
export const arrayToVec = (a: number[] | Vec3): Vec3 => { 
    const cast = a as Vec3;
    if(cast!== undefined){
        return cast;
    }

    const array = a as any;
    return { x: array[0], y: array[1], z: array[2] } as Vec3 
};

export const vecToArrayString = (vec: Vec3): string =>{
    const array = vecToArray(vec);
    return array.join(',');
}