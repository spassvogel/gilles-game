
interface Location {
    x: number;
    y: number;
}

export const lerpLocation = (point1: Location, point2: Location, alpha: number): Location => {
    const x = lerp(point1.x, point2.x, alpha);
    const y = lerp(point1.y, point2.y, alpha);
    return { x, y };
}

const lerp = (n1: number,  n2: number,  alpha: number) =>  {
    return n1 + alpha * (n2 - n1);
}
