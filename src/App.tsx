import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber'
import { Stats, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import "./styles.css";
import React from 'react';
import GuideCube from './components/GuideCube';
import CanvasInteraction from 'canvas/CanvasInteraction';
import SidebarMenu from 'canvas/SidebarMenu';
import Editor from 'canvas/Editor';

const Scene = () => {
    return (
        <>
            {/* <gridHelper /> */}
            {/* <axesHelper /> */}
            <pointLight intensity={1.0} position={[5, 3, 5]} />

            <Editor />
            {/* </AdminMenu> */}
            {/* <GuideCube /> */}
        </>
    );
};

const App = () => {
    return (
        <div
            style={{
                height: "100vh",
                width: "100vw",
            }}
        >
            <Canvas
                camera={{
                    near: 0.1,
                    far: 1000,
                    zoom: 1,
                }}
            // onCreated={({ gl }) => {
            //     gl.setClearColor("white");
            // }}
            >
                <Stats />
                <OrbitControls makeDefault />
                <Suspense fallback={null}>
                    <Scene />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default App;
