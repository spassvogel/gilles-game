const CONSTANT = 0.5;

export const xpToLevel = (xp: number) => {
  return Math.floor(CONSTANT * Math.sqrt(xp));
}

export const levelToXp = (level: number) => {
  return Math.pow(level / CONSTANT, 2);
}

// print out required xp
// for(let i = 1; i < 20; i++) {
//   console.log(levelToXp(i))
// }
