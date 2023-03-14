import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stats, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import "./styles.css";
import Editor from './canvas/Editor'
import GuideCube from './threeComponents/GuideCube';
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
            "position": [0, 0, 0]
        },
        "children": [1, 2]
    };

    const [state, updateState] = useState(cubeNode);
    const { camera } = useThree();
    useEffect(() => {
        camera.lookAt(0, 0, 0);
    }, [])


    return (
        <>
            {/* <gridHelper /> */}
            {/* <axesHelper /> */}
            <pointLight intensity={1.0} position={[5, 20, 5]} />
            {/* </AdminMenu> */}
            <GuideCube id="bestCube" state={state} updateState={updateState} />
        </>
    );
};

const cameraSettings = {
    zoom: 25,
    fov: 45,
    near: 0.1,
    far: 200,
    position: new THREE.Vector3(0, 100, 0)
}


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
                orthographic={true}
                camera={cameraSettings}
            >
                {/* <Stats /> */}
                <OrbitControls makeDefault />
                <Suspense fallback={null}>
                    <Scene />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default App;
