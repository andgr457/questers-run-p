import { useCallback, useEffect, useState } from 'react';
import Modal, { type ModalProps } from '../modals/Modal';
import type { CharacterClass, Character, Stat } from '../../../interfaces/characters/Character.types';
import { CharacterClassRepository } from '../../../repository/characters/CharacterClassRepository';
import { CHARACTER_MAIN_DEFAULT } from '../../../data/characters/MainCharacter.data';
import { CLASS_WARRIOR } from '../../../data/characters/CharacterClasses.data';
import { ACHIEVEMENT_INTRO_MAIN_CHARACTER } from '../../../data/achievements/Achievements.Intro.data';
import { useConfirm } from '../../../providers/ConfirmProvider';
import { DateTime } from 'luxon';
import type { Inventory } from '../../../interfaces/inventories/Inventory.types';
import { getInventoryIntroCurrencyPouch, getInventoryIntroStarterPouch } from '../../../data/inventories/Inventories.Intro.data';
import type { CharacterHistory } from '../../../interfaces/history/History.types';
import type { Quest } from '../../../interfaces/quests/Quests.types';
import { QUEST_INTRO_ADVENTURERS_GUILD } from '../../../data/quests/Quests.Intro.data';

interface NewCharacterModalProps extends ModalProps {
  setMainCharacter: (character: Character) => Promise<void>
  addInventory: (inventory: Inventory[]) => Promise<void>
  addHistory: (newHistory: CharacterHistory[]) => Promise<void>
  addQuest: (quest: Quest, characterId: string) => Promise<void>
  mainCharacter?: Character
}

