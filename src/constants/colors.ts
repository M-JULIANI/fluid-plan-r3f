import { ProgramCategory } from "./program";
export type ColorByProgram = {
    [key in ProgramCategory]: string;
};

export const Colors: ColorByProgram = {
    meeting: 'purple',
    office: 'blue',
    amenity: 'orange',
    core: 'gray',
    support: 'lightgray',
    event: 'green',
}