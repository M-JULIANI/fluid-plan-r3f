import { Node } from "../schema/types"
import { Vec3 } from "../geometry/types";
import { Graph, GraphNode, NodePositionInfo } from "./types";
import { vecToArray, vecToArrayString } from "../geometry/utils";
import { makeGraphNode } from "./make";
import { sCluster } from "./scluster";

export const recomputeGraph = (node: Node): NodePositionInfo[] => {
    const overallGraph = populateGraphExtents(node.children);
    const nodes = node.children;

    const clusters = nodes.map(node => {
        const cluster = new sCluster(node, overallGraph);
        return cluster;
    });

    const clusterPositions = clusters.map((x,index) => {
        const positions = x.getPositions();
        return { node: x.parent, positions: positions };
    });

    return clusterPositions;
}

const populateGraphExtents = (nodes: Node[]) => {
    const record: Graph = {} as Graph;
    nodes.map(node => {
        record[vecToArrayString(node.props.position)] = makeGraphNode(node);
    })
    return record;
}

