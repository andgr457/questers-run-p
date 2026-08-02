import { useState, useEffect, useCallback } from 'react'
import { eventBus } from '../../../../engine/event/EventBus'
import ProgressBar from '../../../../ui/progress-bar/ProgressBar'
import { getProgress } from '../../../../ui/progress-bar/utils/ProgressBar.utils'
import GoldDetail from '../../../../ui/gold/GoldDetail'

import styles from './CharacterListItem.module.css'
import type { CharacterEntity } from '../../../../entity/character/types/CharacterEntity.types'
import { getCharacterGold } from '../../../../entity/character/utils/Character.utils'
import { GAME_CHARACTER_CLASSES } from '../../../../entity/character-class/data/CharacterClassEntity.data'
import type { CharacterClassId } from '../../../../entity/character-class/types/CharacterClassEntity.types'
import { getLocationById } from '../../../../entity/location/utils/Location.utils'
import type { ActivityRuntimeEntity } from '../../../../engine/activity/ActivityRuntimeService'
import { ContextMenuIcon } from '../../../context-menu/data/ContextMenuIcon.data'
import { useTutorial } from '../../../../engine/tutorial/hooks/useTutorial'
import { GAME_TUTORIAL_IDS } from '../../../tutorial/data/Tutorial.data'

interface Props {
  character: CharacterEntity
  showActions?: boolean
  activity?: ActivityRuntimeEntity
}

