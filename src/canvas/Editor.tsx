import GuideCube from '../threeComponents/GuideCube';
import { useState } from 'react';
import SidebarMenu from './SidebarMenu';
import { ProgramTree } from '../../src/mock/ProgramTree';
import { makeNode } from '../schema/make';
export default function Editor() {
    const programTree = ProgramTree;

    const nodes = programTree.children.map(node => makeNode(node));

    const [cubes, updateCubes] = useState(nodes);

    // const cube = GuideCube({ name: 'Meeting Room', id: '', category: 'Meeting', index: 0, zIndex: 1 })

    return (
        <>
            {/* {cube} */}
            <SidebarMenu nodes={cubes} updateModel={updateCubes} />
        </>
    )

}