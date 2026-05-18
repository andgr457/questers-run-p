import { useEffect, useState } from 'react'
import './CharacterInfo.css'
import { CharacterService } from '../../services/characters/CharacterService'
import type { Inventory } from '../../interfaces/inventories/Inventory.types'
import { StatSort, type Stat } from '../../interfaces/characters/Character.types'
import { ProfessionSort } from '../../interfaces/professsions/Profession.types'
import CharacterStatCard from './CharacterStatCard'
import CharacterInfoXP from './CharacterInfoXP'
import type { AppProperties } from '../../interfaces/AppProperties.types'
import CharacterStatCardMin from './CharacterStatCardMin'
import CharacterInfoMiniStatCard from './CharacterInfoMiniStatCard'

interface CharacterInfoProps extends AppProperties {

}

export default function CharacterInfo(props: CharacterInfoProps) {
  const {
    character,
    characterClass,
    characterInventories,
  } = props

  const [characterGold, setCharacterGold] = useState(0)
  const [showAll, setShowAll] = useState(true)
  const [showAttributeStats, setShowAttributeStats] = useState(false)
  const [showProfessionStats, setShowProfessionStats] = useState(false)
  const [showCharacterBaseInfo, setShowCharacterBaseInfo] = useState(true)

  useEffect(() => {
    const load = async function () {
      if (!character || !characterClass) return

      const characterService = new CharacterService(
        character,
        characterClass,
        characterInventories as Inventory[]
      )

      setCharacterGold(characterService.getGold())
    }

    load()
  }, [character, characterClass, characterInventories])

  if (!character) {
    return null
  }

  return <div className='character-info-main'>
    <button
      className="horizontal-expander"
      onClick={() => setShowAll(prev => !prev)}
    >
      <span className={`chev ${showAll ? "open" : ""}`}>
        {showAll ? "<" : ">"}
      </span>

      <span className="vertical-label">
        CHARACTER SHEET
      </span>
    </button>
    <div className={`character-sheet ${showAll === true ? 'open' : ''}`}>
      <div className='character-section-title'>
        <div className='page-header-banner'>
          <div className='page-header-title'>
            {character.name} Lv. {character.level} {characterClass?.name}
          </div>
        </div>
      </div>

      <div className={`character-stats-grid ${showCharacterBaseInfo === true ? 'open' : ''}`}>
        <CharacterInfoXP character={character} />
        <div className='character-info-hero'>

          <div className='character-stat-chip'>
            <div style={{float: 'left'}}>
              <span>Adventurer's Guild</span>
            </div>
            <div style={{float: 'right'}}>
              <span style={{color: 'gold'}}>
                {!character?.guildRank
                  ? 'No Adventurer Rank'
                  : `${character.guildRank} Rank`}
              </span>
            </div>
          </div>
          
          <div className='character-stat-chip'>
            <div style={{float: 'left'}}>
              <span>Gold</span>
            </div>
            <div style={{float: 'right'}}>
              <span style={{color: 'gold'}}>
                {characterGold.toLocaleString()}g
              </span>
            </div>
          </div>
          <CharacterInfoMiniStatCard statItem={character.stats['hp'] as Stat} />
          <CharacterInfoMiniStatCard statItem={character.stats['mp'] as Stat} />
          <CharacterInfoMiniStatCard statItem={character.stats['stamina'] as Stat} />
          <CharacterInfoMiniStatCard statItem={character.stats['agility'] as Stat} />
          <CharacterInfoMiniStatCard statItem={character.stats['intelligence'] as Stat} />
          <CharacterInfoMiniStatCard statItem={character.stats['strength'] as Stat} />

          <CharacterInfoMiniStatCard statType='profession' statItem={character.professions['gathering'] as Stat} />
          <CharacterInfoMiniStatCard statType='profession' statItem={character.professions['fishing'] as Stat} />
          <CharacterInfoMiniStatCard statType='profession' statItem={character.professions['mining'] as Stat} />
        </div>
      </div>
    </div>
  </div>
}
