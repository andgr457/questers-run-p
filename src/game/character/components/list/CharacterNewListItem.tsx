import { useMemo, useState } from 'react'
import styles from './CharacterNewListItem.module.css'
import { useCharacters } from '../../../../engine/character/hooks/useCharacters'
import { usePlayer } from '../../../../engine/player/hooks/usePlayer'
import GoldDetail from '../../../../ui/gold/GoldDetail'
import { GAME_CHARACTER_CLASSES, GAME_CLASSES } from '../../../../entity/character-class/data/CharacterClassEntity.data'
import type { CharacterClassId } from '../../../../entity/character-class/types/CharacterClassEntity.types'
import type { PartyRole } from '../../../../entity/party/types/PartyRole.types'
import { eventBus } from '../../../../engine/event/EventBus'
import { GAME_LOCATION_IDS } from '../../../../entity/location/data/Location.data'
import PlayerCharacterTokens from '../../../../entity/player/components/detail/PlayerCharacterTokens'
import { clockRuntimeService } from '../../../../engine/clock/ClockRuntimeService'

type State = 'main' | 'confirm' | 'class'

export default function CharacterNewListItem() {
  const [expanded, setExpanded] = useState(false)
  const [state, setState] = useState<State>('main')
  const [selectedClassRole, setSelectedClassRole] = useState<PartyRole>()
  const [selectedClassId, setSelectedClassId] = useState<CharacterClassId>()

  const { characters } = useCharacters()
  const { player, playerGold } = usePlayer()
  const playerTokens = player?.characterTokens ?? 0

  const nextGoldRequired = Math.floor(100 * Math.pow(1.35,Math.max(0,characters.length-1)))
  
  const canAfford = playerGold >= nextGoldRequired
  const hasToken = playerTokens > 0

  const allowedClasses = useMemo<PartyRole[]>(()=>{
    const tankClassIds = GAME_CLASSES.filter(c => c.roles.includes('tank')).map(c => c.id)
    const healerClassIds = GAME_CLASSES.filter(c => c.roles.includes('healer')).map(c => c.id)
    const damageClassIds = GAME_CLASSES.filter(c => c.roles.includes('damage')).map(c => c.id)

    const tanks = characters.filter(c=> tankClassIds.includes(c.classId)).length
    const healers = characters.filter(c=> healerClassIds.includes(c.classId)).length
    const damage = characters.filter(c=> damageClassIds.includes(c.classId)).length

    if(healers < tanks){
      return ['healer']
    }

    if(damage < tanks * 3){
      return ['damage']
    }

    return ['tank']
  },[characters])

  const reset = () => {
    setSelectedClassRole(undefined)
    setSelectedClassId(undefined)
    setExpanded(false)
    setState('main')
  }

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.header}
        onClick={() => setExpanded(v => !v)}
      >
        <span>＋ Summon New Character</span>
        <span>{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className={styles.content}>
          {state === 'main' && (
            <>
              <div className={styles.cost}>
                Cost: <GoldDetail gold={nextGoldRequired} />
              </div>

              <div className={styles.requirements}>
                {hasToken ? '✓ Character Token Available' : '✕ Character Token Required'}
              </div>

              <button
                className={styles.button}
                disabled={!canAfford || !hasToken}
                onClick={() => setState('confirm')}
              >
                Begin Summoning
              </button>
            </>
          )}

          {state === 'confirm' && (
            <>
              <div className={styles.confirm}>
                Spend <GoldDetail gold={nextGoldRequired} /> and consume <PlayerCharacterTokens tokens={1} />?
              </div>

              <div className={styles.actions}>
                <button
                  className={styles.button}
                  onClick={() => setState('class')}
                >
                  Yes
                </button>

                <button
                  className={styles.buttonSecondary}
                  onClick={() => setState('main')}
                >
                  Cancel
                </button>
              </div>
            </>
          )}

          {state === 'class' && (
            <>
              <div className={styles.title}>
                Select {!selectedClassRole ? 'Class Role' : 'Class'}
              </div>

              <div className={styles.classList}>
                {allowedClasses.map(type => (
                  <button
                    key={type}
                    className={`${styles.classButton} ${selectedClassRole === type ? styles.selected : ''}`}
                    onClick={() => setSelectedClassRole(type)}
                  >
                    {type.toUpperCase()}
                  </button>
                ))}
                {selectedClassRole && (
                  <select onChange={(e) => {
                    if(e.currentTarget.value){
                      setSelectedClassId(e.currentTarget.value as CharacterClassId)
                    }
                  }}>
                    <option>{selectedClassRole.toUpperCase()} CLASSES</option>
                    {GAME_CLASSES.filter(c => c.roles.includes(selectedClassRole)).map(c => (
                      <option value={c.id}>{c.name}</option>
                    ))}
                  </select>
                )}
              </div>
              <div className={styles.actions}>
                <button
                  className={styles.buttonSecondary}
                  onClick={() => {
                    reset()
                  }}
                >
                  Cancel
                </button>
                <button
                  className={styles.button}
                  disabled={!selectedClassId}
                  onClick={() => {
                    if(!selectedClassId || !player) return
                    //todo get class id from selected class
                    const selectedClass = GAME_CHARACTER_CLASSES[selectedClassId]
                    eventBus.emit({
                      id: crypto.randomUUID(),
                      type: 'player:gold',
                      meta: {
                        playerGoldTransaction: {
                          id: crypto.randomUUID(),
                          amount: -1 * nextGoldRequired,
                          date: clockRuntimeService.getNow()
                        }
                      }
                    })
                    eventBus.emit({
                      id: crypto.randomUUID(),
                      type: 'player:token',
                      meta: {
                        characterTokens: -1
                      }
                    })
                    reset()

                    setTimeout(() => {
                      eventBus.emit({
                        id: crypto.randomUUID(),
                        type: 'world:mode:change',
                        meta: {
                          worldMode: 'warp',
                          warpOverlayModeOnComplete: 'world',
                          warpOverlayWaitMs: 2000,
                          warpOverlayText: 'Summoning Character'
                        }
                      })
                      setTimeout(() => {
                        eventBus.emit({
                          id: crypto.randomUUID(),
                          type: 'character:save',
                          meta: {
                            character: {
                              id: crypto.randomUUID(),
                              playerId: player.id,
                              classId: selectedClass.id,
                              hp: 100,
                              hpMax: 100,
                              mana: 100,
                              manaMax: 100,
                              stamina: 100,
                              staminaMax: 100,
                              agility: selectedClass.agility,
                              intellect: selectedClass.intellect,
                              strength: selectedClass.strength,
                              isIdle: true,
                              level: 1,
                              locationId: GAME_LOCATION_IDS.ORON_ADV_GUILD,
                              xp: 0,
                              xpNextLevel: 100,
                              partyId: undefined,
                              name: `Summoned Character #${characters.length + 1}`
                            }
                          }
                        })
                        
                      }, 5000)

                    }, 750)
                  }}
                >
                  Summon
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}