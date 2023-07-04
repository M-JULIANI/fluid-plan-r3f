import React, { SetStateAction, useCallback, useEffect, useState } from 'react';
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree, Vector3 } from '@react-three/fiber';
import { TransformControls } from '@react-three/drei';
import { TaggedUpdater, Updater } from 'state/types';
import { patch, $set } from '../state/ops';
import { Node } from 'schema/types';
import { Colors, ProgramCategory } from '../constants/colors';
export type GuideCubeProps = {
    id: string,
    nodeState: Node,
    root: Node,
    // updateTree: TaggedUpdater<Node>,
    updateTree: React.Dispatch<SetStateAction<Node>>,
    zIndex?: number,
}
export default function GuideCube(props: GuideCubeProps) {
    const { id, nodeState: state, root, updateTree } = props;
    const cube = useRef<THREE.Mesh>({} as THREE.Mesh);
    const { camera, mouse } = useThree();
    const [isHovered, setIsHovered] = useState(false);

    const [position, setPosition] = useState(state.props.position);
    useEffect(() => {
        setPosition(state.props.position);
    }, []);

    const updateProps = (() => {
        const updatedPos = { x: cube.current.position.x, y: 1, z: cube.current.position.z };
        const update = {
            ...root,
            children:
                [
                    ...root.children.filter(s => s.id !== state.id),
                    {
                        ...state,
                        props: {
                            ...state.props,
                            position: updatedPos
                        }
                    }]
        } as unknown as Node;

        updateTree(update);
    });

    const updateZIndex = (() => {
        const update = {
            ...root,
            props: {
                ...root.props,
                globalZ: (root?.props?.globalZ ?? 0) + 1
            },
            children:
                [
                    ...root.children.filter(s => s.id !== state.id),
                    {
                        ...state,
                        props: {
                            ...state.props,
                            zIndex: root.props.globalZ + 1
                        }
                    }]
        } as unknown as Node;

        console.log('updating z-index:');
        console.log(root.props.globalZ);
        updateTree(update);
    });

    const isActive = state.props.zIndex === root.props.globalZ;
    // const base = [position[0], 0, position[2]] as Vector3;
     const moved = [position[0], 1, position[2]] as Vector3
    return (
        <>
            <mesh ref={cube} position={moved} scale={isActive ? 0.75 : 0.33} onPointerOver={() => setIsHovered(true)} onPointerUp={() => setIsHovered(false)}>
                <boxGeometry />
                <meshStandardMaterial color={isActive ? 'lightgray' : 'gray'} />
            </mesh>
            {/* <TransformControls position-x={2} translationSnap={1}  */}
            { isHovered ? <TransformControls object={cube} mode="translate"
                size={0.5}
                showY={false}
                translationSnap={1} onObjectChange={updateProps} onMouseUp={updateZIndex}
                 /> : null}
        </>
    );
};