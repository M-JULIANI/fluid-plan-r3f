import { Suspense, useEffect, useRef, useState, SetStateAction } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stats, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import "./styles.css";
import Editor from './canvas/Editor'
import GuideCube from './threeComponents/GuideCube';
import { useRefineState, useUpdateState } from 'state/hooks';
import { Node } from 'schema/types';
import { ProgramTree } from './mock/ProgramTree';
import { makeNode } from './schema/make';
import { Updater } from 'state/types';

type SceneProps = {
    root: Node,
    updateTree: React.Dispatch<SetStateAction<Node>>
}
const Scene: React.FC<SceneProps> = (props: SceneProps) => {
    const {
        root,
        updateTree
    } = props;

    console.log(root.children.map(c=>c.props.name).join(','));

    const { camera } = useThree();
    useEffect(() => {
        camera.lookAt(0, 0, 0);
    }, [])

    return (
        <>
            {/* <gridHelper /> */}
            {/* <axesHelper /> */}
            {/* </AdminMenu> */}
            <pointLight intensity={1.0} position={[5, 20, 5]} />
            {root.children.map(node => {
                return <GuideCube key={node.id} id="bestCube" nodeState={node} root={root} updateTree={updateTree} />
            })}


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
    const root = ProgramTree as Node;
    const [state, setState] = useState(root);

    // const sceneProps = {
    //     root: root,
    //     updateTree: setState
    // }
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
                {/* <OrbitControls makeDefault /> */}
                <Suspense fallback={null}>
                    <Scene root={root} updateTree={setState} />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default App;
