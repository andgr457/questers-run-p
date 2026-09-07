import { useCallback, useEffect, useState } from 'react'
import { GAME_CLASSES } from '../../../data/Classes.data'
import type { Character } from '../../../interfaces/Character.types'
import type { ClassIds } from '../../../interfaces/Classes.types'
import type { SelectionDetail } from '../../../core/components/form/Selections'
import type { ValidationRule } from '../../../core/components/form/ValidationRules'
import FeatureBody from '../../../core/components/feature/components/body/FeatureBody'
import Selections from '../../../core/components/form/Selections'

interface Props {
  selectedClassId: ClassIds | ''
  setNewCharacter: React.Dispatch<React.SetStateAction<Character>>
}

export default function CharacterCreateClassSelections(props: Props){
  const {
    selectedClassId,
    setNewCharacter,
  } = props

  const buildSelectionDetails = (selectedClassId?: ClassIds) => {
    return Object.getOwnPropertyNames(GAME_CLASSES).map(classId => {
      const newClass = GAME_CLASSES[classId as ClassIds]

      return {
        text: newClass.title,
        icon: '',
        inactive: false,
        inactiveText: '',
        selected: selectedClassId === classId,
        value: newClass.id
      }
    })
  }
  
  const [classSelections, setClassSelections] = useState<SelectionDetail[]>([])

  const handleIsClassSelected = useCallback(() => {
    return typeof selectedClassId === 'string' && selectedClassId.length > 0
  }, [selectedClassId])

  const getClassSelectionRulesBase = (): ValidationRule[]  => {
    return [
      {
        validationText: 'Class Selected',
        isValid: false,
        isValidFn: () => {
          return handleIsClassSelected()
        }
      }
    ]
  }
  const [classSelectionRules, setClassSelectionRules] = useState<ValidationRule[]>(
    [
      ...getClassSelectionRulesBase()
    ]
  )
  
  useEffect(() => {
    setClassSelections(
      buildSelectionDetails(selectedClassId as ClassIds)
    )
    if(!selectedClassId){
      setClassSelectionRules([
        ...getClassSelectionRulesBase()
      ])
    }
  }, [selectedClassId])

  const handleClassSelectionClicked = useCallback((value: string) => {
    let newClassId = value
    if(selectedClassId === newClassId){
      newClassId = ''
    }
    
    setNewCharacter(prev => {
      if(!prev) return prev

      return {
        ...prev as Character,
        classId: newClassId
      }
    })
    setClassSelections(prev => {
      if(!prev) return prev

      return [
        ...prev.map(p => {
          if(p.value === newClassId){
            p.selected = true
          } else {
            p.selected = false
          }
          return p
        })
      ]
    })
    setClassSelectionRules(prev => {
      if(!prev) return prev

      return [
        ...prev.map(p => {
          p.isValid = newClassId && newClassId.length > 0 ? true : false
          return p
        })
      ]
    })
  }, [selectedClassId, setNewCharacter])
  return (
    <FeatureBody>
      <Selections 
        validationRules={classSelectionRules}
        labelText='Class'
        selectionDetails={classSelections ?? []}
        selectionOnChange={handleClassSelectionClicked}
        setRules={setClassSelectionRules}
      />
    </FeatureBody>
  )
}