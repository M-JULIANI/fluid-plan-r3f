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
import { vecToArray } from '../geometry/utils';
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
            {positions.map((pos,index) => {
                const array = vecToArray(pos) as any;
                return <>
                <mesh ref={cube} position={array} scale={0.95} key={index}>
                    <boxGeometry />
                    <meshStandardMaterial color={color} />
                </mesh>
                </>
            })}
        </>
    );
};