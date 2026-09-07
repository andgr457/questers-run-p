import type { EntityBase, EntityXpProperties } from './EntityBase.types';

export interface Guild extends EntityBase, EntityXpProperties {
  guildMasterId: string
  gold: number
  level: number
  // infractions: GuildInfraction[]
}

export type GuildInfractionStatusType = 
  'received'
  | 'investigation'
  | 'negotiation'
  | 'fines'
  | 'dismissed'
  | 'resolved'

export type GuildInfractionMemberAllegationType = 
  'harm'
  | 'theft'
  | 'sanitary'
  | 'noise'
  | 'fraud'
  | 'taxes_late'

export interface GuildInfraction {
  id: string
  complaint: string
  complaintDate: number
  reportedDate: number
  status: GuildInfractionStatusType
  memberIds: string[]
}