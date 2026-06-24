
export interface QuestEntityRequirementStartStat {
  statName: string
  reqAmount: number
  charAmount: number
}

export interface QuestEntityRequirementStart {
  title: string
  itemId?: string
  itemAmount?: number
  itemCharacterAmount?: number
  itemName?: string
  itemDescription?: string
  achievementId?: string
  achivementTitle?: string
  achivementDescription?: string
  questId?: string
  questTitle?: string
  questDescription?: string
  level?: number
  stamina?: number
  hp?: number
  guildRankLevel?: number
  guildRank?: number
}

export interface QuestEntityRequirementComplete{
  title: string
  itemId?: string
  itemAmount?: number
  itemCharacterAmount?: number
  itemName?: string
  itemDescription?: string
  itemProfessionType?: string
  achievementId?: string
  achievementTitle?: string
  achievementDescription?: string
  timeMillis?: number
  mobId?: string
  mobName?: string
  mobDescription?: string
  mobLevel?: number
  mobAmount?: number
  mobCharacterAmount?: number
  mobLocationType?: string
}