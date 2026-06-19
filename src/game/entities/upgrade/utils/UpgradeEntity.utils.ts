import { GAME_UPGRADES } from '../data/UpgradeEntity.data'

export function getUpgrade(upgradeId: string) {
  return GAME_UPGRADES.find(u => u.id === upgradeId)
}