import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { SetStateAction } from 'react';
import { Button, IconButton } from '@material-ui/core';
import { SaveOutlined as SaveIcon } from '@material-ui/icons';
import { South as TwodIcon, SouthEast as TwoHalfDIcon } from '@mui/icons-material';
import { DashboardCustomizeOutlined as VoxelIcon, HexagonOutlined as PolygonIcon } from '@mui/icons-material';
import { SidebarProps } from './SidebarMenu';
import { Box, Container, Stack } from '@mui/material';


const minDrawerWidth = 220;
const defaultWidth = 220;



export enum CameraViewMode {
    TwoD = '2D',
    TwoHalfD = '2.5D',
}


export enum SpaceRepresentation {
    Cell = 'Cell',
    Polygon = 'Polygon',
}

export type DisplaySettings = {
    cameraViewProps: {
        viewMode: CameraViewMode,
        updateCameraViewMode: React.Dispatch<SetStateAction<CameraViewMode>>,
    }
    spaceRepresentationProps: {
        spaceRenderMode: SpaceRepresentation,
        updateSpaceRenderMode: React.Dispatch<SetStateAction<SpaceRepresentation>>,
    }
}

export type TopMenuProps = Partial<SidebarProps>

export default function TopMenu<TopMenuProps>(props: TopMenuProps) {
    const { displaySettings } = props;

    const { cameraViewProps,
        spaceRepresentationProps } = displaySettings;

    const { cameraViewMode,
        updateCameraViewMode
    } = cameraViewProps;

    const {
        spaceRenderMode,
        updateSpaceRenderMode } = spaceRepresentationProps;

    const [localCameraViewMode, setLocalCameraViewMode] = React.useState<CameraViewMode>(cameraViewMode || CameraViewMode.TwoD);
    const [localSpaceRenderMode, setLocalSpaceRenderMode] = React.useState<SpaceRepresentation>(spaceRenderMode || SpaceRepresentation.Cell);

    //flipped camera icon
    const getCameraViewModeIcon = (viewMode: CameraViewMode) => viewMode === CameraViewMode.TwoD
        ? (<TwoHalfDIcon />)
        : (< TwodIcon/>)
    const [viewModeIcon, setViewModeIcon] =
        React.useState(getCameraViewModeIcon(localCameraViewMode));

    //flipped space-representation icon
    const getSpaceRepresentationIcon = (representation: SpaceRepresentation) =>
        representation === SpaceRepresentation.Cell
            ? (<PolygonIcon />)
            : (<VoxelIcon />);

    const [spaceRepIcon, setSpaceRepIcon] =
        React.useState(getSpaceRepresentationIcon(localSpaceRenderMode));

    React.useEffect(() => {
        //update icon
        setSpaceRepIcon(getSpaceRepresentationIcon(localSpaceRenderMode));
        //send updates upstream
        updateSpaceRenderMode(localSpaceRenderMode);
    }, [localSpaceRenderMode])

    React.useEffect(() => {
        //update icon
        setViewModeIcon(getCameraViewModeIcon(localCameraViewMode));
        //send udpates upstream
        updateCameraViewMode(localCameraViewMode);
    }, [localCameraViewMode])

    const handleViewModeChange = () => {
        //update local state
        setLocalCameraViewMode(mode => mode === CameraViewMode.TwoHalfD ? CameraViewMode.TwoD : CameraViewMode.TwoHalfD);
    }

    const handleSpaceRenderMode = () => {
        //update local state
        setLocalSpaceRenderMode(rep => rep === SpaceRepresentation.Cell ? SpaceRepresentation.Polygon : SpaceRepresentation.Cell);
    }

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (

        <Stack direction={"row"} spacing={'10px'} padding={'10px'}>
            <Button variant="contained" onClick={handleViewModeChange}>
                {viewModeIcon}
                {localCameraViewMode === CameraViewMode.TwoD ? 'Axon' : 'Plan'}
            </Button>
            <Button variant="contained" onClick={handleSpaceRenderMode} style={{fontFamily: 'sans-serif'}}>
                {spaceRepIcon}
                {localSpaceRenderMode === SpaceRepresentation.Cell ? 'Polygon' : 'Voxel'}
            </Button>
        </Stack>


    );
}
