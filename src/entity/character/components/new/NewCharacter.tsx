import { useState, useCallback } from 'react'
import InputForm from '../../../../ui/input-form/InputForm'
import { type CharacterClassEntity, type CharacterClassId } from '../../../character-class/types/CharacterClassEntity.types'
import { GAME_CHARACTER_CLASSES, GAME_CLASSES } from '../../../character-class/data/CharacterClassEntity.data'
import CharacterClassDetail from '../../../character-class/components/detail/CharacterClassDetail'
import type { CharacterEntity } from '../../types/CharacterEntity.types'
import { playerRuntimeService } from '../../../../engine/player/PlayerRuntimeService'
import { eventHistoryRuntimeService } from '../../../../engine/event/EventHistoryRuntimeService'
import { eventBus } from '../../../../engine/event/EventBus'
import { LOCATION_IDS } from '../../../location/data/Location.data'
import { characterRuntimeService } from '../../../../engine/character/CharacterRuntimeService'
import { useTutorial } from '../../../../engine/tutorial/hooks/useTutorial'

export default function NewCharacter(){
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [characterClass, setCharacterClass] = useState<CharacterClassEntity | undefined>(undefined)
  const {tutorialProgress} = useTutorial()

  const NAME_MAX_LENGTH = 16
  const NAME_MIN_LENGTH = 3

  const validateName = useCallback(() => {
    setNameError('')
    if (!name || !name.trim()) {
      setNameError('Character name is empty.')
      return false
    }

    const trimmed = name.trim()
    if (trimmed.length < NAME_MIN_LENGTH) {
      setNameError('Character name is too short.')
      return false
    }

    return true
  }, [name])


  return (
    <InputForm
      transition={{
        title: 'Time for someone new to join the ranks...',
        delay: 2000
      }}
      showCancel={false}
      actionsLocation='bottom'
      screens={[
        {
          index: 0,
          steps: [
            {
              id: 'character-name',
              title: 'New Character',
              content: (
                <>
                  <div>
                    Enter a character name to get started.
                  </div>
                  {nameError && <div className='error-label'>
                    {nameError}  
                  </div>}
                </>
              ),
              inputs: [
                {
                  label: `Name`,
                  value: '',
                  render: (value, onChange) => (
                    <input
                      className={`input ${!nameError ? '' : 'invalid' }`}
                      maxLength={NAME_MAX_LENGTH}
                      value={value}
                      onChange={(e) => {
                        setName(e.target.value)
                        onChange(e.target.value)
                      }}
                    />
                  )
                }
              ],
              onAccept: () => {
                const nameValid = validateName()
                if(!nameValid) return false
                return true
                //valid name go to next screen
              },
              onCancel: () => {
                window.close()
              }
            },
            {
              id: 'character-class',
              title: 'Character Class',
              content: (
                <>
                  <div>
                    Select a class for {name}.
                  </div>
                  {nameError && <div className='error-label'>
                    {nameError}  
                  </div>}
                </>
              ),
              inputs: [
                {
                  label: `Class`,
                  value: '',
                  render: (value, onChange) => (
                    <select
                      // className={`input`}
                      value={value ?? ''}
                      onChange={(e) => {
                        if(!e.target.value) return

                        setCharacterClass(GAME_CHARACTER_CLASSES[e.target.value as CharacterClassId])
                        onChange(e.target.value)
                      }}
                    >
                      <option>Choose a class...</option>
                      {GAME_CLASSES.map(c => {
                        let disabled = false
                        if(characterRuntimeService.getCharacters().length === 0){
                          if(c.id !== 'cc_warrior'){
                            disabled = true
                          }
                        }
                        return <option disabled={disabled} value={c.id}>
                          {c.name}{disabled === true ? ' (locked)' : ''}
                        </option>
                      })}
                    </select>
                  )
                },
                {
                  label: ``,
                  value: '',
                  render: (value, onChange) => {
                    if(value || !onChange) return
                    return characterClass && <CharacterClassDetail characterClass={characterClass as CharacterClassEntity} />
                  }
                }
              ],
              onAccept: () => {
                if(!characterClass) {
                  setNameError('Class not selected.')
                  return false
                }
                
                const character: CharacterEntity = {
                  id: crypto.randomUUID(),
                  name: name,
                  locationId: LOCATION_IDS.ORON_WOODS_1,
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
                  playerId: playerRuntimeService.getPlayer()?.id as string,
                }
                eventHistoryRuntimeService.addHistory(
                  `Character Event`,
                  `${name} was created!`
                )
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
                  type: 'world:mode:change',
                  meta: {
                    worldMode: tutorialProgress?.completedTutorialIds.length === 0 ? 'tutorial' : 'characters'
                  }
                })
                return true
              },
              onCancel: () => {
              }
            }
          ]
        },
      ]}
    />
  )
}