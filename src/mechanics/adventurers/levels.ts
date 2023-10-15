const CONSTANT = 0.5

export const xpToLevel = (xp: number) => {
  return Math.floor(CONSTANT * Math.sqrt(xp))
}

export const levelToXp = (level: number) => {
  return Math.pow(level / CONSTANT, 2)
}

export const MAX_LEVEL = 80 // maximum level an adventurer can e
export const MAX_XP = levelToXp(MAX_LEVEL)

// print out required xp
// for(let i = 1; i < 20; i++) {
//   console.log(levelToXp(i))
// }