export default function NewCharacterModal(props: NewCharacterModalProps) {
  const [newCharacter, setNewCharacter] = useState<Character | undefined>(props.mainCharacter ? props.mainCharacter : CHARACTER_MAIN_DEFAULT)
  const [characterClasses, setCharacterClasses] = useState<CharacterClass[]>([])
  const [selectedClass, setSelectedClass] = useState<CharacterClass | undefined>(undefined)
  const [showClassInfo, setShowClassInfo] = useState(props.mainCharacter ? false : true)
  const [error, setError] = useState('')
  const [newName, setNewName] = useState('')
  const {showConfirm, } = useConfirm()

  useEffect(() => {
    const load = async () => {
      const characterClassRepo = new CharacterClassRepository()
      const classes = await characterClassRepo.list()
      setCharacterClasses(classes)
      if(props.mainCharacter){
        const theClass = classes.find(c => c.id === props.mainCharacter?.classId)
        setSelectedClass(theClass)
      } else {
        if(!selectedClass){
          setSelectedClass(CLASS_WARRIOR)
        }
      }
    }
    load()
  }, [props.mainCharacter, selectedClass])

  const handleUpdateNewCharacterName = useCallback((name: string) => {
    const character: Character = {...newCharacter as Character}
    if(props.mainCharacter){
      setNewName(name)
    } else {
      character.name = name
      setNewCharacter(character)
    }
  }, [newCharacter, props.mainCharacter])

  const handleUpdateNewCharacterClass = useCallback((classId: string) => {
    const character: Character = {...newCharacter as Character}
    character.classId = classId
    setNewCharacter(character)
    setSelectedClass(characterClasses.find(cc => cc.id === classId))
  }, [newCharacter, characterClasses])

  const handleCreateClicked = useCallback(async () => {
    setError('')
    const newNameTrim = newName?.trim()
    if(props.mainCharacter && (!newNameTrim || newNameTrim?.length < 2) ){
      setError('Name must be between 3 and 50 characters long, inclusive.')
      return
    }
    if(!props.mainCharacter && !newCharacter || !newCharacter?.name?.trim()){
      setError('Name must be between 3 and 50 characters long, inclusive.')
      return
    }

    //Confirmation Text depending on create/rename
    let confirmText = `Create the ${selectedClass?.name} ${newCharacter?.name}?`
    if(props.mainCharacter){
      confirmText = `Rename the ${selectedClass?.name} ${newCharacter?.name} to ${newName}?`
    }

    //Show confirmation Yes/No
    if(!await showConfirm({
      message: confirmText,
      title: `${props.mainCharacter ? 'Rename' : 'Create'} Main Character`,
      isYesNo: true
    })) return

    if(!props.mainCharacter){
      //new character
      const histories: CharacterHistory[] = []
      histories.push({
        id: `h_${newCharacter?.id}_${DateTime.utc().toMillis()+100}`,
        characterId: newCharacter?.id as string,
        date: DateTime.utc().toISO(),
        description: `"${newCharacter?.name}" isekai\'d and resurrected here.`
      })

      // Earn Created Main Character Achievement
      newCharacter?.achievements.push({
        achievementDate: DateTime.utc().toISO(),
        achievementId: ACHIEVEMENT_INTRO_MAIN_CHARACTER.id
      })

      histories.push({
        id: `h_${newCharacter?.id}_${DateTime.utc().toMillis()+200}`,
        characterId: newCharacter?.id as string,
        date: DateTime.utc().toISO(),
        description: `Achievement "${ACHIEVEMENT_INTRO_MAIN_CHARACTER.title}" earned!`
      })

      const currencyPouch = getInventoryIntroCurrencyPouch(newCharacter?.id as string, `${DateTime.utc().toMillis()}`)
      const starterPouch = getInventoryIntroStarterPouch(newCharacter?.id as string, `${DateTime.utc().toMillis()}`)

      histories.push({
        id: `h_${newCharacter?.id}_${DateTime.utc().toMillis()+300}`,
        characterId: newCharacter?.id as string,
        date: DateTime.utc().toISO(),
        description: `"${currencyPouch.title}" pouch received!`
      })
      histories.push({
        id: `h_${newCharacter?.id}_${DateTime.utc().toMillis()+400}`,
        characterId: newCharacter?.id as string,
        date: DateTime.utc().toISO(),
        description: `"${starterPouch.title}" pouch received!`
      })
      histories.push({
        id: `h_${newCharacter?.id}_${DateTime.utc().toMillis()+500}`,
        characterId: newCharacter?.id as string,
        date: DateTime.utc().toISO(),
        description: `"${QUEST_INTRO_ADVENTURERS_GUILD.title}" quest received!`
      })
      //Starter Inventories
      const inventories: Inventory[] = []
      inventories.push(currencyPouch)
      inventories.push(starterPouch)
      props.addInventory(inventories)
      props.addHistory(histories)
      props.addQuest(QUEST_INTRO_ADVENTURERS_GUILD, newCharacter?.id as string)
      props.setMainCharacter(newCharacter as Character)
    } else {
      //rename
      props.addHistory([{
        id: `h_${newCharacter?.id}_${DateTime.utc().toMillis()+100}`,
        characterId: newCharacter?.id as string,
        date: DateTime.utc().toISO(),
        description: `"${newCharacter?.name}" is now known as "${newName}".`
      }])
      props.setMainCharacter({
        ...newCharacter as Character,
        name: newName as string
      })
    }
    props.onClose()
  }, [selectedClass, newCharacter, props.mainCharacter, newName])

  const handleCancelClicked = useCallback(() => {
    setNewName('')
    props.onClose()
  }, [props.onClose, setNewName])

  const characterExists = typeof props.mainCharacter?.guildRank !== 'undefined'
  const statsInfos = []
  for(const propertyName of Object.getOwnPropertyNames(selectedClass?.stats ?? {}) ?? []){
    //@ts-ignore
    const statItem = selectedClass?.stats[propertyName] as Stat

    statsInfos.push(<div className='character-info-stat-item'>
      <div>
        +
      </div>
      <div>
        {statItem.name}
      </div>
      <div>
        {statItem.value}
      </div>
    </div>)
  }
  return <Modal
    backdropHides={characterExists}
    isOpen={props.isOpen}
    onClose={props.onClose}
    closeButton={characterExists}
    rightTitle={props.mainCharacter ? `Rename ${newCharacter?.name}` : ACHIEVEMENT_INTRO_MAIN_CHARACTER.title}
    leftTitle={'Class Information'}
    leftChildren={selectedClass && showClassInfo === true && <div>
      <div>
        {selectedClass.name}
      </div>
      <hr/>
      <div className='character-info-stats-xp' style={{fontSize: '0.7em'}}>
        {statsInfos}
      </div>
    </div>
    }
  >
    <div style={{textAlign: 'center'}}>
      <div className='description'>
        {characterExists ? 'Apply for a name change.' : ACHIEVEMENT_INTRO_MAIN_CHARACTER.description}
      </div>
      <div className=''>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center'}}>
          <div>
            <div className='form-label'>
              Name
            </div>
            <div>
              <input 
                type='text'
                style={{width: '250px'}}
                placeholder={characterExists ? `Rename ${newCharacter?.name}...` : 'Enter name...'}
                value={characterExists ? newName : newCharacter?.name}
                maxLength={50}
                onChange={(e) => {handleUpdateNewCharacterName(e.currentTarget.value)}}
              />
            </div>
            <div className='foot-note'>
              {newCharacter?.name?.length ?? 0} / 50 character(s)
            </div>
          </div>
          <div style={{width: '250px'}}>
            <div className='form-label'>
              Class
            </div>
            <div>
              <select
                disabled={characterExists}
                value={newCharacter?.classId}
                style={{width: '265px'}}
                onChange={(e) => {handleUpdateNewCharacterClass(e.currentTarget.value)}}
              >
                <option value='' disabled>Select Class</option>
                {characterClasses.map(cc => {
                  return <option value={cc.id}>{cc.name}</option>
                })}
              </select>
            </div>
            <div className='foot-note danger'>
              {error}
            </div>
          </div>
        </div>
        <hr/>
        <div className='modal-actions'>
            <button className='success' onClick={handleCreateClicked}>
              {characterExists ? 'Rename' : 'Create'}
            </button>
            {characterExists && <button  className='danger' onClick={() => {handleCancelClicked()}}>
                Cancel
              </button>}
            <button  className='basic' onClick={() => {setShowClassInfo(!showClassInfo)}}>
              {showClassInfo === true ? 'Hide' : 'Show'} Class Stats
            </button>
          <div>
            
          </div>
          <div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
}