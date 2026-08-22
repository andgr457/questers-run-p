import { useState } from 'react'
import FeatureBody from '../../core/components/feature/components/body/FeatureBody'
import FeatureHeader from '../../core/components/feature/components/header/FeatureHeader'
import { characterEventService } from '../../engine/events/services/CharacterEventService'
import styles from './CharacterCreate.module.css'
import { getCharacterForCreate } from '../../entities/character/utils/Character.utils'
import type { Character } from '../../interfaces/Character.types'
import type { ValidationRule } from '../../core/components/form/ValidationRules'
import TextBox from '../../core/components/form/TextBox'
import Selections from '../../core/components/form/Selections'
import { GAME_CLASSES } from '../../data/Classes.data'
import type { ClassIds } from '../../interfaces/Classes.types'
import { GAME_ICONS } from '../../core/data/Icons.data'

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
    
      {/* CHARACTER NAME/TITLE */}
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
      {/* DESCRIPTION */}
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
      {/* CLASS SELECTIONS */}
      <FeatureBody>
        <Selections 
          labelText='Class'
          selectionDetails={Object.getOwnPropertyNames(GAME_CLASSES).map(classId => {
            const newClass = GAME_CLASSES[classId as ClassIds]

            return {
              text: newClass.title,
              icon: '',
              inactive: false,
              inactiveText: '',
              selected: false,
              value: newClass.id
            }
          })}
          selectionMode='one'
          selectionOnChange={(value: string, selected: boolean) => {
            console.log(value, selected)
            let newClassId = value
            if(newCharacter?.classId === newClassId){
              if(!selected){
                newCharacter.classId = ''
              }
            }
            console.log(newCharacter?.classId)
            
            setNewCharacter(prev => {
              if(!prev) return prev

              return {
                ...newCharacter as Character,
                classId: newClassId
              }
            })
          }}
          validationRules={[
            {
              validationText: '1 Class Selected',
              isValid: false,
              isValidFn: (value: string) => {
                console.log('rule check',newCharacter?.classId, value)
                return newCharacter?.classId === value
              }
            }
          ]}
        />
      </FeatureBody>

    </div>
  )
}