import type { UpgradeRequirementEntity } from '../../types/UpdateEntity.types'

export default function UpgradeEntityDetailRequirementRecord({
  requirement
}: {
  requirement: UpgradeRequirementEntity
}) {
  return (
    <div>
      {requirement.characterLevel && (
        <div>Level {requirement.characterLevel}</div>
      )}

      {requirement.gold && (
        <div>{requirement.gold} Gold</div>
      )}

      {requirement.characterQuestCount && (
        <div>
          {requirement.characterQuestCount} Quests Completed
        </div>
      )}

      {requirement.characterMobCountAny && (
        <div>
          {requirement.characterMobCountAny} Mobs Defeated
        </div>
      )}
    </div>
  )
}