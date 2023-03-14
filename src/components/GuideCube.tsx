import React, { SetStateAction, useCallback } from 'react';
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { TransformControls } from '@react-three/drei';
import { Updater } from 'state/types';
import { patch, $set } from '../state/ops';
import { Node } from 'schema/types';
export type GuideCubeProps = {
    id: string,
    state: Node,
    updateState: React.Dispatch<SetStateAction<Node>>
    zIndex?: number,
}
export default function GuideCube(props: GuideCubeProps) {
    const { id, state, updateState } = props;
    const cube = useRef<THREE.Mesh>({} as THREE.Mesh);
    console.log('cube ref')
    console.log(cube)

    const updateProps = useCallback(() => {
        // const update = {
        //     position: $set(cube.current.position)
        // };
        console.log('pos:')
        console.log(cube.current.position);
        // updateState(update);
        const updatedPos = { x: cube.current.position.x, y: cube.current.position.y };
        updateState((state) => {
            return {
                ...state,
                props: {
                    position: updatedPos
                }
            }

        })
    }, []);

    return (
        <>
            <mesh ref={cube}>
                <boxGeometry />
                <meshStandardMaterial color="#0391BA" />
            </mesh>
            {/* <TransformControls position-x={2} translationSnap={1}  */}
            <TransformControls object={cube} mode="translate"
                showY={false}
                translationSnap={1} onObjectChange={updateProps} />
        </>
    );
};