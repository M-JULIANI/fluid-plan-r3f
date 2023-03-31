import GuideCube from '../threeComponents/GuideCube';
import React, { SetStateAction, useState } from 'react';
import SidebarMenu from './SidebarMenu';
import { ProgramTree } from '../../src/mock/ProgramTree';
import { makeNode } from '../schema/make';
import { useUpdateState, useRefineState } from '../state/hooks';
import { getNodeKeys } from '../schema/traverse';
import { Node } from '../schema/types';
import { TaggedUpdater } from 'state/types';

type EditorProps = {
    root: Node,
   // updateRoot: TaggedUpdater<Node>,
    updateRoot: React.Dispatch<SetStateAction<Node>>
}
export const Editor: React.FC<EditorProps> = (props: EditorProps) => {
    const programTree = ProgramTree as Node;

    const {
        root,
        updateRoot
    } = props;

    const nodes = programTree.children.map(node => makeNode(node));
    //const partialNodes = nodes.slice(0, 5);
    // console.log('ut at editor: ')
    // console.log(updateRoot)
    // const editPath = getNodeKeys(programTree, isolation, undefinedGetter) || [];
    // const [editShapes, updateShapes] = refine(...editPath, 'children')();


    // const cube = GuideCube({ name: 'Meeting Room', id: '', category: 'Meeting', index: 0, zIndex: 1 })

    return (
        <>
            {/* {cube} */}
            <SidebarMenu node={root} updateNode={updateRoot} />
        </>
    )

}