import CharacterBar from './character/CharacterBar'
import useCharacter from './character/useCharacter'
import { CharacterService } from './entities/character/CharacterService'
import styles from './Hud.module.css'
export default function Hud() {
  const characterService = new CharacterService()
  const {
    character
  } = useCharacter({
    characterService
  })

  if(!character){
    return <div>NO CHARACTER</div>
  }
  return (
    <div
      className={styles.hud}
    >

    {/* ORIENTATION NOTICE */}

    <div
      className={styles.layout}
    >

      <header
        className={styles.character}
        onClick={() => {
          characterService.addXp(10)
        }}
      >
        <CharacterBar 
          character={character}
          maxXp={characterService.getXpMax()}
          maxHp={characterService.getHpMax()}
          maxMp={characterService.getMpMax()}
          maxStamina={characterService.getStaminaMax()}
          maxGold={characterService.getGoldMax()}
        />
      </header>

      <nav
        className={styles.navigation}
      >
        NAVIGATION BAR (LEFT)
      </nav>

      <main
        className={styles.game}
      >
        GAME (CENTER)
      </main>

      <aside
        className={styles.actions}
      >
        ACTIONS (RIGHT)
      </aside>

      <footer
        className={styles.area}
      >
        AREA DETAILS (BOTTOM)
      </footer>

    </div>

    </div>
  )
}