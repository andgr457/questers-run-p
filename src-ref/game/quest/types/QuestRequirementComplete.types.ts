
export interface QuestCompleteRequirement{
  itemId?: string
  itemAmount?: number
  itemCharacterAmount?: number
  itemName?: string
  itemDescription?: string
  itemProfessionType?: string
  achievementId?: string
  achievementTitle?: string
  achievementDescription?: string
  timeSeconds?: number
  timeMinutes?: number
  timeHours?: number
  mobId?: string
  mobName?: string
  mobDescription?: string
  mobLevel?: number
  mobAmount?: number
  mobCharacterAmount?: number
  mobLocationType?: string
  completed: boolean
}