export default function CharacterListItem(props: Props) {
  const {
    character,
    showActions = true,
    activity
  } = props
  const BASE_QUEST_MS = 30000
  const BASE_QUEST_GOLD = 1
  const BASE_QUEST_XP = 1

  const {completedTutorialsProgress} = useTutorial()

  const [isNameChanging, setIsNameChanging] = useState(false)
  const [characterNewName, setCharacterNewName] = useState('')

  const [gold, setGold] = useState(getCharacterGold(character.id))

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if (event.type === 'character:gold:added') {
        setGold(getCharacterGold(character.id))
      }
    })

    return unsub
  }, [character.id])

  const currentLocation = getLocationById(
    character.locationId
  )

  const className =
    GAME_CHARACTER_CLASSES[
      character.classId as CharacterClassId
    ]?.name

  const handleQuestClicked = useCallback(() => {
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'character:manage',
      meta: {
        characterId: character.id
      }
    })
    if(activity){
      eventBus.emit({
        id: crypto.randomUUID(),
        type: 'activity:stop',
        meta: {
          characterId: character.id
        }
      })
    } else {
      const questBase = character?.questSpeed ? BASE_QUEST_MS * (character.questSpeed ?? 1) : 0
      const goldBase = character?.questGold ? BASE_QUEST_GOLD * (character.questGold ?? 1) : 0
      const xpBase = character?.questXp ? BASE_QUEST_XP * (character.questXp ?? 1) : 0

      eventBus.emit({
        id: crypto.randomUUID(),
        type: 'activity:start',
        meta: {
          characterId: character.id,
          activityText: 'Questing',
          activityRuns: -1,
          activityRunTimeMs: BASE_QUEST_MS - questBase,
          activityType: 'questing',
          gold: BASE_QUEST_GOLD - goldBase,
          xp: BASE_QUEST_XP - xpBase,
        }
      })
    }
  }, [])

  const firstTutorialCollected = completedTutorialsProgress?.find(
    p => p.tutorialId === GAME_TUTORIAL_IDS.TUTORIAL_001_CHARACTER_FIRST_CREATE
    && p.completed === true
    && p.collected === true
  )
  const secondTutorialCollected = completedTutorialsProgress?.find(
    p => p.tutorialId === GAME_TUTORIAL_IDS.TUTORIAL_002_CHARACTER_FIRST_QUEST
    && p.completed === true
    && p.collected === true
  )

  return (
    <div className={styles.wrapper}>
      <div className={styles.topRow}>
        <div>
          <div className={styles.name}>
            {!isNameChanging && (
              <>
                {character.name} <span onClick={() => {setIsNameChanging(true)}} className={styles.edit} title={'Change this character\'s name.'}>✎</span>
              </>
            )}
            {isNameChanging && (
              <>
                <input 
                  type={'text'}
                  value={!characterNewName ? character.name : characterNewName}
                  maxLength={128}
                  onChange={(e) => {setCharacterNewName(e.target.value)}}
                />
                &nbsp;
                <span onClick={() => {
                  setCharacterNewName('')
                  setIsNameChanging(false)
                }} 
                className={styles.edit} 
                style={{color: 'var(--danger)'}}
                title={'Cancel the name change.'}>
                  {ContextMenuIcon.close}
                </span>
                &nbsp;&nbsp;
                <span onClick={() => {
                  eventBus.emit({
                    id: crypto.randomUUID(),
                    type: 'character:save',
                    meta: {
                      character: {
                        ...character,
                        name: characterNewName
                      }
                    }
                  })
                  setCharacterNewName('')
                  setIsNameChanging(false)
                }} 
                className={styles.edit} 
                style={{color: 'var(--success)'}}
                title={'Confirm the name change.'}>
                  {ContextMenuIcon.check}
                </span>
              </>
            )}
          </div>

          <div className={styles.className}>
            Lv. {character.level} {className}
          </div>
        </div>
        {showActions && (
          <div className={styles.activities}>
            <div 
              className={`${styles.activity} ${activity?.activityType === 'questing' ? styles.running : ''} ${!firstTutorialCollected ? styles.disabled : ''}`}
              
              onClick={handleQuestClicked}
            >
              🗎 <span className={styles.activityName}>Quest</span>
            </div>

            <div 
              className={`${styles.activity} ${!secondTutorialCollected ? styles.disabled : ''}`}
              
              onClick={() => {
                eventBus.emit({
                  id: crypto.randomUUID(),
                  type: 'character:manage',
                  meta: {
                    characterId: character.id,
                  }
                })
                setTimeout(() => {
                  eventBus.emit({
                    id: crypto.randomUUID(),
                    type: 'world:mode:change',
                    meta: {
                      worldMode: 'character_upgrade'
                    }
                  })
                }, 50)
              }}
            >
              ⇧ <span className={styles.activityName}>Upgrade</span>
            </div>

            <div className={`${styles.activity} ${styles.disabled}`}>
              ⚔ <span className={styles.activityName}>Hunt</span>
            </div>
          </div>          
        )}
      </div>
      
      <div className={styles.infoRow}>

        <div>
          {character.isIdle ? 'Idle' : 'Busy'} {character.isIdle ? '' : `- ${activity?.activityText}`}
        </div>

        <div>
          {currentLocation?.name}
        </div>

        <div className={styles.gold}>
          <GoldDetail gold={gold} />
        </div>
      </div>

      <div className={styles.bars}>
        <ProgressBar
          value={getProgress(
            character.xp,
            character.xpNextLevel
          )}
          max={character.xpNextLevel}
          color="#a855f7"
          label="XP"
          showValues={false}
        />

        <ProgressBar
          value={getProgress(
            character.hp,
            character.hpMax
          )}
          max={character.hpMax}
          color="#ef4444"
          label="HP"
          showValues={false}
        />

        <ProgressBar
          value={getProgress(
            character.mana,
            character.manaMax
          )}
          max={character.manaMax}
          color="#3b82f6"
          label="MP"
          showValues={false}
        />

        <ProgressBar
          value={getProgress(
            character.stamina,
            character.staminaMax
          )}
          max={character.staminaMax}
          color="#22c55e"
          label="STAM"
          showValues={false}
        />
      </div>
      <ProgressBar
        value={activity?.activityProgressPercent ?? 0}
        max={100}
        color="#6d706e"
        showValues={false}
        showLabel={false}
      />
    </div>
  )
}