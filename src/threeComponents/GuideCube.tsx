import React, { SetStateAction, useCallback, useEffect, useState } from 'react';
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { TransformControls } from '@react-three/drei';
import { TaggedUpdater, Updater } from 'state/types';
import { patch, $set } from '../state/ops';
import { Node } from 'schema/types';
import { Colors, ProgramCategory } from '../constants/colors';
export type GuideCubeProps = {
    id: string,
    nodeState: Node,
    root: Node,
    updateTree: TaggedUpdater<Node>,
    zIndex?: number,
}
export default function GuideCube(props: GuideCubeProps) {
    const { id, nodeState: state, root, updateTree } = props;
    const cube = useRef<THREE.Mesh>({} as THREE.Mesh);
    const color = Colors[state.props.category as ProgramCategory];

    const [position, setPosition] = useState(state.props.position);
    useEffect(() => {
        setPosition(state.props.position);

        console.log('oroiginal position: ' + state.id)
        console.log(state.props.position);
    }, [])

    const updateProps = useCallback(() => {
        const updatedPos = { x: cube.current.position.x, y: 0, z: cube.current.position.z };
        console.log('possssss:')
        console.log(updatedPos);

        const update = {
            ...root,
            children:
                [...root.children.filter(s=> s.id !== state.id),
                {
                    ...state,
                    props: {
                        ...state.props,
                        position: updatedPos
                    }

                }]
        } as unknown as Node;

        // updateTree.call(root, update);
        console.log('ut')
        console.log(update)
        updateTree(update);

        console.log('called')

        // updateTree({
        //         ...root,
        //         children: {
        //             ...root.children,
        //             ...state,
        //             state: {
        //                 props: {
        //                     position: updatedPos
        //                 }
        //             }
        //         }
        //     } as Node)
    }
        , []);

    return (
        <>
            <mesh ref={cube} position={position}>
                <boxGeometry />
                <meshStandardMaterial color={color} />
            </mesh>
            {/* <TransformControls position-x={2} translationSnap={1}  */}
            <TransformControls object={cube} mode="translate"
                size={0.5}
                showY={false}
                translationSnap={1} onObjectChange={updateProps} />
        </>
    );
};