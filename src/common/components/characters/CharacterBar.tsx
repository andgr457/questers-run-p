import { useEffect, useState } from 'react'
import './CharacterBar.css'
import { CharacterService } from '../../../services/characters/CharacterService'
import type { Inventory } from '../../../interfaces/inventories/Inventory.types'
import type { Character, CharacterClass, Stats } from '../../../interfaces/characters/Character.types'

interface CharacterCharacterBarProps {
  character: Character
  characterClass: CharacterClass
  characterInventories: Inventory[]
  title: string
}

export default function CharacterBar(props: CharacterCharacterBarProps){
  const {
    character,
    characterClass,
    characterInventories,
    title
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
          {title}
        </div>
        <div className='character-bar-item'>
          {character.name}
        </div>

        <div className='character-bar-item'>
          {character.guildRank ?? 'No'} Guild Rank
        </div>
        
        <div className='character-bar-item'>
          {characterGold.toLocaleString()} Gold
        </div>
        <div className='flex-wrap gap-2'>
          <div className='character-bar-item'>
            Level {character.level} 
          </div>
          <div className='character-bar-item'>
            {characterClass?.name} 
          </div>
          <div className='character-bar-item'>
            XP {character.xp.toLocaleString()} / {character.levelNextXP.toLocaleString()}
          </div>
          <div className='character-bar-item'>
            {(character.levelNextXP - character.xp).toLocaleString()} XP Left
          </div>

        </div>
        
        <div className='flex-wrap gap-2'>
          <div className='character-bar-item' title={characterStats?.hp?.hint}>
            {characterStats?.hp?.name} {characterStats?.hp?.value}
          </div>
          <div className='character-bar-item' title={characterStats?.mp?.hint}>
            {characterStats?.mp?.name} {characterStats?.mp?.value}
          </div>
          <div className='character-bar-item' title={characterStats?.stamina?.hint}>
            {characterStats?.stamina?.name} {characterStats?.stamina?.value}
          </div>          
          <div className='character-bar-item' title={characterStats?.agility?.hint}>
            {characterStats?.agility?.name} {characterStats?.agility?.value}
          </div>
          <div className='character-bar-item' title={characterStats?.strength?.hint}>
            {characterStats?.strength?.name} {characterStats?.strength?.value}
          </div>
          <div className='character-bar-item' title={characterStats?.intelligence?.hint}>
            {characterStats?.intelligence?.name} {characterStats?.intelligence?.value}
          </div>
        </div>
      </div>
    </div>
  </>
}