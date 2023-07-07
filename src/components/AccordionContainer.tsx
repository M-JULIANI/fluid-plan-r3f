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

export default function AccordionContainer<SidebarProps>(props: SidebarProps) {

    const { node, updateNode } = props;

    const [expanded, setExpanded] = React.useState<string | false>(false);
    const [animated, setAnimated] = React.useState<boolean>(false);

    const adjacencyBasket = adjacencies;

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    return (
        <>
            <Accordion expanded={expanded === 'panelAccordion'}
                onChange={handleChange('panelAccordion')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panelAccordion-content"
                    id="panelAccordion-header-nested"
                >
                    <Typography sx={{ width: '33%', flexShrink: 0, fontFamily: 'sans-serif', fontVariant: 'h3'}}>
                        Adjacencies
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}> </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    {expanded && <AdjacencyTableAlt adjacencyBasket={adjacencyBasket} />}
                    {/* {expanded  && <AdjacencyTable basket={adjacencyBasket} />} */}
                </AccordionDetails>
            </Accordion>
        </>
    );
}