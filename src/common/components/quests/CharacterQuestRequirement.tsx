import type { Achievement } from '../../../interfaces/achievements/Achievement.types'
import type { QuestCompletionRequirement } from '../../../interfaces/quests/Quests.types'
import type { QuestWithQuestProgress } from './CharacterQuests'

interface CharacterQuestRequirementProps {
  requirement: QuestCompletionRequirement
  questWithProgress: QuestWithQuestProgress
}

export default function CharacterQuestRequirement(props: CharacterQuestRequirementProps){
  const {
    requirement,
    questWithProgress,
  } = props

  const achievement = questWithProgress?.questRequirementsAchievements?.find(a => a?.id === requirement.achievementId)
  const item = questWithProgress?.questRequirementsItems?.find(i => i?.id === requirement.itemId)
  const txns = questWithProgress?.questRequirementsInventoryTxns?.filter(txn => txn.itemId === requirement.itemId)
  let txnTotal = 0
  for(const txn of txns){
    txnTotal += txn.quantity
  }
  return <div  className={requirement.completed === true ? 'quest-item-requirements-item completed' : 'quest-item-requirements-item'}>
    <div>
      <div style={{float: 'left'}}>
        {requirement.completed === true ? '✔' : '✘'}
      </div>
      {requirement.timeMinutes && <><strong>{requirement.timeMinutes}</strong> Minute(s) Long</>}
      {requirement.achievementId && <div title={achievement?.description}>Achivement: <strong>{achievement?.title}</strong></div>}
      {requirement.itemId && requirement.itemAmount && <><strong>{txnTotal > requirement.itemAmount ? requirement.itemAmount : txnTotal}/{requirement.itemAmount} {item?.name}</strong></>}
    </div>
  </div>
}