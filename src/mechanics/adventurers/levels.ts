const CONSTANT = 0.5;

export function xpToLevel(xp: number) {
    return Math.floor(CONSTANT * Math.sqrt(xp));
}

export function levelToXp(level: number) {
    return Math.pow(level / CONSTANT, 2);
}