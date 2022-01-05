import { Location } from 'utils/tilemap';
import { MultiColorReplaceFilter } from '@pixi/filter-multi-color-replace';


export enum Orientation {
  north = 'n',
  northEast = 'ne',
  east = 'e',
  southEast = 'se',
  south = 's',
  southWest = 'sw',
  west = 'w',
  northWest = 'nw',
}

export const SPRITE_WIDTH = 142;

// Calculates an orientation that origin would be in if it was looking at destination
export const calculateBearing = (origin: Location, destination: Location) => {
  const angle = Math.atan2(destination[1] - origin[1], destination[0] - origin[0]);
  const result = Math.round((angle / (2 * Math.PI / 8) + 8) % 8);
  const orientations = [Orientation.east, Orientation.southEast, Orientation.south, Orientation.southWest, Orientation.west, Orientation.northWest, Orientation.north, Orientation.northEast];
  return orientations[result];
};

export const createColorReplaceFilter = (from: number[], to: number[]) => {
  const replacements: Location[] = from.map((val, index) => {
    return [
      from[index], to[index],
    ];
  });
  // todo!!
  return new MultiColorReplaceFilter(replacements, 0.15);
};

export const BLUES = [
  0x000e5f,
  0x00227f,
  0x0038a5,
  0x0055cc,
];

export const REDS = [
  0x570800,
  0x700c00,
  0x901000,
  0xb51700,
];

export const TEALS = [
  0x00330d,
  0x00653a,
  0x08936f,
  0x30bea5,
];

export const PURPLE = [
  0x3b0d3a,
  0x641d5e,
  0x884696,
  0xaa61bd,
];

export const ORANGE = [
  0x802d0c,
  0xaa4a12,
  0xd16d11,
  0xf59717,
];

export const BLACK = [
  0x0d0d1a,
  0x1a1b2b,
  0x25263a,
  0x35354c,
];

export const WHITE = [
  0x30375e,
  0x676993,
  0xa9aac2,
  0xe6e6e6,
];

export const YELLOW = [
  0xc28600,
  0xd6ae10,
  0xe9d333,
  0xfdf959,
];
