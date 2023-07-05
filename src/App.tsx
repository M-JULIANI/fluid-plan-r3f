import { Suspense, useEffect, useRef, useState, SetStateAction } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stats, OrbitControls, useCamera } from "@react-three/drei";
import * as THREE from "three";
import "./styles.css";
import { Editor, EditorProps } from './canvas/Editor'
import GuideCube from './threeComponents/GuideCube';
import { useRefineState, useUpdateState } from './state/hooks';
import { Node } from 'schema/types';
import { ProgramTree } from './mock/ProgramTree';
import { recomputeGraph } from './graph/graph';
import { NodePositionInfo } from 'graph/types';
import ChildCube from './threeComponents/ChildCube';
import { CameraViewMode, SpaceRepresentation, DisplaySettings } from './canvas/TopMenu';
import PolygonMesh from './threeComponents/PolygonMesh';

const positionTop = new THREE.Vector3(0, 100, 0);
const positionAxon = new THREE.Vector3(50, 100, 50);
const cameraSettings2D = {
    zoom: 25,
    fov: 45,
    near: 0.1,
    far: 200,
    position: positionTop,
    bottom: -175
}
export type CameraProps = {
    position: THREE.Vector3,
}

function Camera(props: CameraProps) {
    const { position } = props;
    const three = useThree();
    const ref = useRef<THREE.OrthographicCamera>(three.camera as THREE.OrthographicCamera);
    three.camera.position.set(position.x, position.y, position.z);
    three.camera.lookAt(0, 0, 0);
    return (<orthographicCamera ref={ref} />);
}



const App = () => {
    const root = ProgramTree;
    // const [state, updateState] = useUpdateState(root);
    const [state, updateState] = useState(root);
    const [viewMode, setViewMode] = useState<CameraViewMode>(CameraViewMode.TwoD);
    const [spaceRepState, setSpaceRepState] = useState<SpaceRepresentation>(SpaceRepresentation.Cell);
    const [clusterState, setClusterState] = useUpdateState([] as NodePositionInfo[]);

    const editorProps = {
        nodeSettings: {
            node: state,
            updateNode: updateState
        },
        displaySettings: {
            cameraViewProps: {
                viewMode: viewMode,
                updateCameraViewMode: setViewMode
            },
            spaceRepresentationProps: {
                spaceRenderMode: spaceRepState,
                updateSpaceRenderMode: setSpaceRepState,
            }
        }
    };

    //initialize clusters 
    useEffect(() => {
        const clusterInfo = recomputeGraph(state)
        setClusterState(clusterInfo);
    }, []);
    ;
    const cameraPosition = viewMode === CameraViewMode.TwoD ? positionTop : positionAxon;
    const orbitEnabled = viewMode === CameraViewMode.TwoD ? false : true;
    //reactivity to 'guide cubes'
    useEffect(() => {
        const clusterInfo = recomputeGraph(state)
        setClusterState(clusterInfo);
    }, [state])

    return (
        <div
            style={{
                height: "100vh",
                width: "100vw",
            }}
        >
            <Editor {...editorProps} nodeInfo={clusterState} />
            <Canvas
                orthographic={true}
                camera={cameraSettings2D}>
                 {orbitEnabled ? <OrbitControls makeDefault /> : null}

                <Camera position={cameraPosition} />
                {/* <Stats /> */}

                <Suspense fallback={null}>
                    <Scene root={state} updateRoot={updateState} clusterNode={clusterState} representation={spaceRepState} />
                </Suspense>
            </Canvas>
        </div>
    );
};

type SceneProps = {
    root: Node,
    // updateRoot: TaggedUpdater<Node>,
    updateRoot: React.Dispatch<SetStateAction<Node>>,
    clusterNode: NodePositionInfo[],
    representation: SpaceRepresentation

}
const Scene: React.FC<SceneProps> = (props: SceneProps) => {
    const {
        root,
        updateRoot,
        clusterNode,
        representation
    } = props;

    return (
        <>
            {/* <gridHelper /> */}
            {/* <axesHelper /> */}
            {/* </AdminMenu> */}
            <pointLight intensity={1.0} position={[5, 20, 5]} />
            {root.children.map(node => {
                return <GuideCube key={node.id} id="guideCube" nodeState={node} root={root} updateTree={updateRoot} />
            })}

            {representation === SpaceRepresentation.Cell
                ? clusterNode.map((node) => {
                    return <ChildCube key={node.node.id} id="childCube" node={node.node} positions={node.positions} connectivities={node.connectivities} />
                })
                : clusterNode.map((node) => {
                   return <PolygonMesh key={node.node.id} id="polygonMesh" node={node.node} positions={node.positions} perimeterPositions={node.perimeterPositions} />
                })
            }
        </>
    );
};


export default App;
