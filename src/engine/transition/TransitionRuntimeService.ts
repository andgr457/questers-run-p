import { GAME_LOCATIONS } from '../../entity/location/data/Location.data'
import type { Location } from '../../entity/location/types/Location.types'
import { TUTORIAL_IDS } from '../../game/tutorial/data/Tutorial.data'
import type { Transition } from '../../ui/transition/types/Transition.types'
import { characterRuntimeService } from '../character/CharacterRuntimeService'
import { eventBus } from '../event/EventBus'
import { eventHistoryRuntimeService } from '../event/EventHistoryRuntimeService'
import { tutorialRuntimeService } from '../tutorial/TutorialRuntimeService'

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
        this.transition = event.meta.transition
        this.destination = GAME_LOCATIONS.find(l => l.id === event.meta.destinationId)

        eventBus.emit({
          id: crypto.randomUUID(),
          type: 'transition:started',
          meta: {
            characterId: event.meta.characterId,
            partyId: event.meta.partyId,
            locationId: event.meta.destinationId
          }
        })
        eventBus.emit({
          id: crypto.randomUUID(),
          parentEventId: event.id,
          type: 'world:mode:change',
          meta: {
            worldMode: 'transition'
          }
        })
      }
      if(event.type === 'transition:started'){
        if(event.meta.characterId){
          eventBus.emit({
            id: crypto.randomUUID(),
            type: 'character:save',
            parentEventId: event.id,
            meta: {
              character: {
                ...characterRuntimeService.getCharacter(
                  event.meta.characterId
                ),
                locationId: event.meta.locationId
              }
            }
          })
        }
        if(event.meta.partyId){
          console.log('Party Transition Not Implemented')
        }
      }
      if(event.type === 'transition:stop'){
        //need to do this or other things not using normal transition (input form) wont work correctly
        if(this.destination){
          if(this.destination.type === 'town'){
            const travelTutorialComplete = tutorialRuntimeService.isComplete(
              TUTORIAL_IDS.TRAVEL_TO_TOWN
            )
            if(travelTutorialComplete === false){
              tutorialRuntimeService.completeTutorial(TUTORIAL_IDS.TRAVEL_TO_TOWN)
            }
            if(event.meta.characterId){{
              const character = characterRuntimeService.getCharacter(event.meta.characterId)
              eventHistoryRuntimeService.addHistory(
                `Character Event`,
                `${character.name} arrived at ${this.destination.name}.`
              )
            }}
            if(event.meta.partyId){
              const party = {name: 'not implemented!'}
              eventHistoryRuntimeService.addHistory(
                `Party Event`,
                `${party.name} arrived at ${this.destination.name}.`
              )
            }
          }
          if(this.destination.type === 'adv_guild'){
            const travelTutorialComplete = tutorialRuntimeService.isComplete(
              TUTORIAL_IDS.VISIT_ADV_GUILD
            )
            if(travelTutorialComplete === false){
              tutorialRuntimeService.completeTutorial(TUTORIAL_IDS.VISIT_ADV_GUILD)
            }
          }
        }

        this.transition = undefined
        this.destination = undefined
        eventBus.emit({
          id: crypto.randomUUID(),
          parentEventId: event.id,
          type: 'world:mode:change',
          meta: {
            worldMode: 'character_manage'
          }
        })
      }
    })
  }

  getCurrentTransition(){
    return {
      transition: this.transition,
    }
  }

}
export const transitionRuntimeService = new TransitionRuntimeService()