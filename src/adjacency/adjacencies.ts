import { ProgramCategory } from "../constants/program"

export type ProgramPairInfo = {
    to: ProgramCategory
    distance: number
}
export type AdjacencyBasket = {
    [branch: string]: {
        [prop: string]: number
    };
}