import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber'
import { Stats, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import "./styles.css";
import Editor from './canvas/Editor'
import GuideCube from './components/GuideCube';

const Scene = () => {
    return (
        <>
            {/* <gridHelper /> */}
            {/* <axesHelper /> */}
            <pointLight intensity={1.0} position={[5, 3, 5]} />
            {/* </AdminMenu> */}
            <GuideCube id='' name='name' category='Meeting' index={0} zIndex={1} />
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
            <Editor />
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
