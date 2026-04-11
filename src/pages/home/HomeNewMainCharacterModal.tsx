import { useCallback, useEffect, useState } from 'react';
import Modal, { type ModalProps } from '../../common/components/modals/Modal';
import type { CharacterClass, Character, Stat } from '../../interfaces/characters/Character.types';
import { CharacterClassRepository } from '../../repository/characters/CharacterClassRepository';
import { CHARACTER_MAIN_DEFAULT } from '../../data/characters/MainCharacter.data';
import { CLASS_WARRIOR } from '../../data/characters/CharacterClasses.data';
import { ACHIEVEMENT_INTRO_MAIN_CHARACTER } from '../../data/achievements/Achievements.Intro.data';
import { useConfirm } from '../../providers/ConfirmProvider';
import { DateTime } from 'luxon';
import type { Inventory } from '../../interfaces/inventories/Inventory.types';
import { getInventoryIntroCurrencyPouch, getInventoryIntroStarterPouch } from '../../data/inventories/Inventories.Intro.data';
import type { CharacterHistory } from '../../interfaces/history/History.types';
import type { Quest } from '../../interfaces/quests/Quests.types';
import { QUEST_INTRO_ADVENTURERS_GUILD } from '../../data/quests/Quests.Intro.data';
import CharacterBar from '../../common/components/characters/CharacterBar';

interface HomeNewMainCharacterModalProps extends ModalProps {
  setMainCharacter: (character: Character) => Promise<void>
  addInventory: (inventory: Inventory[]) => Promise<void>
  addHistory: (newHistory: CharacterHistory[]) => Promise<void>
  addQuest: (quest: Quest, characterId: string) => Promise<void>
  mainCharacter?: Character
}

export default function HomeNewMainCharacterModal(props: HomeNewMainCharacterModalProps) {
  const [newCharacter, setNewCharacter] = useState<Character | undefined>(props.mainCharacter ? props.mainCharacter : CHARACTER_MAIN_DEFAULT)
  const [characterClasses, setCharacterClasses] = useState<CharacterClass[]>([])
  const [selectedClass, setSelectedClass] = useState<CharacterClass | undefined>(undefined)
  const [showClassInfo, setShowClassInfo] = useState(props.mainCharacter ? false : true)
  const [newName, setNewName] = useState('')
  const {showConfirm, } = useConfirm()

  useEffect(() => {
    const load = async () => {
      const characterClassRepo = new CharacterClassRepository()
      const classes = await characterClassRepo.list()
      setCharacterClasses(classes)
      if(props.mainCharacter){
        const theClass = classes.find(c => c.id === props.mainCharacter?.classId)
        console.log(theClass)
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
    //Validation, exit on OK
    if(props.mainCharacter && (!newName || newName?.trim().length === 0) ){
      await showConfirm({
        message: 'You must change your name before submitting.',
        title: 'New Name Issues',
        isYesNo: false
      })
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
      props.addHistory([{
        id: `h_${newCharacter?.id}_${DateTime.utc().toMillis()+100}`,
        characterId: newCharacter?.id as string,
        date: DateTime.utc().toISO(),
        description: `Renamed "${newCharacter?.name}" to "${newName}".`
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

  const exampleCurrencyInventory = getInventoryIntroCurrencyPouch(newCharacter?.id as string, `${DateTime.utc().toMillis()}`)
  const exampleStarterInventory = getInventoryIntroStarterPouch(newCharacter?.id as string, `${DateTime.utc().toMillis()}`)

  return <Modal
    backdropHides={typeof props.mainCharacter !== 'undefined'}
    isOpen={props.isOpen}
    onClose={props.onClose}
    closeButton={typeof props.mainCharacter !== 'undefined'}
    rightTitle={props.mainCharacter ? `Rename ${newCharacter?.name}` : ACHIEVEMENT_INTRO_MAIN_CHARACTER.title}
    leftTitle={'Class Information'}
    leftChildren={selectedClass && showClassInfo === true && <div>
      <div className='header-1'>
        {selectedClass.name}
      </div>
      <div className='description'>
        {selectedClass.description}
      </div>
      <div className='header-2'>
        Class Starting Stats
      </div>
      <div className='flex-wrap gap-1 description'>
        {Object.getOwnPropertyNames(selectedClass.stats).map(propertyName => {
          //@ts-ignore
          const content: Stat = selectedClass.stats[propertyName]
          console.log('content', content)
          return <div>
            +{content.value} {content.name}
          </div>
        })}
      </div>
      <div>
        <CharacterBar character={newCharacter as Character} characterClass={selectedClass} characterInventories={[exampleCurrencyInventory, exampleStarterInventory]} />
      </div>
    </div>
    }
  >
    <div>
      <div className='description'>
        {props.mainCharacter ? 'Apply for a name change.' : ACHIEVEMENT_INTRO_MAIN_CHARACTER.description}
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
                placeholder={props.mainCharacter ? `Rename ${newCharacter?.name}...` : 'Enter name...'}
                value={props.mainCharacter ? newName : newCharacter?.name}
                maxLength={50}
                onChange={(e) => {handleUpdateNewCharacterName(e.currentTarget.value)}}
              />
            </div>
          </div>
          <div>
            <div className='form-label'>
              Class
            </div>
            <select
              disabled={typeof props.mainCharacter !== 'undefined'}
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
        </div>
        <hr/>
        <div className='flex-wrap gap-1'>
          <div>
            <button onClick={handleCreateClicked}>
              {props.mainCharacter ? 'Rename' : 'Create'}
            </button>
            
          </div>
          {props.mainCharacter && <div>
            <button onClick={() => {handleCancelClicked()}}>
              Cancel
            </button>
          </div>}
          <div>
            <button onClick={() => {setShowClassInfo(!showClassInfo)}}>
              {showClassInfo === true ? 'Hide' : 'Show'} Class Stats
            </button>
          </div>
        </div>
      </div>
    </div>
  </Modal>
}