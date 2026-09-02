import { useCallback, useEffect, useState } from 'react'
import FeatureBody from '../../../core/components/feature/components/body/FeatureBody'
import TextBox from '../../../core/components/form/TextBox'
import type { Character } from '../../../interfaces/Character.types'
import type { ValidationRule } from '../../../core/components/form/ValidationRules'

interface Props {
  characterName: string
  setNewCharacter: React.Dispatch<React.SetStateAction<Character | undefined>>
}

export default function CharacterCreateNameInput(props: Props){
  const {
    characterName,
    setNewCharacter
  } = props
  const [newCharacterName, setNewCharacterName] = useState(characterName)
  
  useEffect(() => {
    setNewCharacterName(characterName)
  }, [characterName])

  const getNameRulesBase = (): ValidationRule[]  => {
    return [
      {
        validationText: '3-32 Characters Long',
        isValid: false,
        isValidFn: (value: string) => {
          if(!value || !value.length) return false
          return value.length >=3 && value.length <= 32
        }
      }
    ]
  }
  const [nameRules, setNameRules] = useState<ValidationRule[]>(
    getNameRulesBase()
  )

  const handleNameChanged = useCallback((name: string) => {
    const newName = name.trim()
    setNewCharacterName(newName)
    setNewCharacter(prev => {
      if(!prev) return prev

      return {
        ...prev,
        title: newName
      }
    })
    setNameRules(prev => {
      if(!prev) return prev

      return [
        ...prev.map(p => {
          p.isValid = p.isValidFn(newName)
          return p
        })
      ]
    })
  }, [setNewCharacter])

  return (
    <FeatureBody>
      <TextBox 
        validationRules={nameRules}
        inputMaxLength={32}
        inputOnChange={handleNameChanged}
        inputPlaceholderText='Enter character name...'
        inputValue={newCharacterName ?? ''}
        labelText='Character Name'
      />
    </FeatureBody>
  )
}