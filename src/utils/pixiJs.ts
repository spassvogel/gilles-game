import { Loader, LoaderResource } from 'pixi.js';
import { lerp } from './math';

export interface Coords {
  x: number;
  y: number;
}

export const lerpLocation = (point1: Coords, point2: Coords, alpha: number): Coords => {
  const x = lerp(point1.x, point2.x, alpha);
  const y = lerp(point1.y, point2.y, alpha);
  return { x, y };
};

// Uses the shared pixi loader to load a resource
export async function loadResourceAsync(path: string) {
  const loader = Loader.shared;
  return new Promise<LoaderResource>((resolve, _reject) => {
    if (loader.resources[path]) {
      resolve(loader.resources[path]);
    } else {
      loader.add(path).load((_, resources) => {
        resolve(resources[path]);
      });
    }
  });
}

export async function loadResourcesAsync(paths: string[]) {
  const loader = Loader.shared;
  return new Promise((resolve, _reject) => {
    paths.forEach(p => loader.add(p));
    loader.load((_, resources) => {
      resolve(resources);
    });
  });
}

export const loadResource = (path: string, callback: (resource: LoaderResource) => void) => {
  const loader = Loader.shared;
  if (loader.resources[path]) {
    callback(loader.resources[path]);
    return;
  }
  loader.add(path).load((_, resources) => { callback(resources[path]);});
};
