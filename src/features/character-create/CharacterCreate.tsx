import { useEffect, useState } from 'react'
import FeatureHeader from '../../core/components/feature/components/header/FeatureHeader'
import { characterEventService } from '../../engine/events/services/CharacterEventService'
import styles from './CharacterCreate.module.css'
import { getCharacterForCreate } from '../../entities/character/utils/Character.utils'
import type { Character } from '../../interfaces/Character.types'
import { type ClassIds } from '../../interfaces/Classes.types'
import CharacterCreateClassSelections from './form-sections/CharacterCreateClassSelections'
import CharacterCreateNameInput from './form-sections/CharacterCreateNameInput'
import FeatureDescription from '../../core/components/feature/components/description/FeatureDescription'
import CharacterCreateDescriptionInput from './form-sections/CharacterCreateDescriptionInput'
import Actions, { type ActionDetail } from '../../core/components/form/Actions'
import DialogConfirm from '../../core/components/dialog/DialogConfirm'

export default function CharacterCreate() {
  const [newCharacter, setNewCharacter] = useState<Character | undefined>(
    getCharacterForCreate()
  )
  const [resetDialogVisible, setResetDialogVisible] = useState(false)

  const getFormActionsDefault = (canSubmit: boolean): ActionDetail[] => {
    return [
      {
        text: 'Submit',
        icon: '',
        inactive: canSubmit === false,
        inactiveText: 'Initializing',
        value: 'character_create_submit',
        onClick: () => {
          console.log('submit clicked')
        },
        isSubmit: true,
      },
      {
        text: 'Clear',
        icon: '',
        inactive: false,
        inactiveText: '',
        value: 'character_create_clear',
        onClick: () => {
          setResetDialogVisible(true)
        },
      },
    ]
  }
  const [formActions, setFormActions] = useState<ActionDetail[]>(
    getFormActionsDefault(false)
  )

  useEffect(() => {
    if(!newCharacter) return

    const name = newCharacter.title.trim()
    const nameValid = name.length >= 3
    const classSelected = newCharacter.classId.length > 0
    let canSubmit = false
    if(nameValid && classSelected){
      canSubmit = true
    } else {
      canSubmit = false
    }
    setFormActions(
      getFormActionsDefault(canSubmit)
    )
  }, [newCharacter])

  const noMainCharacter = characterEventService.getCharacters().length === 0
  
  return (
    <div 
      className={styles.wrapper}
    >
      <FeatureHeader
        text={`Summon Resident`}
      />

      {noMainCharacter && (
        <FeatureDescription isAlert={true}>
          <div>
            First character detected! After creation, this character will 
            act as your main and guide you through 
            managing your guild.
          </div>
        </FeatureDescription>
      )}
      <FeatureDescription>
        Fill this out and submit it to notify the Town Hall of the new resident.
      </FeatureDescription>
    
      {/* CHARACTER NAME/TITLE */}
      <CharacterCreateNameInput 
        characterName={newCharacter?.title ?? ''}
        setNewCharacter={setNewCharacter}
      />
      {/* CHARACTER DESCRIPTION/LORE */}
      <CharacterCreateDescriptionInput 
        characterDescription={newCharacter?.description ?? ''}
        setNewCharacter={setNewCharacter}
      />
      {/* CLASS SELECTIONS */}
      <CharacterCreateClassSelections 
        selectedClassId={newCharacter?.classId as ClassIds}
        setNewCharacter={setNewCharacter}
      />
      {/* FORM ACTIONS */}
      <Actions 
        actions={formActions}
      />
      <DialogConfirm 
        title='Summon Reset'
        cancelText='Cancel'
        confirmText='Confirm'
        descriptions={[
          'This will reset all fields to their default values.',
          'Are you sure?'
        ]}
        onCancel={() => {
          setResetDialogVisible(false)
        }}
        onConfirm={() => {
          setNewCharacter(
            getCharacterForCreate()
          )
        }}
        visible={resetDialogVisible}
        setVisible={setResetDialogVisible}
      />
    </div>
  )
}