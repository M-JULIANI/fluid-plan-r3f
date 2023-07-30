import { Suspense, useEffect, useRef, useState, SetStateAction } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stats, OrbitControls, useCamera, OrbitControlsProps, Line } from "@react-three/drei";
import * as THREE from "three";
import "./styles.css";
import { Editor, EditorProps } from './canvas/Editor'
import GuideCube from './threeComponents/GuideCube';
import HighlightedPolygon from './threeComponents/HighlightedPolygon';
import { useRefineState, useUpdateState } from './state/hooks';
import { Node } from 'schema/types';
import { ProgramTree } from './mock/ProgramTree';
import { recomputeGraph } from './graph/graph';
import { NodePositionInfo } from 'graph/types';
import ChildCube from './threeComponents/ChildCube';
import { CameraViewMode, SpaceRepresentation, DisplaySettings } from './canvas/TopMenu';
import PolygonMesh from './threeComponents/PolygonMesh';
import { Euler, OrthographicCamera } from 'three';
import { NodeSettings } from 'canvas/SidebarMenu';
import { vecToArray } from './geometry/utils';

const positionTop = new THREE.Vector3(0, 100, 0);
const positionAxon = new THREE.Vector3(50, 100, 50);
const rotationTop = new THREE.Vector3(0, 1, 0);
const rotationAxon = new THREE.Vector3(0, 1, 0);
const cameraSettings2D = (position: THREE.Vector3) => {
    return {
        zoom: 25,
        fov: 45,
        near: 0.1,
        far: 200,
        position: position,
        bottom: -175,
    }
}
export type CameraProps = {
    position: THREE.Vector3,
    sceneRef: React.MutableRefObject<OrthographicCamera>
}

function Camera(props: CameraProps) {
    const { position, sceneRef } = props;
    const original = new Euler(-1.57, 0, 0);
    const three = useThree();
    three.camera.position.set(position.x, position.y, position.z);
    // console.log('euler: ')
    // console.log(three.camera)
    three.camera.lookAt(0, 0, 0);
    //three.camera.setRotationFromEuler(original);
    useEffect(() => {

        // const scene = sceneRef.current;
        // // Calculate the bounding box of all objects in the scene
        // const box = new THREE.Box3().setFromObject(scene);

        // // Get the center of the bounding box
        // const center = box.getCenter(new THREE.Vector3());

        // // Get the size of the bounding box
        // const size = box.getSize(new THREE.Vector3());

        // // Calculate the distance to fit the entire bounding box within the view
        // const distance = Math.max(size.x, size.y, size.z) * 1.5;

        // // Set the camera position and target
        // camera.position.set(center.x, center.y, center.z + distance);
        // camera.lookAt(center);
    }, [position])

    return (<orthographicCamera ref={sceneRef} />);
}



const App = () => {
    const root = ProgramTree;
    // const [state, updateState] = useUpdateState(root);
    const [state, updateState] = useState(root);
    const [viewMode, setViewMode] = useState<CameraViewMode>(CameraViewMode.TwoD);
    const [spaceRepState, setSpaceRepState] = useState<SpaceRepresentation>(SpaceRepresentation.Polygon);
    const [clusterState, setClusterState] = useUpdateState([] as NodePositionInfo[]);
    const [adjacencyNodes, setAdjacencyNodes] = useState<string[]>(['']);
    const [editorProps, setEditorProps] = useState({} as any);
    const [nodeSettings, setNodeSettings] = useState({ node: state, updateNode: updateState } as NodeSettings);
    const [displaySettings, setDisplaySettings] = useState({
        cameraViewProps: {
            viewMode: viewMode,
            updateCameraViewMode: setViewMode
        },
        spaceRepresentationProps: {
            spaceRenderMode: spaceRepState,
            updateSpaceRenderMode: setSpaceRepState,
        }
    } as DisplaySettings);

    useEffect(() => {
        setNodeSettings({ ...nodeSettings, node: state })
    }, [state])

    useEffect(() => {
        setDisplaySettings({
            cameraViewProps: {
                viewMode: viewMode,
                updateCameraViewMode: setViewMode
            },
            spaceRepresentationProps: {
                spaceRenderMode: spaceRepState,
                updateSpaceRenderMode: setSpaceRepState,
            }
        })
    }, [viewMode, spaceRepState]);

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
        const clusterInfo = recomputeGraph(state);
        setClusterState(clusterInfo);
    }, [state])

    const sceneRef = useRef<THREE.OrthographicCamera>({} as THREE.OrthographicCamera);
    const controlsRef = useRef<any>();

    return (
        <div
            style={{
                height: "100vh",
                width: "100vw",
            }}
        >
            <Editor {...editorProps}
                nodeInfo={clusterState}
                nodeSettings={nodeSettings}
                displaySettings={displaySettings}
                // setNodeInfo={setClusterState}
                //   adjacencyNodes={adjacencyNodes}
                setAdjacencyNodes={setAdjacencyNodes} />
            <Canvas
                orthographic={true}
                camera={cameraSettings2D(cameraPosition)}>
                {orbitEnabled ? <OrbitControls ref={controlsRef} enablePan enableRotate={false} /> : null}
                <Camera position={cameraPosition} sceneRef={sceneRef} />
                {/* <Stats /> */}

                <Suspense fallback={null}>
                    {/* <scene ref={sceneRef}> */}
                    <Scene
                        root={state}
                        updateRoot={updateState}
                        clusterNode={clusterState}
                        representation={spaceRepState}
                        adjacencyNodes={adjacencyNodes}
                    />
                    {/* </scene> */}
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
    representation: SpaceRepresentation,
    adjacencyNodes: string[],

}
const Scene: React.FC<SceneProps> = (props: SceneProps) => {
    const {
        root,
        updateRoot,
        clusterNode,
        representation,
        adjacencyNodes
    } = props;

    const affectedNodes = clusterNode.filter(c => adjacencyNodes?.includes(c.node.props.displayName));

    useEffect(()=>{
        console.log(affectedNodes.map(x=> x.node.props.position))
    }, [affectedNodes])

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
            {affectedNodes && affectedNodes?.map((node) => {
                return <HighlightedPolygon key={node.node.id} id="adjacency-outline"
                    node={node.node}
                    positions={node.positions}
                    perimeterPositions={node.perimeterPositions}
                    providedLineWidth={4} />
            })
            }
            {affectedNodes.length === 2 && <Line points={[ Array.isArray(affectedNodes?.[0]?.node.props.position) ? affectedNodes?.[0]?.node.props.position : vecToArray(affectedNodes?.[0]?.node?.props?.position),
            Array.isArray(affectedNodes?.[1]?.node?.props?.position) ? affectedNodes[1].node.props.position : vecToArray(affectedNodes[1]?.node?.props?.position)]} color={'black'} lineWidth={2}/>}

        </>
    );
};


export default App;
