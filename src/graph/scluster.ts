import { Vec3 } from 'geometry/types';
import { vecToArrayString } from '../geometry/utils';
import { Node } from '../schema/types';
import { Graph, GraphNode } from './types';
import { makeGraphNode } from './make';
export class sCluster {

    parent: Node;
    initialLocs: Vec3[];
    localGraph: Graph;
    overallGraph: Graph;
    constructor(node: Node, overallGraph: Graph) {
        this.parent = node;
        this.overallGraph = overallGraph;
        this.initialLocs = this.computeLocs(node.props.position, node.props.length, node.props.width);
        this.localGraph = this.initializeLocalGraph(this.initialLocs);
    }

    getPositions(){
        return this.initialLocs;
    }

    computeLocs(loc: Vec3, length: number, width: number): Vec3[] {
        const halfLength = Math.floor(length / 2);
        const halfWidth = Math.floor(width / 2);

        let pos = [];
        for (let i = -halfLength; i < halfLength; i++) {
            for (let j = -halfWidth; j < halfWidth; j++) {
                const position = { x: loc.x + i, y: 0, z: loc.z + j } as Vec3;
                pos.push(position);
            }
        }
        return pos;
    }

    initializeLocalGraph(locs: Vec3[]) {
        const localGraph: Graph = {} as Graph;

        locs.map(loc => {
            const key = vecToArrayString(loc);
            const gNode = makeGraphNode(this.parent) as GraphNode;
            if (localGraph[key] === undefined) {
                localGraph[key] = gNode;
            }

            if (this.overallGraph[key] === undefined) {
                this.overallGraph[key] = gNode;
            }
        })

        return localGraph;
    }
}