import { Vec3 } from "./types"

export const vecToArray = (vector: Vec3) => [vector.x, vector.y, vector.z];
export const numArrayToVec = (a: number[]): Vec3 => { 
    if (Array.isArray(a)) {
        return { x: a[0], y: a[1], z: a[2] } as Vec3 
    }
    return a; 
};

export const stringArrayToVec3 = (a: string): Vec3 => { 
    const numbers = a.split(',');
    return { x: +numbers[0], y: +numbers[1], z: +numbers[2] } as Vec3 
};

export const vec3ToArrayString = (vec: Vec3): string =>{
    const array = vecToArray(vec);
    return array.join(',');
}

export const stringToVec3 = (string: string): Vec3 =>{
    console.log('a streng')
    console.log(string)
   const vec = JSON.parse(string) as Vec3;
   return vec;
}