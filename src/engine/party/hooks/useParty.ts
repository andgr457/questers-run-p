import { useEffect, useState } from 'react'
import { eventBus } from '../../../engine/event/EventBus'
import { partyRuntimeService } from '../../../engine/party/PartyRuntimeService'
import type { PartyEntity } from '../../../entity/party/types/PartyEntity.types'

export function useParty() {
  const [parties, setParties] = useState<PartyEntity[]>([])
  const [managedParty, setManagedParty] =
    useState<PartyEntity | undefined>(undefined)

  useEffect(() => {
    setParties(partyRuntimeService.getParties())
    setManagedParty(undefined)
  }, [])

  useEffect(() => {
    const sync = () => {
      setParties(partyRuntimeService.getParties())
    }

    const unsubscribe = eventBus.subscribe(event => {
      if (event.type.startsWith('party:')) {
        sync()
      }
    })

    return () => {
      unsubscribe?.()
    }
  }, [])

  return {
    parties,
    managedParty,
    setManagedParty,

    getParty: (partyId: string) =>
      partyRuntimeService.getParty(partyId),

    getPartiesAtLocation: (locationId: string) =>
      partyRuntimeService.getPartiesAtLocation(locationId)
  }
}