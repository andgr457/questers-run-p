import { useCallback, useEffect, useState } from 'react'
import FeatureBody from '../../../core/components/feature/components/body/FeatureBody'
import TextBox from '../../../core/components/form/TextBox'
import type { Character } from '../../../interfaces/Character.types'
import type { ValidationRule } from '../../../core/components/form/ValidationRules'

interface Props {
  characterDescription: string
  setNewCharacter: React.Dispatch<React.SetStateAction<Character | undefined>>
}

export default function CharacterCreateDescriptionInput(props: Props){
  const {
    characterDescription,
    setNewCharacter
  } = props
  const [newCharacterDescription, setNewCharacterDescription] = useState(characterDescription)
  
  useEffect(() => {
    setNewCharacterDescription(characterDescription)
  }, [characterDescription])

  const getDescriptionRulesBase = (): ValidationRule[]  => {
    return [
      {
        validationText: '0-64 Characters Long',
        isValid: true,
        isValidFn: (value: string) => {
          return value.length >=0 && value.length <= 32
        }
      },
    ]
  }
  const [descriptionRules, setDescriptionRules] = useState<ValidationRule[]>(
    getDescriptionRulesBase()
  )

  const handleDescriptionChanged = useCallback((description: string) => {
    const newDescription = description.trim()
    setNewCharacterDescription(newDescription)
    setNewCharacter(prev => {
      if(!prev) return prev

      return {
        ...prev,
        description: newDescription
      }
    })
    setDescriptionRules(prev => {
      if(!prev) return prev

      return [
        ...prev.map(p => {
          p.isValid = p.isValidFn(newDescription)
          return p
        })
      ]
    })
  }, [setNewCharacter])

  return (
    <FeatureBody>
      <TextBox 
        isTextArea={true}
        validationRules={descriptionRules}
        inputMaxLength={32}
        inputOnChange={handleDescriptionChanged}
        inputPlaceholderText='Enter optional character Lore...'
        inputValue={newCharacterDescription ?? ''}
        labelText='Lore'
      />
    </FeatureBody>
  )
}