import { Updater } from '../state/types'
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import { Button, Chip, Container, keyframes } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ProgramCard from '../components/ProgramCard';
import { Node } from '../schema/types';
import { useCallback } from 'react';
import { TaggedUpdater } from '../state/types';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {AdjacencyTableContainer} from '../components/AccordionContainer';
import AdjacencyMatrix from '../components/AdjacencyMatrix';
import { CameraViewMode, DisplaySettings } from './TopMenu';
import { SetStateAction } from 'react';
import {TopMenu} from './TopMenu';
import { EditorProps } from './Editor';
import { NodePositionInfo } from 'graph/types';
import { makeImagesOfClusters } from '../geometry/utils';
import { Stack } from '@mui/material';
import { Colors, lightenColor } from '../constants/colors';
import { ProgramCategory } from '../constants/program';
import { fontFamily, fontWeight } from '@mui/system';
import { uniqueId } from 'lodash';

const minDrawerWidth = 240;
const defaultWidth = 480;

export type NodeSettings = {
    node: Node,
    updateNode: TaggedUpdater<Node>,
}

export interface SidebarProps {
    nodeInfo: NodePositionInfo[],
    nodeSettings: NodeSettings,
    displaySettings: DisplaySettings,
    setAffectedNodes: React.Dispatch<SetStateAction<string[]>>,
}

export const SidebarMenu: React.FC<SidebarProps> = ({ nodeInfo, nodeSettings, displaySettings, setAffectedNodes }) =>{

    const { node, updateNode } = nodeSettings;
    const [expanded, setExpanded] = React.useState<string | false>(false);
    const [images, setImages] = React.useState<{ [k: string]: string }>({});
    // const [rendered, setRendered] = React.useState<boolean>(false);

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };


    React.useEffect(() => {
        const renderClusters = async () => {
            //if (rendered) return;
            const img = makeImagesOfClusters(nodeInfo, 3);
            const imageMap: { [k: string]: string } = {};
            nodeInfo.forEach((b: NodePositionInfo, i: number) => (imageMap[b.node.id] = img[i]));
            // setRendered(true);
            setImages(imageMap);
        };
        renderClusters();
    }, [nodeInfo]);

    const cloneNode = (node: Node): Node => {
        return {
            ...node,
            id: uniqueId(),
            props: {
                ...node.props,
                name: node.props.name + ' COPY',
                displayName: node.props.displayName + ' COPY',
                position: [(node?.props?.position?.[0]  ?? node?.props?.position?.x)+ 0.75, 0, (node?.props?.position?.[2]  ?? node?.props?.position?.z) + 0.75]
            }
        }
    }

    const handleClone = (nodeI: NodePositionInfo) => {
        const cloned = cloneNode(nodeI.node);
        updateNode({
            ...node,
            children: [
                ...node.children,
                cloned
            ]
        })
    }

    return (
        <Drawer
            sx={{
                width: defaultWidth,
                minWidth: minDrawerWidth,
                // maxHeight: 250,
                // overflow: 'auto',
                display: 'flex',
                flex: 'flex-grow',
                // flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: defaultWidth,
                    minWidth: minDrawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <TopMenu displaySettings={displaySettings} />
            <div style={{ backgroundColor: '#EAEAEA' }}>
                <Toolbar><Typography sx={{ width: '33%', flexShrink: 0, fontFamily: 'sans-serif', fontVariant: 'h1', fontSize: '24px', fontWeight: '200' }}>
                    Fluid Plan
                </Typography></Toolbar>
            </div>
            <Divider />

            <Container sx={{}}>
                <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} sx={{
                width: '100%',
                    flex: 'flex-grow'}}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Typography sx={{ width: '33%', flexShrink: 0, fontFamily: 'sans-serif', fontVariant: 'h2' }}>
                            Metrics
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}></Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ width: '100%',}}>
                        <AdjacencyTableContainer 
                        nodeInfo={nodeInfo}
                         width={defaultWidth}
                         setAffectedNodes={setAffectedNodes}/>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel-images-content"
                        id="panel-images-header"
                    >
                        <Typography sx={{ width: '33%', flexShrink: 0, fontFamily: 'sans-serif', fontVariant: 'h2' }}>
                            Clusters
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}></Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack direction={"column"} spacing={'10px'} padding={'10px'}>
                            {Object.keys(images).map((key, i) => {
                                return <Stack direction={'row'} spacing={'10px'} paddingBottom={'20px'}>
                                    <Chip label={nodeInfo[i]?.node?.props?.displayName} sx={{
                                        mr: '0px',
                                        backgroundColor: `${lightenColor(Colors[nodeInfo[i]?.node?.props?.category as ProgramCategory], 10)}`,
                                        fontFamily: 'sans-serif'
                                    }} />
                                    <Chip label={'+'}
                                        onClick={() => handleClone(nodeInfo[i])} sx={{
                                            mr: '100px',
                                            backgroundColor: `${lightenColor(Colors[nodeInfo[i]?.node?.props?.category as ProgramCategory], 20)}`,
                                            fontFamily: 'sans-serif', fontWeight: 800,
                                            '&:hover': {
                                                //  backgroundColor: `${lightenColor(Colors[nodeInfo[i].node.props.category as ProgramCategory], -5)}`,
                                                border: 2,
                                                borderColor: 'black'
                                            },
                                        }} />
                                    <img
                                        key={key}
                                        src={images[key]}
                                        alt={'cluster name'}
                                        style={{ width: '50px', maxHeight: '50', objectFit: 'contain', paddingRight: '10px' }}
                                    />
                                </Stack>
                            })}
                        </Stack>
                    </AccordionDetails>
                </Accordion>
                {/* <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2bh-content"
                            id="panel2bh-header"
                        >
                            <Typography sx={{ width: '33%', flexShrink: 0 }}>Users</Typography>
                            <Typography sx={{ color: 'text.secondary' }}>
                                You are currently not an owner
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus,
                                varius pulvinar diam eros in elit. Pellentesque convallis laoreet
                                laoreet.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel3bh-content"
                            id="panel3bh-header"
                        >
                            <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                Advanced settings
                            </Typography>
                            <Typography sx={{ color: 'text.secondary' }}>
                                Filtering has been entirely disabled for whole web server
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
                                amet egestas eros, vitae egestas augue. Duis vel est augue.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel4bh-content"
                            id="panel4bh-header"
                        >
                            <Typography sx={{ width: '33%', flexShrink: 0 }}>Personal data</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
                                amet egestas eros, vitae egestas augue. Duis vel est augue.
                            </Typography>
                        </AccordionDetails>
                    </Accordion> */}
            </Container>


            {/* {node.children.map((node: Node) => (
                    <ProgramCard 
                        key={node.id}
                        id={node.id}
                        category={node.props.category}
                        name={node.props.name}
                        length={node.props.length}
                        width={node.props.width}
                        locked={node.props.locked}
                        selected={false} 
                        deleteNode={deleteNode}/>
                ))} */}

        </Drawer>
    );
}
