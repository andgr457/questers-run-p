import { useMemo } from 'react'
import type { Character } from '../../interfaces/characters/Character.types'

interface CharacterInfoXPProps {
  character: Character
}

export default function CharacterInfoXP(props: CharacterInfoXPProps){
  const {
    character
  } = props

  const levelProgress = useMemo(() => {
    if (!character.levelNextXP) return 0

    return Math.min(
      100,
      Math.max(
        0,
        (character.xp / character.levelNextXP) * 100
      )
    )
  }, [character])
  
  return <div
    className='character-progress-card main-level'
    title={`${(character.levelNextXP - character.xp).toLocaleString()} XP left`}
  >
    <div className='character-progress-header'>
      <span>XP</span>

      <span>
        {character.xp.toLocaleString()} / {character.levelNextXP.toLocaleString()}
      </span>
    </div>

    <div className='character-progress-bar'>
      <div
        className='character-progress-fill level-fill'
        style={{ width: `${levelProgress}%` }}
      />
    </div>

    <div className='character-progress-footer'>
      {(character.levelNextXP - character.xp).toLocaleString()} XP left
    </div>
  </div>
}