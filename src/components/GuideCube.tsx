import React from 'react';
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export default function GuideCube() {
    const cube = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        // cube.current!.rotation.x += 0.01;
        // cube.current!.rotation.y += 0.01;
        // cube.current?.rotateX(delta);

        // state.camera.posi
    });

    return (
        <>
            <mesh ref={cube}>
                <boxBufferGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#0391BA" />
            </mesh>
        </>
    );
};