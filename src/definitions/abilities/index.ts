import { WeaponAbility } from './types'

export type WeaponAbilityDefinition = {
  passive?: boolean
}

const all = {
  [WeaponAbility.aimedShot]: {

  },
  [WeaponAbility.swing]: {

  },
  [WeaponAbility.block]: {
    passive: true
  },
  [WeaponAbility.cut]: {

  },
  [WeaponAbility.cleave]: {

  },
  [WeaponAbility.shoot]: {

  },
  [WeaponAbility.slash]: {

  },
  [WeaponAbility.parry]: {
    passive: true
  },
  [WeaponAbility.riposte]: {
    passive: true
  }
}

export default all
export const getDefinition = (weaponAbility: WeaponAbility): WeaponAbilityDefinition => {
  return all[weaponAbility]
}
