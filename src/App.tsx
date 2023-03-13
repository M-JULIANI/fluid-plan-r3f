import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber'
import { Stats, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import "./styles.css";
import Editor from './canvas/Editor'
import GuideCube from './components/GuideCube';
import { useRefineState, useUpdateState } from 'state/hooks';
import { Node } from 'schema/types';

const Scene = () => {

    const cubeNode = {
        "id": "497b70fb-ce38-4910-8e85-b021e4a0b9b2",
        "type": "guide",
        "props": {
            "category": "meeting",
            "name": "small meeting",
            "locked": true,
            "length": 3,
            "width": 2,
            "rotated": false,
            "zIndex": 6,
            "position": [0, 10]
        },
        "children": [1, 2]
    };

    const [state, updateState] = useState(cubeNode);

    console.log('stateroo:')
    console.log(state.props.position);



    return (
        <>
            {/* <gridHelper /> */}
            {/* <axesHelper /> */}
            <pointLight intensity={1.0} position={[5, 3, 5]} />
            {/* </AdminMenu> */}
            <GuideCube id="bestCube" state={state} updateState={updateState} />
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
