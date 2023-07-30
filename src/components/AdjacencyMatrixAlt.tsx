import { Group } from "@visx/group";
import genBins, { Bin, Bins } from "@visx/mock-data/lib/generators/genBins";
import { scaleLinear } from "@visx/scale";
import { HeatmapCircle, HeatmapRect } from "@visx/heatmap";
import { getSeededRandom } from "@visx/mock-data";
import { AdjacencyBasket, adjacencyColors, AdjacencyMap, AdjacencyType } from "../adjacency/adjacencies";
import React, { ReactNode, CSSProperties, useState, useEffect } from "react";
import { style } from "typestyle";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import invert from "lodash/invert";
import mean from "lodash/mean";
import { programTypeCategories } from "../constants/program";
import { Box, Container, Tooltip } from "@mui/material";
import { borderLeft } from "@mui/system";
import { TaggedUpdater } from "state/types";


type HeatmapProps = {
    overallWidth: number;
    setAffectedNodes: React.Dispatch<React.SetStateAction<string[]>>;
    height?: number;
    adjacencyBasket: AdjacencyMap;
    margin?: { top: number; right: number; bottom: number; left: number };
    separation?: number;
    events?: boolean;
};

const rowTypeStyle = (cellWidth: number) => style({
    whiteSpace: 'nowrap',
    transform: 'rotate(235deg)',
    writingMode: 'vertical-lr',
    textAlign: 'right',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: cellWidth * 1.5,
    height: cellWidth,
    borderWidth: 1,
    borderColor: 'white',

});

const colTypeStyle = (cellWidth: number) => style({
    transform: 'rotate(180deg)',
    whiteSpace: 'nowrap',
    writingMode: 'vertical-lr',
    overflow: 'hidden',
    //textAlign: 'center',
    textOverflow: 'ellipsis',
    maxWidth: cellWidth,
    // maxHeight: cellWidth,
    borderWidth: 1,
    borderColor: 'white'
});

const programTypeStyle = (cellWidth: number) => style({
    fontSize: cellWidth * 0.5,
    width: cellWidth,
    height: cellWidth,
    borderWidth: 1,
    borderColor: 'white'
});


const getCellStyle = (adjacencyType: AdjacencyType, cellWidth: number) => {
    const { fill, text } = adjacencyColors[adjacencyType] ?? {};
    return {
        backgroundColor: fill,
        color: text,
        fontSize: cellWidth * 0.5,
        overflow: 'hidden',
       // WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 1,
       // textAlign: 'left',
        textOverflow: 'ellipsis',
        width: cellWidth,
        height: cellWidth,
        borderRadius: '0px',
        transition: 'background-color 0.3s ease',
        borderWidth: 1,
        borderColor: 'black',
        margin: '5px',
        borderLeft: '1.5px solid black',
        borderRight: '1.5px solid black',
        borderTop: '1.5px solid black',
        borderBottom: '1.5px solid black',
    };
}


const sample = (adjacencyType: AdjacencyType, cellWidth: number) => {
    const { fill, text } = adjacencyColors[adjacencyType] ?? {};
    return style({
        backgroundColor: fill,
        color: text,
        fontSize: cellWidth * 0.5,
        overflow: 'hidden',
        textAlign: 'center',
       // wordBreak: 'break-all',
        textOverflow: 'ellipsis',
        maxWidth: cellWidth,
        maxHeight: cellWidth,
        borderRadius: '0px',
        transition: 'background-color 0.3s ease',
        borderWidth: 1,
        borderColor: 'black',
        margin: '5px',
        borderLeft: '1.5px solid black',
        borderRight: '1.5px solid black',
        borderTop: '1.5px solid black',
        borderBottom: '1.5px solid black',
    });
}
const hoveredCellStyle = {
    borderLeft: '3px solid black',
    borderRight: '3px solid black',
    borderTop: '3px solid black',
    borderBottom: '3px solid black',
};

export function AdjacencyTableAlt({ adjacencyBasket, overallWidth, setAffectedNodes}: HeatmapProps) {

    const [cellWidth, setCellWidth] = useState(10);
    const [hoveredCell, setHoveredCell] = useState<string | undefined>(undefined);
    const keys = Object.keys(adjacencyBasket);

    //console.log('keys: ' + keys.length)
    useEffect(() => {
        const width = (overallWidth - 40) / ((keys.length * 5) || 1);
        setCellWidth(width);
    }, [keys])

    useEffect(() => {
       // console.log('hovered: ' + hoveredCell)
    }, [hoveredCell])

    useEffect(() => {
        console.log('cell width: ' + cellWidth)
    }, [cellWidth])


    const handleMouseOverCell = (cat1: string, cat2: string, adj: string) => {
        setHoveredCell(`${cat1} - ${cat2}: ${adj}`);
        setAffectedNodes([cat1, cat2]);
    }

    return (
        <Container
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px'
            }}
            onMouseLeave={() => {
                setHoveredCell(undefined)
                setAffectedNodes([]);
            }}
        >
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell className={rowTypeStyle(cellWidth)} />
                        {keys.map((x, i) => (
                            <TableCell key={i} className={colTypeStyle(cellWidth)}>
                                <strong className={programTypeStyle(cellWidth)}>{keys[i]}</strong>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.keys(adjacencyBasket).map((category, i) => (
                        <TableRow key={i}>
                            <Tooltip title={category} arrow
                                placement="right"
                                PopperProps={{ style: { marginLeft: '0px' } }} >
                                <TableCell className={rowTypeStyle(cellWidth)}>
                                    <strong className={programTypeStyle(cellWidth)}>{category}</strong>
                                </TableCell>
                            </Tooltip>
                            {Object.keys(adjacencyBasket[category])?.map((category2: any, j: number) => {
                                if (j <= i) {
                                    const num = adjacencyBasket[category][category2];
                                    const paddedNumber = `${num}`.length === 1 ? `0${num}` : `${num}`;

                                    const key = JSON.stringify([category, num]);
                                    // const meanDistance = Math.round(mean(distances))
                                    const adjacency = num <= 10
                                        ? AdjacencyType.Adjacent
                                        : num <= 20
                                            ? AdjacencyType.CloseBy
                                            : AdjacencyType.Disconnected;

                                    const tooltip = `${category} - ${category2}: ${adjacency}`;

                                    const combinedStyle = hoveredCell === tooltip
                                        ? { ...getCellStyle(adjacency, cellWidth), ...hoveredCellStyle }
                                        : getCellStyle(adjacency, cellWidth);

                                    return (
                                        <Tooltip
                                            title={tooltip}
                                            arrow={true}
                                            placement="right"
                                            PopperProps={{ style: { marginLeft: '0px' } }}>
                                            <TableCell key={j} style={combinedStyle} align="center"
                                                onMouseEnter={() => handleMouseOverCell(category, category2, adjacency)}>
                                                {isNaN(num) ? 'N ' : paddedNumber}
                                            </TableCell>
                                        </Tooltip>
                                    );
                                }

                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    );
};