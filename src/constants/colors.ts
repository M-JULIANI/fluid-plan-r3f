import { ProgramCategory } from "./program";
export type ColorByProgram = {
    [key in ProgramCategory]: string;
};

export const Colors: ColorByProgram = {
    meeting: '#FF7F50', //coral
    office: '#FFF44F', //lemon
    amenity: '#87CEEB', //sky
    core: '#FF69B4', // fucsia pink
    support: '#FFA07A', //tangerine orange
    event: '#9370DB', //lavender purple
}