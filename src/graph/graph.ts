import { Node } from "../schema/types"
import { Vec3 } from "../geometry/types";
import { Graph, GraphNode } from "./types";
import { vecToArray, vecToArrayString } from "../geometry/utils";
import { makeGraphNode } from "./make";
export const recomputeGraph = (node: Node): Graph | undefined=>{
    const overallGraph = populateGraphExtents(node.children);
    const nodes = node.children;
    return undefined;
}

const populateGraphExtents = (nodes: Node[]) =>{

    const record: Graph = {} as Graph;

    nodes.map(node=>{
        record[vecToArrayString(node.props.position)] = makeGraphNode(node);
    })
}