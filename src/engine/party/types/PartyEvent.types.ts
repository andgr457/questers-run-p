import type { PartyEntity } from '../../../entity/party/types/PartyEntity.types'
import type { GameEvent } from '../../event/types/EventBus.types'

export type PartyEventTypes =
  | 'party:save'
  | 'party:saved'
  | 'party:created'
  | 'party:updated'
  | 'party:deleted'
  | 'party:manage'

export interface GameEvent_PartySave extends GameEvent {
  type: 'party:save'
  meta: {
    party: PartyEntity
  }
}

export interface GameEvent_PartySaved extends GameEvent {
  type: 'party:saved'
  meta: {
    party: PartyEntity
  }
}

export interface GameEvent_PartyCreated extends GameEvent {
  type: 'party:created'
  meta: {
    party: PartyEntity
  }
}

export interface GameEvent_PartyUpdated extends GameEvent {
  type: 'party:updated'
  meta: {
    party: PartyEntity
  }
}

export interface GameEvent_PartyDeleted extends GameEvent {
  type: 'party:deleted'
  meta: {
    partyId: string
  }
}

export interface GameEvent_PartyManage extends GameEvent {
  type: 'party:manage'
  meta: {
    partyId: string
  }
}

export type PartyEvents =
  | GameEvent_PartySave
  | GameEvent_PartySaved
  | GameEvent_PartyCreated
  | GameEvent_PartyUpdated
  | GameEvent_PartyDeleted
  | GameEvent_PartyManage