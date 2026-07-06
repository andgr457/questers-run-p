import type { PartyEntity } from '../../entity/party/types/PartyEntity.types'
import { GAME_STORAGE_KEYS } from '../data/local-storage/GameStorageKeys.data'
import { eventBus } from '../event/EventBus'
import type { GameEvent } from '../event/types/EventBus.types'

class PartyRuntimeService {
  private initialized = false

  private parties: Record<string, PartyEntity> = {}
  private partyIdManaging: string | undefined

  init() {
    if (this.initialized) {
      return
    }

    this.initialized = true

    const partiesValue = localStorage.getItem(
      GAME_STORAGE_KEYS.PARTIES_GAME
    )

    if (partiesValue) {
      const parties = JSON.parse(partiesValue) as PartyEntity[]

      this.parties = {}

      for (const party of parties) {
        this.parties[party.id] = party
      }
    }

    eventBus.subscribe(event => {
      if (event.type === 'party:save') {
        this.save(event)
      }

      if (event.type === 'party:manage') {
        this.partyIdManaging = event.meta.partyId
      }
    })
  }

  getParty(id: string) {
    return this.parties[id]
  }

  getParties() {
    return Object.values(this.parties)
  }

  getPartiesAtLocation(locationId: string) {
    return Object.values(this.parties).filter(
      p => p.locationId === locationId
    )
  }

  getManagingParty(): PartyEntity | undefined {
    if (!this.partyIdManaging) return undefined
    return this.parties[this.partyIdManaging]
  }

  saveParty(party: PartyEntity) {
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'party:save',
      meta: {
        party
      }
    })
  }

  private save(event: GameEvent) {
    const party = event.meta?.party as PartyEntity

    if (!party) {
      return
    }

    this.parties[party.id] = party

    eventBus.emit({
      id: crypto.randomUUID(),
      parentEventId: event.id,
      type: 'party:saved',
      meta: {
        party
      }
    })

    eventBus.emit({
      id: crypto.randomUUID(),
      parentEventId: event.id,
      type: 'party:updated',
      meta: {
        party
      }
    })
  }
}

export const partyRuntimeService = new PartyRuntimeService()