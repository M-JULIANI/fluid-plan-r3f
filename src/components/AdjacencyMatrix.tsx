import React from "react";
import { Group } from "@visx/group";
import genBins, { Bin, Bins } from "@visx/mock-data/lib/generators/genBins";
import { scaleLinear } from "@visx/scale";
import { HeatmapCircle, HeatmapRect } from "@visx/heatmap";
import { getSeededRandom } from "@visx/mock-data";
import { AdjacencyBasket } from "adjacency/adjacencies";
import {  HeatMapComponent, Inject, Legend, Tooltip, Adaptor } from "@syncfusion/ej2-react-heatmap";

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

export type HeatmapProps = {
    width: number;
    height: number;
    adjacencyBasket: AdjacencyBasket;
    margin?: { top: number; right: number; bottom: number; left: number };
    separation?: number;
    events?: boolean;
};

const defaultMargin = { top: 100, left: 60, right: 20, bottom: 100 };

function AdjacencyMatrix() {



    let heatmapData : any[] = [
        [73, 39, 26, 39, 94, 0],
        [93, 58, 53, 38, 26, 68],
        [99, 28, 22, 4, 66, 90],
        [14, 26, 97, 69, 69, 3],
        [7, 46, 47, 47, 88, 6],
        [41, 55, 73, 23, 3, 79],
        [56, 69, 21, 86, 3, 33],
        [45, 7, 53, 81, 95, 79],
        [60, 77, 74, 68, 88, 51],
        [25, 25, 10, 12, 78, 14],
        [25, 56, 55, 58, 12, 82],
        [74, 33, 88, 23, 86, 59]
];

    return (<HeatMapComponent
    titleSettings = { {
      text: 'Sales Revenue per Employee (in 1000 US$)',
      textStyle: {
          size: '15px',
          fontWeight: '500',
          fontStyle: 'Normal',
          fontFamily: 'Segoe UI'
      }
  } }
  xAxis = { {
      labels: ['Nancy', 'Andrew', 'Janet', 'Margaret', 'Steven',
  'Michael', 'Robert', 'Laura', 'Anne', 'Paul', 'Karin',   'Mario'],
  } }
  yAxis = { {
      labels: ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'],
  } }
  width="400px"
  height="400px"
  cellSettings = { {
      border: {
          width: 1,
          radius: 4,
          color: 'white'
      }
  } }
  dataSource={heatmapData}>
  <Inject services={[Tooltip]} />
  </HeatMapComponent> )
};

export default AdjacencyMatrix;