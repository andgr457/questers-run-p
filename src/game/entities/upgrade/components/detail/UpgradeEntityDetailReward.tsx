import type { UpgradeRewardEntity } from '../../types/UpdateEntity.types'

export default function UpgradeEntityDetailRewardRecord({
  reward
}: {
  reward: UpgradeRewardEntity
}) {
  return (
    <div>

      {reward.hp && (
        <div>+{reward.hp} HP Max</div>
      )}

      {reward.mana && (
        <div>+{reward.mana} Mana Max</div>
      )}

      {reward.stamina && (
        <div>+{reward.stamina} Stamina Max</div>
      )}

      {reward.strength && (
        <div>+{reward.strength} Strength</div>
      )}

      {reward.intellect && (
        <div>+{reward.intellect} Intellect</div>
      )}

      {reward.agility && (
        <div>+{reward.agility} Agility</div>
      )}

      {reward.characterTokens && (
        <div>
          +{reward.characterTokens} Character Tokens
        </div>
      )}
    </div>
  )
}