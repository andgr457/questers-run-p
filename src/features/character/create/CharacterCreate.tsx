import { useState } from 'react';
import { getCharacterForCreate } from '../../../entities/character/utils/Character.utils';
import Actions from '../../../core/components/form/Actions';
import CharacterCreateClassSelections from './CharacterCreateClassSelections';
import type { Character } from '../../../interfaces/Character.types';
import CharacterCreateNameInput from './CharacterCreateNameInput';
import { eventBus } from '../../../engine/events/EventBus';
import { clockRuntimeService } from '../../../engine/clock/ClockRuntimeService';
import type { ClassIds } from '../../../interfaces/Classes.types';

export default function CharacterCreate() {
  const [newCharacter, setNewCharacter] = useState<Character>(
    getCharacterForCreate()
  )

  return (
    <div>
      <div>
        Summon Circle
      </div>
      <div>
        Summon isekai'd adventurers from another world.
      </div>
      <div>
        <CharacterCreateNameInput 
          characterName={newCharacter.title}
          setNewCharacter={setNewCharacter}
        />
        <CharacterCreateClassSelections 
          selectedClassId={newCharacter?.classId as ClassIds}
          setNewCharacter={setNewCharacter}
        />
        <Actions 
          actions={[
            {
              inactive: false,
              onClick: () => {
                const nameValid = newCharacter.title.trim().length >= 3
                const classSelected = newCharacter.classId.length > 0
                if(nameValid && classSelected){
                  eventBus.emit({
                    id: crypto.randomUUID(),
                    type: 'character:create',
                    created: clockRuntimeService.getNow(),
                    meta: {
                      character: {
                        ...newCharacter,
                        title: newCharacter.title.trim()
                      }
                    }
                  })
                  eventBus.emit({
                    id: crypto.randomUUID(),
                    type: 'world:mode:main:change',
                    created: clockRuntimeService.getNow(),
                    meta: {
                      mode: 'none'
                    }
                  })
                }
              },
              text: 'Save',
              colorScheme: 'success'
            },
            {
              inactive: false,
              onClick: () => {
                setNewCharacter(prev => {

                  return {
                    ...prev,
                    title: '',
                    classId: ''
                  }
                })
              },
              text: 'Clear',
              colorScheme: 'danger'
            }
          ]}
        />
      </div>
    </div>
  )
}