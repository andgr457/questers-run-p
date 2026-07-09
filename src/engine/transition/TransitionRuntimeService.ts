import { GAME_LOCATIONS } from '../../entity/location/data/Location.data'
import type { Location } from '../../entity/location/types/Location.types'
import { TUTORIAL_IDS } from '../../game/tutorial/data/Tutorial.data'
import type { Transition } from '../../ui/transition/types/Transition.types'
import { characterRuntimeService } from '../character/CharacterRuntimeService'
import { eventBus } from '../event/EventBus'
import { partyRuntimeService } from '../party/PartyRuntimeService'

class TransitionRuntimeService {
  private initialized = false
  private transition: Transition | undefined
  private destination: Location | undefined

  init() {
    if (this.initialized) {
      return
    }

    this.initialized = true

    eventBus.subscribe(event => {
      if (event.type === 'transition:start') {
        this.transition = event.meta?.transition

        if (!event.meta?.transition?.characterId && !event.meta?.transition?.partyId) {
          eventBus.emit({
            id: crypto.randomUUID(),
            type: 'transition:started',
            meta: {
              transition: event.meta?.transition,
            },
          })

          eventBus.emit({
            id: crypto.randomUUID(),
            parentEventId: event.id,
            type: 'world:mode:change',
            meta: {
              worldMode: 'transition',
            },
          })

          return
        }

        this.destination = GAME_LOCATIONS.find(
          l => l.id === event.meta?.transition?.destinationLocationId as string
        )

        eventBus.emit({
          id: crypto.randomUUID(),
          type: 'transition:started',
          meta: {
            transition: event.meta.transition,
          },
        })

        eventBus.emit({
          id: crypto.randomUUID(),
          parentEventId: event.id,
          type: 'world:mode:change',
          meta: {
            worldMode: 'transition',
          },
        })
      }

      if (event.type === 'transition:started') {
        if (event.meta?.transition?.characterId) {
          eventBus.emit({
            id: crypto.randomUUID(),
            type: 'character:save',
            parentEventId: event.id,
            meta: {
              character: {
                ...characterRuntimeService.getCharacter(
                  event.meta.transition.characterId
                ),
                locationId: event.meta.transition.destinationLocationId as string,
              },
            },
          })
        }

        if (event.meta?.transition?.partyId) {
          eventBus.emit({
            id: crypto.randomUUID(),
            type: 'party:save',
            parentEventId: event.id,
            meta: {
              party: partyRuntimeService.getParty(
                event.meta.transition.partyId
              ),
            },
          })
        }
      }

      if (event.type === 'transition:stop') {
        if (this.destination) {
          if (this.destination.type === 'town') {
            eventBus.emit({
              id: crypto.randomUUID(),
              type: 'tutorial:complete',
              meta: {
                tutorialId: TUTORIAL_IDS.TRAVEL_TO_TOWN,
              },
            })

            if (event.meta?.transition?.characterId) {
              const character = characterRuntimeService.getCharacter(
                event.meta.transition.characterId
              )
              eventBus.emit({
                id: crypto.randomUUID(),
                type: 'notification:save',
                meta: {
                  notification: {
                    title: 'Character Event',
                    description: `${character.name} arrived at the ${this.destination.name}.`
                  }
                }
              })
            }

            if (event.meta?.transition?.partyId) {
              const party = { name: 'not implemented!' }
              eventBus.emit({
                id: crypto.randomUUID(),
                type: 'notification:save',
                meta: {
                  notification: {
                    title: 'Party Event',
                    description: `${party.name} arrived at the ${this.destination.name}.`
                  }
                }
              })
            }
          }

          if (this.destination.type === 'adv_guild') {
            eventBus.emit({
              id: crypto.randomUUID(),
              type: 'tutorial:complete',
              meta: {
                tutorialId: TUTORIAL_IDS.VISIT_ADV_GUILD,
              },
            })
          }
        }

        this.transition = undefined
        this.destination = undefined

        if (event.meta?.transition?.characterId) {
          eventBus.emit({
            id: crypto.randomUUID(),
            parentEventId: event.id,
            type: 'world:mode:change',
            meta: {
              worldMode: 'character_manage',
            },
          })
        }

        if (event.meta?.transition?.partyId) {
          eventBus.emit({
            id: crypto.randomUUID(),
            parentEventId: event.id,
            type: 'world:mode:change',
            meta: {
              worldMode: 'party_manage',
            },
          })
        }
      }
    })
  }

  getCurrentTransition() {
    return this.transition
  }
}

export const transitionRuntimeService = new TransitionRuntimeService()