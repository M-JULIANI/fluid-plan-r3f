import React, { SetStateAction } from 'react';
import { NodeSettings, SidebarMenu } from './SidebarMenu';
import { Node } from '../schema/types';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, keyframes } from '@mui/material';
import { TopMenu, DisplaySettings } from './TopMenu';
import { CameraViewMode } from './TopMenu';
import { NodePositionInfo } from 'graph/types';
import { TaggedUpdater } from 'state/types';

export type EditorProps ={
    nodeSettings: NodeSettings,
    displaySettings: DisplaySettings,
    nodeInfo: NodePositionInfo[],
    setAdjacencyNodes: React.Dispatch<SetStateAction<string[]>>,
    // setNodeInfo: React.Dispatch<SetStateAction<NodePositionInfo[]>>
}

export const Editor: React.FC<EditorProps> = ({ nodeInfo, nodeSettings, displaySettings, setAdjacencyNodes }) =>{
    return (
        <>
            <Container sx={{ display: 'flex' }}>
                <CssBaseline />
                {/* {cube} */}
                <SidebarMenu 
                nodeInfo={nodeInfo} 
                nodeSettings={nodeSettings} 
                displaySettings={displaySettings}
                setAffectedNodes={setAdjacencyNodes} />
            </Container>
        </>
    )

}