import { getPointCollectionWidthHeight } from "./grid";
import { Vec3, Point } from "./types"
import { NodePositionInfo } from "../graph/types";
import { makeAllPointsFromNodes } from "./grid";
import { Node } from "../schema/types";
import { ProgramCategory } from "../constants/program";
import { Colors } from "../constants/colors";
import { Direction, getDomain } from "./domain";
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
   const vec = JSON.parse(string) as Vec3;
   return vec;
}

export const createImageOfGrid = (grid: Point[][], color: string, size: number) =>{
    const hiddenCanvas = document.createElement('canvas');
    const [width, height] = getPointCollectionWidthHeight(grid);
    hiddenCanvas.width = width  + size;
    hiddenCanvas.height = height + size;
    const ctx = hiddenCanvas.getContext('2d');
    if(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width + size, height + size);
        drawPoints(ctx, grid, size, color)
    }
    return hiddenCanvas.toDataURL('image/png');
}

export const drawPoints = async(ctx: CanvasRenderingContext2D, grid: Point[][], size: number, color: string) =>{

    ctx.strokeStyle = color ?? 'black';
 //   ctx.fillStyle = 'black';
    grid.map((cellsX, initialIndexX) => {
        cellsX.map((cellsY, initialIndexY) =>{

           // ctx.save();
            ctx.beginPath();
            ctx.rect(cellsY[0]+ (size * 0.5), cellsY[1] + (size * 0.5), 0.5, 0.5)
            // ctx.arc(, 0.5,
            //     0, Math.PI * 2);
            ctx.stroke();
         //   ctx.restore();
        })
    })   
   // ctx.save();
    ctx.restore();
}

export const makeImagesOfClusters = (clusterNodeInfo: NodePositionInfo[], size: number) => {
    const positions = clusterNodeInfo.map((nodeInfo) => {
        return makeImages(nodeInfo.node, nodeInfo.perimeterPositions, size);
    });

    return positions;
}

const makeImages = (node: Node, positions: Vec3[], size: number)=>{
    const pos = makeAllPointsFromNodes(positions, 1);
    const posExpanded = expandedGrid(pos, size);
    const normalizedGrid = normalize(posExpanded);
    const color = Colors[node.props.category as ProgramCategory];
    const img = createImageOfGrid(normalizedGrid, color, size);
    return img;
}

const expandedGrid = (positions: Point[][], factor: number)=>{
   return  positions.map(points=> points.map(x=> [x[0] * factor, x[1] * factor] as Point));
}

const normalize = (positions: Point[][])=>{
    const xDom = getDomain(Direction.X, positions);
    const yDom = getDomain(Direction.Y, positions);

    const xMin = xDom.min;
    const yMin = yDom.min;

    return positions.map(pos=> pos.map(p=> [p[0] - xMin, p[1] - yMin] as Point));
 }