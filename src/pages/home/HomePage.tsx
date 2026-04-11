import { useEffect, useState } from 'react'
import HomeNewMainCharacterModal from './HomeNewMainCharacterModal'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { LOCAL_STORAGE_KEYS } from '../../common/constants/LocalStorageKeys'
import type { Character } from '../../interfaces/characters/Character.types'
import type { Inventory } from '../../interfaces/inventories/Inventory.types'

export default function HomePage(){
  const [newMainCharacterModalOpen, setNewMainCharacterModalOpen] = useState(false)
  const [mainCharacter, setMainCharacter] = useLocalStorage<Character | undefined>(LOCAL_STORAGE_KEYS.CHARACTERS_MAIN, undefined)
  const [inventories, setInventories] = useLocalStorage<Inventory[]>(LOCAL_STORAGE_KEYS.INVENTORIES, [])

  useEffect(() => {
  }, [])
  return <div className='home-main'>
    <HomeNewMainCharacterModal 
      rightTitle={'Create Main Character'}
      setMainCharacter={setMainCharacter}
      closeButton={true} //prod = false
      backdropHides={false}
      isOpen={newMainCharacterModalOpen}
      onClose={() => setNewMainCharacterModalOpen(false)}
    >
      <></>
    </HomeNewMainCharacterModal>
    <div className='header-2'>
      Home
    </div>
    <div>
      {mainCharacter?.name} {mainCharacter?.level} {mainCharacter?.classId}
    </div>
    <div className='home-main-section'>
      <div className='home-actions'>
        <div>
          <button
            onClick={() => setNewMainCharacterModalOpen(true)}
          >
            Create Main Character
          </button>
          <button
            onClick={() => setMainCharacter(undefined)}
          >
            Clear Main Character
          </button>
        </div>
      </div>
    </div>
  </div>
}