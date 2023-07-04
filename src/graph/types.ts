import { Vec3 } from "../geometry/types";
import { Node } from "../schema/types";

export type GraphNode = {
    node: Node
    connectivity: number,
    position: Vec3,
    active: boolean,
}

export type NodePositionInfo = {
    node: Node,
    positions: Vec3[],
    perimeterPositions: Vec3[],
    connectivities?: number[]
}

export type Graph = Record<string, GraphNode>;