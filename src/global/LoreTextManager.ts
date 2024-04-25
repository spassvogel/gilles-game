import { Gender } from 'constants/gender'
import { Race } from 'constants/race'
import { randomInt } from 'utils/random'

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

export const generateRandomName = (race: Race, gender: Gender) => {
  const names = loreTexts.characters.names[Race[race] as RaceType]
  const firstNames = gender === Gender.female ? names.female : names.male
  const lastNames = names.last

  return [
    firstNames.at(randomInt(0, firstNames.length - 1)),
    lastNames.at(randomInt(0, lastNames.length - 1))
  ].join(' ').trim()
}
