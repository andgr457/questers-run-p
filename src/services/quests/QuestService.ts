import type { QuestWithQuestProgress } from '../../common/components/quests/CharacterQuests';
import type { Character } from '../../interfaces/characters/Character.types';
import type { Quest, QuestGroup, QuestProgress } from '../../interfaces/quests/Quests.types';

export class QuestService {

  constructor(){

  }

  getQuestWithQuestProgress(character: Character, quests: Quest[], questGroups: QuestGroup[], characterQuestProgress: QuestProgress[]): QuestWithQuestProgress[] {
    let anyQuestInProgress = false
    let cannotTakeReasons = ''
    const questsWithProgress: QuestWithQuestProgress[] = []
    for(const q of quests){
      const progress = characterQuestProgress?.find(qp => qp.questId === q.id && qp.characterId === character.id)
      if(progress && progress.status === 'in-progress'){
        anyQuestInProgress = true
        cannotTakeReasons = 'Another quest is already in progress.'
      }
      const group = questGroups.find(qg => qg.id === q.groupId)
      
      let canTake = !anyQuestInProgress && character.level >= q.requiredLevel
      if(canTake === true){
        if(character.level < q.requiredLevel){
          canTake = false
          cannotTakeReasons = `"${character.name}" must be level "${q.requiredLevel}" or above.`
        }
      }
      if(canTake === true){
        for(const propertyName of Object.getOwnPropertyNames(q.requiredStats)){
          //@ts-ignore
          const characterStat: Stat = character.stats[propertyName]
          //@ts-ignore
          const questStat: Stat = q.requiredStats[propertyName]
          if(characterStat.value < questStat.value){
            canTake = false
            cannotTakeReasons += ` "${characterStat.name}" must be "${questStat.value}" or above. `
          }
        }
      }
      if(canTake === true && q.requiredQuestId){
        const requiredQuestProgress = characterQuestProgress.find(qp => qp.questId === q.requiredQuestId && qp.status === 'complete')
        if(!requiredQuestProgress){
          canTake = false
          const requiredQuest = quests.find(quest => quest.id === q.requiredQuestId)
          cannotTakeReasons = `"${requiredQuest?.title}" quest must be completed before starting this.`
        }
      }
  
      const mergeItem: QuestWithQuestProgress = {
        quest: q,
        questGroup: group,
        questProgress: progress,
        canTakeQuest: canTake,
        cannotTakeReasons
      }
      questsWithProgress.push(mergeItem)
    }

    return questsWithProgress
  }
}