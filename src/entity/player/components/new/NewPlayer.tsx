import { useState, useCallback } from 'react'
import ViewInputScreen from '../../../../ui/input-form/InputForm'
import type { InputValidationResult } from '../../../../ui/input-form/types/InputForm.types'
import type { PlayerEntity } from '../../types/PlayerEntity.types'
import { eventBus } from '../../../../engine/event/EventBus'

export default function NewPlayer(){
  const [name, setName] = useState('')

  const NAME_MAX_LENGTH = 16

  const validateName = useCallback((): InputValidationResult => {
    if (!name || !name.trim()) {
      return {
        isValid: false,
        error: 'Player name is empty.'
      }
    }

    const trimmed = name.trim()

    if (trimmed.length < 3) {
      return {
        isValid: false,
        error: 'Player name is too short.'
      }
    }

    return { isValid: true }
  }, [name])


  return (
    <ViewInputScreen
      transition={{
        title: 'The world slowly comes into focus...',
        delay: 4000
      }}
      screens={[
        {
          index: 0,
          steps: [
            {
              id: 'player-name',
              title: 'Who Are You?',
              content: (
                <>
                  Before your adventure begins, tell us your name.
                </>
              ),
              inputs: [
                {
                  label: `Name (max ${NAME_MAX_LENGTH})`,
                  value: '',
                  onValidate: validateName,
                  render: (value, onChange) => (
                    <input
                      className="input"
                      maxLength={NAME_MAX_LENGTH}
                      value={value}
                      onChange={(e) => {
                        onChange(e.target.value)
                        setName(e.target.value)
                      }}
                    />
                  )
                }
              ],
              onAccept: () => {
                const player: PlayerEntity = {
                  id: crypto.randomUUID(),
                  name: name,
                  characterTokens: 1,
                  gold: 0,
                  level: 1,
                  xp: 0,
                  xpNextLevel: 100
                } as PlayerEntity

                eventBus.emit({
                  type: 'player:save',
                  meta: {
                    player
                  }
                })
              }
            }
          ]
        }
      ]}
    />
  )
}