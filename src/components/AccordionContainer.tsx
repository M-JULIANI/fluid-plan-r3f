import { Updater } from '../state/types'
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
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
import { Container, keyframes } from '@mui/material';
import { useCallback } from 'react';
import { TaggedUpdater } from '../state/types';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AdjacencyMatrix from './AdjacencyMatrix';
import { ParentSize } from '@visx/responsive';
import { useEffect } from 'react';
import { adjacencies } from '../mock/ProgramTreeAdjacencies';
import { AdjacencyTableAlt } from './AdjacencyMatrixAlt';
import { NodePositionInfo } from 'graph/types';
import { calculateAdjacencies } from '../adjacency/adjacencies';

type ContainerProps = {
    nodeInfo: NodePositionInfo[]
    width: number,
    setAffectedNodes: React.Dispatch<React.SetStateAction<string[]>>
}

export const AdjacencyTableContainer: React.FC<ContainerProps> = ({nodeInfo, width, setAffectedNodes})=> {

    const [expanded, setExpanded] = React.useState<string | false>(false);
    const adjacencyBasket = calculateAdjacencies(nodeInfo);
    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    return (
            <Accordion expanded={expanded === 'panelAccordion'}
                onChange={handleChange('panelAccordion')}
                sx={{ width: '100%'}}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panelAccordion-content"
                    id="panelAccordion-header-nested"
                    sx={{ width: '100%',
                    display: 'flex',}}
                >
                    <Typography sx={{ width: '33%', flexShrink: 0, fontFamily: 'sans-serif', fontVariant: 'h3' }}>
                        Adjacencies
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}> </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{
                    display: 'flex',
                    width: '100%',
                    flex: 'flex-grow',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    {expanded && <AdjacencyTableAlt 
                    adjacencyBasket={adjacencyBasket} 
                    overallWidth={width} 
                    setAffectedNodes = {setAffectedNodes}
                    />}
                    {/* {expanded  && <AdjacencyTable basket={adjacencyBasket} />} */}
                </AccordionDetails>
            </Accordion>
    );
}