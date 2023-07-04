import { Direction, getDomain } from "./domain";
import {  uniqueVectors, Vec3 } from "./types"
import { Point } from "./types";


export const expandGridByHalf = (vec: Vec3, cellSize: number = 1) => {

    const half = cellSize * 0.5;
    const pts = [] as Vec3[];
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;

            const pt = { x: vec.x + (half * i), y: 0, z: vec.z + (half * j) } as Vec3;
            pts.push(pt);
        }
    }
    return pts;
}

export const expandGridCustom = (vec: Vec3, cellSize: number = 1) => {

    const half = cellSize * 0.5;

    return [
        { x: vec.x + (half), y: vec.y + (half), z: vec.z } as Vec3,
        { x: vec.x - (half), y: vec.y + (half), z: vec.z } as Vec3,
        { x: vec.x + (half),y: vec.y - (half), z: vec.z } as Vec3,
        { x: vec.x - (half),y: vec.y - (half), z: vec.z } as Vec3,
    ]
}

export const makeExpandedGrid = (vecs: Vec3[], size: number = 1) => {
    const allPts =  vecs.flatMap(x => expandGridCustom(x, size));
    const set = uniqueVectors(allPts);
    return set;
}
export const makePointsFromVec = (vec: Vec3, cellSize: number = 1) => {

    const half = cellSize * 0.5;
    const pts = [] as Point[];
    for (let i = -1; i <= 1; i++) {
        if (i === 0) continue;
        for (let j = -1; j <= 1; j++) {
            if (j === 0) continue;

            const pt = [vec.x + (half * i), vec.z + (half * j)] as Point;
            // const pt = [vec.x, vec.z] as Point;
            pts.push(pt);
        }
    }
    return pts;
}

export const makeAllPointsFromNodes = (vecs: Vec3[], size: number = 1) => {
    return vecs.map(x => makePointsFromVec(x, size));
}

export const getPointCollectionWidthHeight = (pc: Point[][]) => {
    const xDomain = getDomain(Direction.X, pc);
    const yDomain = getDomain(Direction.Y, pc);
    return [xDomain.max - xDomain.min, yDomain.max - yDomain.min];
}
