import { useCallback, useEffect, useState } from 'react';
import Modal, { type ModalProps } from '../../common/components/Modal';
import type { CharacterClass, Character } from '../../interfaces/characters/Character.types';
import { CharacterClassRepository } from '../../repository/characters/CharacterClassRepository';
import { CHARACTER_MAIN_DEFAULT } from '../../data/characters/MainCharacter.data';
import { CLASS_WARRIOR } from '../../data/characters/CharacterClasses.data';
import { ACHIEVEMENT_INTRO_MAIN_CHARACTER } from '../../data/achievements/Achievements.Intro.data';
import { useConfirm } from '../../providers/ConfirmProvider';
import { DateTime } from 'luxon';

interface HomeNewMainCharacterModalProps extends ModalProps {
  setMainCharacter: (character: Character) => void
}

export default function HomeNewMainCharacterModal(props: HomeNewMainCharacterModalProps) {
  const [newCharacter, setNewCharacter] = useState<Character | undefined>(CHARACTER_MAIN_DEFAULT)
  const [characterClasses, setCharacterClasses] = useState<CharacterClass[]>([])
  const [selectedClass, setSelectedClass] = useState<CharacterClass | undefined>(CLASS_WARRIOR)
  const showConfirm = useConfirm()

  useEffect(() => {
    const load = async () => {
      const characterClassRepo = new CharacterClassRepository()
      const classes = await characterClassRepo.list()
      setCharacterClasses(classes)
    }
    load()
  }, [])

  const handleUpdateNewCharacter = useCallback((field: string, value: unknown) => {
    //@ts-ignore
    const character: Character = {
      ...newCharacter,
      [field]: value
    }
    setNewCharacter(character)
    if(field === 'classId'){
      setSelectedClass(characterClasses.find(cc => cc.id === value))
    }
  }, [newCharacter, characterClasses])

  const handleCreateClicked = useCallback(async () => {
    if(!await showConfirm(`Create the ${selectedClass?.name} ${newCharacter?.name}?`)) return 
    newCharacter?.achievements.push({
      achievementDate: DateTime.utc().toISO(),
      achievementId: ACHIEVEMENT_INTRO_MAIN_CHARACTER.id
    })
    props.setMainCharacter(newCharacter as Character)
    props.onClose()
  }, [selectedClass, newCharacter])

  return <Modal
    backdropHides={props.backdropHides}
    isOpen={props.isOpen}
    onClose={props.onClose}
    closeButton={props.closeButton}
    rightTitle={ACHIEVEMENT_INTRO_MAIN_CHARACTER.title}
    leftTitle={'Class Information'}
    leftChildren={selectedClass && <div>
      <div className='header-1'>
        {selectedClass.name}
      </div>
      <div className='description'>
        {selectedClass.description}
      </div>
      <div className='header-2'>
        Starting Stats
      </div>
      <div className='flex-wrap gap-1 description'>
        <div>
          +HP {selectedClass.stats.hp}
        </div>
        <div>
          +MP {selectedClass.stats.hp}
        </div>
        <div>
          +STAMINA {selectedClass.stats.hp}
        </div>
        <div>
          +AGILITY {selectedClass.stats.hp}
        </div>
        <div>
          +STRENGTH {selectedClass.stats.hp}
        </div>
        <div>
          +INTELLIGENCE {selectedClass.stats.hp}
        </div>
      </div>
    </div>
    }
  >
    <div>
      <div className='description'>
        {ACHIEVEMENT_INTRO_MAIN_CHARACTER.description}
      </div>
      <div className=''>
        <div >
          <div>
            <div className='form-label'>
              Name
            </div>
            <div>
              <input 
                type='text'
                style={{width: '250px'}}
                placeholder='Enter name...'
                value={newCharacter?.name}
                onChange={(e) => {
                  handleUpdateNewCharacter('name', e.currentTarget.value)
                }}
              />
            </div>
          </div>
          <div>
            <div className='form-label'>
              Class
            </div>
            <select
              value={newCharacter?.classId}
              style={{width: '265px'}}
              onChange={(e) => {handleUpdateNewCharacter('classId', e.currentTarget.value)}}
            >
              <option value='' disabled>Select Class</option>
              {characterClasses.map(cc => {
                return <option value={cc.id}>{cc.name}</option>
              })}
            </select>
          </div>
        </div>
        <hr/>
        <div className='flex-wrap gap-1'>
          <div>
            <button onClick={handleCreateClicked}>Create</button>
          </div>
        </div>
      </div>
    </div>
  </Modal>
}