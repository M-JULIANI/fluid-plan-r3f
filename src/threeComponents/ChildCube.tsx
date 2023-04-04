import React, { SetStateAction, useCallback, useEffect, useState } from 'react';
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text, Text3D, TransformControls } from '@react-three/drei';
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
    positions: Vec3[],
    connectivities: number[] | undefined,
    // root: Node,
    //  updateTree: TaggedUpdater<Node>,
    zIndex?: number,
}
export default function ChildCube(props: ChildCubeProps) {
    const { id, node, positions, connectivities } = props;
    const cube = useRef<THREE.Mesh>({} as THREE.Mesh);
    const color = Colors[node.props.category as ProgramCategory];

    return (
        <>
            {positions.map((pos, index) => {
                const array = vecToArray(pos) as any;
                const upPos = { x: pos.x, y: pos.y + 0.75, z: pos.z };
                const updatedArray = vecToArray(upPos) as any;
                return <>
                    <mesh ref={cube} position={array} scale={0.95} key={index}>
                        <boxGeometry />
                        <meshStandardMaterial color={color} />

                    </mesh>

                    <Text position={updatedArray} color={'black'}
                        fontSize={0.5}
                        rotation-x={-Math.PI / 2}
                    >
                        {(connectivities && connectivities[index]) ? `${connectivities[index]}`: 'u'}
                    </Text>
                </>
            })}
        </>
    );
};