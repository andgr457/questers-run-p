import { useEffect, useState } from 'react'
import './CharacterBar.css'
import { CharacterService } from '../../../services/characters/CharacterService'
import type { Inventory } from '../../../interfaces/inventories/Inventory.types'
import type { Character, CharacterClass, Stats } from '../../../interfaces/characters/Character.types'

interface CharacterCharacterBarProps {
  character: Character
  characterClass: CharacterClass
  characterInventories: Inventory[]
}

export default function CharacterBar(props: CharacterCharacterBarProps){
  const {
    character,
    characterClass,
    characterInventories
  } = props
  
  const [characterStats, setCharacterStats] = useState<Stats | undefined>(undefined)
  const [characterGold, setCharacterGold] = useState(0)

  useEffect(() => {
    const load = async function() {
      if(!character || !characterClass) return

      const characterService = new CharacterService(
        character,
        characterClass,
        characterInventories
      )
      setCharacterStats(characterService.getStats())
      setCharacterGold(characterService.getGold())
    }
    load()
  }, [character, characterClass, characterInventories])

  if(!character){
    return null
  }

  return <>
  <div>
      <div className='character-bar' >
        <div className='character-bar-item'>
          {character.name}
        </div>
        <div className='character-bar-item'>
          {characterClass?.name} 
        </div>
        <div className='character-bar-item'>
          {characterGold.toLocaleString()} Gold
        </div>
        <div className='flex-wrap gap-2'>
          <div className='character-bar-item'>
            Lvl {character.level} 
          </div>
          <div className='character-bar-item'>
            XP {character.xp} / {character.levelNextXP}
          </div>
          <div className='character-bar-item'>
            {character.levelNextXP - character.xp} XP Left
          </div>

        </div>
        
        <div className='flex-wrap gap-2'>
          {characterStats && Object.getOwnPropertyNames(characterStats).map(propertyName => {
            //@ts-ignore
            const stat: Stat = characterStats[propertyName]
            return <div className='character-bar-item' title={stat.hint}>
              {stat.name} {stat.value}
            </div>
          })}
        </div>
      </div>
    </div>
  </>
}