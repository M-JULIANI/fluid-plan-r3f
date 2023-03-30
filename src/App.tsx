import { Suspense, useEffect, useRef, useState, SetStateAction } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stats, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import "./styles.css";
import { Editor } from './canvas/Editor'
import GuideCube from './threeComponents/GuideCube';
import { useRefineState, useUpdateState } from './state/hooks';
import { Node } from 'schema/types';
import { ProgramTree } from './mock/ProgramTree';
import { makeNode } from './schema/make';
import { TaggedUpdater, Updater } from 'state/types';
import { recomputeGraph } from './graph/graph';
import { NodePositionInfo } from 'graph/types';
import { clone } from './state/ops';
import ChildCube from './threeComponents/ChildCube';

type SceneProps = {
    root: Node,
    updateRoot: TaggedUpdater<Node>
    clusterNode: NodePositionInfo[]
}
const Scene: React.FC<SceneProps> = (props: SceneProps) => {
    const {
        root,
        updateRoot,
        clusterNode
    } = props;

    console.log('cluster node')
    console.log(clusterNode)

    console.log(root.children.map(c => c.props.name).join(','));

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
                return <GuideCube key={node.id} id="guideCube" nodeState={node} root={root} updateTree={updateRoot} />
            })}

            {/* {clusterNode.map(node => {
                return <ChildCube key={node.node.id} id="childCube" node={node.node} positions={node.positions}/>
            })} */}


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


const recomputeTreeClusters = (node: Node, clusterPositions: NodePositionInfo[]) => {

    const clonedNode = clone(node);
    Object.values(clonedNode.children).forEach((node: Node) => {
        const pos = clusterPositions.find(c => c.node.id === node.id);
        node.props.cluster = pos?.positions;
    });
    return clonedNode;
}

const App = () => {
    const root = ProgramTree as Node;
    const [state, updateState] = useUpdateState(root);
    const [clusterState, setClusterState] = useUpdateState(root);
    useEffect(() => {

        const clusterInfo = recomputeGraph(state)
    //    const recomputedNode = recomputeTreeClusters(state, clusterInfo)
        setClusterState(clusterInfo);
        console.log('report something on state: ')
        console.log(state)
    }, [state])

    return (
        <div
            style={{
                height: "100vh",
                width: "100vw",
            }}
        >
            <Editor root={state} updateRoot={updateState} />
            <Canvas
                orthographic={true}
                camera={cameraSettings}
            >
                {/* <Stats /> */}
                {/* <OrbitControls makeDefault /> */}
                <Suspense fallback={null}>
                    <Scene root={state} updateRoot={updateState} clusterNode={clusterState} />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default App;
