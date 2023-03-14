
export enum ProgramCategory {
    Meeting = "meeting",
    Office = "office",
    Amenity = "amenity",
    Core = "core",
    Support = "support",
    Event = "event"
}

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