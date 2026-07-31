import { useEffect, useState } from 'react'

import { eventBus } from '../engine/event/EventBus'
import type { OverlayMode } from './context-menu/types/OverlayMode.types'
import { usePlayer } from '../engine/player/hooks/usePlayer'
import { GAME_CHARACTER_CLASSES } from '../entity/character-class/data/CharacterClassEntity.data'
import { GAME_LOCATION_IDS } from '../entity/location/data/Location.data'
import { useCharacters } from '../engine/character/hooks/useCharacters'
import CharacterList from './character/components/list/CharacterList'
import PlayerDetail from './player/components/detail/PlayerDetail'
import CharacterQuestList from './character/components/quest/CharacterQuestList'
import CharacterNewListItem from './character/components/list/CharacterNewListItem'
import { clockRuntimeService } from '../engine/clock/ClockRuntimeService'
import SummonCharacterOverlay from '../ui/overlays/summon-character/SummonCharacterOverlay'

export default function World() {
  console.log('world start')
  const [overlayMode, setOverlayMode] = useState<OverlayMode>('character_summon')
  const {player} = usePlayer()
  const {characters} = useCharacters()
  console.log('world player', player)
  console.log('world characters', characters)

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(event.type === 'world:mode:change'){
        eventBus.emit({
          id: crypto.randomUUID(),
          type: 'world:mode:changing',
          meta: {
            worldMode: event.meta?.worldMode,
            worldModePrevious: overlayMode
          }
        })
        setTimeout(() => {
          setOverlayMode(event.meta?.worldMode ?? 'world')
        }, 250)
      }
         
    })
    return unsub
  }, [])

  

  useEffect(() => {
    //create player 0 tokens, wait a bit, add 1 token, then use it to auto create 1st character, and subtract it.
    if(!player){
      console.log('creating initial player', player)
      const playerId = crypto.randomUUID()
      eventBus.emit({
        id: crypto.randomUUID(),
        type: 'player:save',
        meta: {
          player: {
            id: playerId,
            characterTokens: 0,
            level: 1,
            name: 'Guild Master',
            xp: 0,
            xpNextLevel: 100
          }
        }
      })
      setTimeout(() => {
        eventBus.emit({
          id: crypto.randomUUID(),
          type: 'player:token',
          meta: {
            characterTokens: 1
          }
        })
        eventBus.emit({
          id: crypto.randomUUID(),
          type: 'player:gold',
          meta: {
            playerGoldTransaction: {
              amount: 100,
              date: clockRuntimeService.getNow(),
              id: crypto.randomUUID(),
            }
          }
        })
        // setTimeout(() => {
        //   const warrior = GAME_CHARACTER_CLASSES.cc_warrior
        //   eventBus.emit({
        //     id: crypto.randomUUID(),
        //     type: 'character:save',
        //     meta: {
        //       character: {
        //         id:  crypto.randomUUID(),
        //         name: 'Marcus Oron',
        //         agility: warrior.agility,
        //         intellect: warrior.intellect,
        //         strength: warrior.strength,
        //         classId: warrior.id,
        //         hp: 100,
        //         hpMax: 100,
        //         mana: 10,
        //         manaMax: 10,
        //         stamina: 100,
        //         staminaMax: 100,
        //         isIdle: true,
        //         level: 1,
        //         locationId: GAME_LOCATION_IDS.ORON_ADV_GUILD,
        //         playerId: playerId,
        //         xp: 0,
        //         xpNextLevel: 100,
        //         partyId: undefined
        //       }
        //     }
        //   })
        //   setTimeout(() => {
        //     eventBus.emit({
        //       id: crypto.randomUUID(),
        //       type: 'player:token',
        //       meta: {
        //         characterTokens: -1
        //       }
        //     })
        //   }, 100)
        // }, 1000)
      }, 1000)
    }
  }, [])

  return (
    <>
      <SummonCharacterOverlay 
        active={overlayMode === 'character_summon'}
        setActive={(value) => {
          console.log('set active triggered')
          if(value === false){
            eventBus.emit({
              id: crypto.randomUUID(),
              type: 'world:mode:change',
              meta: {
                worldMode: 'world'
              }
            })
          }
        }} 
        waitMs={2500}
      />
      
      {overlayMode === 'character_quest' && (
        <CharacterQuestList />
      )}
      <div style={overlayMode === 'world' ? {opacity: 1, transition: 'opacity 500ms ease'} : {opacity: 0.2, transition: 'opacity 500ms ease'}}>
        <div className='sticky-player'>
          <PlayerDetail />
        </div>
        {<CharacterNewListItem />}
        {<CharacterList />}
      </div>
    </>
  )
}