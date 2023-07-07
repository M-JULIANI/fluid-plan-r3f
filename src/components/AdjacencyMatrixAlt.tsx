import { Group } from "@visx/group";
import genBins, { Bin, Bins } from "@visx/mock-data/lib/generators/genBins";
import { scaleLinear } from "@visx/scale";
import { HeatmapCircle, HeatmapRect } from "@visx/heatmap";
import { getSeededRandom } from "@visx/mock-data";
import { AdjacencyBasket, adjacencyColors, AdjacencyType } from "../adjacency/adjacencies";
import React, { ReactNode, CSSProperties } from "react";
import { style } from "typestyle";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import invert from "lodash/invert";
import mean from "lodash/mean";
import { programTypeCategories } from "../constants/program";
import { Box } from "@mui/system";


const hot1 = "#77312f";
const hot2 = "#f33d15";
const cool1 = "#122549";
const cool2 = "#b4fbde";
export const background = "#FFFFFF";

const seededRandom = getSeededRandom(0.41);

const binData = genBins(
  /* length = */ 16,
  /* height = */ 16,
  /** binFunc */(idx) => 150 * idx,
  /** countFunc */(i, number) => 25 * (number - i) * seededRandom()
);
console.log('binss')
console.log(binData)

function max<Datum>(data: Datum[], value: (d: Datum) => number): number {
    return Math.max(...data.map(value));
}

function min<Datum>(data: Datum[], value: (d: Datum) => number): number {
    return Math.min(...data.map(value));
}

// accessors
const bins = (d: Bins) => d.bins;
const count = (d: Bin) => d.count;

const colorMax = max(binData, (d) => max(bins(d), count));
const bucketSizeMax = max(binData, (d) => bins(d).length);

// scales
const xScale = scaleLinear<number>({
    domain: [0, binData.length]
});
const yScale = scaleLinear<number>({
    domain: [0, bucketSizeMax]
});
const circleColorScale = scaleLinear<string>({
    range: [hot1, hot2],
    domain: [0, colorMax]
});
const rectColorScale = scaleLinear<string>({
    range: [cool1, cool2],
    domain: [0, colorMax]
});
const opacityScale = scaleLinear<number>({
    range: [0.1, 1],
    domain: [0, colorMax]
});

 type HeatmapProps = {
    widt?: number;
    height?: number;
    adjacencyBasket: AdjacencyBasket;
    margin?: { top: number; right: number; bottom: number; left: number };
    separation?: number;
    events?: boolean;
};

const defaultMargin = { top: 100, left: 60, right: 20, bottom: 100 };

type ProximitiesTableProps = {
    proximities: Proximities,
};

const rowTypeStyle = style({
    whiteSpace: 'nowrap',
    textAlign: 'right',
});

const colTypeStyle = style({
    transform: 'rotate(180deg)',
    whiteSpace: 'nowrap',
    writingMode: 'vertical-lr',
});

const programTypeStyle = style({
    fontSize: 18,
});

const mapByTypes = (
    proximities: Proximities,
    callback: (programType: string, briefType: string) => ReactNode
) => {
    const programTypes = Object.keys(proximities).sort();
    return programTypes.map(programType => {
        const briefTypes = Object.keys(proximities[programType]).sort();
        return briefTypes.map(briefType => (
            callback(programType, briefType)
        ));
    });
};

const programTypeNames = invert(programTypeCategories);

const getCellStyle = (adjacencyType: AdjacencyType): CSSProperties => {
    const { fill, text } = adjacencyColors[adjacencyType] ?? {};
    return {
        backgroundColor: fill,
        color: text,
    };
};

export function AdjacencyTableAlt({ adjacencyBasket }: HeatmapProps) {

    console.log('regular: ')
    console.log(programTypeCategories)
    console.log('inverted: ')
    console.log(programTypeNames)

    console.log('basket: ')
    console.log(adjacencyBasket)

    console.log('sim:')
    Object.keys(adjacencyBasket).forEach((x, i) => {
        console.log('key: ' + x)
        Object.keys(x).forEach((y, j) => {
            console.log('x: ' + x + ', j: ' + y)
            console.log(adjacencyBasket[x][y])
        });

    });

    return (
        <Box sx={{
            width: '80%', maxWidth: '80%',
            display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
        }}>
            <Table sx={{width: '80%', maxWidth: '80%', mr: '100px', ml: '100px'}}>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        {Object.keys(programTypeCategories).map((x, i) => (
                            <TableCell key={i} className={colTypeStyle}>
                                <strong className={programTypeStyle}>{programTypeCategories[x]}</strong>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.values(adjacencyBasket).map((category, i) => (
                        <TableRow key={i}>
                                <TableCell className={rowTypeStyle}>
                                    <strong className={programTypeStyle}>{Object.keys(category)[i]}</strong>
                                </TableCell>
                            {Object.values(category).map(y => {
                                const num = y as number ?? 0;
                                const key = JSON.stringify([category, num]);
                                const distances = Math.abs(20 - num);
                                // const meanDistance = Math.round(mean(distances))
                                const adjacency = distances <= 10
                                    ? AdjacencyType.Adjacent
                                    : distances <= 20
                                        ? AdjacencyType.Near
                                        : AdjacencyType.NotConnected;

                                return (
                                    <TableCell key={key} style={getCellStyle(adjacency)} align="center">
                                        {isNaN(distances) ? `${category}` : distances}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
};