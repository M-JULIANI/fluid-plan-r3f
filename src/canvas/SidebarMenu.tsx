import { Updater } from '../state/types'
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, keyframes } from '@mui/material';
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
import AccordionContainer from '../components/AccordionContainer';
import AdjacencyMatrix from '../components/AdjacencyMatrix';
import { CameraViewMode, DisplaySettings } from './TopMenu';
import { SetStateAction } from 'react';
import TopMenu from './TopMenu';
import { EditorProps } from './Editor';

const minDrawerWidth = 240;
const defaultWidth = 420;

export type NodeSettings = {
    node: Node,
    updateNode: TaggedUpdater<Node>,
}

export interface SidebarProps extends EditorProps {
    props: Pick<EditorProps, 'displaySettings'>;
}

export default function SidebarMenu<SidebarProps>(props: SidebarProps) {

    console.log('sidebar')
    console.log(props)
  
    // const displaySettings  = props.displaySettings;
    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    return (
        <Drawer
            sx={{
                width: defaultWidth,
                minWidth: minDrawerWidth,
                // maxHeight: 250,
                // overflow: 'auto',
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: defaultWidth,
                    minWidth: minDrawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <TopMenu {...props} />
            <div style={{ backgroundColor: '#EAEAEA' }}>
                <Toolbar><h3>Fluid Plan</h3></Toolbar>
            </div>
            <Divider />

            <div>
                <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Typography sx={{ width: '33%', flexShrink: 0 }}>
                            Metrics
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}></Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <AccordionContainer></AccordionContainer>
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
            </div>


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
