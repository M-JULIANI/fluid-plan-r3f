import { ProgramCategory } from './program';
import tinycolor from 'tinycolor2';
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

export const lightenColor = (hex: string, percent: number) => {

  // Create a tinycolor object from the hex color
  const color = tinycolor(hex);

  // Lighten the color by the specified percentage
  const lightenedColor = color.lighten(percent);

  // Return the lightened color as a hex string
  return lightenedColor.toHexString();
}