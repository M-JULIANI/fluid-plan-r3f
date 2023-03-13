import GuideCube from "components/GuideCube";
import { useState } from "react";
import CanvasInteraction from "./CanvasInteraction";
import SidebarMenu from "./SidebarMenu";

const Editor: React.FC = () => {

    const [cubes, updateCubes] = useState();

    // const cube = GuideCube({name: 'Meeting Room', id: '', category: 'Meeting', index:0, zIndex:1 })

    return (
        <>
            <CanvasInteraction />
            <SidebarMenu />
        </>
    )

}

export default Editor;