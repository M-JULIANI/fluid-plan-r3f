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
  providedLineWidth?: number,
  zIndex?: number,
}
export default function HighlightedPolygon(props: ChildCubeProps) {
  const { id, node, perimeterPositions, positions, providedLineWidth } = props;
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

  return (
    <>
      {orderedPerimeterPositions.map((x, i) => {
        if (i < orderedPerimeterPositions.length - 1) {
          const start = orderedPerimeterPositions[i];
          const end = orderedPerimeterPositions[i + 1];

          return (
          // <>
          <Line points={[...vecToArray(start), ...vecToArray(end)]} lineWidth={providedLineWidth ?? 4} 
          color={'black'} type="dashed" gapSize={3} dashSize={1}/>
        
          )
        }
      })
    }
    </>
  )
};






