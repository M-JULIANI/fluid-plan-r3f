import React from 'react';
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { TransformControls } from '@react-three/drei';
export type GuideCubeProps = {
    id: string,
    name: string,
    category: string,
    index?: number,
    zIndex?: number,
}
export default function GuideCube(props: GuideCubeProps) {
    const { name, category, index, id } = props;
    const cube = useRef<THREE.Mesh>({} as THREE.Mesh);

    return (
        <>
            <mesh ref={cube}>
                <boxBufferGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#0391BA" />
            </mesh>
            {/* <TransformControls position-x={2} translationSnap={1}  */}
            <TransformControls object={cube} mode="translate"
                showY={false}
                translationSnap={1} />
        </>
    );
};