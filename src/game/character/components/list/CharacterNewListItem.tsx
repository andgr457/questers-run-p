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
import { GAME_PARTY_ROLE_IDS, GAME_PARTY_ROLE_NAMES } from '../../../../entity/party/data/PartyRole.data'

type State = 'main' | 'class'

export default function CharacterNewListItem() {
  const [expanded, setExpanded] = useState(false)
  const [state, setState] = useState<State>('main')
  const [selectedClassRole, setSelectedClassRole] = useState<PartyRole | undefined>(undefined)
  const [selectedClassId, setSelectedClassId] = useState<CharacterClassId | undefined>(undefined)

  const { characters } = useCharacters()
  const { player, playerGold } = usePlayer()
  const playerTokens = player?.characterTokens ?? 0

  const nextGoldRequired = Math.floor(100 * Math.pow(1.35,Math.max(0,characters.length)))
  
  const canAfford = playerGold >= nextGoldRequired
  const hasToken = playerTokens > 0

  const allowedRoles = useMemo<PartyRole[]>(()=>{
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
        <span>＋ Summon New Hero</span>
        <span>{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className={styles.content}>
          {state === 'main' && (
            <>
              <div className={styles.section}>
                <div className={styles.sectionTitle}>
                  SUMMON COST
                </div>
                <div>

                </div>
                <div className={styles.sectionContent}>
                  <div className={styles.costSection}>
                    <div style={{fontSize: 'smaller', padding: '0'}} className={styles.costSectionContent}>
                      <div>
                        HAVE
                      </div>
                      <div>
                        /
                      </div>
                      <div>
                        REQUIRED
                      </div>
                    </div>

                    <div className={styles.costSectionContent} >
                      <div style={{color: canAfford ? 'var(--success)' : 'var(--danger)'}}>
                        <GoldDetail gold={playerGold} />
                      </div>
                      <div>
                        /
                      </div>
                      <div>
                        <GoldDetail gold={nextGoldRequired} />  
                      </div>
                    </div>

                    <div className={styles.costSectionContent}>
                      <div style={{color: hasToken ? 'var(--success)' : 'var(--danger)'}}>
                        <PlayerCharacterTokens tokens={player?.characterTokens ?? 0} />
                      </div>
                      <div>
                        /
                      </div>
                      <div>
                        <PlayerCharacterTokens tokens={1} />
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  className={styles.button}
                  disabled={!canAfford || !hasToken}
                  onClick={() => setState('class')}
                >
                  START SUMMONING
                </button>
              </div>

            </>
          )}

          {state === 'class' && (
            <>
              <div className={styles.section}>
                <div className={styles.sectionTitle}>
                  SELECT ROLE
                </div>
                <div className={styles.sectionContent}>
                  <div className={styles.classList}>
                    {GAME_PARTY_ROLE_IDS.map(roleId => {
                      const roleName = GAME_PARTY_ROLE_NAMES[roleId]
                      let disabled = false
                      if(!allowedRoles.includes(roleId)){
                        disabled = true
                      }
                      return <button
                        key={roleId}
                        disabled={disabled}
                        className={`${styles.button} ${selectedClassRole === roleId ? styles.selected : ''}`}
                        onClick={() => setSelectedClassRole(roleId)}
                      >
                        {roleName}
                      </button>
                    })}
                    
                  </div>
                  
                </div>

              </div>

              <div className={styles.section}>
                <div className={styles.sectionTitle}>
                  SELECT CLASS
                </div>
                <div className={styles.sectionContent}>
                  <select onChange={(e) => {
                    if(e.currentTarget.value){
                      setSelectedClassId(e.currentTarget.value as CharacterClassId)
                    }
                  }}>
                    <option value=''>{!selectedClassRole ? 'SELECT ROLE FIRST...' : `SELECT ${selectedClassRole.toUpperCase()} CLASS...`}</option>
                    {selectedClassRole && GAME_CLASSES.map(c => {
                      const disabled = !c.roles.includes(selectedClassRole)
                      return <option disabled={disabled} value={c.id}>{c.name.toUpperCase()} - {c.roles.join(' / ')}</option>
                    })}
                  </select>
                </div>
              </div>

              <div className={styles.section}>
                <button
                  className={styles.button}
                  disabled={!selectedClassId}
                  onClick={() => {
                    if(!selectedClassId || !player) return
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
                            name: `Summoned Character #${characters.length + 1}`,
                            questGold: 0,
                            questSpeed: 0,
                            questXp: 0
                          }
                        }
                      })
                    }, 750)
                  }}
                >
                  Summon
                </button>
                <button
                  className={styles.buttonSecondary}
                  onClick={() => {
                    reset()
                  }}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}