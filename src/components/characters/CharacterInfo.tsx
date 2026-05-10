import { useEffect, useMemo, useState } from 'react'
import './CharacterInfo.css'
import { CharacterService } from '../../services/characters/CharacterService'
import type { Inventory } from '../../interfaces/inventories/Inventory.types'
import { StatSort, type Character, type CharacterClass, type Stat, type Stats } from '../../interfaces/characters/Character.types'
import { ProfessionSort } from '../../interfaces/professsions/Profession.types'
import CharacterStatCard from './CharacterStatCard'
import CharacterInfoXP from './CharacterInfoXP'
import type { AppProperties } from '../../interfaces/AppProperties.types'

interface CharacterInfoProps extends AppProperties {

}

export default function CharacterInfo(props: CharacterInfoProps) {
  const {
    character,
    characterClass,
    characterInventories,
  } = props

  const [characterStats, setCharacterStats] = useState<Stats | undefined>(undefined)
  const [characterGold, setCharacterGold] = useState(0)
  const [showAttributeStats, setShowAttributeStats] = useState(true)
  const [showProfessionStats, setShowProfessionStats] = useState(true)
  const [showCharacterBaseInfo, setShowCharacterBaseInfo] = useState(true)

  useEffect(() => {
    const load = async function () {
      if (!character || !characterClass) return

      const characterService = new CharacterService(
        character,
        characterClass,
        characterInventories as Inventory[]
      )

      setCharacterStats(characterService.getStats())
      setCharacterGold(characterService.getGold())
    }

    load()
  }, [character, characterClass, characterInventories])

  if (!character) {
    return null
  }

  return <div className='character-info-main'>
  {/* HERO */}
  <div className='character-section-title' onClick={() => setShowCharacterBaseInfo(prev => !prev)}>
    <div className='page-header-banner'>
      <div className='page-header-title'>
        {character.name} Lv. {character.level} {characterClass?.name}
      </div>

      <div
        className='page-header-expander'
        
      >
        <span>{showCharacterBaseInfo === true ? 'Hide' : 'Show'}</span>
      </div>
    </div>
  </div>
  <div className={`character-stats-grid ${showCharacterBaseInfo === true ? 'open' : ''}`}>
    <div className='character-info-hero'>
      <CharacterInfoXP character={character} />

      <div className='character-info-meta'>
        <div className='character-meta-card'>
          <span className='meta-label'>Adventurer's Guild</span>

          <span className='meta-value'>
            {!character?.guildRank
              ? 'No Adventurer Rank'
              : `${character.guildRank} Rank`}
          </span>
        </div>

        <div className='character-meta-card gold-card'>
          <span className='meta-label'>Gold</span>

          <span className='meta-value'>
            {characterGold.toLocaleString()}g
          </span>
        </div>
      </div>
    </div>
  </div>

  <div className='character-section-title' onClick={() => setShowAttributeStats(prev => !prev)}>
    
    <div className='page-header-banner'>
      <div className='page-header-title'>
        Attributes
      </div>

      <div
        className='page-header-expander'
        
      >
        <span>{showAttributeStats === true ? 'Hide' : 'Show'}</span>
      </div>
    </div>
  </div>
  {/* STATS */}
  <div className={`character-stats-grid ${showAttributeStats === true ? 'open' : ''}`}>
    {Object
      .getOwnPropertyNames(character.stats ?? {})
      .map((propertyName) => {
        //@ts-ignore
        return character?.stats[propertyName] as Stat
      })
      .filter((statItem) => !!statItem)
      .sort((a, b) => {
        //@ts-ignore
        const aSort = StatSort[a.name]
        //@ts-ignore
        const bSort = StatSort[b.name]

        return (aSort ?? 999) - (bSort ?? 999)
      })
      .map((statItem) => {
        return (
          <CharacterStatCard
            statItem={statItem}
            statType='attribute'
          />
        )
      })}
  </div>
  <div className='character-section-title' onClick={() => setShowProfessionStats(prev => !prev)}>
    
    <div className='page-header-banner'>
      <div className='page-header-title'>
        Professions
      </div>

      <div
        className='page-header-expander'
        
      >
        <span>{showProfessionStats === true ? 'Hide' : 'Show'}</span>
      </div>
    </div>
  </div>
  {/* PROFESSIONS */}
  <div className={`character-stats-grid ${showProfessionStats === true ? 'open' : ''}`}>
    {Object
      .getOwnPropertyNames(character.professions ?? {})
      .map((propertyName) => {
        //@ts-ignore
        return character?.professions[propertyName] as Stat
      })
      .filter((profession) => !!profession)
      .sort((a, b) => {
        //@ts-ignore
        const aSort = ProfessionSort[a.name]
        //@ts-ignore
        const bSort = ProfessionSort[b.name]

        return (aSort ?? 999) - (bSort ?? 999)
      })
      .map((statItem) => {
        return (
          <CharacterStatCard
            statItem={statItem}
            statType='profession'
          />
        )
      })}
    </div>

</div>
}
