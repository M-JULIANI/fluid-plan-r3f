import GuideCube from "components/GuideCube";
import { useState } from "react";
import SidebarMenu from "./SidebarMenu";

export default function Editor() {

    const [cubes, updateCubes] = useState();

    // const cube = GuideCube({name: 'Meeting Room', id: '', category: 'Meeting', index:0, zIndex:1 })

    return (
        <>
            <SidebarMenu />
        </>
    )

}