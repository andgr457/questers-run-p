import { useState, useRef, useEffect } from 'react'
import type { PlayerEntity } from '../../types/PlayerEntity.types'
import { eventBus } from '../../../../engine/event/EventBus'
import GamePanelSection from '../../../../ui/panel/GamePanelSection'
import GamePanel from '../../../../ui/panel/GamePanel'
import styles from './NewPlayerForm.module.css'
import LeftRightText from '../../../../ui/text/left-right-text/LeftRightText'
interface Props {
  onComplete: () => void
}

export default function NewPlayerForm(props: Props){
  const {
    onComplete
  } = props

  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const NAME_MAX_LENGTH = 16
  const NAME_MIN_LENGTH = 3

  useEffect(() => {
    inputRef.current?.focus()
  }, [])


  return <GamePanel
      title=''
      currentScreenName=''
    >

    <GamePanelSection
      title=''
      actions={[]}
    >
      <div className={styles.wrapper}>
        <div className={styles.container}>

          <LeftRightText 
            leftText='Player Name'
            leftRightStyle='left-first'
            rightText=''
          />
          <div>
            <input
              ref={inputRef}
              className={`input ${!nameError ? '' : 'invalid' }`}
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

          <div>
            <button 
              ref={buttonRef} 
              className='button success'
              onClick={() => {
                setNameError('')
                setTimeout(() => {
                  if (!name || !name.trim()) {
                    setNameError('Player name is empty.')
                    return
                  }
              
                  const trimmed = name.trim()
                  if (trimmed.length < NAME_MIN_LENGTH) {
                    setNameError('Player name is too short.')
                    return
                  }
                  const player: PlayerEntity = {
                    id: crypto.randomUUID(),
                    name: name,
                    characterTokens: 1,
                    level: 1,
                    xp: 0,
                    xpNextLevel: 100
                  }

                  eventBus.emit({
                    id: crypto.randomUUID(),
                    type: 'notification:save',
                    meta: {
                      notification: {
                        title: 'Player Event',
                        description: `${name} was created.`
                      }
                    }
                  })
                  
                  eventBus.emit({
                    id: crypto.randomUUID(),
                    type: 'player:save',
                    meta: {
                      player
                    }
                  })
                  onComplete()
                }, 250)
              }}
            >
              Accept
            </button>  
          </div>
          <div className={`${styles.errorWrapper} ${nameError ? styles.show : ''}`}>
            {!nameError && <div className='error-label'>...</div>}
            {nameError && <div className='error-label'>{nameError}</div>}
          </div>
        </div>
      </div>
    </GamePanelSection>
  </GamePanel>
}