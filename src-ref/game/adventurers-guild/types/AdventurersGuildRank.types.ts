export type AdventurersGuildRankLabel = '' 
  | 'F' 
  | 'E' 
  | 'D' 
  | 'C' 
  | 'B' 
  | 'A' 
  | 'S' 
  | 'SS'

export type AdventurersGuildRankRequirementType = 'level' 
  | 'total_quests'
  | 'total_achievements'
  | 'total_mobs'
  | 'total_mob_id'
  | 'mob_id'
  | 'quest_id'
  | 'achievement_id'

export type AdventurersGuildRankRequirementTypeLabel = 'Level'
  | 'Number of Quests'
  | 'Number of Achievements'
  | 'Number of Any Mobs Defeated'
  | 'Number of Certain Mob Defeated'
  | 'Certain Mob Defeated Once'
  | 'Certain Quest Defeated Once'
  | 'Certain Achievement Obtained'

export interface AdventurersGuildRankRequirement {
  type: AdventurersGuildRankRequirementType
  label: AdventurersGuildRankRequirementTypeLabel
}

export interface AdventurersGuildRank {
  name: AdventurersGuildRankLabel
  description: React.ReactNode
  requirements: AdventurersGuildRankRequirement[]
}