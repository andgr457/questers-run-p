export type QuestProgressStatus = 'in-progress' | 'complete'

export interface QuestProgress {
  id: string
  questId: string
  characterId: string
  status: QuestProgressStatus
  startDate: string
  endDate?: string
}