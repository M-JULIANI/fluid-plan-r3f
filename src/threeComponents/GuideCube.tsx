import React, { SetStateAction, useCallback, useEffect, useState } from 'react';
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { TransformControls } from '@react-three/drei';
import { Updater } from 'state/types';
import { patch, $set } from '../state/ops';
import { Node } from 'schema/types';
import { Colors, ProgramCategory } from '../constants/colors';
export type GuideCubeProps = {
    id: string,
    nodeState: Node,
    root: Node,
    updateTree: React.Dispatch<SetStateAction<Node>>
    zIndex?: number,
}
export default function GuideCube(props: GuideCubeProps, root: Node, updateTree: React.Dispatch<SetStateAction<Node>>) {
    const { id, nodeState: state } = props;
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
        updateTree((state) => {
            return {
                ...root,
                children: {
                    ...root.children,
                    ...state,
                    state: {
                        props: {
                            position: updatedPos
                        }
                    }
                }
            }
        })
    }, []);

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