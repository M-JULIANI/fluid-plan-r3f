
import { Vec3 } from "../geometry/types"
import { Node } from "../schema/types"
import { GraphNode } from "./types"


export const makeGraphNode = (node: Node) => {
    return {
        node: node,
        connectivity: 0,
        position: node.props.position ?? { x: 0, y: 0, z: 0 } as Vec3,
        active: false
    }
}

export const makeGraphNodeFromVec = (vec: Vec3, parentNode: Node) => {
    return {
        node: parentNode,
        connectivity: 0,
        position: vec,
        active: false
    }
}