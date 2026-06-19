import { useCallback } from 'react'
import { GAME_TAVERN_ACTIONS } from '../../../../tavern/data/Tavern.data'
import type { CharacterEntity } from '../../../types/Character.types'
import styles from './CharacterActionsSection.module.css'
import { gameEventBus } from '../../../../../engine/event-bus/GameEventBus'
import CharacterActionsSection from './CharacterActionsSection'

interface Props {
  character: CharacterEntity
  locked: boolean
}

export default function CharacterActionsTavern(props: Props){
  const {
    character,
    locked,
  } = props

  const handleActionClicked = useCallback((actionId: string) => {
    gameEventBus.emit({
      type: 'tavern:start',
      characterId: character.id,
      meta: {
        tavernActionId: actionId
      }
    })

  }, [character.id])

  return <CharacterActionsSection
    title='Tavern'
    locked={locked}
  >
    <div>

      <div className={styles.label}>
        Rest to replenish your stats.
      </div>

      <div className={styles.actions}>
        {GAME_TAVERN_ACTIONS.map(action => {
          const hasEnoughGold = character.gold >= action.cost
          return <div className={`${hasEnoughGold ? styles.action : styles.actionLocked}`}>
            <button className='button-basic dark' onClick={() => handleActionClicked(action.id)}>
              {action.title}
              <br/>
              <span style={{color: 'gold', textTransform: 'lowercase'}}>{action.cost}g</span> - {action.percent * 100}% - <span style={{textTransform: 'lowercase'}}>{action.duration / 1000}s</span>
            </button>
          </div>
        })}
      </div>
      
    </div>
    
  </CharacterActionsSection>
}