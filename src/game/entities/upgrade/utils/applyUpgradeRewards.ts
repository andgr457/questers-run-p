import type { CharacterEntity } from '../../character/types/Character.types'
import type { UpgradeEntity } from '../types/UpdateEntity.types'

export function applyUpgradeRewards(
  character: CharacterEntity,
  upgrade: UpgradeEntity
): CharacterEntity {

  const updated = { ...character }

  for (const reward of upgrade.rewards) {

    updated.hpMax += reward.hp ?? 0

    updated.manaMax += reward.mana ?? 0

    updated.staminaMax += reward.stamina ?? 0

    updated.strength += reward.strength ?? 0
    updated.intellect += reward.intellect ?? 0
    updated.agility += reward.agility ?? 0
  }

  return updated
}