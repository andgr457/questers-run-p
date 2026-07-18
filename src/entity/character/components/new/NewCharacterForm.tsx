import { useState, useRef, useEffect } from 'react'
import { eventBus } from '../../../../engine/event/EventBus'
import type { CharacterEntity } from '../../types/CharacterEntity.types'
import { GAME_CHARACTER_CLASSES, GAME_CLASSES } from '../../../character-class/data/CharacterClassEntity.data'
import { characterRuntimeService } from '../../../../engine/character/CharacterRuntimeService'
import { GAME_LOCATION_IDS } from '../../../location/data/Location.data'
import type { CharacterClassId } from '../../../character-class/types/CharacterClassEntity.types'
import { usePlayer } from '../../../../engine/player/hooks/usePlayer'
import styles from './NewCharacterForm.module.css'
import LeftRightText from '../../../../ui/text/left-right-text/LeftRightText'
import CharacterClassDetail from '../../../character-class/components/detail/CharacterClassDetail'
import { ContextMenuIcon } from '../../../../game/context-menu/data/ContextMenuIcon.data'

interface Props {
  onComplete: (character: CharacterEntity) => void
}

export default function NewCharacterForm(props: Props){
  const {
    onComplete
  } = props
  const {player} = usePlayer()

  const [name, setName] = useState('')
  const [classId, setClassId] = useState('')
  const [showClass, setShowClass] = useState(false)

  const [error, setError] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const NAME_MAX_LENGTH = 16
  const NAME_MIN_LENGTH = 3

  useEffect(() => {
    inputRef.current?.focus()
  }, [])


  return <div className={styles.wrapper}>
    <div className={styles.container}>
      <LeftRightText 
        leftText='Character Name'
        leftRightStyle='left-first'
        rightText=''
      />
      <div>
        <input
          ref={inputRef}
          className={`input ${!error.includes('Character') ? '' : 'invalid' }`}
          maxLength={NAME_MAX_LENGTH}
          value={name}
          onChange={(e) => {
            setName(e.target.value)
          }}
          onKeyDown={(e) => {
            if(buttonRef){
              if(e.key === 'Enter'){
                buttonRef.current?.click()
              }
            }
          }}
        />
      </div>
      <LeftRightText 
        leftText=''
        leftRightStyle='right-first'
        rightText='Character Class'
      />
      <div className={styles.classSelection}>
        <div>
          <select
            value={classId ?? ''}
            className={`select ${!error.includes('Class ') ? '' : 'invalid' }`}

            onChange={(e) => {
              setClassId(e.target.value)
            }}
            onKeyDown={(e) => {
              if(buttonRef){
                if(e.key === 'Enter'){
                  buttonRef.current?.click()
                }
              }
            }}
          >
            <option key='option-0' value=''>Choose a class...</option>
            {GAME_CLASSES.map((c, idx) => {
              let disabled = false
              if(characterRuntimeService.getCharacters().length === 0){
                if(c.id !== 'cc_warrior'){
                  disabled = true
                }
              }
              return <option key={`option-${idx+1}`} disabled={disabled} value={c.id}>
                {c.name}{disabled === true ? ' (locked)' : ''}
              </option>
            })}
          </select>
        </div>
        <div
          className={styles.classToggle}
          onClick={() => {
            if(classId){
              setShowClass(!showClass)
            }
          }}
        >
          {!classId ? '?' : !showClass ? ContextMenuIcon.eye : ContextMenuIcon.close}
        </div>
      </div>
      
      <div>
        <button 
          ref={buttonRef} 
          className='button success'
          onClick={() => {
            setError('')
            setTimeout(() => {
              if (!name || !name.trim()) {
                setError('Character name is empty.')
                return
              }
          
              const trimmed = name.trim()
              if (trimmed.length < NAME_MIN_LENGTH) {
                setError('Character name is too short.')
                return
              }

              if(!classId) {
                setError('Class not selected.')
                return
              }

              const characterClass = GAME_CHARACTER_CLASSES[classId as CharacterClassId]
              if(!characterClass) return
              
              const character: CharacterEntity = {
                id: crypto.randomUUID(),
                name: name,
                locationId: GAME_LOCATION_IDS.ORON_WOODS_1,
                isIdle: true,
                level: 1,
                xp: 0,
                xpNextLevel: 100,
                hp: 100,
                hpMax: 100,
                mana: 100,
                manaMax: 100,
                stamina: 100,
                staminaMax: 100,
                agility: 1 + characterClass.agility,
                strength: 1 + characterClass.strength,
                intellect: 1 + characterClass.intellect,
                classId: characterClass.id,
                playerId: player?.id as string,
              }
              eventBus.emit({
                id: crypto.randomUUID(),
                type: 'notification:save',
                meta: {
                  notification: {
                    title: 'Character Event',
                    description: `${name} was summoned, breathing this world's air for the first time.`
                  }
                }
              })
              eventBus.emit({
                id: crypto.randomUUID(),
                type: 'character:save',
                meta: {
                  character
                }
              })
              eventBus.emit({
                id: crypto.randomUUID(),
                type: 'player:token',
                meta: {
                  characterTokens: -1
                }
              })
              eventBus.emit({
                id: crypto.randomUUID(),
                type: 'character:manage',
                meta: {
                  characterId: character.id
                }
              })
              onComplete(character)
            }, 250)
          }}
        >
          Accept
        </button>  
      </div>
      <div className={`${styles.errorWrapper} ${error ? styles.show : ''}`}>
        {!error && <div className='error-label'>...</div>}
        {error && <div className='error-label'>{error}</div>}
      </div>
      <div className={styles.classInfo}>
        {classId && showClass === true && <CharacterClassDetail characterClass={GAME_CHARACTER_CLASSES[classId as CharacterClassId]} />}
      </div>

    </div>
  </div>
}