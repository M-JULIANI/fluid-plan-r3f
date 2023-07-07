import { ProgramCategory } from "../constants/program"


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
    Near = "Near",
    NotConnected = "NotConnected",
}

type ColorInfo =  {
    fill: string
    text: string
  }

export const adjacencyColors: Record<AdjacencyType, ColorInfo> = {
    [AdjacencyType.Adjacent]: {
      fill: "#45818e",
      text: "#ffffff",
    },
    [AdjacencyType.Near]: {
      fill: "#fff2cc",
      text: "#000000",
    },
    [AdjacencyType.NotConnected]: {
      fill: "#a61c00",
      text: "#ffffff",
    },
  };