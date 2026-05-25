import { useState } from 'react'
import './CharacterInfo.css'
import { type Stat } from '../../interfaces/characters/Character.types'
import type { AppProperties } from '../../interfaces/AppProperties.types'
import CharacterInfoMiniStatCard from './CharacterInfoMiniStatCard'

interface CharacterInfoProps extends AppProperties {
  showExpander: boolean
}

export default function CharacterInfo(props: CharacterInfoProps) {
  const {
    character,
    characterClass,
    showExpander = true,
    characterGold
  } = props
  const [showAll, setShowAll] = useState(true)

  if (!character) {
    return null
  }

  return <div className='character-info-main'>
    {showExpander && <button
      className="horizontal-expander"
      onClick={() => setShowAll(prev => !prev)}
    >
      <span className={`chev ${showAll ? "open" : ""}`}>
        {showAll ? "<" : ">"}
      </span>

      <span className="vertical-label">
        CHARACTER SHEET
      </span>
    </button>}
    <div className={`character-sheet ${showAll === true ? 'open' : ''}`}>
      <div className='character-section-title'>
        <div className='page-header-banner'>
          <div className='page-header-title'>
            {character.name}
          </div>
        </div>
      </div>

      <div className={`character-stats-grid open`}>
        <div className='character-info-hero'>
          <div className='character-stat-chip'>
            <div style={{float: 'left'}}>
              <span>Level</span>
            </div>
            <div style={{float: 'right'}}>
              <span style={{color: 'gold'}}>
                {character?.level}
              </span>
            </div>
          </div>
          <div className='character-stat-chip'>
            <div style={{float: 'left'}}>
              <span>Class</span>
            </div>
            <div style={{float: 'right'}}>
              <span style={{color: 'gold'}}>
                {characterClass?.name}
              </span>
            </div>
          </div>

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
                {characterGold?.toLocaleString()} g
              </span>
            </div>
          </div>
          <CharacterInfoMiniStatCard className='level-fill purple' statItem={{name: 'XP' as any, value: character.xp, max: character.levelNextXP, level: character.level, nextLevelXP: character.levelNextXP, xp: character.xp}} />
          <CharacterInfoMiniStatCard className='level-fill red' statItem={character.stats['hp'] as Stat} />
          <CharacterInfoMiniStatCard className='level-fill blue' statItem={character.stats['mp'] as Stat} />
          <CharacterInfoMiniStatCard className='level-fill green' statItem={character.stats['stamina'] as Stat} />
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
