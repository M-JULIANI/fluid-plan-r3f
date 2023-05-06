
export enum ProgramCategory {
    Meeting = "meeting",
    Office = "office",
    Amenity = "amenity",
    Core = "core",
    Support = "support",
    Event = "event"
}


export const ProgramList = [
    [ProgramCategory.Meeting],
    [ProgramCategory.Office],
    [ProgramCategory.Amenity],
    [ProgramCategory.Core],
    [ProgramCategory.Support],
    [ProgramCategory.Event],
]

export const programTypeCategories: Record<string, ProgramCategory> = {
    "Office": ProgramCategory.Office,
    "Meeting": ProgramCategory.Meeting,
    "Amenity": ProgramCategory.Amenity,
    "Core": ProgramCategory.Core,
    "Event": ProgramCategory.Event,
  };