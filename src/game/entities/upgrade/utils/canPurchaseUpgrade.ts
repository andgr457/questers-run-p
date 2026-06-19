import type { CharacterEntity } from '../../character/types/Character.types'
import type { CharacterUpgradeEntity } from '../../character-upgrade/types/CharacterUpgradeEntity.types'
import type { UpgradeEntity } from '../types/UpdateEntity.types'

export function canPurchaseUpgrade(
  character: CharacterEntity,
  upgrade: UpgradeEntity,
  purchased: CharacterUpgradeEntity[]
) {
  const alreadyPurchased = purchased.some(
    p =>
      p.characterId === character.id &&
      p.upgradeId === upgrade.id
  )

  if (alreadyPurchased) {
    return false
  }

  for (const requirement of upgrade.requirements) {

    if (
      requirement.characterLevel &&
      character.level < requirement.characterLevel
    ) {
      return false
    }

    if (
      requirement.gold &&
      character.gold < requirement.gold
    ) {
      return false
    }
  }

  return true
}