import { Race } from 'constants/race'

export type LoreTexts = {
  characters: CharacterLoreTexts
}

type CharacterRaceLoreTexts = {
  female: string[]
  male: string[]
  last: string[]
}

type CharacterLoreTexts = {
  names: Record<RaceType, CharacterRaceLoreTexts>
}

let loreTexts: LoreTexts

type RaceType = keyof typeof Race

export const init = (_loreTexts: LoreTexts) => {
  loreTexts = _loreTexts
}

export const generateRandomName = (race: Race, isFemale = false) => {
  const names = loreTexts.characters.names[Race[race] as RaceType]
  const firstNames = isFemale ? names.female : names.male
  const lastNames = names.last

  return [
    firstNames.at(Math.floor(Math.random() * firstNames.length)),
    lastNames.at(Math.floor(Math.random() * lastNames.length))
  ].join(' ').trim()
}
