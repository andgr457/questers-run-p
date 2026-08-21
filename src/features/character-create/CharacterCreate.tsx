import { useState } from 'react'
import FeatureBody from '../../core/components/feature/components/body/FeatureBody'
import FeatureHeader from '../../core/components/feature/components/header/FeatureHeader'
import { characterEventService } from '../../engine/events/services/CharacterEventService'
import styles from './CharacterCreate.module.css'
import { getCharacterForCreate } from '../../entities/character/utils/Character.utils'
import type { Character } from '../../interfaces/Character.types'
import type { ValidationRule } from '../../core/components/form/ValidationRules'
import TextBox from '../../core/components/form/TextBox'

export default function CharacterCreate() {
  const [newCharacter, setNewCharacter] = useState<Character | undefined>(
    getCharacterForCreate()
  )

  const noMainCharacter = characterEventService.getCharacters().length === 0
  
  return (
    <div 
      className={styles.wrapper}
    >
      <FeatureHeader
        text={`${noMainCharacter ? 'Summon Main Character' : 'Summon New Character'}`}
      />

      <div className={styles.description}>
        Fill out this form and submit it to the town hall to register them in this world.
      </div>
    
      <FeatureBody>
        <TextBox 
          validationRules={[
            {
              validationText: '3-32 Characters Long',
              isValid: false,
              isValidFn: (value: string) => {
                if(!value || !value.length) return false
                return value.length >=3 && value.length <= 32
              }
            },
          ]}
          inputMaxLength={32}
          inputOnChange={(value) => {
            setNewCharacter(prev => {
              return {
                ...prev as Character,
                title: value
              }
            })
          }}
          inputPlaceholderText='Character name...'
          inputValue={newCharacter?.title ?? ''}
          labelText='Character Name'
        />
      </FeatureBody>
       <FeatureBody>
        <TextBox 
          validationRules={[
            {
              validationText: '0-64 Characters Long',
              isValid: true,
              isValidFn: (value: string) => {
                return value.length >=0 && value.length <= 32
              }
            },
          ]}
          inputMaxLength={64}
          inputOnChange={(value) => {
            setNewCharacter(prev => {
              return {
                ...prev as Character,
                description: value
              }
            })
          }}
          inputPlaceholderText='Optional background lore...'
          inputValue={newCharacter?.description ?? ''}
          labelText='Description'
        />
      </FeatureBody>

    </div>
  )
}