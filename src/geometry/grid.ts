import { Direction, getDomain } from "./domain";
import { PointCollection, Vec3 } from "./types"
import { Point } from "./types";

export const makePointsFromVec = (vec: Vec3, cellSize: number = 1) => {

    const half = cellSize * 0.5;
    const pts = [] as Point[];
    for (let i = -1; i <= 1; i++) {
        if (i === 0) continue;
        for (let j = -1; j <= 1; j++) {
            if (j === 0) continue;

         //   const pt = [vec.x + (half * i), vec.z + (half * j)] as Point;
            const pt = [vec.x, vec.z] as Point;
            pts.push(pt);
        }
    }
    return pts;
}

export const makeAllPointsFromNodes = (vecs: Vec3[], size: number = 1)=>{
return vecs.map(x=> makePointsFromVec(x, size));
}

export const getPointCollectionWidthHeight = (pc: Point[][]) =>{
    const xDomain = getDomain(Direction.X, pc);
    const yDomain = getDomain(Direction.Y, pc);
    return [xDomain.max - xDomain.min, yDomain.max - yDomain.min];
}
