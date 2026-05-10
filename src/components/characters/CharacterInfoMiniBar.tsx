import { useEffect, useState } from 'react'
import { StatSort, type Stat } from '../../interfaces/characters/Character.types'
import './CharacterInfoMiniBar.css'
import CharacterInfoMiniStatCard from './CharacterInfoMiniStatCard'
import { CharacterService } from '../../services/characters/CharacterService'
import type { AppProperties } from '../../interfaces/AppProperties.types'
import type { Inventory } from '../../interfaces/inventories/Inventory.types'
import { sleep } from '../../services/CommonServices'
import './CharacterStatCard.css'

interface CharacterInfoMiniBarProps extends AppProperties {
}

export default function CharacterInfoMiniBar(props: CharacterInfoMiniBarProps) {
  const [characterGold, setCharacterGold] = useState(0)

  const { 
    character, 
    characterClass, 
    characterInventories,
    characterQuestProgress,
    location,
    handleSetRequestedWindowId
  } = props

  const statNames = ['hp', 'mp', 'stamina']

  useEffect(() => {
    const load = async () => {
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

  async function toggleWindow(id: string) {
    handleSetRequestedWindowId?.('')
    await sleep(50)
    handleSetRequestedWindowId?.(id)
  }

  const divider = <div className='mini-divider'>|</div>
  const xpProgress = character && character.xp && character.levelNextXP ? Math.min(100, (character.xp / character.levelNextXP) * 100) : 0


  if (!character?.name || !characterClass?.name) return null

  return (
    <div className="character-info-mini">
      <div style={{display: 'flex', flexWrap: 'wrap', gap: '15px'}}>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '3px'}}>
          <div className='mini-location'>
            {location}
          </div>
          {divider}
          <div className="mini-name" style={{cursor: 'pointer'}} onClick={() => {toggleWindow?.('character')}}>
            {character.name}
          </div>
          {divider}
          <div className="mini-class" style={{cursor: 'pointer'}} onClick={() => {toggleWindow?.('character')}}>
            Lv {character.level} {characterClass.name}
          </div>
          {divider}
          <div className="mini-gold" style={{cursor: 'pointer'}} onClick={() => {toggleWindow?.('inventory')}}>
            {characterGold.toLocaleString()}g
          </div>
          {divider}
          <div className="mini-class" style={{cursor: 'pointer'}} onClick={() => {toggleWindow?.('quest')}}>
            <div className='mini-gold'>
              Quest:
            </div>
          </div>
          <div className='mini-class quest'  onClick={() => {toggleWindow?.('quest')}}>
            {!characterQuestProgress ? 'N/A' : <div title={characterQuestProgress.quest.title}> {characterQuestProgress.questProgress?.status} </div>}
          </div>
          {divider}
        </div>
        <div>
          <div className="character-stat-chip" title={`Experience Points`}>
            <span className="chip-name">XP</span>

            <span className="chip-values">
              {character.xp.toLocaleString()}/{character.levelNextXP.toLocaleString()}
            </span>
            <div
              className={`
                character-stat-card-bar
                ${'attribute-bar'}
              `}
            >
              <div
                className={`
                  character-stat-card-fill
                  ${'attribute-fill'}
                `}
                style={{
                  width: `${xpProgress}%`
                }}
              />
            </div>
          </div>
        </div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
          {Object.getOwnPropertyNames(character.stats ?? {})
            .map((propertyName) => {
              if (!statNames.includes(propertyName)) return
              //@ts-ignore
              return character.stats[propertyName] as Stat
            })
            .filter(Boolean)
            .sort((a, b) => {
              //@ts-ignore
              return (StatSort[a.name] ?? 999) - (StatSort[b.name] ?? 999)
            })
            .map((statItem) => (
              <CharacterInfoMiniStatCard
                key={statItem?.name}
                statItem={statItem as Stat}
                statType="attribute"
              />
            ))}
        </div>
      </div>

     
    </div>
  )
}