import ProgressBar from '../../../core/components/progress-bar/ProgressBar'
import { formatPrimitiveValueToString } from '../../../core/utils/Formatting.utils'
import type { Character } from '../entities/character/Character.types'
import { HUD_CLASS_BY_ID } from '../entities/character/CharacterClass.utils'
import styles from './CharacterBar.module.css'

interface Props {
  character: Character
  maxXp: number
  maxHp: number
  maxMp: number
  maxStamina: number
  maxGold: number
}

/**
 * Top bar of the hud.
 * Displays character details left to right stretched out.

 * @param props 
 * @returns 
 */
export default function CharacterBar(props: Props) {
  const {
    character,
    maxXp
  } = props

  const characterClass = HUD_CLASS_BY_ID[character.classId]

  return (
    // Left to right, div 2 should show as much as possible (progress bars)
    <div
      className={styles.characterBar}
    >

      {/* Holds Character Name, level, class name, and gold */}
      <div
        className={styles.characterBase}
      >
        <div
          className={styles.characterName}
        >
          {character.name}
        </div>

        <div
          className={styles.characterLevel}
        >
          Lv. {character.level}
        </div>

        <div
          className={styles.characterClassName}
        >
          {characterClass.name}
        </div>

        <div
          className={styles.characterGold}
        >
          {formatPrimitiveValueToString(character.gold)}g
        </div>
      </div>

      {/* Holds XP, HP, MP, and Stamina progress bars  */}
      <div
        className={styles.characterProgress}
      >
        <div
          className={styles.xpProgress}
        >
          <ProgressBar 
            color='purple'
            max={maxXp}
            value={character.xp}
            label='XP'
            showValues={true}
          />
        </div>
      </div>

      {/* Holds settings cog */}
      <div
        className={styles.settings}
      >

      </div>

    </div>
  )
}