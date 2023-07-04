import React, { SetStateAction, useCallback, useEffect, useState } from 'react';
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Line, Point, Text, Text3D, TransformControls } from '@react-three/drei';
import { TaggedUpdater, Updater } from 'state/types';
import { patch, $set } from '../state/ops';
import { Node } from 'schema/types';
import { Colors } from '../constants/colors';
import { ProgramCategory } from '../constants/program';
import { Vec3 } from '../geometry/types';
import { Shape, Vector3 } from 'three';
import { vecToArray } from '../geometry/utils';
import { getSortedPerimeterCells, getPerimeterCellsManually, getNeighborCount } from '../graph/perimeterSolver';
import { makeExpandedGrid } from '../geometry/grid';
import { Graph, GraphNode } from '../graph/types';
import { vec3ToArrayString } from '../geometry/utils';
export type ChildCubeProps = {
  id: string,
  node: Node,
  positions: Vec3[],
  perimeterPositions: Vec3[],
  zIndex?: number,
}
export default function PolygonMesh(props: ChildCubeProps) {
  const { id, node, perimeterPositions, positions } = props;
  const cube = useRef<THREE.Mesh>({} as THREE.Mesh);
  const color = Colors[node.props.category as ProgramCategory];

  const verticesRaw = [] as number[];

  perimeterPositions.forEach(x => {
    verticesRaw.push(x.x);
    verticesRaw.push(x.y);
    verticesRaw.push(x.z);
  })
  const vertices = new Float32Array(verticesRaw);
  const normalVecs = [] as THREE.Vector3[];
  perimeterPositions.forEach(x => normalVecs.push(new THREE.Vector3(0, 1, 0)));

  //handles converting to XY
  const converted = positions.map(x=> {
    return {x: x.x, y: x.z, z: x.y} as Vec3});

   const expandedGrid =  makeExpandedGrid(converted);
  const perimeterGraph: Graph = {};
  expandedGrid.forEach((x) => {
      const newPos = { x: x.x, y: x.y, z: x.z } as Vec3
      const graphNode = {
          node: {},
          connectivity: 0,
          position: newPos,
          active: false,
      } as GraphNode;
      perimeterGraph[vec3ToArrayString(newPos)] = graphNode;
  })
  const boundaryPerimeterCells = getPerimeterCellsManually(perimeterGraph).map(x=> {
    return {x: x.position.x, y: x.position.y, z: x.position.z} as Vec3});

 const orderedPerimeterPositions = getSortedPerimeterCells(boundaryPerimeterCells).map(x=> {return {x: x.x, y: x.z, z: x.y} as Vec3});
 //const orderedPerimeterPositions = boundaryPerimeterCells.map(x=> {return {x: x.x, y: x.z, z: x.y} as Vec3});
  const computedNormals = [] as number[];
  normalVecs.forEach(x => {
    computedNormals.push(x.x)
    computedNormals.push(x.y)
    computedNormals.push(x.z);
  });

  const normals = new Float32Array(computedNormals);
 // console.log('normals: ' + computedNormals.length)

  //console.log('---')


  return (
    <>
      {orderedPerimeterPositions.map((x, i) => {
        if (i < orderedPerimeterPositions.length - 1) {
          const start = orderedPerimeterPositions[i];
          const end = orderedPerimeterPositions[i + 1];
          const upPos = { x: x.x, y: x.y + 0.25, z: x.z };
          const updatedArray = vecToArray(upPos) as any;
          const swapped = { x: start.x, y: start.z, z: start.y };
          const connect = getNeighborCount(swapped, perimeterGraph);

          return (
          <>
          <Line points={[...vecToArray(start), ...vecToArray(end)]} lineWidth={4} color={color} />
          <Text position={updatedArray} color={'black'}
                        fontSize={0.25}
                        rotation-x={-Math.PI / 2}
                    >
                      {`${connect}`}
                       {/* {`${updatedArray[0]}, ${updatedArray[2]}`} */}
                    </Text> 
          </>
          )
        }
      })
      
    }
    </>
  )

  //     <mesh ref={cube} position={node.props.position}>

  //       <bufferGeometry attach="geometry">
  //         <bufferAttribute attach="position" array={vertices} itemSize={3}  /> 
  //         <bufferAttribute attach="normal" array={normals} itemSize={3}  />
  //         <bufferAttribute attach="index" array={floatIndeces} itemSize={3}/>
  //       </bufferGeometry>
  //       <meshStandardMaterial color={color} />
  //     </mesh>

};

// Ear Clipping algorithm implementation
function earclip(vertices: THREE.Vector3[]): number[] {
  const indices: number[] = [];

  const polygon = vertices.map(vertex => [vertex.x, vertex.z]);
  let numVertices = polygon.length;

  let v = 0;

  while (numVertices > 2) {
    if (isEar(v, polygon)) {
      const v0 = (v + numVertices - 1) % numVertices;
      const v1 = v;
      const v2 = (v + 1) % numVertices;

      indices.push(vertices.indexOf(vertices[v0]));
      indices.push(vertices.indexOf(vertices[v1]));
      indices.push(vertices.indexOf(vertices[v2]));

      polygon.splice(v, 1);
      numVertices--;

      v = 0;
    } else {
      v = (v + 1) % numVertices;
    }
  }

  return indices;
}

function isEar(v: number, polygon: number[][]): boolean {
  const numVertices = polygon.length;

  const v0 = polygon[(v + numVertices - 1) % numVertices];
  const v1 = polygon[v];
  const v2 = polygon[(v + 1) % numVertices];

  const triangle = [v0, v1, v2];

  for (let i = 0; i < numVertices; i++) {
    if (i !== v && i !== (v + numVertices - 1) % numVertices && i !== (v + 1) % numVertices) {
      if (pointInTriangle(polygon[i], triangle)) {
        return false;
      }
    }
  }

  return true;
}

function pointInTriangle(point: number[], triangle: number[][]): boolean {
  const p0 = triangle[0];
  const p1 = triangle[1];
  const p2 = triangle[2];

  const dX = point[0] - p2[0];
  const dY = point[1] - p2[1];
  const dX21 = p2[0] - p1[0];
  const dY12 = p1[1] - p2[1];
  const D = dY12 * (p0[0] - p2[0]) + dX21 * (p0[1] - p2[1]);
  const s = dY12 * dX + dX21 * dY;
  const t = (p2[1] - p0[1]) * dX + (p0[0] - p2[0]) * dY;

  if (D < 0) {
    return s <= 0 && t <= 0 && s + t >= D;
  }

  return s >= 0 && t >= 0 && s + t <= D;
}







