import { Node } from "../schema/types"
import { Vec3 } from "../geometry/types";
import { Graph, GraphNode, NodePositionInfo } from "./types";
import { vecToArray, vec3ToArrayString } from "../geometry/utils";
import { makeGraphNode } from "./make";
import { sCluster } from "./scluster";

export const recomputeGraph = (node: Node): NodePositionInfo[] => {
    const overallGraph = populateGraphExtents(node.children);
    const nodes = orderChildrenByZIndex(node.children);

    const clusters = nodes.map(node => {
        const cluster = new sCluster(node, overallGraph);
        return cluster;
    });

    const usedPositions = [] as Vec3[];


    clusters.map((x, index)=>{
        x.computePositions(usedPositions, index);
        x.currentLocs.forEach(loc=> usedPositions.push(loc));
    })

    const clusterPositions = clusters.map((x,index) => {
        const positions = x.getPositions();
        const perimeterPositions = x.getPerimeterCells(x.localGraph);
        const perim = Object.values(perimeterPositions).map(x => x.position);
        const connectivity = x.getConnectivity()
        return { node: x.parent, positions: positions, perimeterPositions: perim, connectivities: connectivity };
    });

    return clusterPositions;
}

const populateGraphExtents = (nodes: Node[]) => {
    const record: Graph = {} as Graph;
    nodes.map(node => {
        record[vec3ToArrayString(node.props.position)] = makeGraphNode(node);
    })
    return record;
}

const orderChildrenByZIndex = (nodes: Node[]) => {
    return nodes.sort((a, b) => (a?.props?.zIndex ?? 0) - (b?.props?.zIndex ?? 0));
}

