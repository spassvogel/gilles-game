import * as PIXI from 'pixi.js';

export const lerpPoint = (point1: PIXI.Point, point2: PIXI.Point, alpha: number): PIXI.Point => {
    const x = lerp(point1.x, point2.x, alpha);
    const y = lerp(point1.y, point2.y, alpha);
    return new PIXI.Point(x, y);
}

const lerp = (n1: number,  n2: number,  alpha: number) =>  {
    return n1 + alpha * (n2 - n1);
}
