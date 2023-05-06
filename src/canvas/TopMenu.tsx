import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { SetStateAction } from 'react';
import { Button, IconButton } from '@material-ui/core';
import { SaveOutlined as SaveIcon } from '@material-ui/icons';
import { South as TwodIcon, SouthEast as TwoHalfDIcon } from '@mui/icons-material';
import { Dangerous as VoxelIcon, Face as PolygonIcon } from '@mui/icons-material';
import { SidebarProps } from './SidebarMenu';


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

export type TopMenuProps =  Partial<SidebarProps>

export default function TopMenu<TopMenuProps>(props: TopMenuProps) {

    console.log('proponents:')
    console.log(props)
    const { displaySettings } = props;

    const { cameraViewProps,
        spaceRepresentationProps } = displaySettings;

    const { cameraViewMode,
        updateCameraViewMode
    } = cameraViewProps;

    const {
        spaceRenderMode,
        updateSpaceRenderMode } = spaceRepresentationProps;

    const [localCameraViewMode, setLocalCameraViewMode] = React.useState<CameraViewMode>(cameraViewMode);
    const [localSpaceRenderMode, setLocalSpaceRenderMode] = React.useState<SpaceRepresentation>(spaceRenderMode);


    //camera icon
    const getCameraViewModeIcon = (viewMode: CameraViewMode) => viewMode === CameraViewMode.TwoD ? (<TwodIcon />) : (<TwoHalfDIcon />);
    const [viewModeIcon, setViewModeIcon] =
        React.useState(getCameraViewModeIcon(cameraViewMode));

    //space-representation icon
    const getSpaceRepresentationIcon = (representation: SpaceRepresentation) =>
        representation === SpaceRepresentation.Cell
            ? (<VoxelIcon />)
            : (<PolygonIcon />);

    const [spaceRepIcon, setSpaceRepIcon] =
        React.useState(getSpaceRepresentationIcon(spaceRenderMode));

    const handleViewModeChange = () => {
        setLocalCameraViewMode(mode => mode === CameraViewMode.TwoHalfD ? CameraViewMode.TwoD : CameraViewMode.TwoHalfD);
        setViewModeIcon(getCameraViewModeIcon(localCameraViewMode));
        updateCameraViewMode(localCameraViewMode);
    }

    const handleSpaceRenderMode = () => {
        setLocalSpaceRenderMode(rep => rep === SpaceRepresentation.Cell ? SpaceRepresentation.Polygon : SpaceRepresentation.Cell)
        setSpaceRepIcon(getSpaceRepresentationIcon(localSpaceRenderMode));
        updateSpaceRenderMode(localSpaceRenderMode);
    }

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (

        <div>
            <Button variant="contained" startIcon={viewModeIcon} onClick={handleViewModeChange}>
                {cameraViewMode === CameraViewMode.TwoD ? 'Plan' : 'Axon'}
            </Button>
            <Button variant="contained" startIcon={spaceRepIcon} onClick={handleSpaceRenderMode}>
                {localSpaceRenderMode === SpaceRepresentation.Cell ? 'Voxel' : 'Polygon'}
            </Button>
        </div>


    );
}
