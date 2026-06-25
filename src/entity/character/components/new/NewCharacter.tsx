import { useState, useCallback } from 'react'
import ViewInputScreen from '../../../../ui/input-form/InputForm'
import { type CharacterClassEntity, type CharacterClassId } from '../../../character-class/types/CharacterClassEntity.types'
import { GAME_CHARACTER_CLASSES, GAME_CLASSES } from '../../../character-class/data/CharacterClassEntity.data'
import CharacterClassDetail from '../../../character-class/components/detail/CharacterClassDetail'
import type { CharacterEntity } from '../../types/CharacterEntity.types'
import { playerRuntimeService } from '../../../../engine/player/PlayerRuntimeService'
import { eventHistoryRuntimeService } from '../../../../engine/event/EventHistoryRuntimeService'
import { eventBus } from '../../../../engine/event/EventBus'

export default function NewCharacter(){
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [characterClass, setCharacterClass] = useState<CharacterClassEntity | undefined>(undefined)

  const NAME_MAX_LENGTH = 16
  const NAME_MIN_LENGTH = 3

  const validateName = useCallback(() => {
    setNameError('')
    console.log(name)
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
    <ViewInputScreen
      transition={{
        title: 'Time for someone new to join the ranks...',
        delay: 2000
      }}
      showCancel={false}
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
                  label: `New Character Name ( ${NAME_MIN_LENGTH}-${NAME_MAX_LENGTH} characters )`,
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
                if(!nameValid) return

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
                </>
              ),
              inputs: [
                {
                  label: `Classes`,
                  value: '',
                  render: (value, onChange) => (
                    <select
                      // className={`input`}
                      value={value}
                      onChange={(e) => {
                        if(!e.target.value) return

                        setCharacterClass(GAME_CHARACTER_CLASSES[e.target.value as CharacterClassId])
                        onChange(e.target.value)
                      }}
                    >
                      <option>Choose a class...</option>
                      {GAME_CLASSES.map(c => {
                        return <option value={c.id}>
                          {c.name}
                        </option>
                      })}
                    </select>
                  )
                },
                {
                  label: ``,
                  value: '',
                  render: (value, onChange) => (
                    characterClass && <CharacterClassDetail characterClass={characterClass as CharacterClassEntity} />
                  )
                }
              ],
              onAccept: () => {
                if(!characterClass) return
                
                const character: CharacterEntity = {
                  id: crypto.randomUUID(),
                  name: name,
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
                  type: 'world:mode:change',
                  meta: {
                    worldMode: 'world'
                  }
                })
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