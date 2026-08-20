import { useState } from 'react'
import FeatureBody from '../../core/components/feature/components/body/FeatureBody'
import FeatureHeader from '../../core/components/feature/components/header/FeatureHeader'
import { characterEventService } from '../../engine/events/services/CharacterEventService'
import styles from './CharacterCreate.module.css'
import { getCharacterForCreate } from '../../entities/character/utils/Character.utils'
import type { Character } from '../../interfaces/Character.types'

export default function CharacterCreate() {
  const [newCharacter, setNewCharacter] = useState<Character | undefined>(getCharacterForCreate())
  const noMainCharacter = characterEventService.getCharacters().length === 0
  
  return (
    <div 
      className={styles.wrapper}
    >
      <FeatureHeader
        text={`${noMainCharacter ? 'Summon Main Character' : 'Summon New Character'}`}
      />

      <FeatureBody>
        <div className={styles.description}>
          Fill out this form and submit it to the town hall to register them in this world.
        </div>
        <div className={styles.form}>
          <div className={styles.inputSection}>
            <div className={styles.inputLabel}>
              Name
            </div>
            <div className={styles.inputElement}>
              <input 
                type='text'
                maxLength={32}
                placeholder='Enter a character name...'
                value={newCharacter?.title}
                onChange={(e) => {
                  setNewCharacter(prev => {
                    return {
                      ...prev as Character,
                      title: e.target.value
                    }
                  })
                }}
              />
            </div>
          </div>
        </div>
      </FeatureBody>

    </div>
  )
}