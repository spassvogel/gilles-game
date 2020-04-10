import * as PIXI from 'pixi.js';
// Adapted from https://github.com/explooosion/hitarea-shapes/blob/master/src/index.js

export default class HitAreaShapes {
    public shapes: PIXI.Polygon[];

    constructor(shapes = {}, sprite: string = "0") {
  //     console.log(shapes, sprite)
  //     const keys = Object.keys(shapes)[sprite];      
  // console.log(keys)
      this.shapes = shapes[sprite].map((definition: { shape: number[]; }) => {
          const shape: number[] = definition.shape;
          return new PIXI.Polygon(shape);
      });
    }
  
    /**
     * Called by hitArea
     * @param {number} x
     * @param {number} y
     */
    contains(x = 0, y = 0) {
      return (!this.shapes || this.shapes.length === 0)
        ? false
        : this.shapes.some(shape => shape.contains(x, y));
    }
  }