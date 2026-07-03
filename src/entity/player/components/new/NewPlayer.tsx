import { useState, useCallback } from 'react'
import InputForm from '../../../../ui/input-form/InputForm'
import type { PlayerEntity } from '../../types/PlayerEntity.types'
import { eventBus } from '../../../../engine/event/EventBus'
import { eventHistoryRuntimeService } from '../../../../engine/event/EventHistoryRuntimeService'

export default function NewPlayer(){
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')

  const NAME_MAX_LENGTH = 16
  const NAME_MIN_LENGTH = 3

  const validateName = useCallback(() => {
    setNameError('')
    if (!name || !name.trim()) {
      setNameError('Player name is empty.')
      return false
    }

    const trimmed = name.trim()
    if (trimmed.length < NAME_MIN_LENGTH) {
      setNameError('Player name is too short.')
      return false
    }

    return true
  }, [name])


  return (
    <InputForm
      transition={{
        title: 'The world slowly comes into focus...',
        delay: 1000
      }}
      showCancel={false}
      actionsLocation='bottom'
      screens={[
        {
          index: 0,
          steps: [
            {
              id: 'player-name',
              title: 'New Player',
              content: (
                <>
                  <div>
                    Enter a player name to get started.
                  </div>
                  {nameError && <div className='error-label'>
                    {nameError}  
                  </div>}
                </>
              ),
              inputs: [
                {
                  label: ``,
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

                const player: PlayerEntity = {
                  id: crypto.randomUUID(),
                  name: name,
                  characterTokens: 1,
                  level: 1,
                  xp: 0,
                  xpNextLevel: 100
                }
                eventHistoryRuntimeService.addHistory(
                  `Player Event`,
                  `${name} was created!`
                )
                eventBus.emit({
                  id: crypto.randomUUID(),
                  type: 'player:save',
                  meta: {
                    player
                  }
                })
                return true
              },
              onCancel: () => {
                window.close()
              }
            }
          ]
        }
      ]}
    />
  )
}