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
    positions: Vec3[]
}

export type Graph = Record<string, GraphNode>;