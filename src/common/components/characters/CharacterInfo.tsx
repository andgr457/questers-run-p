import { useEffect, useState } from 'react'
import './CharacterInfo.css'
import { CharacterService } from '../../../services/characters/CharacterService'
import type { Inventory } from '../../../interfaces/inventories/Inventory.types'
import { GuildRanks, type Character, type CharacterClass, type Stat, type Stats } from '../../../interfaces/characters/Character.types'
import CustomContainer from '../CustomContainer'

interface CharacterInfoProps {
  character: Character
  characterClass: CharacterClass
  characterInventories: Inventory[]
  expanded?: boolean
}

export default function CharacterInfo(props: CharacterInfoProps){
  const {
    character,
    characterClass,
    characterInventories,
    expanded = true
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

  const statsInfos = []
  for(const propertyName of Object.getOwnPropertyNames(character.stats ?? {}) ?? []){
    //@ts-ignore
    const statItem = character?.stats[propertyName] as Stat

    {/* @ts-ignore */}
    const left = `${(statItem?.nextLevelXP - statItem.xp).toLocaleString()} left`
    statsInfos.push(<div className='character-info-stat-item' title={left}>
      <div>
        {statItem.name}
      </div>
      <div>
        {statItem.level}
      </div>
      <div>
        {statItem.xp}
      </div>
      <div>
         / 
      </div>
      <div>
        {statItem.nextLevelXP}
      </div>
    </div>)
  }
  const nextLevelXP = (character.levelNextXP - character.xp).toLocaleString()

  return <div id='tutorial-character'>
    <CustomContainer
      title={character?.name}
      expandable={true}
      expanded={expanded}
      isChildCustomContainer={false}
      description=''
      headerLeft={`${characterGold.toLocaleString()}g`}
    >
      <div className='character-info-main'>

        <div className='character-info-class'>
          <div className='character-info-stat-item'>
            Level {character.level} {characterClass?.name}
          </div>
          <div className='character-info-stat-item' title={`${nextLevelXP} left`}>
            <div>
              XP
            </div>
            <div>
              {character.xp}
            </div>
            <div>
              / 
            </div>
            <div>
              {character.levelNextXP}
            </div>
          </div>
          
        </div>
        <div className='character-info-stats-xp'>
          <div className='character-info-stat-item'>
            <div>
              {!character?.guildRank ? 'No  Adventurer\'s Guild Rank' : `${character.guildRank} Rank`}
            </div>
          </div>
          {statsInfos}
        </div>
      </div>
    </CustomContainer>
  </div>
}