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
import { Node } from 'schema/types';
import { Container, keyframes } from '@mui/material';
import { useCallback } from 'react';

const minDrawerWidth = 240;
const defaultWidth = 420;

type SidebarProps = {
    nodes: Node[],
    updateNodes: Updater<Node[]>
}

export default function SidebarMenu<SidebarProps>(props: SidebarProps) {

    const { nodes, updateNodes } = props;

    console.log('nodes at sidebar')
    console.log(nodes);

    const deleteNode = useCallback((id) => {
        console.log('deleting node: ' + id)
        updateNodes(nodes.filter(node=> node.id !== id))
    }, []);

    return (
        <Container sx={{ display: 'flex' }}>
            <CssBaseline />
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
                <div style={{ backgroundColor: '#EAEAEA' }}>
                    <Toolbar><h3>Program Elements</h3></Toolbar>
                </div>
                <Divider />


                {nodes.map((node: Node) => (
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
                ))}

            </Drawer>
        </Container>
    );
}
