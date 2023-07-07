import { vec3ToArrayString } from '../geometry/utils';
import { Vec3 } from '../geometry/types';
import { Graph, GraphNode } from './types';

enum Direction {
    Right = 0,
    Up = 1,
    Left = 2,
    Down = 3
}

export const getSortedPerimeterCells = (perimeterCells: Vec3[]) => {
    const perimeterGraph: Graph = {};
    perimeterCells.forEach((x) => {
        const newPos = { x: x.x, y: x.y, z: x.z } as Vec3
        const graphNode = {
            node: {},
            connectivity: 0,
            position: newPos,
            active: false,
        } as GraphNode;
        perimeterGraph[vec3ToArrayString(newPos)] = graphNode;
    })


    const startingNode = Object.values(perimeterGraph).sort((a, b) => ((a.position.y - b.position.y)* 2) + (a.position.x - b.position.x))[0];
    let output = [] as Vec3[];
    let found = true;
    let currentNode = startingNode;
    let c = 0;
    while (found) {
        const { exists, position } = tryGetNext(currentNode, perimeterGraph, c === 0);
        found = exists;
        if (found && position) {
            currentNode = perimeterGraph[vec3ToArrayString(position)];
            output.push(position);
        }
        c++;
    }
    return output;
}

const tryGetNext = (current: GraphNode, graph: Graph, initial: boolean): { exists: boolean, position: Vec3 | undefined } => {
    let nPos = {} as Vec3;
    for (let i = 0; i < 4; i++) {
        let direction = Direction.Down;
        if (i === 0) direction = Direction.Right;
        if (i === 1) direction = Direction.Up;
        if (i === 2) direction = Direction.Left;
        if (i === 3) direction = Direction.Down;
        const { exists, position: neighborPos } = getNeighbor(current.position, graph, direction);
        nPos = neighborPos;
        if (exists) {
            if (graph[vec3ToArrayString(neighborPos)]) {
                if (!initial) graph[vec3ToArrayString(neighborPos)].active = true;
                return { exists: true, position: neighborPos };
            }
        }
    }
    return { exists: false, position: nPos };
}

const getNeighbor = (pos: Vec3, graph: Graph, direction: Direction): { exists: boolean, position: Vec3 } => {
    const { x, y, z } = pos;
    let xIncrement, yIncrement = 0;
    switch (direction) {
        case Direction.Right:
            xIncrement = 1;
            yIncrement = 0;
            break;
        case Direction.Up:
            xIncrement = 0;
            yIncrement = 1;
            break;
        case Direction.Left:
            xIncrement = -1;
            yIncrement = 0;
            break
        case Direction.Down:
            xIncrement = 0;
            yIncrement = -1;
            break;
    }
    const neighborPos = { x: x + xIncrement, y: y + yIncrement, z: z } as Vec3;
    const exists = graph[vec3ToArrayString(neighborPos)];
    if (exists && !exists.active) {
        return { exists: true, position: neighborPos }
    }

    return { exists: false, position: neighborPos }
}

export const getPerimeterCellsManually = (locGraph: Graph, cellSize = 1): GraphNode[] => {
    return Object.values(locGraph).filter(cell => getNeighborCount(cell.position, locGraph, cellSize) < 8)
}

export const getNeighborCount = (pos: Vec3, graph: Graph, size = 1) => {
    const { x, y, z } = pos;
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0)
                continue;

            const neighborPos = { x: x + (i * size), y: y + (j * size), z: z } as Vec3;
            const exists = graph[vec3ToArrayString(neighborPos)];
            if (exists && !exists.active) {
                count++;
            }
        }
    }
    return count;
}