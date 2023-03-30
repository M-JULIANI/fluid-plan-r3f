import React, { SetStateAction, useCallback, useEffect, useState } from 'react';
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { TransformControls } from '@react-three/drei';
import { TaggedUpdater, Updater } from 'state/types';
import { patch, $set } from '../state/ops';
import { Node } from 'schema/types';
import { Colors, ProgramCategory } from '../constants/colors';
import { Vec3 } from '../geometry/types';
import { Vector3 } from 'three';
export type ChildCubeProps = {
    id: string,
    node: Node,
    positions: Vec3[]
   // root: Node,
  //  updateTree: TaggedUpdater<Node>,
    zIndex?: number,
}
export default function ChildCube(props: ChildCubeProps) {
    const { id, node, positions } = props;
    const cube = useRef<THREE.Mesh>({} as THREE.Mesh);
    const color = Colors[node.props.category as ProgramCategory];

    return (
        <>
        {positions.map(p=>{
            const vec = {x: p.x, y: p.y, z: p.z} as Vector3;
            return <>
            <mesh ref={cube} position={vec}>
                <boxGeometry />
                <meshStandardMaterial color={color} />
            </mesh>
            </>
        })}
        </>
    );
};