import { NodePositionInfo } from "../graph/types";
import { ProgramCategory } from "../constants/program";
import { Node } from "../schema/types";


export type ProgramPairInfo = {
  to: ProgramCategory,
  distance: number
}
export type AdjacencyBasket = {
  [branch: string]: {
    [prop: string]: number
  };
}

export enum AdjacencyType {
  Adjacent = "Adjacent",
  CloseBy = "CloseBy",
  Disconnected = "Disconnected",
}

type ColorInfo = {
  fill: string
  text: string
}

export const adjacencyColors: Record<AdjacencyType, ColorInfo> = {
  [AdjacencyType.Adjacent]: {
    fill: "#B4FFB4",
    text: "#000000",
  },
  [AdjacencyType.CloseBy]: {
    fill: "#FFCFA0",
    text: "#000000",
  },
  [AdjacencyType.Disconnected]: {
    fill: "#FFB4B4",
    text: "#000000",
  },
};

type AdjacencyBucket = { [cat: string]: number }
export type AdjacencyMap = { [k: string]: AdjacencyBucket }

//assumes xz plane, not xy plane
const manhattan = (n1: Node, n2: Node) => {
  const position1x = n1.props?.position?.x ? n1.props.position.x : n1.props.position[0];
  const position1y = n1.props?.position?.z ? n1.props.position.z : n1.props.position[2];

  const position2x = n2.props?.position?.x ? n2.props.position.x : n2.props.position[0];
  const position2y = n2.props?.position?.z ? n2.props.position.z : n2.props.position[2];
  return Math.abs(position1x - position2x) + Math.abs(position1y - position2y);
}

export const calculateAdjacencies = (nodeInfo: NodePositionInfo[]): AdjacencyMap => {

  const map: AdjacencyMap = {};

  const duplicate = nodeInfo.slice();
  const sorted = duplicate.sort((a, b) => a.node.props.displayName.localeCompare(b.node.props.displayName));

  for (let i = 0; i < sorted.length; i++) {
    const idFirst = sorted[i].node.props.displayName;
    map[idFirst] = {};

    for (let j = 0; j < sorted.length; j++) {
      const idSecond = sorted[j].node.props.displayName;
      if (i === j) {
        map[idFirst][idSecond] = 0;
        continue;
      }
      const inverse = map[idSecond]?.[idFirst];
      if (inverse) {
        map[idFirst][idSecond] = inverse;
      }
      else {
        map[idFirst][idSecond] = manhattan(sorted[i].node, sorted[j].node)
      }
    }
  }
  return map;
}