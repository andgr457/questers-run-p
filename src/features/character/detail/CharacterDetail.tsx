import type { ActionDetail } from '../../../core/components/form/Actions'
import Actions from '../../../core/components/form/Actions'
import Gold from '../../../core/components/gold/Gold'
import HeaderFancy from '../../../core/components/header/fancy/HeaderFancy'
import ProgressBar from '../../../core/components/progress-bar/ProgressBar'
import { GAME_CLASSES } from '../../../data/Classes.data'
import { clockRuntimeService } from '../../../engine/clock/ClockRuntimeService'
import { eventBus } from '../../../engine/events/EventBus'
import type { Character } from '../../../interfaces/Character.types'
import type { ClassIds } from '../../../interfaces/Classes.types'
import styles from './CharacterDetail.module.css'

interface Props {
  character: Character
}

export default function CharacterDetail(props: Props){

  const {
    character
  } = props

  const characterClass = GAME_CLASSES[character.classId as ClassIds]

  const actions: ActionDetail[] = [
    {
      id: `cda_rest_${crypto.randomUUID()}`,
      inactive: false,
      onClick: () => {
        eventBus.emit({
          id: crypto.randomUUID(),
          type: 'character:attributes:add',
          created: clockRuntimeService.getNow(),
          meta: {
            characterId: character.id,
            attributes: {
              hp: {
                ...character.attributes.hp,
                value: 10,
              },
              mana: {
                ...character.attributes.mana,
                value: 10,
              },
              stamina: {
                ...character.attributes.stamina,
                value: 10
              }
            }
          }
        })
      },
      text: 'Rest',
    },
    {
      id: `cda_quest_${crypto.randomUUID()}`,
      inactive: false,
      onClick: () => {
        if(character.attributes.stamina.value <= 10){
          return
        }

        eventBus.emit({
          id: crypto.randomUUID(),
          type: 'character:attributes:add',
          created: clockRuntimeService.getNow(),
          meta: {
            characterId: character.id,
            attributes: {
              hp: {
                ...character.attributes.hp,
                value: 0,
              },
              mana: {
                ...character.attributes.mana,
                value: 0,
              },
              stamina: {
                ...character.attributes.stamina,
                value: -10
              }
            }
          }
        })
        eventBus.emit({
          id: crypto.randomUUID(),
          type: 'character:xp:add',
          created: clockRuntimeService.getNow(),
          meta: {
            characterId: character.id,
            value: 10
          }
        })
      },
      text: 'Quest',
    },
  ]

  return (
    <div>
      <HeaderFancy 
        text={character.title}
        type='sub'
      />
      <div
        className={`section ${styles.wrapper}`}
      >
        
        <div
          className={styles.top}
          >

          <div>
            {characterClass.title}
          </div>
          <div>
            Lv. {character.level}
          </div>
          <div>
            <Gold 
              value={character.gold}
            />
          </div>
        </div>
        <div>
          <ProgressBar 
            color='purple'
            max={character.xp.valueMax}
            value={character.xp.value}
            showValues={false}
            showLabel={false}
          />
        </div>
        <div
          className={styles.progress}
        >
          <ProgressBar 
            color='red'
            max={character.attributes.hp.valueMax}
            value={character.attributes.hp.value}
            label='HP'
            showValues={false}
            showLabel={false}
          />
          <ProgressBar 
            color='blue'
            max={character.attributes.mana.valueMax}
            value={character.attributes.mana.value}
            label='MP'
            showValues={false}
            showLabel={false}
          />
          <ProgressBar 
            color='green'
            max={character.attributes.stamina.valueMax}
            value={character.attributes.stamina.value}
            label='STAM'
            showValues={false}
            showLabel={false}
          />
        </div>
      </div>
      <Actions 
        actions={actions}
      />
      <div
        className={`section ${styles.wrapper}`}
      >
        <div>
          XP: {character.xp.value}/{character.xp.valueMax}
        </div>
        <div>
          HP: {character.attributes.hp.value}/{character.attributes.hp.valueMax}
        </div>
        <div>
          MP: {character.attributes.mana.value}/{character.attributes.mana.valueMax}
        </div>
        <div>
          STAM: {character.attributes.stamina.value}/{character.attributes.stamina.valueMax}
        </div>
      </div>
    </div>
  )
}