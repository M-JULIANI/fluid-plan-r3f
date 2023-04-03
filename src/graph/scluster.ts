import { distanceTo, Vec3 } from '../geometry/types';
import { numArrayToVec, stringArrayToVec3, stringToVec3, vec3ToArrayString } from '../geometry/utils';
import { Node } from '../schema/types';
import { Graph, GraphNode } from './types';
import { makeGraphNode, makeGraphNodeFromVec } from './make';
import { generateUUID } from 'three/src/math/MathUtils';
export class sCluster {

  id: string;
  parent: Node;
  initialLocs: Vec3[];
  currentLocs: Vec3[];
  localGraph: Graph;
  overallGraph: Graph;
  constructor(node: Node, overallGraph: Graph) {
    this.id = generateUUID();
    this.parent = node;
    this.overallGraph = overallGraph;
    const convertedPos = numArrayToVec(node.props.position);
    this.initialLocs = this.computeLocs(convertedPos, node.props.length, node.props.width);
    this.currentLocs = [...this.initialLocs];
    this.localGraph = this.initializeLocalGraph(this.currentLocs);
  }

  getPositions() {
    return this.currentLocs;
  }

  computeLocs(loc: Vec3, length: number, width: number): Vec3[] {
    const halfLength = Math.floor(length / 2);
    const halfWidth = Math.floor(width / 2);
    let pos = [] as Vec3[];
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
      const key = vec3ToArrayString(loc);
      const gNode = makeGraphNodeFromVec(loc, this.parent) as GraphNode;
      gNode.active = true;
      if (localGraph[key] === undefined) {
        localGraph[key] = gNode;
      }

      if (this.overallGraph[key] === undefined) {
        this.overallGraph[key] = gNode;
      }
    })

    return localGraph;
  }

  computePositions(prohibitedLocations: Vec3[], listIndex: number) {
    const currentPts = [...this.currentLocs];
    const conn: number[] = [];
    if (prohibitedLocations.length != 0 || listIndex == 0) {
      let objectsToRelocate = 0;

      var locsToRemove: Vec3[] = [];
      const currentStrings = currentPts.map(c=> vec3ToArrayString(c));

      for (let i = 0; i < prohibitedLocations.length; i++) {
        let loc = prohibitedLocations[i];
        let s = vec3ToArrayString(loc);
        let cell = this.overallGraph[vec3ToArrayString(loc)];
        cell.active = true;
        if (currentStrings.includes(s)) {
          objectsToRelocate++;
          locsToRemove.push(loc)
        }
      }
      
      const localGraphKeys = Object.keys(this.localGraph);
      for (let i = 0; i < localGraphKeys.length; i++) {
        const item = stringArrayToVec3(localGraphKeys[i])
        const connect = this.getNeighborConnectivity(item.x, item.z);
        const neighborCount = this.getNeighborCount(item.x, item.z);
        const cell = this.localGraph[localGraphKeys[i]];
        cell.connectivity = connect;
        conn.push(neighborCount);
      }

      var perimeterLocations = this.getPerimeterCells(this.localGraph);

      console.log('perimieter locations: ' + perimeterLocations.length)
      console.log('loc to remove: ' + locsToRemove.length)
      console.log('objs to relocate: ' + objectsToRelocate)

      if (locsToRemove.length > perimeterLocations.length) {
        this.localGraph = this.recursiveExpand(this.localGraph, locsToRemove.length);
        // const loct = Object.values(this.localGraph).filter(x => x.active).map(x => x.position);
        // // console.log('filtered list:')
        // // console.log(loct)
        console.log('move locs to remove than there are perim conditions!!!!!!')
        this.currentLocs = Object.values(this.localGraph).filter(x => x.active).map(x => x.position);
        return conn;
      }

      //is this being sorted correctly
      const orderedByConnectivity = perimeterLocations.sort((a, b) => b.connectivity - a.connectivity);
      const newExpansionNodes = orderedByConnectivity.slice(0, objectsToRelocate + 1);

      const keys = Object.keys(this.localGraph);
      const vals = Object.values(this.localGraph);

      let expansionPtLength = newExpansionNodes.length;
      this.localGraph = {} as Graph;
      for (let k = 0; k < keys.length; k++) {
        if (!locsToRemove.includes(stringArrayToVec3(keys[k]))) {
          this.localGraph[keys[k]] = vals[k];
        }
      }

      for (let i = 0; i < expansionPtLength; i++) {
        this.tryExpand(newExpansionNodes[i], this.localGraph);
      }
      this.currentLocs = Object.values(this.localGraph).filter(f => f.active).map(x => x.position);
    }

    return conn;
  };


  getNeighborConnectivity(x: number, y: number) {
    let total = 0.0;

    const current = { x: x, y: 0, z: y } as Vec3;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i == 0 && j == 0)
          continue;

        const neighborPos = { x: x + i, y: 0, z: y + j } as Vec3;
        const exists = this.localGraph[vec3ToArrayString(neighborPos)];
        if (exists) {
          if (exists.active) {
            const dist = distanceTo(current, neighborPos);
            total += (1 / dist);
          }
        }
      }
    }
    return total;
  }

  getNeighborCount(x: number, y: number) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i == 0 && j == 0)
          continue;

        const neighborPos = { x: x + i, y: 0, z: y + j } as Vec3;
        const exists = this.localGraph[vec3ToArrayString(neighborPos)];

        if (exists) {
          if (exists.active) {
            count++;
          }
        }
      }
    }
    return count;
  }


  getPerimeterCells(locGraph: Graph): GraphNode[] {
    return Object.values(locGraph).filter(cell => this.getNeighborCount(cell.position.x, cell.position.z) <= 5)
  }

  recursiveExpand(localGraph: Graph, numCells: number): Graph {
    let relocated = 0;
    while (relocated < numCells) {
      const perim = this.getPerimeterCells(localGraph);

      for (let i = 0; i < perim.length; i++) {
        if (relocated == numCells)
          break;
        this.tryExpand(perim[i], localGraph);

        relocated++;
      }
    }
    return localGraph;
  }

  tryExpand(graphNode: GraphNode, localGraph: Graph) {
    const loc = graphNode.position;
    let x = loc.x;
    let y = loc.z;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i == 0 && j == 0)
          continue;

        var neighborPos = { x: x + 1, y: 0, z: y + j } as Vec3;
        const neighborIndex = vec3ToArrayString(neighborPos);
        const existsOnLocalGraph = this.localGraph[neighborIndex];

        if (existsOnLocalGraph == null || existsOnLocalGraph === undefined) {
          const existsOnOverall = this.overallGraph[neighborIndex];
          if (existsOnOverall) {
            if (!existsOnOverall.active) {
              this.updateGraphLocation(graphNode, neighborPos, localGraph);
            }
          }
          else {
            this.addGraphLocation(graphNode, neighborPos, localGraph);
          }
        }
      }
    }
  }

  updateGraphLocation(parent: GraphNode, neighborPos: Vec3, locGraph: Graph) {
    const graphNode = makeGraphNodeFromVec(neighborPos, parent.node);
    graphNode.active = true;
    const index = vec3ToArrayString(neighborPos);
    locGraph[index] = graphNode;
    this.overallGraph[index] = graphNode;
  }
  addGraphLocation(parent: GraphNode, neighborPos: Vec3, locGraph: Graph) {
    const graphNode = makeGraphNodeFromVec(neighborPos, parent.node);
    graphNode.active = true;
    const index = vec3ToArrayString(neighborPos);
    locGraph[index] = graphNode;
    this.overallGraph[index] = graphNode;
    const parentLoc = parent.position;
    delete locGraph[vec3ToArrayString(parentLoc)];
  }
}