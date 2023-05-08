import React, { SetStateAction } from 'react';
import SidebarMenu, { NodeSettings } from './SidebarMenu';
import { Node } from '../schema/types';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, keyframes } from '@mui/material';
import TopMenu, { DisplaySettings } from './TopMenu';
import { CameraViewMode } from './TopMenu';

export interface EditorProps extends JSX.IntrinsicAttributes{
    nodeSettings: NodeSettings,
    displaySettings: DisplaySettings
}

export function Editor<EditorProps>(props: EditorProps) {
    return (
        <>
            <Container sx={{ display: 'flex' }}>
                <CssBaseline />
                {/* {cube} */}
                <SidebarMenu {...props} />
            </Container>
        </>
    )

}